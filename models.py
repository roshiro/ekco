from google.appengine.ext import blobstore
from google.appengine.ext import db

class User(db.Model):
	username = db.StringProperty(required=True)
	name = db.StringProperty(required=False)
	email = db.StringProperty(required=True)
	about = db.StringProperty(required=False)
	work = db.StringProperty(required=False)
	website = db.StringProperty(required=False)	
	avatar_thumb = db.StringProperty(required=False)
	location = db.StringProperty(required=False)
	facetoken = db.StringProperty(required=False)
	faceid = db.StringProperty(required=False)
	document_index_id = db.StringProperty(required=False)
