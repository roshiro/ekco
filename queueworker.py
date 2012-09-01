from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class EmailWorker(webapp.RequestHandler):
    def post(self):
		return
'''		action = self.request.get('action')
		if action == 'new_user':
			username = self.request.get('username')
			email.sendConfirmation(userService.get(username))'''

def main():
    run_wsgi_app(webapp.WSGIApplication([
								        ('/queue/email', EmailWorker)
    ]))

if __name__ == '__main__':
    main()
