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
		
	// Delete button, its state can be toggled by the user.
	this.remove = new Object();
	this.remove.select = function () {
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		$C.selected.tool = "delete";
		document.getElementById("removeButton").setAttributeNS(null, "stroke-opacity", "1.0");
		loggit("Deletion tool selected.");
	}
	this.remove.deselect = function () {
		$C.selected.tool = "color" + $C.selected.color + $C.palette[$C.selected.color][3];
		document.getElementById("removeButton").setAttributeNS(null, "stroke-opacity", "0.0");
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "1.0");
		loggit("Deletion tool deselected.");
	}
	
	this.grid = function () {
		this.up = function () {
			if($C.layerOffset.z < ($C.gridDims.r - 1)) {
				$C.layerOffset.z++;
				$C.posInd.redraw();
				// Raise the SVG grid.
				document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(0,"
					+ (-35 - $C.layerOffset.z * $C.blockSize.half) + ")");
			}
		}
		this.down = function () {
			if($C.layerOffset.z > 0) {
				$C.layerOffset.z--;
				$C.posInd.redraw();
				// Lower the SVG grid.
				document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(0,"
					+ (-35 - $C.layerOffset.z * $C.blockSize.half) + ")");
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
		fillColorSwatch();
	}
}
