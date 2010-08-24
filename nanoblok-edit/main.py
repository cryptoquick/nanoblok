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
			cheat_sheet = '''
			<p><a href="/load/190">Load sprite 190</a></p>
			<p><a href="/my_sprites">List all of my saved sprites</a></p>
			<form action="/save" method="post"><input type="submit" value="Save NEW sprite"/></form>
			<form action="/save/190" method="post"><input type="submit" value="Update sprite"/></form>
			'''
			self.response.out.write(cheat_sheet)
		else:
			self.redirect(users.create_login_url(self.request.uri))

class ListHandler(webapp.RequestHandler):
	def get(self):
		user = users.get_current_user()
		
		if user:
			self.response.out.write("List all of the sprites that have been saved by this user (" + user.nickname() + ")" )
		else:
			self.redirect(users.create_login_url(self.request_uri))

class SaveHandler(webapp.RequestHandler):
	def save_voxels(self):
		#maybe this should be a Class method on the Voxel Model? Whatevs.
		pass
		
	def get(self):
		pass #This will probably never get called
		
	def post(self, sprite_id = None):
		user = users.get_current_user()
		
		if user:
			if sprite_id:
				#retrieve this sprite from the datastore
				#make sure this sprite belongs to this user
				#delete all the associated Voxels
				#update Sprite
				#call the save_voxels method.
				pass
			else:
				#instantiate new Sprite
				#call save_voxels method
				pass
		else:
			self.redirect(users.create_login_url(self.request_url))

class LoadHandler(webapp.RequestHandler):
	def get(self, sprite_id = None):
		if sprite_id:
			self.response.out.write("Send the JSON data for sprite " + sprite_id)
		else:
			self.response.out.write("Throw some kind of error message")

def main():
	application = webapp.WSGIApplication([
		('/', MainHandler),
		('/my_sprites', ListHandler),
		('/save/?(.+)?', SaveHandler),
		('/load/?(.+)?', LoadHandler),], debug=True)
	util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
