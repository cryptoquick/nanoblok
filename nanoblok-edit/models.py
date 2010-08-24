from google.appengine.api import users 
from google.appengine.ext import db

class Sprite(db.Model):
	"""Encapsulated representation of the Sprite drawn on the HTML5 stage in the frontend."""
	user = db.UserProperty(auto_current_user_add=True)
	name = db.StringProperty()

class Voxel(db.Model):#Later on when physics features are added to Nanoblok, this could become an Expando
	"""Database representation of a single drawn pixel. References the Sprite it belongs to."""
	#Alex uses a slightly different definition of "voxel" in his main code, but I can't really think of a better term to use here.
	sprite = db.ReferenceProperty(Sprite)
	x = db.IntegerProperty()
	y = db.IntegerProperty()
	z = db.IntegerProperty()
	color = db.IntegerProperty()
	
	@classmethod
	def save_voxels(cls, sprite, voxels):
		"""Given a Sprite instance and a list of Voxels in the format [x, y, z, color], will save them en masse."""
		for v in voxels:
			cls(sprite=sprite,x=v[0],y=v[1],z=v[2],color=v[3]).put()
