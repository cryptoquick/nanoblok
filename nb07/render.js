var Renderer = function () {
	this.canvas = document.getElementById('renderer');
	this.ctx = context('renderer');
	
	this.scale = 2;
	this.rectPoints = [];
	
	this.bufferMask = [];
	
	this.octree = [];
	this.scale = 32;
	this.depth = 0;
	
	this.buildOctree = function () {
		var date0 = new Date();
		// First, find how deep the octrees should go. For a 32vx object, this is 5.
		var level = this.scale;
		while (level > 1) {
			level /= 2;
			this.depth++;
		}
		
		this.octree = this.recursiveArray([], 5, 8);
		
		var temp = [];
		
		var date1 = new Date();
		console.log('time: ' + (date1 - date0));
	}
	
	this.recursiveArray = function (array, depth, leaves) {
		var temp = [];
		
		if (depth > 0) {
			for (var node = 0; node < leaves; node++) {
				temp.push(array);
			}
			return (this.recursiveArray(temp, depth - 1, leaves));
		}
		else {
			console.log(this.its);
			return array;
		}
	}
	
	this.findDepthBuffer = function () {
		// find top Voxels
		
	}
	
	this.buildRectPoints = function () {
		var rectPoints = {x: 0, y: 0, z: 0, w: 0, h: 0, c: null};
		
		for (var i = 0, ii = Field.length; i < ii; i++) {
			rectPoints.x = Field[i][0] * this.scale;
			rectPoints.y = Field[i][1] * this.scale;
			rectPoints.z = Field[i][2] * this.scale;
			rectPoints.w = this.scale;
			rectPoints.h = this.scale;
			rectPoints.c = SwatchField[Field[i][3]][3];
			
			this.rectPoints.push(rectPoints);
		}
	}
	
	this.transformPoints = function () {
		
	}
	
	this.rectMask = [];
	
	this.renderRects = function () {
		// Create rectMask 2D array
		for (var i = 0; i < 64 * 64; i++) {
			// if () {
				this.rectMask.push(Math.floor(this.rectPoints[i].z));
			// }
		}
		
		var it = 0;
		
		for (var y = 0; y < 64; y++) {
			for (var x = 0; x < 64; x++) {
				this.rectMask[it]
			}
			
			it++;
		}
	}
	
	this.render = function () {
		// this.buildRectPoints();
		// this.renderRects();
	}
	
	this.test = function () {
		var ctx = context('grids');
		ctx.fillStyle = 'orange';
		ctx.fillRect(0,0,3,3);
		var img = ctx.getImageData(0, 0, 3, 3);
		console.log(img);
	}
	
	this.pixrender = function () {
		this.clear();
		
		var color = {r: 255, g: 255, b: 255};
		var img = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		var index = 0;
		
		for (var y = 0; y < 64; y++) {
			for (var x = 0; x < 64; x++) {
				for (var z = 0; z < 32; z++) {
					if (Voxel[Math.floor(x / 2)][Math.floor(y / 2)][z] != -1) {
						color = SwatchField[Field[Voxel[Math.floor(x / 2)][Math.floor(y / 2)][z]][3]][3];
					}
				}
				
				index = (x + y * 64) * 4;
				
				img.data[index + 0] = color.r;
				img.data[index + 1] = color.g;
				img.data[index + 2] = color.b;
				img.data[index + 3] = 255;
				
				color = {r: 255, g: 255, b: 255};
			}
		}
		
		this.ctx.putImageData(img, 0, 0);
	}
	
	this.clear = function () {
		this.ctx.clearRect(0, 0, 64, 64);
	}
}

