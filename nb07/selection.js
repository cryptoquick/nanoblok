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
			console.log("Start: " + this.start.x + ", " + this.start.y);
		}
		else {
			this.end.x = parseInt(target.getAttributeNS(null, "c"));
			this.end.y = parseInt(target.getAttributeNS(null, "r"));
			this.end.z = $C.layerOffset.z;
			console.log("End: " + this.end.x + ", " + this.end.y);
		}
		
		this.draw();
	}
	
	this.deselect = function () {
		this.enabled = false;
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
		
		console.log(this.start);
		console.log(this.end);
		
		// This basically draws every block inside the selection area.
		
		for (var x = 0; x < xDiff + 1; x++) {
			for (var y = 0; y < yDiff + 1; y++) {
				if (this.begin) {
					location.x = this.start.x;
					location.y = this.start.y;
				}
				else {
					// location.x = Math.abs(this.end.x - (xDiff - x));
					// location.y = Math.abs(this.end.y - (yDiff - y));
					if (this.start.x > this.end.x) {
						location.x = x + this.end.x;
					}
					else {
						location.x = x + this.start.x;
					}
					if (this.start.y > this.end.y) {
						location.y = y + this.end.y;
					}
					else {
						location.y = y + this.start.y;
					}
				}
				
				location.z = 0;
				gridPosition = location.x * $C.gridDims.c + location.y;
				coors = GridField["x-" + gridPosition].coors;
				yellow = "rgb(255, 255, 0)";
				color = {left: yellow, right: yellow, top: yellow, inset: yellow};
				canvasBlock(coors, location, color);
				i++;
			}
		}
		
		$C.posInd.redraw();
		
		var time1 = new Date();
		console.log(xDiff + ", " + yDiff + ", run : " + i + " times.");
		
		loggit("Selection drawn in " + (time1 - time0) + " ms.");
	}
}

function fillSelection () {
	
}

function removeSelection () {
	
}