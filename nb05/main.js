//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/

//	SUMMARY	
//	To come as development progresses.

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

function computeCommonVars () {
	// Viewport information from the browser.
	var windowSize = {x: window.innerWidth, y: window.innerHeight};
	
	// Change to a smaller display format if the window is too small. Not yet fully worked out.
	if (windowSize.x < 725 || windowSize.y < 760)
		var blockDims = 15; // For smaller screens
	else {
		var blockDims = 20; // Regular size
	}
	
	// Size of blocks / tiles.
	var blockSize = {
		full: blockDims,
		half: blockDims / 2,
		third: blockDims / 2 + blockDims / 4,
		quarter: blockDims / 4
	}
	
	// Throughout the program, the c field is used for various measures. If c is not the same as r-- or vice versa--, problems will occur.
	var gridDims = {c: 32, r: 32};
	var gridSize = {
		x: gridDims.c * blockSize.full,
		y: gridDims.r * blockSize.quarter
	};
	
	// Center of the window.
	var center = {x: windowSize.x / 2, y: windowSize.y / 2};
	
	// Grid edges.
	var edges = {
		left: center.x - gridSize.x / 2,
		right: center.x + gridSize.x / 2,
		top: windowSize.y - gridSize.y * 2
	};
	
	// This should technically be how far away from the left and top of the screen that the left-most, top-most corner of grid is located.
	var offset = {
		x: (windowSize.x - gridSize.x) / 2,
		y: windowSize.y - gridSize.y * 2
	};
	
	// From Tango Project colors:
	// http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
	var defaultPalette = [
		[164, 0, 0, 'red', null],
		[211, 127, 4, 'orange', null],
		[213, 184, 8, 'yellow', null],
		[42, 197, 18, 'green', null],
		[43, 84, 200, 'blue', null],
		[147, 29, 199, 'purple', null],
		[190, 67, 180, 'pink', null],
		[201, 202, 188, 'white', null],
		[55, 48, 51, 'black', null],
		[255, 255, 255, 'transparent', null]
	];
	
	// Various fields for selection states.
	var selected = {
		color: 0,
		tool: "color",
		area: {x: 0, y: 0, z: 0, l: 0, w: 0, h: 0}
	};
	
	var layerOffset = {x: 0, y: 0, z: 0};
	
	// Updated as the marker is moved about the screen.
	var markerPosition = {
		x: 0,
		y: 0,
		z: 0
	};
	
	// Put all the variables into one, common object.
	var commonVars = {
		blockDims: blockDims,
		blockSize: blockSize,
		gridDims: gridDims,
		gridSize: gridSize,
		windowSize: windowSize,
		center: center,
		edges: edges,
		offset: offset,
		palette: defaultPalette,
		selected: selected,
		layerOffset: layerOffset,
		markerPosition: markerPosition
	};
	
	// Initialize the voxel array.
	for (var x = -1; x < gridDims.r + 1; x++) {
		Voxel[x] = new Array();
		for (var y = -1; y < gridDims.r + 1; y++) {
		Voxel[x][y] = new Array();
			for (var z = -1; z < gridDims.c +1; z++) {
				Voxel[x][y][z] = -1;
			}
		}
	}
	
	return commonVars;
}

var loadTimer;

// Redraw grid, redraw UI, redraw canvas...
function Update (updateMode, updateSettings, commonVars) {
	loadTimer = window.setInterval("timeBlokLoop(true)", 300);
	
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
	
	// Timer/Loader
	if (timerRuns > 2) {
		window.clearTimeout(loadTimer);
		timeBlokLoop(false);
	} else {
		window.clearTimeout(loadTimer);
		timeBlokLoop(true);
		timeBlokLoop(false);
		timeBlokLoop(false);
	}
	timerRuns = 0;
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

// Calls canvasBlock to place a block on the grid.
function placeBlock (target, commonVars) {
	// Get 
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: commonVars.layerOffset.z
	}

	// Draw the actual block using coordinates using the location of the grid's tiles as a reference for pixel-placement for all the rest of the blocks (this is the first argument). The target.id should look something like "x-123".
	// colorBlock is used to turn the color index into a color object (with separate color values for each face as well as its lines)
	canvasBlock(GridField[target.id].coors, location, commonVars, colorBlock(commonVars.selected.color, commonVars));
	
	// Now record information about the position of the block internally using both the Voxel array...
	Voxel[location.x][location.y][location.z] = commonVars.selected.color;
	// ...and the Field array, which is for serialization.
	Field.push([location.x, location.y, location.z, commonVars.selected.color]);
	
	// Let the user know they've placed a block.
	loggit("A " + commonVars.palette[commonVars.selected.color][3] + " block placed at " + location.x + ", " + location.y + ", " + location.z + ".")
}

// WTF is this. >:I
function deleteBlock (target, commonVars) {
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: 0 + commonVars.layerOffset.z
	}
	
	canvasBlockDelete(GridField[target.id].coors, location, commonVars);
	Voxel[location.x][location.y][location.z] = -1;
	loggit(" The block placed at " + location.x + ", " + location.y + ", " + location.z + " was deleted.")
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