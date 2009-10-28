//	Copyright 2009 Alex Trujillo
//	Full source available here under the MIT License: http://code.google.com/p/nanoblok/

//	SUMMARY	
//	To come as development progresses.

var SVGDocument = null;
var SVGRoot = document.rootElement;
var svgNS = 'http://www.w3.org/2000/svg';

var grid_x = 16;
var grid_y = 16;
//var rotation = 1.0;

var initialized = false;

//var gridAngle = 0.0;

// Block ID variable
var blockTick = 1000;

function testScript() {
	// Block speed test		
	var gridEl = null;

	for (var i = 0; i < 256; i++) {
		gridEl = document.getElementById("bgGrid-" + i);
		attachBlock(gridEl, 'blue', '123');
	}
}

/*
// For grid rotation, to work on later
function testScript() {
//	for (i = 0.0; i <= 1.0; i + 0.1)	{
		var init0 = new Date();
		transformGrid(gridAngle);
		var init1 = new Date();
		gridAngle += 0.1;
		loggit('Rotation speed is ' + (init1 - init0) + ' milliseconds.');
//	}
}
*/

window.addEventListener('load', function () {
	Initialize();
}, false);

var mouseDown = false;

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
			loggit('Resolution change detected, updating screen.');
		}
		Update("resize", {gridMode: "standard"}, commonVars);
	}
}

