#!/usr/bin/python
# -*- coding: latin-1 -*-
import cgi
import wsgiref.handlers
import os
import logging
import datetime

from datetime import timedelta
from properties import *
from models import *
from service import *
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

# delete all StoryByUser data
def cleanStoryByUser():
	q = StoriesByUser.all(keys_only = True)
	count = q.count()
	keys = q.fetch(count)
	db.delete(keys)

# delete all StoryByUser data
def cleanStoryPartsByUser():
	q = StoryPartsByUser.all(keys_only = True)
	count = q.count()
	keys = q.fetch(count)
	db.delete(keys)

def removeDuplicates(seq):
    seen = set()
    seen_add = seen.add
    return [ x for x in seq if x not in seen and not seen_add(x)]

def deleteDocument(index_name):
	"""Delete all the docs in the given index."""
	doc_index = search.Index(index_name)

	while True:
		# Get a list of documents populating only the doc_id field and extract the ids.
		document_ids = [document.doc_id
						for document in doc_index.list_documents(ids_only=True)]
		if not document_ids:
			break
		# Remove the documents for the given ids from the Index.
		doc_index.remove(document_ids)
	return


# Summarize how many stories each user has created
class CronStoriesByUser(webapp.RequestHandler):
	def get(self):
		cleanStoryByUser()
		
		delta = timedelta(days=-7)
		now = datetime.now()
		dateToQuery = now + delta
		user_ids = []
		
		for prj in db.GqlQuery('SELECT user FROM Story WHERE date >= :1', dateToQuery):
			logging.info("%s", prj.user)
			user_ids.append(int(prj.user))
		
		# Get the duplicates
		dups = [x for x in user_ids if user_ids.count(x) > 1]
		dups = removeDuplicates(dups)
		logging.info('Content of dups %s', dups)
		for user_id in dups:
			counter = user_ids.count(user_id)
			if counter > 1:
				s = StoriesByUser(user_id = user_id, number_stories = counter)
				s.put()
	
		return
		
# Summarize how many story parts each user has created
class CronStoryPartsByUser(webapp.RequestHandler):
	def get(self):
		cleanStoryPartsByUser()
		delta = timedelta(days=-7)
		now = datetime.now()
		dateToQuery = now + delta
		story_ids = []
		
		for prj in db.GqlQuery('SELECT * FROM StoryPart WHERE date >= :1', dateToQuery):
			logging.info("%s", prj.parent().key().id())
			story_ids.append(int(prj.parent().key().id()))
		
		# Get the duplicates
		dups = [x for x in story_ids if story_ids.count(x) > 1]
		dups = removeDuplicates(dups)
		logging.info('Content of dups %s', dups)
		for story_id in dups:
			counter = story_ids.count(story_id)
			if counter > 1:
				s = StoryPartsByUser(story_id = story_id, number_storyparts = counter)
				s.put()	
		return

# Summarize most popular users
class CronPopularUsers(webapp.RequestHandler):
	def get(self):
		logging.info('Cron for PopularUsers -----------------------')
		return

# Index stories to be easily searched
class IndexStories(webapp.RequestHandler):
	def get(self):
		searchService = SearchService()
		stories = Story.all().filter('document_index_id =', None).fetch(50)
		if stories:
			for story in stories:
				idx = search.Index(name=searchService._STORY_INDEX_NAME).add(searchService.createDocument(str(story.key()), story.content))
				story.document_index_id = str(idx[0].id)
				story.put()
		return
		
class IndexUsers(webapp.RequestHandler):
	def get(self):
		searchService = SearchService()
		users = User.all().filter('document_index_id =', None).fetch(100)
		if users:
			for user in users:
				idx = search.Index(name=searchService._USER_INDEX_NAME).add(searchService.createDocument(str(user.key()), user.name + ' ' + user.username))
				user.document_index_id = str(idx[0].id)
				user.put()
		return

class WipeOutUserSearch(webapp.RequestHandler):
	def get(self):
		searchService = SearchService()
		deleteDocument(searchService._USER_INDEX_NAME)
		return

class WipeOutStorySearch(webapp.RequestHandler):
	def get(self):
		searchService = SearchService()
		deleteDocument(searchService._STORY_INDEX_NAME)
		return

application = webapp.WSGIApplication([
									   	('/cron/storiesbyuser', CronStoriesByUser),
										('/cron/storypartsbyuser', CronStoryPartsByUser),
										('/cron/popularusers', CronPopularUsers),
										('/cron/indexstories', IndexStories),
										('/cron/indexusers', IndexUsers),
										('/cron/wipeoutusersearch', WipeOutUserSearch),
										('/cron/wipeoutstorysearch', WipeOutStorySearch)
									 ], debug=False)

def main():
  run_wsgi_app(application)

if __name__ == '__main__':
  main()