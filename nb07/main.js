/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for main.js:
 * Has event listeners and corresponding handlers for Initialization, Update (to refresh all parts of the screen), Click, and Hover. 
 */

var initialized = false;

window.addEventListener('load', function () {
	Initialize();
}, false);

var mouseDown = false;
var displayResized = false;

/* Main Functions */
function Initialize ()
{
	loggit("Program loaded.");
	
	var init0 = new Date();
	
	window.Common = computeCommonVars();
	
	// Run core graphics functions in default state.
	Update("initialize", {gridMode: "standard"});
	
	// Post-initialization tasks.
	var init1 = new Date();
	
	loggit('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	initialized = true;
	
	/* Event listeners */
	window.addEventListener('mousedown', function (evt) {
		Click(evt);
		mouseDown = true;
	}, false);
	
	window.addEventListener('mouseup', function (evt) {
		mouseDown = false;
	}, false);

	window.addEventListener('mouseover', function (evt) {
		Hover(evt, 'in');
	}, false);

	window.addEventListener('mouseout', function (evt) {
		Hover(evt, 'out');
	}, false);

	window.onresize = function() {
		if(initialized) {
			loggit('Resolution change detected, click refresh button.');
		}
		displayResized = true;
	}
}

// Redraw grid, redraw UI, redraw canvas...
function Update (updateMode, updateSettings) {	
	if (updateMode == "resize" || updateMode == "initialize") {
		gridCoors();
	//	removeUI();
	//	removeGrid();
	}
	
	// Draw SVG grid
	if (updateMode == "resize" || updateMode == "initialize") {
		drawUI();
		drawGrid("bottom");
	}

	// Draw canvas grid...
	if (updateMode == "resize" || updateMode == "canvas" || updateMode == "initialize") {		
		canvasGrid("bottom", updateSettings.gridMode);
		// canvasGrid(Common, "left", updateSettings.gridMode);
		// canvasGrid(Common, "right", updateSettings.gridMode);
		
		// ...and some logic for button outlines / selection.
		if (updateSettings.gridMode == "standard") {
			
			// Select color button at update.
			document.getElementById("color" + Common.selected.color + Common.palette[Common.selected.color][3] + "Button").setAttributeNS(null, "stroke-opacity", "1.0");
		}
		else if (updateSettings.gridMode == "number") {
			document.getElementById("numberButton").setAttributeNS(null, "fill-opacity", 1.0);
			document.getElementById("standardButton").setAttributeNS(null, "fill-opacity", 0.5);
		}
	}
}

// Handles click events from its corresponding event listener.
function Click (evt) {
	var target = evt.target;
	
	// Top-side mode/settings buttons.
	// Save button.
	if (target.id == "saveButton" || target.id == "saveText") {
		saveField();
	}
	
	// Load button.
	else if (target.id == "loadButton" || target.id == "loadText") {
		loadField();
		drawBlocks();
	}

	// Refresh button.
	else if (target.id == "refreshButton" || target.id == "refreshText") {
		Update("refresh", {gridMode: "standard"});
		loggit("Canvas refreshed.");
	}
	
	// Delete button, its state can be toggled by the user.
	else if (target.id == "deleteButton" || target.id == "deleteText") {
		if (Common.selected.tool != "delete") {
			document.getElementById(Common.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			Common.selected.tool = "delete";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Deletion tool selected.");
		}
		else if (Common.selected.tool == "delete") {
			Common.selected.tool = "color";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "0.0");
			loggit("Deletion tool deselected.");
		}
	}
	
	// Select button.
	else if (target.id == "selectButton" || target.id == "selectText" || target.id == "selectLogo") {
		if (Common.selected.tool != "select") {
			document.getElementById(Common.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			Common.selected.tool = "select";
			document.getElementById("selectButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Selection tool selected.");
		}
		else if (Common.selected.tool == "select") {
			Common.selected.tool = "color";
			document.getElementById("selectButton").setAttributeNS(null, "stroke-opacity", "0.0");
			loggit("Selection tool deselected.");
		}
	}

	// Fill button.
	else if (target.id == "fillButton" || target.id == "fillText") {
		fillRandom();
	}
	
	// Grid Up button.
	else if (target.id == "gridUpButton" || target.id == "gridUpText") {
		if(Common.layerOffset.z < (Common.gridDims.r - 1)) {
			Common.layerOffset.z++;
			positionIndicator();
			// Raise the SVG grid.
			document.getElementById("gridContainer")
			.setAttributeNS(null, "transform", "translate(0," + (-35 - Common.layerOffset.z * Common.blockSize.half) + ")");
		}
	}
	
	// Grid Down button.
	else if (target.id == "gridDownButton" || target.id == "gridDownText") {
		if(Common.layerOffset.z > 0) {
			Common.layerOffset.z--;
			positionIndicator();
			// Lower the SVG grid.
			document.getElementById("gridContainer")
			.setAttributeNS(null, "transform", "translate(0," + (-35 - Common.layerOffset.z * Common.blockSize.half) + ")");
		}
	}
	
	// Color selection.
	if (target.id.substr(0,5) == "color") {
		var oldColorIndex = Common.selected.color;
		document.getElementById(Common.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		
		// Get the color swatch (its name corresponds to its color), then set its black outline to transparent, making it appear deselected.
		document.getElementById("color" + oldColorIndex + Common.palette[oldColorIndex][3] + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		
		// Get the color value from its id and set the currently selected color as this. (not the best way to do this...)
		Common.selected.color = parseInt(target.id.substr(5,1));
		
		// 'Select' the clicked-on color swatch.
		document.getElementById(target.id).setAttributeNS(null, "stroke-opacity", "1.0");
		
		Common.selected.tool = "color" + Common.selected.color + Common.palette[Common.selected.color][3];
		loggit("Selected color is: " + Common.palette[Common.selected.color][3] + ".");
	}
	
	// Block placement (first click, and if only one single click)
	if (Common.selected.tool == "delete") {
		deleteBlock(target);
	}
	else if (Common.selected.tool == "select") {
		selectArea(target, true);
	}
	else if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-')
	{
		placeBlock(target);
	}
}

// Gets hover events from its corresponding event listener, including whether the user hovered in or out of the object.
function Hover (evt, inout) {
	var target = evt.target;
	
	// Place a block on the x-grid as long as the mouse is down and place it only when moving into the cell, otherwise the block would be placed twice.
	if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in") {
		placeBlock(target);
	}
	
	// Puts information about the position of the cursor over the grid into the markerPosition field in Common, allowing that to be used by the positionIndicator function.
	if (target.id.substr(0,2) == 'x-' && inout == "in") {
		Common.markerPosition.x = target.getAttribute("c");
		Common.markerPosition.z = target.getAttribute("r");
		positionIndicator();
	}
}