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
	this.remove = function () {
		if ($C.selected.tool == "remove")
		{
			$C.tools.deselectRm();
		}
		else {
			$C.tools.selectRm();
		}
	}
	this.selectRm = function () {
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		$C.selected.tool = "remove";
		document.getElementById("toolButton5").setAttributeNS(null, "stroke-opacity", "1.0");
		loggit("Deletion tool selected.");
	}
	this.deselectRm = function () {
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
			
			// For Color Cube slicing.
			if ($C.swatchActive) {
				for (var s = 0; s < 1023; s++) {
					SwatchField[s * $C.layerOffset.z][4] = false;
				}
				$C.posInd.clearSwatch();
				drawAllSwatch();
				
				loggit("Slice up to " + $C.layerOffset.z);
			}
			else {
				loggit("Up to " + $C.layerOffset.z);
			}
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
			
			// For Color Cube slicing.
			if ($C.swatchActive) {
				for (var s = 0; s < 1024; s++) {
					SwatchField[s + (($C.layerOffset.z) * 1024)][4] = false;
				}
				console.log("Slice: " + 1023 * ($C.layerOffset.z));
				$C.posInd.clearSwatch();
				drawAllSwatch();
				
				loggit("Slice down to " + $C.layerOffset.z);
			}
			else {
				loggit("Down to " + $C.layerOffset.z);
			}
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
	
	// This function works on both the grid and the color cube.
	if ($C.swatchActive) {
		initVoxels(Swatch);
	}
	else {
		initVoxels(Voxel);
	}
	
	var x = 0;
	var y = 0;
	var z = 0;
	
	var Fx = 0;
	var Fy = 0;
	
	if ($C.swatchActive) {
		Fld = SwatchField;
	}
	else {
		Fld = Field;
	}
	
	var ang = (90 * Math.PI) / 180;
	
	if (!direction) {
		ang = (-90 * Math.PI) / 180;
	}

	// This is where the magic happens.
	for (var i = 0; i < Fld.length; i++) {
		
		// Field coordinates.
		Fx = Fld[i][0];
		Fy = Fld[i][1];
		z = Fld[i][2];
		
		// Translate coordinates over one in order to compensate for the zero origin issue.
		Fx++;
		Fy++;
		
		// A lovely matrix transformation.
		x = Math.round(Fx * Math.cos(ang) - Fy * Math.sin(ang));
		y = Math.round(Fx * Math.sin(ang) + Fy * Math.cos(ang));
		
		// To keep blocks from going off-grid, put them on the other side.
		if (x < 0) {
			x = ($C.gridDims.c) + x;
		}
		
		if (y < 0) {
			y = ($C.gridDims.r) + y;
		}
		
		// More compensation for zero origin issue.
		if (direction) {
			y--;
		}
		else {
			x--;
		}
		
		// Assign color. Works with both old and new color systems.
		var color = Fld[i][3];

		// Add to respective field, but voxel doesn't need to be added to color cube.
		Fld[i] = [x, y, z, color];
		Voxel[x][y][z] = Fld[i][3];
	}
	
	// Tell which field to put back into (cube or grid), and their associated functions.
	if ($C.swatchActive) {
		SwatchField = Fld;
		$C.posInd.clearSwatch();
		drawAllSwatch();
	}
	else {
		Field = Fld;
		$C.posInd.clearBlocks();
		drawAllBlocks();
	}
	
	$C.posInd.redraw();
	
	// True for left, False for right.
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