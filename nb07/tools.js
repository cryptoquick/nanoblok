/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for tools.js:
 * Logic for selecting tools and their associated functions.
 */

// Top-side mode/settings buttons.
var Tools = function () {
	// Save button.
	this.save = function () {
		saveField();
		loggit("Blocks saved.");
	}
	
	// Load button.
	this.load = function () {
		loadField();
		drawBlocks();
		loggit("Blocks loaded.");
	}
	
	// Refresh button.
	this.refresh = function () {
		Update("refresh", {gridMode: "standard"});
		loggit("Canvas refreshed.");
	}
		
	// Remove button, its state can be toggled by the user.
	this.remove = new Object();
	this.remove.select = function () {
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		$C.selected.tool = "remove";
		document.getElementById("toolButton5").setAttributeNS(null, "stroke-opacity", "1.0");
		loggit("Deletion tool selected.");
	}
	this.remove.deselect = function () {
		$C.selected.tool = "color" + $C.selected.color + $C.palette[$C.selected.color][3];
		document.getElementById("toolButton5").setAttributeNS(null, "stroke-opacity", "0.0");
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "1.0");
		loggit("Deletion tool deselected.");
	}
	
	this.gridUp = function () {
		if($C.layerOffset.z < ($C.gridDims.r - 1)) {
			$C.layerOffset.z++;
			$C.posInd.redraw();
			// Raise the SVG grid.
			var gridOffset = -389;
			if ($C.smallDisplay) {gridOffset = -309};
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(-1,"
				+ (gridOffset - $C.layerOffset.z * $C.blockSize.half) + ")");
			loggit("Up to " + $C.layerOffset.z);
		}
	}
	this.gridDown = function () {
		if($C.layerOffset.z > 0) {
			$C.layerOffset.z--;
			$C.posInd.redraw();
			// Lower the SVG grid.
			var gridOffset = -389;
			if ($C.smallDisplay) {gridOffset = -309};
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(-1,"
				+ (gridOffset - $C.layerOffset.z * $C.blockSize.half) + ")");
			loggit("Down to " + $C.layerOffset.z);
		}
	}
	
	this.color = function () {
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		// Get the color swatch (its name corresponds to its color), then set its black outline to transparent,
		// making it appear deselected.
		document.getElementById("color" + $C.selected.lastColor + $C.palette[$C.selected.lastColor][3] + "Button")
			.setAttributeNS(null, "stroke-opacity", "0.0");
		$C.selected.tool = "color" + $C.selected.color + $C.palette[$C.selected.color][3];
		loggit("Selected color is: " + $C.palette[$C.selected.color][3] + ".");
	}
	
	this.swatch = function () {
		if ($C.swatchActive) {
			$C.selected.tool = "color" + $C.selected.color + $C.palette[$C.selected.color][3];
			document.getElementById("toolButton4").setAttributeNS(null, "stroke-opacity", "0.0");
			document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "1.0");
			closeColorSwatch();
			loggit("Color Cube closed.");
		}
		else {
			document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			$C.selected.tool = "swatch";
			document.getElementById("toolButton4").setAttributeNS(null, "stroke-opacity", "1.0");
			fillColorSwatch();
		}
	}
	
	this.rotLeft = function () {
		rotate(1);
	}
	
	this.rotRight = function () {
		rotate(0);
	}
}

var rotation = 0;

function rotate (direction) {
	var location = new Object();
	initVoxels();
	
	var x = 0;
	var y = 0;
	var z = 0;
	
	for (var i = 0; i < Field.length; i++) {
		//$C.gridDims.r - 1 - 
		// x = Math.abs(Field[i][0] - $C.gridDims.r);
		if (rotation == 0 || rotation == 2) {
			x = $C.gridDims.c - 1 - Field[i][0];
		}
		else {
			x = Field[i][0];
		}
		// y = Math.abs(Field[i][1] - $C.gridDims.r);
		if (rotation == 1 || rotation == 3) {
			y = $C.gridDims.r - 1 - Field[i][1];
		}
		else {
			y = Field[i][1];
		}
		
		z = Field[i][2];

		var color = Field[i][3];

		Field[i] = [x, y, z, color];
		Voxel[x][y][z] = Field[i][3];
	}
	
	$C.posInd.clearBlocks();
	drawAllBlocks();
	$C.posInd.redraw();
	
	// true for left, false for right.
	if (direction) {	
		if (rotation < 3) {
			rotation++;
		}
		else {
			rotation = 0;
		}
		loggit("Rotated left to " + rotation * 90 + " degrees.");
	}
	else {
		if (rotation > 0) {
			rotation--;
		}
		else {
			rotation = 3;
		}
		loggit("Rotated right to " + rotation * 90 + " degrees.");
	}
}