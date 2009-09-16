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
		top: windowSize.y - gridSize.y * 2
	};
	
	var offset = {
		x: (windowSize.x - gridSize.x) / 2,
		y: windowSize.y - gridSize.y * 2
	};
	
	var commonVars = {
		blockDims: blockDims,
		blockSize: blockSize,
		gridDims: gridDims,
		gridSize: gridSize,
		windowSize: windowSize,
		center: center,
		edges: edges,
		offset: offset
	};
	
	loggit(commonVars.offset.x);
/*	var offsetLeft = {
		x: (windowSize.x - gridSize.x) / 2,
		y: windowSize.y - gridSize.y * 2
	};
	var offsetRight = {
		x: (windowSize.x - gridSize.x) / 2,
		y: windowSize.y - gridSize.y * 2
	};*/

	// Run core graphics functions in default state.
	Update("resize", {gridMode: "standard"}, commonVars);
	
	// Post-initialization tasks.
	var init1 = new Date();
	
	loggit('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	initialized = true;
	
	/* Event listeners */
	window.addEventListener('click', function (evt) {
		Click(evt);
	}, false);

	window.addEventListener('mouseover', function (evt) {
		Hover(evt, 'in', offset, blockSize);
	}, false);

	window.addEventListener('mouseout', function (evt) {
		Hover(evt, 'out', offset, blockSize);
	}, false);

	window.onresize = function() {
		if(initialized) {
			loggit('Resolution change detected, updating screen.');
		}
		Update("resize", {gridMode: "standard"});
	}
}

// Redraw grid, redraw UI, redraw canvas...
function Update(updateMode, updateSettings, commonVars) {
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
	}
}

function Click (evt) {
	// Find out which element we clicked on
	var target = evt.target;
	
//	var axis = {x: 0, y: 0, z: 0};
	
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
	}
}

function Hover (evt, inout, offset, blockSize) {
	var target = evt.target;
	if (target.id.substr(0,1) == 'x' || target.id.substr(0,1) == 'y' || target.id.substr(0,1) == 'z') {
		tileHover(target, inout, offset, blockSize);
	}
}