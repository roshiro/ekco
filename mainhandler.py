#!/usr/bin/python
# -*- coding: latin-1 -*-
import cgi
import wsgiref.handlers
import os
import logging
import urllib2
import datetime
import time

from google.appengine.api import users
from google.appengine.ext import db
from properties import *
from models import *
from service import *
from google.appengine.api import files
from django.utils import simplejson
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from gaesessions import get_current_session
from google.appengine.api import taskqueue
from google.appengine.ext.db import Key
from google.appengine.api import images

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers

userService = UserService()
facebookService = FacebookService()
portfolioService = PortfolioService()

def showUpgradeMessage(user, portfolios):
	return (not user.membership and int(user.membership) == 0) and len(portfolios) == 1

def isMyPage(userTryingToAccess):
	loggedUser = getLoggedInUser()
	return loggedUser and loggedUser.key().id() == userTryingToAccess.key().id()
	
def isLoggedIn():
	session = get_current_session()
	if session.has_key('profile'):
		return True
	return False

def getLoggedInUser():
	if isLoggedIn():
		session = get_current_session()
		return session['profile']
	return None

class Home(webapp.RequestHandler):
	def get(self):
		if not isLoggedIn():
			self.redirect("/")
		else:
			user = getLoggedInUser()
			path = os.path.join(os.path.dirname(__file__) + '/templates', 'home.html')
			self.response.out.write(template.render(path, {'isLoggedIn': isLoggedIn(), 'loggedInUser': user, 'faceAppId': FACEBOOK["appId"]}))

class HomePage(webapp.RequestHandler):
	def get(self):
		user = getLoggedInUser()
		template_values = {'isLoggedIn': isLoggedIn(), 'loggedInUser': user, 'faceAppId': FACEBOOK["appId"]}
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'homepage.html')
		self.response.out.write(template.render(path, template_values))

class LandingPage(webapp.RequestHandler):
	def get(self):
		if isLoggedIn():
			self.redirect("/home")
		else:
			template_values = {'isLoggedIn': isLoggedIn(), 'faceAppId': FACEBOOK["appId"], 'faceRedirectUrl': FACEBOOK["redirectUrl"]}
			path = os.path.join(os.path.dirname(__file__) + '/templates', 'landing.html')
			self.response.out.write(template.render(path, template_values))

class NewUser(webapp.RequestHandler):
	def get(self):
		template_values = {'isLoggedIn': isLoggedIn()}
		path = os.path.join(os.path.dirname(__file__) + '/templates', 'index.html')
		self.response.out.write(template.render(path, template_values))
	def post(self):
		userjson = self.request.get("user")
		user = simplejson.loads(userjson)
		session = get_current_session()
		if session.is_active() and session.has_key('facetoken'):
			user['facetoken'] = session['facetoken']
		if session.is_active() and session.has_key('faceid'):
			user['faceid'] = session['faceid']
		user = userService.save(user)
		if session.is_active():
			session.terminate()
		session['profile'] = user
		# Add sending email to the queue
		taskqueue.add(url='/queue/email', params={'action': 'new_user', 'username': user.username})
		
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', "id": user.key().id(), "url": userService.getURL(user), 'isLoggedIn': isLoggedIn()}))

