import logging
import urllib
import urllib2

from properties import *
from models import *
from memcacheutils import MemCacheUtils
from google.appengine.api import urlfetch
from google.appengine.ext import db
from django.utils import simplejson
from gaesessions import get_current_session
from google.appengine.api import search
from datetime import datetime, date, time, timedelta
from timeit import Timer

cache = MemCacheUtils()

class PusherUtil():
	def publish(self, channel, message):
		url = 'http://pubsub.pubnub.com/publish/'+ PUBNUB['publishKey'] +'/'+ PUBNUB['subscribeKey'] +'/'+ PUBNUB['pubNubSecret'] +'/'+ channel +'/0/%22' + urllib2.quote(str(message)) + '%22'
		logging.info('Requesting URL %s', url)
		urlfetch.fetch(url)	
		return
		
class Utils():
	def convertDate(self, date):
		time = datetime.now() - date
	
		second = time.seconds
		minute = second/60
		hour = minute/60
		day = time.days
		
		if day >= 2:
			date = date.strftime("%d. %B %Y")
		elif day >= 1:
			date = 'Ontem'
		elif hour >= 1:
			if hour == 1:
				date = 'há ± ' + str(hour) + ' hora'
			else:
				date = 'há ± ' + str(hour) + ' horas'
		elif minute >= 1:
			if minute == 1:
				date = 'há ' + str(minute) + ' minuto'
			else:
				date = 'há ' + str(minute) + ' minutos'
		elif second >= 1:
			if second == 1:
				date = 'há ' + str(second) + ' segundo'
			else:
				date = 'há ' + str(second) + ' segundos'
		else:
			date = 'há 1 segundo'
				
		return date.decode('utf8')

class PortfolioService():
	def save(self, obj, user):
		user.newuser = False
		user.put()
		if int(obj['id']) != 0:
			p = Portfolio.get_by_id(int(obj['id']))
			p.name = obj['name']
			p.put()
		else:
			p = Portfolio(name=obj['name'], user=user, cover="")
			p.put()
		return p
			
	def delete(self, portfolio_id):
		p = Portfolio.get_by_id(int(portfolio_id))
		blobstore.delete(p.photos)
		p.delete()
		return
		
	def addPhotos(self, portfolio_id, blob_keys):
		p = Portfolio.get_by_id(int(portfolio_id))
		if not p.cover:
			p.cover = blob_keys[0]
		for index in blob_keys:
			p.photos.append(index)
		return p.put()
	
	def setNewCover(self, portfolio):
		p = Portfolio.get_by_id(portfolio.key().id())
		logging.debug('In function setNewCover(). %s', p)
		if p.photos:
			logging.debug('Found photos in portfolio')
			for photo in p.photos:
				logging.debug('Cover set to %s', photo)
				p.cover = photo
				p.put()
	
	def deletePhotos(self, portfolio_id, blob_keys):
		p = Portfolio.get_by_id(int(portfolio_id))
		setNewCover = False
		for index in blob_keys:
			logging.debug('Removing photo %s from portfolio %s', index, p.key().id())	
			p.photos.remove(index)
			blobstore.delete(index)
			if p.cover == index:
				logging.debug('Cover set to None')
				p.cover = None
				setNewCover = True
				p.put()
				
		logging.debug('Value o setNewCover = %s', setNewCover)
		if setNewCover:
			self.setNewCover(p)
		return

	def getPortfolio(self, portfolio_id):
		try:
			return Portfolio.get_by_id(int(portfolio_id))
		except:
			return None
			
	def getPortfolios(self, user):
		portfolios = Portfolio.all().filter('user =', user).fetch(10)
		return portfolios
	
	def getListInJSON(self, portfolios):
		jsonList = []
		if portfolios:
			logging.debug('%s', portfolios)
			for p in portfolios:
				jsonList.append(toJSON(p))
		return jsonList

