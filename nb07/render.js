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
		// First, find how deep the octrees should go. For a 32vx object, this is 5.
		this.depth = 0;
		var level = this.scale;
		while (level > 1) {
			level /= 2;
			this.depth++;
		}
		
		// Then, build your octree. Eight for the octants.
		this.octree = this.recursiveArray(this.depth, 8, []);
	}
	
	// This function works backwards, creating an array of eight leaves, then pushing several of those to a new array of nodes, recursively.
	this.recursiveArray = function (depth, leaves, array) {
		var temp = [];
		
		if (depth > 0) {
			for (var node = 0; node < leaves; node++) {
				temp.push(array);
			}
			return (this.recursiveArray(temp, depth - 1, leaves));
		}
		else {
			return array;
		}
	}
	
	this.scales = [];
	this.rscales = [];
	
	this.convertVoxels = function () {
		var octree = new Array(Field.length);
		
		for (var i = 0, ii = this.depth; i < ii; i++) {
			this.scales.push(Math.pow(2, i));
		}
		for (var i = this.depth - 1; i >= 0; i--) {
			this.rscales.push(Math.pow(2, i));
		}
		
		for (var i = 0, ii = Field.length; i < ii; i++) {
			// ind = new Array(6);
			// octree[i] = this.saveVoxel(Field[i], this.depth, ind);
			octree[i] = this.saveVoxel(Field[i], this.depth - 1, []);
		}
		
		this.octree = octree;
		console.log(octree);
	}
	
	this.iterations = 0;
	
	// Saves the voxel in the appropriate spot in the octree array.
	// Indices in the octree array, in order of scale.
	this.saveVoxel = function (vox, level, indices) {
		var x = vox[0];
		var y = vox[1];
		var z = vox[2];
		
		// var pos = {x: 0, y: 0, z: 0};
		var index = 0;
		
		if (level >= 0) {
			(x / this.scales[level] > this.rscales[level]) ? index += 1 : index += 0;
			(y / this.scales[level] > this.rscales[level]) ? index += 2 : index += 0;
			(z / this.scales[level] > this.rscales[level]) ? index += 4 : index += 0;
			
			// indices[level] = index;
			indices.push(index);
			console.log('level:' + level + ' scale:' + this.scales[level] + ' x: ' + x / this.scales[level] + ', ' + index);
			// console.log(level + ': ' + x + ', ' + y + ', ' + z);
			// console.log('x: ' + x / level > scale);
			// this.iterations++;
			// console.log('iterations: ' + this.iterations);
			return (this.saveVoxel(vox, level - 1, indices));
		}
		else {
			return indices;
		}
	}
	
	this.recursiveVoxels = function (vox, level) {
		if (level > 1) {
			
			return (this.recursiveVoxels(vox, level / 2));
		}
	}
	
	this.render = function () {
		var date0 = new Date();
		
		this.buildOctree();
		this.convertVoxels();
		
		var date1 = new Date();
		console.log('time: ' + (date1 - date0));
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