class AuthFacebook(webapp.RequestHandler):
	def get(self):
		state = self.request.get('state')
		code = self.request.get('code')
		error = self.request.get('error')
		if not error:
			logging.info('User accepted authorization, state %s, code %s', state, code)
			access = facebookService.requestAccessToken(code)
			token = access["access_token"]
			user = userService.getByFacebookToken(token)
			if user:
				logging.info('User registered with token')
				session = get_current_session()
				if session.is_active():
					session.terminate()
				session['profile'] = user
			else:
				logging.info('User not registered %s', token)
				session = get_current_session()
				if session.is_active():
					session.terminate()
				faceuser = facebookService.getUserByToken(token)
				logging.info('Faceuser %s', faceuser)
				user = self.getUserJSON(faceuser, token)
				user = userService.save(user)
				session['profile'] = user
			
			if state == 'landingpage':
				self.redirect('/home')
			if state == 'signup':
				self.redirect('/photos/' + user.username)
		else:
			logging.info('User declined authorization, error %s', error)
		
		return
		
	def getUserJSON(self, json, token):
		logging.info('Deserializing User')
		user = {'id': 0, 
			'facetoken': token, 
			'faceid': json['id'], 
			'username': json['username'], 
			'name': json['name'], 
			'email': '', 
			'location': '', 
			'work': ''
		}
		if json['email']:
			user['email'] = json['email']
		if json['location']:
			user['location'] = json['location']['name']
		if hasattr(json, 'work') and json['work'] and json['work'][0]:
			user['work'] = json['work'][0]['employer']['name']
		logging.info('User deserialized %s', user)
		return user	

class AuthUser(webapp.RequestHandler):
	def get(self):
		username = self.request.get('username')
		password = self.request.get('password')
		session = get_current_session()

		if session.is_active():
			session.terminate()
		logging.info('Params received %s and %s', username, password)
		result = userService.validateUser(username, password)
		logging.info('Status %s', result['status'])
		if result['status'] == 'SUCCESS':
			logging.debug('User validated OK')
			session['profile'] = result['user']
			self.response.headers['Content-Type'] = 'application/json'
			self.response.out.write(simplejson.dumps({'status': 'success', 'user': userService.getUserInJSON(result['user'])}))
		else:
			logging.debug('User validation failed')
			self.response.headers['Content-Type'] = 'application/json'
			self.response.out.write(simplejson.dumps({'status': result['status']}))			

class Prototype(webapp.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__) + '/templates', 'prototype.html')
		self.response.out.write(template.render(path, template_values))

class UserExists(webapp.RequestHandler):
	def get(self, username):
		user = userService.get(username)
		userExist = False
		if user:
			userExist = True			
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'userExist': userExist}))

class EmailExists(webapp.RequestHandler):
	def get(self, email):
		user = userService.getByEmail(urllib2.unquote(email))
		emailExist = False		
		if user:
			emailExist = True
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'emailExist': emailExist}))

class SignupPage(webapp.RequestHandler):
	def get(self):
		template_values = {'faceAppId': FACEBOOK["appId"], 'faceRedirectUrl': FACEBOOK["redirectUrl"]}
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'signup_1.html')	
		self.response.out.write(template.render(path, template_values))

class SignupThanksPage(webapp.RequestHandler):
	def get(self):
		template_values = {}		
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'signup_2.html')	
		self.response.out.write(template.render(path, template_values))		

class ProfilePage(webapp.RequestHandler):
	def get(self, username):
		loggedUser = getLoggedInUser()
		user = userService.get(username)
		portfolios = portfolioService.getPortfolios(user)
		upgradeMsg = showUpgradeMessage(user, portfolios)
		template_values = {
			'isLoggedIn': isLoggedIn(), 
			'loggedInUser': loggedUser, 
			'user': user, 
			'portfolios': portfolios,
			'faceAppId': FACEBOOK["appId"],
			'isMyPage': isMyPage(user),
			'showUpgradeMessage': upgradeMsg
		}
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'profile.html')	
		self.response.out.write(template.render(path, template_values))

class UpdateUser(webapp.RequestHandler):
	def post(self):
		userjson = self.request.get("user")
		user = simplejson.loads(userjson)
		user = userService.savePersonalInfo(user)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'user': userService.getUserInJSON(user)}))

class SearchPage(webapp.RequestHandler):
	def get(self):
		users = User.all().filter('active =', True).fetch(100)
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'search.html')	
		self.response.out.write(template.render(path, {
			'users': users,
			'loggedInUser': getLoggedInUser(),
			'isLoggedIn': isLoggedIn()
		}))				