class UserService():
	def save(self, obj):
		if not hasattr(obj, 'faceid') == False:
			logging.info('Does not have faceid')
			obj['faceid'] = ""

		if not hasattr(obj, 'facetoken') == False:
			logging.info('Does not have facetoken')
			obj['facetoken'] = ""
								
		if not hasattr(obj, 'name') == False:
			obj['name'] = ""
		
		if not hasattr(obj, 'work') == False:
			obj['work'] = ""
			
		if int(obj['id']) != 0:
			user = User.get_by_id(int(obj['id']))
			user.username = obj['username']
			user.about = ''
			user.location = obj['location']
			user.address = obj['address']
			user.phone = obj['phone']
			user.work = obj['work']
			user.email = obj['email']
			user.name = obj['name']
			user.facetoken = obj['facetoken']
			user.faceid = obj['faceid']
			user.document_index_id = ''
		else:
			user = User(username=obj['username'],
					email=obj['email'],
					name=obj['name'],
					location=obj['location'],
					work=obj['work'],
					phone='',
					address=obj['location'],
					facetoken=obj['facetoken'],
					faceid=obj['faceid'],
					document_index_id='')
			""" If is facebook account, build photo url """
			if user.faceid:
				user.avatar_thumb = 'http://graph.facebook.com/'+ user.faceid +'/picture'
			
		user.put()
		return user
	
	def savePersonalInfo(self, userUpdated):
		user = self.getByEmail(userUpdated['email'])
		user.about = userUpdated['about']
		user.location = userUpdated['location']
		user.phone = userUpdated['phone']
		user.address = userUpdated['address']
		user.name = userUpdated['name']
		user.website = userUpdated['website']
		user.save()
		return user
	
	def updateFaceToken(self, username, token):
		result = User.all().filter('username =', username).fetch(1)
		user = result[0]
		user.facetoken = token
		user.put()
		return user
	
	def getByID(self, id):
		return User.get_by_id(id)
	
	def get(self, username):
		if username is None:
			q = User.all()
			return q.fetch(50)
		else:
			q = db.Query(User)
			q.filter('username =', username)
			results = q.fetch(1)
			
			if results:
				return results[0]
			
		return None
		
	def search(self, name):	
		return
		
	def delete(self, id):
		user = self.get(id)
		user.delete()
		return
	
	def getUserInJSON(self, user):
		return {'id': user.key().id(),
				'name': user.name,
				'username': user.username,
				'email': user.email,
				'avatar_thumb': user.avatar_thumb,
				'location': user.location,
				'address': user.address,
				'phone': user.phone,
				'website': user.website,
				'about': user.about,
				'categories': user.categories}

	def getByEmail(self, email):
		results = User.all().filter("email =", email).fetch(1)
		logging.info('Searching for %s', email)
		if results:
			return results[0]
		return
					
	def getByFacebookToken(self, token):
		results = User.all().filter("facetoken =", token).fetch(1)
		if results:
			return results[0]
		return
	
	def getByFacebookID(self, id):
		results = User.all().filter("faceid =", id).fetch(1)
		if results:
			return results[0]
		return
	
	def getInJSON(self, users):
		response = []
		for user in users:
			response.append(toJSON(user))
		return response
		
	def getURL(self, user):
		short_username = ''
		num = len(user.username)
		if num > 100:
			short_username = user.username[:100]
		else:
			short_username = user.username
			
		short_username = short_username.strip()
		url = '/user/' + short_username.replace(" ", "-")
		return url

class FacebookService():
	def requestAccessToken(self, code):
		url = "https://graph.facebook.com/oauth/access_token?client_id=" + FACEBOOK['appId'] + "&redirect_uri=" + FACEBOOK['redirectUrl'] + "&client_secret=" + FACEBOOK['appSecret'] + "&code=" + str(code)
		logging.info('Requesting URL %s', url)
		result = urlfetch.fetch(url)
		logging.info("This is the result form access token %s", result.content)
		token = result.content.split("&")
		access_token = token[0].split("=")[1]
		expires = token[1].split("=")[1]		
		return {"access_token": access_token, "expires": expires}

	def getUserByToken(self, token):
		url = "https://graph.facebook.com/me?access_token=" + token
		result = urlfetch.fetch(url)
		userjson = simplejson.loads(result.content)
		return userjson
			
class SearchService():
	_STORY_INDEX_NAME = 'story_index'
	_STORYPART_INDEX_NAME = 'storypart_index'
	_USER_INDEX_NAME = 'user_index'
	
	def createDocument(self, key, content):
		return search.Document(
				fields=[search.TextField(name='key', value=str(key)),
						search.TextField(name='content', value=content)])
	
	def search(self, index_name, value):
		# sort results by author descending
		expr_list = [search.SortExpression(expression='content', default_value='', direction=search.SortExpression.DESCENDING)]
		sort_opts = search.SortOptions(expressions=expr_list)
		query_options = search.QueryOptions(limit=100, sort_options=sort_opts)
		query_obj = search.Query(query_string=value, options=query_options)
		try:
			results = search.Index(name=index_name).search(query=query_obj)
			return results
		except search.Error:
			logging.exception('Search failed')
			return
		except ZeroDivisionError:
			return