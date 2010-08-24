from google.appengine.api import users 
from google.appengine.ext import db

class Sprite(db.Model):
	user = db.UserProperty(auto_current_user_add=True)
	name = db.StringProperty()

class Voxel(db.Model):
	#Alex, I know you're using a slightly different definition of "voxel" in your main code, but I can't really think of a better term to use here.
	sprite = db.ReferenceProperty(Sprite)
	x = db.IntegerProperty()
	y = db.IntegerProperty()
	z = db.IntegerProperty()
	color = db.IntegerProperty()
	
	@classmethod
	def save_voxels(cls, sprite, voxels):
		for v in voxels:
			cls(sprite=sprite,x=v[0],y=v[1],z=v[2],color=v[3]).put()