class GetUser(webapp.RequestHandler):
	def get(self):
		user = getLoggedInUser()
		self.response.headers['Content-Type'] = 'application/json'
		try:
			user = userService.getByEmail(user.email)
			self.response.out.write(simplejson.dumps({'status': 'success', 'user': userService.getUserInJSON(user)}))
		except:
			self.response.out.write(simplejson.dumps({'status': 'error', 'message': 'Não foi possivel pesquisar usuário.'}))
			
class Logout(webapp.RequestHandler):
	def get(self):
		session = get_current_session()
		if session.is_active():
			session.terminate()
		self.redirect('/')

class ErrorPage():
	def errorPage(self, response):
		template_values = {}		
		path = os.path.join(os.path.dirname(__file__), '404.html')	
		response.out.write(template.render(path, template_values))

class GenerateUploadUrl(webapp.RequestHandler):
	def get(self, username):
		upload_url = blobstore.create_upload_url('/upload', gs_bucket_name='ekfotoco/'+username)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'url': upload_url}))		

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
	def post(self):
		upload_files = self.get_uploads('file')
		portfolio_id = self.request.get('portfolio_id')
		blob_info = upload_files[0]
		portfolioService.addPhotos(portfolio_id, [str(blob_info.key())])
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'blob_key': str(blob_info.key())}))

class ServeHandler(blobstore_handlers.BlobstoreDownloadHandler):
	def get(self, resource):
		resource = str(urllib.unquote(resource))
		height = self.request.get('height')
		width = self.request.get('width')
		quality = self.request.get('quality')
		dimensions = getDimensions(resource)
		if not quality:
			quality = 60
		# Crop if both are set
		if height and width:
			thumbnail = rescale(resource, width, height, 'middle', 'top')
			try:
				thumbnail = thumbnail.execute_transforms(output_encoding=images.JPEG, quality=int(quality))
				self.response.headers['Content-Type'] = 'image/jpeg'
				logging.debug('Converted to JPEG')
			except:
				thumbnail = thumbnail.execute_transforms(output_encoding=images.PNG)	
				self.response.headers['Content-Type'] = 'image/png'
				logging.debug('Converted to PNG')
			finally:
				self.response.out.write(thumbnail)
							
		else:
			blob_info = blobstore.BlobInfo.get(resource)
			self.send_blob(blob_info)

class ServeCoverHandler(blobstore_handlers.BlobstoreDownloadHandler):
	def get(self, width, quality, resource):
		resource = str(urllib.unquote(resource))
		dimensions = getDimensions(resource)
		img = images.Image(blob_key=resource)
		if dimensions['width'] > int(width):
			img.resize(width=int(width))
		try:
			try:
				thumbnail = img.execute_transforms(output_encoding=images.JPEG, quality=int(quality))	
				self.response.headers['Content-Type'] = 'image/jpeg'
				logging.debug('Converted to JPEG')
			except:
				thumbnail = img.execute_transforms(output_encoding=images.PNG)	
				self.response.headers['Content-Type'] = 'image/png'
				logging.debug('Converted to PNG')
			finally:
				self.response.out.write(thumbnail)
		except:
			self.redirect('/serve/'+resource)
			return

def getDimensions(blob_key):
	data = blobstore.fetch_data(blob_key, 0, 50000)
	img = images.Image(image_data=data)
	dimesions = {'width': img.width, 'height': img.height}
	logging.debug(dimesions)
	return dimesions

