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
	this.activate = function (toolName) {
		if ($C.selected.tool == "toolButton" + toolName)
		{
			this.selectColor();
		}
		else {
			document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "0.0");
			$C.selected.tool = "toolButton" + toolName;
			document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "1.0");
			loggit($C.selected.tool.substr(10,100) + " tool activated.");
		}
	}
	// For when the tool button is clicked again, to default to block placement.
	// Get the color swatch (its name corresponds to its color), then set its black outline to transparent,
	// making it appear deselected.
	this.selectColor = function () {
		// Deselect previous tool.
		if ($C.selected.lastColor != -1) {
			document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "0.0");
		}
		$C.selected.tool = "color" + $C.selected.color;
		document.getElementById($C.selected.tool).setAttributeNS(null, "stroke-opacity", "1.0");
	}
	
	// Save button.
	this.save = function () {
		saveField();
		loggit("Blocks saved.");
	}
	
	// Load button.
	this.load = function () {
		if (Dialog.showing) {
			Dialog.hide();
		}
		else {
			Dialog.show('dialog');
		}
	}
	
	// Refresh button.
	this.refresh = function () {
		Update("refresh", {gridMode: "standard"});
		loggit("Canvas refreshed.");
	}
		
	// Remove button, its state can be toggled by the user.
	this.remove = function () {
		if ($C.selection.enabled) {
			$C.selection.remove();
		}
		else {
			this.activate("Delete");
		}
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
				for (var s = 0; s < 1024; s++) {
					SwatchField[s + (($C.layerOffset.z) * 1024)][4] = true;
				}
				$C.posInd.clearSwatch();
				drawAllSwatch();
			}
			// For block slicing.
			else {
				for (var i = 0, ii = Field.length; i < ii; i++) {
					if (Field[i][2] == $C.layerOffset.z) {
						FieldVisible[i] = true;
					}
				}
				
				$C.posInd.clearBlocks();
				drawAllBlocks();
				$C.posInd.redraw();
			}
			
			loggit("Slice up to " + $C.layerOffset.z);
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
					SwatchField[s + (($C.layerOffset.z + 1) * 1024)][4] = false;
				}
				$C.posInd.clearSwatch();
				drawAllSwatch();
			}
			// For block slicing.
			else {
				for (var i = 0, ii = Field.length; i < ii; i++) {
					if (Field[i][2] > $C.layerOffset.z) {
						FieldVisible[i] = false;
					}
				}
				
				$C.posInd.clearBlocks();
				drawAllBlocks();
				$C.posInd.redraw();
			}
			
			loggit("Slice down to " + $C.layerOffset.z);
		}
	}
	
	this.color = function () {
		this.selectColor();
		// loggit("Selected color is: " + $C.palette[$C.selected.color][3] + ".");
	}
	
	this.swatch = function () {
		if ($C.swatchActive) {
			this.activate("Colors");
			closeColorSwatch();
			loggit("Color Cube closed.");
		}
		else {
			this.activate("Colors");
			fillColorSwatch();
		}
	}
	
	this.rotLeft = function () {
		if (!$C.swatchActive) {
			rotate(1);
		}
	}
	
	this.rotRight = function () {
		if (!$C.swatchActive) {
			rotate(0);
		}
	}
	
	this.select = function () {
		this.activate("Select");
		// Toggle off.
		if ($C.selection.enabled) {
			$C.selection.deselect();
		}
	}
	
	this.fill = function () {
		if ($C.selection.enabled) {
			$C.selection.fill();
			loggit('Selection fill.');
		}
		else {
			this.activate("Fill");
		}
		
		loggit('Fill tool not yet implemented.');
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
	for (var i = 0, ii = Fld.length; i < ii; i++) {
		
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
		var visibility = false;
		
		if ($C.swatchActive) {
			visibility = Fld[i][4];
		}

		// Add to respective field, but voxel doesn't need to be added to color cube.
		if ($C.swatchActive) {
			Fld[i] = [x, y, z, color, visibility];
		}
		else {
			Fld[i] = [x, y, z, color];
		}
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

