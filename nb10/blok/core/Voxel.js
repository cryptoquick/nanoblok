BLOK.Voxel = function (x, y, z) {
	if (x && y && z) {
		this.setCoordinates(x, y, z);
		this.setPosition();
	}
	
	return this;
};

BLOK.Voxel.prototype = {
	constructor: BLOK.Voxel,
	
	coordinates: {x: 0, y: 0, z: 0},
	position: {x: 0, y: 0},
	
	setCoordinates: function (x, y, z) {
		coordinates.x = x;
		coordinates.y = y;
		coordinates.z = z;
	},
	
	// Determines the position on the screen which is the center of the voxel.
	setPosition: function () {
		
	}
};