def rescale(blob_key, width, height, halign='middle', valign='middle'):
	"""Resize then optionally crop a given image.

	Attributes:
	blob_key: blob_key of the image
	width: The desired width
	height: The desired height
	halign: Acts like photoshop's 'Canvas Size' function, horizontally
	       aligning the crop to left, middle or right
	valign: Verticallly aligns the crop to top, middle or bottom
	999999
	"""
	image_data = blobstore.fetch_data(blob_key, 0, 999999)	
	image = images.Image(image_data)
	
	desired_wh_ratio = float(width) / float(height)
	wh_ratio = float(image.width) / float(image.height)

	if desired_wh_ratio > wh_ratio:
		# resize to width, then crop to height
		image = images.Image(blob_key=blob_key)
		image.resize(width=int(width))
		image.execute_transforms()
		trim_y = (float(image.height - int(height)) / 2) / image.height
		if valign == 'top':
			image.crop(0.0, 0.0, 1.0, 1 - (2 * trim_y))
		elif valign == 'bottom':
			image.crop(0.0, (2 * trim_y), 1.0, 1.0)
		else:
			image.crop(0.0, trim_y, 1.0, 1 - trim_y)
	else:
		# resize to height, then crop to width
		image = images.Image(blob_key=blob_key)
		image.resize(height=int(height))
		image.execute_transforms()
		trim_x = (float(image.width - int(width)) / 2) / image.width
		if halign == 'left':
			image.crop(0.0, 0.0, 1 - (2 * trim_x), 1.0)
		elif halign == 'right':
			image.crop((2 * trim_x), 0.0, 1.0, 1.0)
		else:
			image.crop(trim_x, 0.0, 1 - trim_x, 1.0)

	return image

class NewPortfolio(webapp.RequestHandler):
	def post(self):
		name = self.request.get("name")
		user = getLoggedInUser()
		portfolio = {'id': 0, 'name': name}
		portfolio = portfolioService.save(portfolio, user)
		dic = portfolio.to_dict()
		dic['id'] = portfolio.key().id()
		logging.info('%s', dic)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'portfolio': toJSON(portfolio) }))

class DeletePortfolio(webapp.RequestHandler):
	def post(self, portfolio_id):
		self.response.headers['Content-Type'] = 'application/json'
		if portfolio_id:
			portfolioService.delete(portfolio_id)		
			self.response.out.write(simplejson.dumps({'status': 'success'}))
		else:
			self.response.out.write(simplejson.dumps({'status': 'error', 'message': 'no ID provided'}))

class PartialPortfolio(webapp.RequestHandler):
	def get(self, portfolio_id):
		portfolio = portfolioService.getPortfolio(portfolio_id)
		loggedUser = getLoggedInUser()
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'partial_portfolio_thumb.html')	
		self.response.out.write(template.render(path, {'portfolio': portfolio, 
			'isLoggedIn': isLoggedIn(), 
			'loggedInUser': loggedUser,
			'isMyPage': isMyPage(portfolio.user),
			'user': portfolio.user}))
			
class EditPortfolio(webapp.RequestHandler):
	def get(self, portfolio_id):
		portfolio = portfolioService.getPortfolio(portfolio_id)
		user = portfolio.user
		loggedUser = getLoggedInUser()
		if isMyPage(portfolio.user):
			upgradeMsg = showUpgradeMessage(user, portfolioService.getPortfolios(user))
			path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'portfolio_edit.html')	
			self.response.out.write(template.render(path, {
				'user': user, 
				'isLoggedIn': isLoggedIn(), 
				'loggedInUser': loggedUser, 
				'portfolio': portfolio,
				'showUpgradeMessage': upgradeMsg
			}))
		else:
			self.redirect('/photos/'+user.username)
			
class PhotoDelete(webapp.RequestHandler):
	def post(self, portfolio_id, photo):
		user = getLoggedInUser()
		p = portfolioService.getPortfolio(portfolio_id)
		logging.debug('%s %s', user.key().id(), p.user.key().id())
		if user and user.key().id() == p.user.key().id():
			logging.debug('User authorized to delete photo %s', urllib2.unquote(photo))
			try:
				portfolioService.deletePhotos(portfolio_id, [urllib2.unquote(photo)])
				self.response.headers['Content-Type'] = 'application/json'
				self.response.out.write(simplejson.dumps({'status': 'success'}))				
			except:
				self.response.headers['Content-Type'] = 'application/json'
				self.response.out.write(simplejson.dumps({'status': 'error'}))
		else:
			logging.debug('User not authorized')
			self.response.headers['Content-Type'] = 'application/json'
			self.response.out.write(simplejson.dumps({'status': 'error', 'message': 'user not authorized'}))

