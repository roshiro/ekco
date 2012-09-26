import time
import datetime

from django.utils import simplejson
from google.appengine.ext import blobstore
from google.appengine.ext import db

SIMPLE_TYPES = (int, long, float, bool, dict, basestring, list)

def toJSON(self):
	dic = self.to_dict()
	dic['id'] =self.key().id()
	return simplejson.dumps([dic])

class User(db.Model):
	username = db.StringProperty(required=True)
	name = db.StringProperty(required=False)
	email = db.StringProperty(required=True)
	about = db.StringProperty(required=False, multiline=True)
	work = db.StringProperty(required=False)
	website = db.StringProperty(required=False)	
	avatar_thumb = db.StringProperty(required=False)
	location = db.StringProperty(required=False)
	address = db.StringProperty(required=False)
	phone = db.StringProperty(required=False)
	categories = db.ListProperty(str, default=[], indexed=True)
	facetoken = db.StringProperty(required=False)
	faceid = db.StringProperty(required=False)
	document_index_id = db.StringProperty(required=False)	
	created_at = db.DateTimeProperty(auto_now_add=True, indexed=True)

	def to_dict(self):
		return dict([(p, unicode(getattr(self, p))) for p in self.properties()])	
		
class Portfolio(db.Model):
	user = db.ReferenceProperty(User)
	name = db.StringProperty(required=False)
	photos = db.StringListProperty(default=[])
	cover = db.StringProperty(required=False)
	created_at = db.DateTimeProperty(auto_now_add=True, indexed=True)
	
	def to_dict(self):
		return dict([(p, unicode(getattr(self, p))) for p in self.properties()])	
