// Heavily based upon the Vector2 structure within Three.js, but with some of my own changes.

BLOK.Vector2 = function (x, y) {
	this.set(x, y);
	
	return this;
};

BLOK.Vector2.prototype = {
	constructor: BLOK.Vector2,
	
	set: function (x, y) {
		x ? this.x = x : this.x = 0;
		y ? this.y = y : this.y = 0;
		
		return this;
	},
	
	copy: function (v) {
		if (instanceof(v) == BLOK.Vector2) {
			this.x = v.x;
			this.y = v.y;
			
			return this;
		}
		else
			console.log("Vector2 copy failed because it was not given a Vector2.");
	},
	
	clone: function () {
		return new BLOK.Vector2(this.x, this.y);
	}
};