function computeCommonVars () {
	// Viewport information from the browser.
	var windowSize = {x: window.innerWidth, y: window.innerHeight};
	
	// Size of blocks / tiles.
	if (windowSize.x < 725 || windowSize.y < 760)
		var blockDims = 15; // For smaller screens
	else {
		var blockDims = 20; // Regular size
	}
	var blockSize = {
		full: blockDims,
		half: blockDims / 2,
		third: blockDims / 2 + blockDims / 4,
		quarter: blockDims / 4
	}
	
	var gridDims = {c: 32, r: 32};
	var gridSize = {
		x: gridDims.c * blockSize.full,
		y: gridDims.r * blockSize.quarter
	};
	
	// Center of the window
	var center = {x: windowSize.x / 2, y: windowSize.y / 2};
	
	// Grid edges
	var edges = {
		left: center.x - gridSize.x / 2,
		right: center.x + gridSize.x / 2,
		top: windowSize.y - gridSize.y * 2
	};
	
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
	
	var selectedColor = 0;
	
	var layerOffset = {x: 0, y: 0, z: 0};
	
	var markerPosition = {
		x: 0,
		y: 0,
		z: 0
	}
	
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
		selectedColor: selectedColor,
		layerOffset: layerOffset,
		markerPosition: markerPosition
	};
	
	// Initialize the voxel array.
	for (var x = 0; x < gridDims.r; x++) {
		Voxel[x] = new Array();
		for (var y = 0; y < gridDims.r; y++) {
		Voxel[x][y] = new Array();
			for (var z = 0; z < gridDims.c; z++) {
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
		gridCoors(commonVars, "bottom");
		gridCoors(commonVars, "left");
		gridCoors(commonVars, "right");
	//	removeUI();
	//	removeGrid();
	}
	
	// Draw SVG grid
	if (updateMode == "resize" || updateMode == "initialize") {
		drawUI(commonVars);
		drawGrid(commonVars, "bottom");
	//	drawGrid(commonVars, "left");
	//	drawGrid(commonVars, "right");
		drawMarkers(commonVars);
	}

	// Draw canvas grid...
	if (updateMode == "resize" || updateMode == "canvas" || updateMode == "initialize") {		
		canvasGrid(commonVars, "bottom", updateSettings.gridMode);
		canvasGrid(commonVars, "left", updateSettings.gridMode);
		canvasGrid(commonVars, "right", updateSettings.gridMode);
		
		// ...and some logic for button outlines / selection.
		if (updateSettings.gridMode == "standard") {
			document.getElementById("standardButton").setAttributeNS(null, "fill-opacity", 1.0);
			document.getElementById("numberButton").setAttributeNS(null, "fill-opacity", 0.5);
			
			// Select color button at update.
			document.getElementById("color" + commonVars.selectedColor + commonVars.palette[commonVars.selectedColor][3]).setAttributeNS(null, "stroke-opacity", "1.0");
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

function Click (evt, commonVars) {
	// Find out which element we clicked on
	var target = evt.target;
	
//	var axis = {x: 0, y: 0, z: 0};
	/*
	if (target.id.substr(0,1) == 'x' || target.id.substr(0,1) == 'y' || target.id.substr(0,1) == 'z') {
		var position = Field[target.id];
		position.z++;
		attachBlock(position);
	} else if (target.id == 'left') {
		var targetBlock = Field[target.parentNode.id];
		targetBlock.position.y = -1;
		attachBlock(targetBlock.position, targetBlock.axis); // y-
	} else if (target.id == 'right') {
		var targetBlock = Field[target.parentNode.id];
		targetBlock.position.x = 1;
		attachBlock(targetBlock.position, targetBlock.axis); // x+
	} else if (target.id == 'top') {
		var targetBlock = Field[target.parentNode.id];
		attachBlock(targetBlock.position, targetBlock.axis); // z+
	}*/
	
	// Left-side mode settings buttons.
	if (target.id == "standardButton" || target.id == "standardText") {
		Update("canvas", {gridMode: "standard"}, commonVars);
		loggit("Set to standard view.");
	}
	else if (target.id == "numberButton" || target.id == "numberText") {
		Update("canvas", {gridMode: "number"}, commonVars);
		loggit("Set to number view.")
	}
	
	// Color selection.
	if (target.id.substr(0,5) == "color") {
		var oldColorIndex = commonVars.selectedColor;
		
		document.getElementById("color" + oldColorIndex + commonVars.palette[oldColorIndex][3])
		.setAttributeNS(null, "stroke-opacity", "0.0");
		
		commonVars.selectedColor = target.id.substr(5,1);
		
		loggit("Selected color is: " + commonVars.palette[commonVars.selectedColor][3] + ".");
		
		document.getElementById(target.id).setAttributeNS(null, "stroke-opacity", "1.0");
	}
	
	// Block placement.
	if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-')
	{
		placeBlock(target, commonVars);
	}
}

function placeBlock (target, commonVars) {
	var location = {
		x: GridField[target.id].x,
		y: GridField[target.id].y,
		z: 0 + commonVars.layerOffset.z
	}
/*	
	while (Voxel[location.x][location.y][location.z] !== -1) {
		if (Voxel[location.x][location.y][location.z] < commonVars.gridDims.c) {
			location.z++;
		} else {
			loggit("Outside bounds.");
			return 0;
		}
	}*/
	
//	if (Voxel[location.x][location.y][location.z] == -1) {
		canvasBlock(GridField[target.id].coors, location, commonVars, commonVars.selectedColor);
		Voxel[location.x][location.y][location.z] = commonVars.selectedColor;
		loggit("A " + commonVars.palette[commonVars.selectedColor][3] + " block placed at " + location.x + ", " + location.y + ", " + location.z + ".")
/*	} else {
		loggit("A block already exists here.");
	}*/
}

// var markerX;
// var markerY;
// var markerZ;

function Hover (evt, inout, commonVars) {
	var target = evt.target;
	
	// Hands id of hovered grid tile to let the user know what tile their mouse is over.
	// if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-') {
	// 	tileHover(target, inout, commonVars.offset, commonVars.blockSize);
	// }
	// Display the color of the hovered object in the event log.
	if (target.id.substr(0,5) == "color") {
		loggit("Color " + commonVars.palette[target.id.substr(5,1)][3]);
	}
	// Same as above, but for the left-side buttons.
	if (target.id == "standardButton") {
		loggit("Standard view");
	}
	if (target.id == "numberButton") {
		loggit("Number view");
	}
	
	if ((target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-') && mouseDown && inout == "in") {
		placeBlock(target, commonVars);
	}
	
	// Position Indicators
	if (target.id.substr(0,2) == 'x-') {
		commonVars.markerPosition.x = target.getAttribute("c");
		commonVars.markerPosition.z = target.getAttribute("r");
		positionIndicator(commonVars, inout);
	}
	if (target.id.substr(0,2) == 'z-') {
		commonVars.markerPosition.z = target.getAttribute("r");
		positionIndicator(commonVars, inout);
	}
	
	/* Marker code
	else if (target.id.substr(0,2) == 'x-') {
		if (markerX != null) {
			markerX.setAttributeNS(null, "fill-opacity", "0.0");
		}
		markerX = document.getElementById("markerX" + target.getAttribute("r"));
		markerX.setAttributeNS(null, "fill-opacity", "0.7");
	}
	else if (target.id.substr(0,2) == 'y-') {
		if (markerY != null) {
			markerY.setAttributeNS(null, "fill-opacity", "0.0");
		}
		markerY = document.getElementById("markerY" + target.getAttribute("r"));
		markerY.setAttributeNS(null, "fill-opacity", "0.7");
	}
	else if (target.id.substr(0,2) == 'z-') {
		if (markerZ != null) {
			markerZ.setAttributeNS(null, "fill-opacity", "0.0");
		}
		markerZ = document.getElementById("markerZ" + target.getAttribute("r"));
		markerZ.setAttributeNS(null, "fill-opacity", "0.7");
	}*/
}