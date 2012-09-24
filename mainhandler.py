#!/usr/bin/python
# -*- coding: latin-1 -*-
import cgi
import wsgiref.handlers
import os
import logging
import urllib2

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
from datetime import datetime, date, time

try:
    files.gs
except AttributeError:
    import gs
    files.gs = gs

userService = UserService()
facebookService = FacebookService()

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
		template_values = {'isLoggedIn': isLoggedIn(), 'loggedInUser': loggedUser, 'user': user, 'faceAppId': FACEBOOK["appId"]}
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
		path = os.path.join(os.path.dirname(__file__) + '/templates/app', 'search.html')	
		self.response.out.write(template.render(path, {}))				

class GetUser(webapp.RequestHandler):
	def get(self):
		user = getLoggedInUser()
		user = userService.getByEmail(user.email)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'user': userService.getUserInJSON(user)}))

class UploadHandler(webapp.RequestHandler):
    READ_PATH = '/gs/ekfotoapp/'

    def get(self):
		filename = self.request.get('filename')
		message = self.request.get('message')
		
		writable_file_name = files.gs.create(filename=self.READ_PATH + '/' + filename, acl='public-read', mime_type='text/html', cache_control='no-cache')
		with files.open(writable_file_name, 'a') as f:
		    f.write(message)
		files.finalize(writable_file_name)
		
		'''
		i = Image()
		i.img = db.Blob(image)
		i.put()		

		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(simplejson.dumps({'status': 'success', 'photoId': i.key().id()}))'''
		return

class ReadFile(webapp.RequestHandler):
	READ_PATH = '/gs/ekfotoapp/'
	def get(self):
		filename = self.request.get('filename')
		print 'Opening file', filename
		with files.open(self.READ_PATH+'/'+filename, 'r') as f:
		    data = f.read(1000)
		    while data:
		        print data
		        data = f.read(1000)
		return

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
		
application = webapp.WSGIApplication([
									   	('/', LandingPage),
										('/home', Home),
										('/homepage', HomePage),
										('/search', SearchPage),
										('/logout', Logout),
										('/facebookauth', AuthFacebook),
										('/prototype', Prototype),
										('/signup', SignupPage),
										('/signup/confirmation', SignupThanksPage),
										('/photos/([^/]+)?', ProfilePage),
										('/user/update', UpdateUser),
										('/getuser', GetUser),
										('/upload', UploadHandler),
										('/read', ReadFile)
									 ], debug=True)

def main():
  run_wsgi_app(application)

if __name__ == '__main__':
  main()