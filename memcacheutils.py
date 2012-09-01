import logging
from google.appengine.api import memcache

class MemCacheUtils():
	def checkCache(self, key):
		data = memcache.get(key)
		if data:
			logging.info('Cache found for key %s', key)
		else:
			logging.info('No Cache found for key %s', key)
		return data
	
	def cache(self, key, data, timeout):
		logging.info('Cached key %s', key)
		memcache.add(key, data, timeout)
		return data
