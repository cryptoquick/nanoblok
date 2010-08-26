import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from google.appengine.ext import db

from django.utils import simplejson as json

from models import Sprite, Voxel

debug = 0

class MainHandler(webapp.RequestHandler):
	if debug:
		def get(self):
			user = users.get_current_user()
			if user:
				self.response.out.write('Going to copy Alex\'s code from the other example here so it loads his editor.')
				cheat_sheet = '''
				<p><a href="/load/190">Load sprite 190</a></p>
				<p><a href="/list">List all of my saved sprites</a></p>
				<form action="/save" method="post">
				<input type="hidden" name="data" value='{"title":"Sketch", "Field":[[18,7,0,26624],[19,8,0,26624],[20,9,0,26624],[21,10,0,26624],[21,11,0,26624],[22,12,0,26624],[22,13,0,26624],[21,15,0,26624],[21,17,0,26624],[20,18,0,26624],[20,19,0,26624],[18,20,0,26624],[12,22,0,26624],[10,22,0,26624],[9,22,0,26624],[9,21,0,26624],[8,21,0,26624],[8,19,0,26624],[8,18,0,26624],[8,17,0,26624],[8,15,0,26624],[9,13,0,26624],[10,11,0,26624],[10,10,0,26624],[12,9,0,26624],[15,8,0,26624],[16,10,0,32386],[16,11,0,32386],[16,12,0,32386],[16,13,0,32386],[16,14,0,32386],[15,15,0,32386],[14,15,0,32386],[13,17,0,32386],[12,17,0,32386],[12,16,0,32386],[11,15,0,32386],[11,14,0,32386],[11,13,0,32386],[11,12,0,32386],[12,10,0,32386],[13,10,0,32386],[13,9,0,32386],[14,10,0,32386],[15,10,0,32386],[17,10,0,32386],[18,11,0,32386],[19,11,0,32386],[19,12,0,32386],[18,13,0,32386],[18,14,0,32386],[18,15,0,32386],[18,16,0,32386],[17,17,0,32386],[17,18,0,32386],[16,19,0,32386],[15,19,0,32386],[14,20,0,32386],[20,14,1,7040],[19,14,1,7040],[19,13,1,7040],[18,13,1,7040],[17,12,1,7040],[17,11,1,7040],[16,11,1,7040],[15,11,1,7040],[13,12,1,7040],[12,12,1,7040],[11,13,1,7040],[10,13,1,7040],[10,14,1,7040],[10,16,1,7040],[10,17,1,7040],[10,18,1,7040],[10,19,1,7040],[12,19,1,7040],[13,19,1,7040],[14,19,1,7040],[15,18,1,7040]]}'/>
				<input type="submit" value="Save NEW sprite"/></form>
				<form action="/save/190" method="post">
				<input type="hidden" name="data" value='{"title":"Sketch", "Field":[[18,7,0,26624],[19,8,0,26624],[20,9,0,26624],[21,10,0,26624],[21,11,0,26624],[22,12,0,26624],[22,13,0,26624],[21,15,0,26624],[21,17,0,26624],[20,18,0,26624],[20,19,0,26624],[18,20,0,26624],[12,22,0,26624],[10,22,0,26624],[9,22,0,26624],[9,21,0,26624],[8,21,0,26624],[8,19,0,26624],[8,18,0,26624],[8,17,0,26624],[8,15,0,26624],[9,13,0,26624],[10,11,0,26624],[10,10,0,26624],[12,9,0,26624],[15,8,0,26624],[16,10,0,32386],[16,11,0,32386],[16,12,0,32386],[16,13,0,32386],[16,14,0,32386],[15,15,0,32386],[14,15,0,32386],[13,17,0,32386],[12,17,0,32386],[12,16,0,32386],[11,15,0,32386],[11,14,0,32386],[11,13,0,32386],[11,12,0,32386],[12,10,0,32386],[13,10,0,32386],[13,9,0,32386],[14,10,0,32386],[15,10,0,32386],[17,10,0,32386],[18,11,0,32386],[19,11,0,32386],[19,12,0,32386],[18,13,0,32386],[18,14,0,32386],[18,15,0,32386],[18,16,0,32386],[17,17,0,32386],[17,18,0,32386],[16,19,0,32386],[15,19,0,32386],[14,20,0,32386],[20,14,1,7040],[19,14,1,7040],[19,13,1,7040],[18,13,1,7040],[17,12,1,7040],[17,11,1,7040],[16,11,1,7040],[15,11,1,7040],[13,12,1,7040],[12,12,1,7040],[11,13,1,7040],[10,13,1,7040],[10,14,1,7040],[10,16,1,7040],[10,17,1,7040],[10,18,1,7040],[10,19,1,7040],[12,19,1,7040],[13,19,1,7040],[14,19,1,7040],[15,18,1,7040]]}'/>
				<input type="submit" value="Update sprite"/></form>
				'''
				self.response.out.write(cheat_sheet)
			else:
				self.redirect(users.create_login_url(self.request.uri))
	else:
		def get(self):
			template_values = { }
			self.response.headers['Content-Type'] = "application/xhtml+xml"
			path = os.path.join(os.path.dirname(__file__), "index.xhtml")
			self.response.out.write(template.render(path, template_values))


class ListHandler(webapp.RequestHandler):
	def get(self):
		user = users.get_current_user()
		if user:
			self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
			q = Sprite.all().filter("user =", user)
			self.response.out.write("{[")
			objs = []
			for s in q:
				objs.append("{\"title\":\"%s\",\"url\":\"/load/%s\"}" % (s.name, s.key()))
			
			self.response.out.write(",".join(objs))
			self.response.out.write("]}")
		else:
			self.redirect(users.create_login_url(self.request_uri))

class SaveHandler(webapp.RequestHandler):		
	def get(self):
		pass #This will probably never get called
		
	def post(self, sprite_id = None):
		user = users.get_current_user()
		if user:
			posted_sprite = json.loads(self.request.get("data"))
			if sprite_id:
				sprite = Sprite(key_name=sprite_id)
				if sprite.user == user:
					sprite.name = posted_sprite['title']
				sprite.put()
				
				#This will technically work, but is probably unsafe longterm. If anything goes wrong in the saving process, your Sprite is gone.
				db.delete( Voxel.all().filter("sprite =", sprite) )
			else:
				sprite = Sprite(name=posted_sprite['title'])
				sprite.put()
			
			Voxel.save_voxels(sprite, posted_sprite['Field'])
			self.response.out.write(posted_sprite)
		else:
			self.redirect(users.create_login_url(self.request_uri))

class LoadHandler(webapp.RequestHandler):
	def get(self, sprite_id = None):
		if sprite_id:
			sprite = Sprite.get(sprite_id)
			voxels = Voxel.all().filter("sprite =", sprite)
			self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
			self.response.out.write("{")
			self.response.out.write("\"title\":\"%s\"," % sprite.name)
			self.response.out.write("\"Field\":[")
			vxls = []
			for v in voxels:
				vxls.append("[%d, %d, %d, %d]" % (v.x, v.y, v.z, v.color))
			
			self.response.out.write(",".join(vxls))
			self.response.out.write("]")
			self.response.out.write("}")
		else:
			self.response.out.write("Throw some kind of error message")

def main():
	application = webapp.WSGIApplication([
		('/', MainHandler),
		('/list', ListHandler),
		('/save/?(.+)?', SaveHandler),
		('/load/?(.+)?', LoadHandler),], debug=True)
	util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
