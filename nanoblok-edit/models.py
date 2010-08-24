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
