var time0;

var SelectionVox = new Array();

var Selection = function () {
	// If a selection has been drawn, this is true.
	this.enabled = false;
	
	// Defines the bounds of selection.
	this.start = {x: 0, y: 0, z: 0};
	this.end = {x: 0, y: 0, z: 0};
	
	// This is so the begin is only drawn once.
	this.begin = true;
	
	this.area = {x: 0, y: 0, z: 0};
	
	this.selectionField = new Array();
	
	this.select = function (target) {
		time0 = new Date();
		
		this.enabled = true;
		
		if (this.begin) {
		 	this.start.x = parseInt(target.getAttributeNS(null, "c"));
			this.start.y = parseInt(target.getAttributeNS(null, "r"));
			this.start.z = $C.layerOffset.z;
			this.end.x = parseInt(target.getAttributeNS(null, "c"));
			this.end.y = parseInt(target.getAttributeNS(null, "r"));
			this.end.z = $C.layerOffset.z;
			this.begin = false;
		}
		else {
			this.end.x = parseInt(target.getAttributeNS(null, "c"));
			this.end.y = parseInt(target.getAttributeNS(null, "r"));
			this.end.z = $C.layerOffset.z;
		}
		
		this.draw();
	}
	
	this.deselect = function () {
		// Reset start and end values.
		this.start = {x: 0, y: 0, z: 0};
		this.end = {x: 0, y: 0, z: 0};
		// this.area = {x: 0, y: 0, z: 0};
		this.begin = true;
		
		// Clear canvas.
		$C.posInd.clearSelection();
		$C.posInd.redraw();
		
		// Make sure it's off.
		this.enabled = false;
		console.log('selection off');
	}
	
	this.draw = function () {
		$C.posInd.clearSelection();
		
		// Facilitates drawing of the array using canvasBlock occlusion.
		for (var x = -1; x < $C.gridDims.r + 1; x++) {
			SelectionVox[x] = new Array();
			for (var y = -1; y < $C.gridDims.r + 1; y++) {
			SelectionVox[x][y] = new Array();
				for (var z = -1; z < $C.gridDims.c + 1; z++) {
					SelectionVox[x][y][z] = -1;
				}
			}
		}
		
		var location = {x: 0, y: 0, z: 0};
		
		var i = 0;
		
		var xDiff = Math.abs(this.end.x - this.start.x);
		var yDiff = Math.abs(this.end.y - this.start.y);
		var zDiff = Math.abs(this.end.z - this.start.z);
		
		// This basically draws every block inside the selection area.
		
		var offset = {};
		
		for (var x = 0; x < xDiff + 1; x++) {
			for (var y = 0; y < yDiff + 1; y++) {
				for (var z = 0; z < zDiff + 1; z++) {
					if (this.begin) {
						location.x = this.start.x;
						location.y = this.start.y;
						location.z = this.start.z;
					}
					else {
						offset = {x: x, y: y, z: z};
						location = this.normalize(this.start, this.end, offset);
					}
					
					this.selectionField.push([location.x, location.y, location.z]);
				
					gridPosition = location.x * $C.gridDims.c + location.y;
					coors = GridField["x-" + gridPosition].coors;
					yellow = "rgb(255, 255, 0)";
					color = {left: yellow, right: yellow, top: yellow, inset: yellow};
					canvasBlock(coors, location, color);
					SelectionVox[x][y][z] = 1;
					i++;
				}
			}
		}
		
		$C.posInd.redraw();
		
		var time1 = new Date();
		console.log(xDiff + ", " + yDiff + ", run : " + i + " times.");
		
		loggit("Selected " + i + " blocks.");
		
		this.area = {x: xDiff, y: yDiff, z: zDiff};
	}
	
	this.fill = function () {
		var time2 = new Date();
		
		var diff = {}
		var norm = {};
		
		for (var z = 0; z < this.area.z; z++) {
			for (var y = -1; y < this.area.y; y++) {
				for (var x = this.area.x + 1; x > 0; x--) {
					diff = {x: x, y: y, z: z};
					norm = this.normalize(this.start, this.end, diff);
					Field.push([norm.x, norm.y, norm.z, $C.selected.color]);
					console.log(norm);
					Voxel[x][y][z] = Field.length - 1;
				}
			}
		}
		
		this.deselect();
		
		drawAllBlocks();
		$C.posInd.redraw();
		
		var time3 = new Date();
		
		console.log('Fill took: ' + (time3 - time2) + 'ms.');
	}
	
	this.remove = function () {
		
	}
	
	this.normalize = function (start, end, offset) {
		var location = {x: 0, y: 0, z: 0};
		
		if (start.x > end.x) {
			location.x = offset.x + end.x;
		}
		else {
			location.x = offset.x + start.x;
		}
		if (start.y > end.y) {
			location.y = offset.y + end.y;
		}
		else {
			location.y = offset.y + start.y;
		}
		if (start.z > end.z) {
			location.z = offset.z + end.z;
		}
		else {
			location.z = offset.z + start.z;
		}
		
		return location;
	}
}

function fillSelection () {
	
}

function removeSelection () {
	
}

