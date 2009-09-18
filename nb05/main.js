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

/* Main Functions */
function Initialize ()
{
	var init0 = new Date();
	
	var commonVars = computeCommonVars();
	
	// Run core graphics functions in default state.
	Update("resize", {gridMode: "standard"}, commonVars);
	
	// Post-initialization tasks.
	var init1 = new Date();
	
	loggit('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	initialized = true;
	
	/* Event listeners */
	window.addEventListener('click', function (evt) {
		Click(evt, commonVars);
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
	// Basic dimensions.	
	var blockDims = 20; // Size of blocks / tiles.
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
	
	// Viewport information from the browser.
	var windowSize = {x: window.innerWidth, y: window.innerHeight};	
	
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
	
	selectedColor = 0;
	
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
		selectedColor: selectedColor
	};
	
//	var commonVars = hexInit(commonVars);
	
	return commonVars;
}

var loadTimer;

// Redraw grid, redraw UI, redraw canvas...
function Update (updateMode, updateSettings, commonVars) {
	loadTimer = window.setInterval("timeBlokLoop(true)", 300);
	
	if (updateMode == "resize") {
	//	removeUI();
	}
	
	if (updateMode == "resize") {
		drawUI(commonVars);
	}
	
	if (updateMode == "resize") {
		drawGrid(commonVars, "bottom");
		drawGrid(commonVars, "left");
		drawGrid(commonVars, "right");
	}

	if (updateMode == "resize" || updateMode == "canvas") {
		canvasGrid(commonVars, "bottom", updateSettings.gridMode);
		canvasGrid(commonVars, "left", updateSettings.gridMode);
		canvasGrid(commonVars, "right", updateSettings.gridMode);
		
		if (updateSettings.gridMode == "standard") {
			document.getElementById("standardButton").setAttributeNS(null, "fill-opacity", 1.0);
			document.getElementById("numberButton").setAttributeNS(null, "fill-opacity", 0.5);
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
	if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-') {
		canvasBlock(GridField[target.id].coors, commonVars, commonVars.selectedColor);
		loggit("Block placed at " + GridField[target.id].x + ", " + GridField[target.id].y + ", " + GridField[target.id].z + ".")
	}
}

function Hover (evt, inout, commonVars) {
	var target = evt.target;
	// Hands id of hovered grid tile to let the user know what tile their mouse is over.
	if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-') {
		tileHover(target, inout, commonVars.offset, commonVars.blockSize);
	}
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
}