# !/usr/bin/env python
# Bulk of this document is based on code from here: http://code.google.com/appengine/articles/rpc.html

import os

import logging

from django.utils import simplejson
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from google.appengine.ext import db

# import zlib

class MainPage(webapp.RequestHandler):
	"""Renders the main template."""
	def get(self):
		template_values = { }
		self.response.headers['Content-Type'] = "application/xhtml+xml"
		path = os.path.join(os.path.dirname(__file__), "index.xhtml")
		self.response.out.write(template.render(path, template_values))


class SaveHandler(webapp.RequestHandler):
	""" Allows the functions defined in the RPCMethods class to be RPCed."""
	def __init__(self):
		webapp.RequestHandler.__init__(self)
		# self.methods = RPCMethods()
	
	def post(self):
		data = simplejson.loads(self.request.body)
		length = self.request.headers['content-length']
		
		# data = simplejson.loads(args)
		
		# blockcountlen = len(data[2])
		
		dbdata = BlokField(
			author 		= data[0],
			title 		= data[1],
			field 		= simplejson.dumps(data[2]),
			revision 	= float(data[3]),
			blockcount 	= int(len(data[2])),
			repo		= data[4]
		)
		
		# 	["CryptoQuick", "TestBlock", [[20, 12, 0, 0], [19, 11, 0, 0], [18, 11, 0, 0]], 0.01]
		
		dbdata.put()
		
		# if func[0] == '_':
		# 	self.error(403) # access denied
		# 	return
		
		# func = getattr(self.methods, func, None)
		# if not func:
		# 	self.error(404) # file not found
		# 	return
		# 
		# result = func(*args)
		# self.response.out.write(simplejson.dumps(result))
		
		self.response.out.write(str(length) + ' bytes of data saved to the server.')


# class RPCMethods:
# 	""" Defines the methods that can be RPCed.
# 	NOTE: Do not allow remote callers access to private/protected "_*" methods.
# 	"""
# 		
# 	def Save(self, *args):
# 		#
# 		#return len(args[0])
# 		return ''.join(args) + ' bytes of data saved to server.'


class BlokField(db.Model):
	author		= db.StringProperty(required=True)# db.UserProperty()
	title		= db.StringProperty(required=True)
	field		= db.StringProperty(required=True)
	datetime	= db.DateTimeProperty(required=True, auto_now_add=True)
	revision	= db.FloatProperty(required=True)
	blockcount	= db.IntegerProperty(required=True)
	repo		= db.StringProperty(required=True)


def main():
	app = webapp.WSGIApplication([
		('/', MainPage),
		('/save', SaveHandler),
		# ('/load', LoadHandler),
		], debug=True)
	util.run_wsgi_app(app)

if __name__ == '__main__':
	main()