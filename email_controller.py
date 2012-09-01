from google.appengine.api import mail
from properties import *
from google.appengine.ext.webapp import template

import sendgrid
import os

class TellynnEmail():
	def sendConfirmation(self, user):
		if user and user.email:
			try:
				path = os.path.join(os.path.dirname(__file__) + '/templates/email', 'new_user.html')
				html = template.render(path, {'name': user.name})
				self.send(user.email, user.name, "Bem-Vindo ao Tellynn!", html)
				return True
			except Exception:
				return False
		else:
			return False
		
	def send(self, to_email, to_name, title, content):
		s = sendgrid.Sendgrid(SENDGRID["username"], SENDGRID["password"], secure=True)
		message = sendgrid.Message("tellynn@tellynn.com", title, "", content)
		message.add_to(to_email, to_name)
		s.web.send(message)
		return