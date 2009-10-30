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
	
	var commonVars = computeCommonVars();
	
	// Run core graphics functions in default state.
	Update("initialize", {gridMode: "standard"}, commonVars);
	
	// Post-initialization tasks.
	var init1 = new Date();
	
	loggit('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	initialized = true;
	
	/* Event listeners */
	window.addEventListener('mousedown', function (evt) {
		Click(evt, commonVars);
		mouseDown = true;
	}, false);
	
	window.addEventListener('mouseup', function (evt) {
		mouseDown = false;
	}, false);

	window.addEventListener('mouseover', function (evt) {
		Hover(evt, 'in', commonVars);
	}, false);

	window.addEventListener('mouseout', function (evt) {
		Hover(evt, 'out', commonVars);
	}, false);

	window.onresize = function() {
		if(initialized) {
			loggit('Resolution change detected, click refresh button.');
		}
		displayResized = true;
	}
}

// Redraw grid, redraw UI, redraw canvas...
function Update (updateMode, updateSettings, commonVars) {	
	if (updateMode == "resize" || updateMode == "initialize") {
		gridCoors(commonVars);
	//	removeUI();
	//	removeGrid();
	}
	
	// Draw SVG grid
	if (updateMode == "resize" || updateMode == "initialize") {
		drawUI(commonVars);
		drawGrid(commonVars, "bottom");
	}

	// Draw canvas grid...
	if (updateMode == "resize" || updateMode == "canvas" || updateMode == "initialize") {		
		canvasGrid(commonVars, "bottom", updateSettings.gridMode);
		canvasGrid(commonVars, "left", updateSettings.gridMode);
		canvasGrid(commonVars, "right", updateSettings.gridMode);
		
		// ...and some logic for button outlines / selection.
		if (updateSettings.gridMode == "standard") {
			
			// Select color button at update.
			document.getElementById("color" + commonVars.selected.color + commonVars.palette[commonVars.selected.color][3]).setAttributeNS(null, "stroke-opacity", "1.0");
		}
		else if (updateSettings.gridMode == "number") {
			document.getElementById("numberButton").setAttributeNS(null, "fill-opacity", 1.0);
			document.getElementById("standardButton").setAttributeNS(null, "fill-opacity", 0.5);
		}
	}
}

// Handles click events from its corresponding event listener.
function Click (evt, commonVars) {
	var target = evt.target;
	
	// Left-side mode settings buttons.
	// Refresh button.
	if (target.id == "refreshButton" || target.id == "refreshText") {
		Update("refresh", {gridMode: "standard"}, commonVars);
		loggit("Canvas refreshed.");
	}
	// Delete button, its state can be toggled by the user.
	else if (target.id == "deleteButton" || target.id == "deleteText") {
		if (commonVars.selected.tool == "color") {
			commonVars.selected.tool = "delete";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Deletion tool selected.");
		}
		else if (commonVars.selected.tool == "delete") {
			commonVars.selected.tool = "color";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "0.0");
			loggit("Deletion tool deselected.");
		}
	}
	// Save button.
	else if (target.id == "saveButton" || target.id == "saveText") {
		saveField();
	}
	// Load button.
	else if (target.id == "loadButton" || target.id == "loadText") {
		loadField();
		drawBlocks(commonVars);
	}
	
	// Color selection.
	if (target.id.substr(0,5) == "color") {
		var oldColorIndex = commonVars.selected.color;
		
		// Get the color swatch (its name corresponds to its color), then set its black outline to transparent, making it appear deselected.
		document.getElementById("color" + oldColorIndex + commonVars.palette[oldColorIndex][3]).setAttributeNS(null, "stroke-opacity", "0.0");
		
		// Get the color value from its id and set the currently selected color as this. (not the best way to do this...)
		commonVars.selected.color = parseInt(target.id.substr(5,1));
		
		// 'Select' the clicked-on color swatch.
		document.getElementById(target.id).setAttributeNS(null, "stroke-opacity", "1.0");
		
		loggit("Selected color is: " + commonVars.palette[commonVars.selected.color][3] + ".");
	}
	
	// Block placement (first click, and if only one single click)
	if (commonVars.selected.tool == "delete") {
		deleteBlock(target, commonVars);
	} else if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-')
	{
		placeBlock(target, commonVars);
	}
}

// Gets hover events from its corresponding event listener, including whether the user hovered in or out of the object.
function Hover (evt, inout, commonVars) {
	var target = evt.target;
	
	// Place a block on the x-grid as long as the mouse is down and place it only when moving into the cell, otherwise the block would be placed twice.
	if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in") {
		placeBlock(target, commonVars);
	}
	
	// Puts information about the position of the cursor over the grid into the markerPosition field in commonVars, allowing that to be used by the positionIndicator function.
	if (target.id.substr(0,2) == 'x-') {
		commonVars.markerPosition.x = target.getAttribute("c");
		commonVars.markerPosition.z = target.getAttribute("r");
		positionIndicator(commonVars, inout);
	}
}