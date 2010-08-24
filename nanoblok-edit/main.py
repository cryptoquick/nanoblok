#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#	  http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from models import Sprite, Voxel

class MainHandler(webapp.RequestHandler):
	def get(self):
		user = users.get_current_user()
		
		if user:
			self.response.out.write('Going to copy Alex\'s code from the other example here so it loads his editor.')
		else:
			self.redirect(users.create_login_url(self.request.uri))

class ListHandler(webapp.RequestHandler):
	def get(self):
		user = users.get_current_user()
		
		if user:
			self.response.out.write("List all of the sprites that have been saved by this user")
		else:
			self.redirect(users.create_login_url(self.request_uri))

class SaveHandler():
	def get(self):
		pass #This will probably never get called
		
	def post(self, sprite_id = None):
		user = users.get_current_user()
		
		if user:
			if sprite_id:
				#make sure this sprite belongs to this user.
				
			else:
				#create & save a new sprite
		else:
			self.redirect(users.create_login_url(self.request_url))

def main():
	application = webapp.WSGIApplication([
		('/', MainHandler),
		('/my_sprites', ListHandler),
		('/save/?(+d)?)', SaveHandler),
		('/load/(+d)', LoadHandler),
		], debug=True)
	util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