class JsonGetPorfolio(webapp.RequestHandler):
	def get(self, portfolio_id):
		portfolio = portfolioService.getPortfolio(portfolio_id)
		json = toJSON(portfolio)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'portfolio': json}))

class FullPortfolio(webapp.RequestHandler):
	def get(self, portfolio_id):
		portfolio = portfolioService.getPortfolio(portfolio_id)
		user = User.get_by_id(portfolio.user.key().id())
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'portfolio.html')	
		self.response.out.write(template.render(path, {'user': user, 'isLoggedIn': isLoggedIn(), 'loggedInUser': getLoggedInUser(), 'portfolio': portfolio}))

class PartialAddPhotos(webapp.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'partial_add_photos.html')	
		self.response.out.write(template.render(path, {}))

class PartialEditProfile(webapp.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'partial_edit_profile.html')	
		self.response.out.write(template.render(path, {}))

class DeleteUser(webapp.RequestHandler):
	def post(self):
		return

class PartialAddPhotosLink(webapp.RequestHandler):
	def get(self, username):
		loggedUser = getLoggedInUser()
		user = userService.get(username)
		portfolios = portfolioService.getPortfolios(user)
		upgradeMsg = showUpgradeMessage(user, portfolios)
		template_values = {
			'isLoggedIn': isLoggedIn(), 
			'loggedInUser': loggedUser, 
			'user': user, 
			'portfolios': portfolios,
			'isMyPage': isMyPage(user),
			'showUpgradeMessage': upgradeMsg
		}
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'partial_add_photos_link.html')
		self.response.out.write(template.render(path, template_values))

class AboutPage(webapp.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'about.html')	
		self.response.out.write(template.render(path, {'isLoggedIn': isLoggedIn(), 'loggedInUser': getLoggedInUser()}))

class ContactPage(webapp.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'contact.html')	
		self.response.out.write(template.render(path, {'isLoggedIn': isLoggedIn(), 'loggedInUser': getLoggedInUser()}))		

application = webapp.WSGIApplication([
									   	('/', LandingPage),
										('/home', Home),
										('/homepage', HomePage),
										('/explore', SearchPage),
										('/logout', Logout),
										('/sobre', AboutPage),
										('/contato', ContactPage),
										('/facebookauth', AuthFacebook),
										('/prototype', Prototype),
										('/signup', SignupPage),
										('/signup/confirmation', SignupThanksPage),
										('/photos/([^/]+)?', ProfilePage),
										('/user/update', UpdateUser),
										('/user/delete/username', DeleteUser),
										('/getuser', GetUser),
										('/getuploadurl/([^/]+)?', GenerateUploadUrl),
										('/upload', UploadHandler),
										('/serve/([^/]+)?', ServeHandler),
										('/servecover/([^/]+)?/([^/]+)?/([^/]+)?', ServeCoverHandler),
										('/portfolio/new', NewPortfolio),
										('/portfolio/delete/([^/]+)?', DeletePortfolio),
										('/photos/delete/([^/]+)?/([^/]+)?', PhotoDelete),
										('/partial/portfolio/([^/]+)?', PartialPortfolio),
										('/partial/addphotos', PartialAddPhotos),
										('/partial/addphotolink/([^/]+)?', PartialAddPhotosLink),
										('/partial/editprofile', PartialEditProfile),
										('/portfolio/edit/([^/]+)?', EditPortfolio),
										('/portfolio/([^/]+)?', FullPortfolio),
										('/portfolio/get/json/([^/]+)?', JsonGetPorfolio)
									 ], debug=True)

def main():
	if env == 'DEV':
		logging.getLogger().setLevel(logging.DEBUG)
	else:
		logging.getLogger().setLevel(logging.INFO)
	run_wsgi_app(application)

if __name__ == '__main__':
  main()