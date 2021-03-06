/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for data.js:
 * Handles data structures within the client, as well as requests to the server.
 * Also computes common variables used throughout the program, called by the $C variable attached to the window in main.js.
 */

// Field is short for Playfield, and each element contains 4 values; X, Y, Z, and color. This is strictly for serialization, and is in the order by which the user placed the blocks. Also, another array to tell if the voxel is visible.
var Field = [];
var FieldVisible = [];

// GridField stores the positions of the grid tiles. These are set by gridCoors() in grid.js. Used by the other grid functions to render.
var GridField = {};

// Voxels are volumetric pixels, 3D coordinates. This keeps track of those in order to speed up spatial determinations, such as if a block is close by to another block.
var Voxel = [];

// Many common variables used throughout the program.
var Common = function () {
	// Viewport information from the browser.
	this.windowSize = {x: window.innerWidth, y: window.innerHeight};
	
	this.blockDims = null;
	this.smallDisplay = false;
	
	// atan(0.5) in degrees, meant to represent 2:1 pixels.
	this.isoAngle = 26.565;
	
	// Change to a smaller display format if the window is too small. Not yet fully worked out.
	if (this.windowSize.x < 725 || this.windowSize.y < 760) {
		this.blockDims = 15; // For smaller screens
		loggit("Small display detected, adjusting.");
		this.smallDisplay = true;
	}
	else {
		this.blockDims = 20; // Regular size
	}
	
	// Size of blocks / tiles.
	this.blockSize = {
		full: this.blockDims,
		half: this.blockDims / 2,
		third: this.blockDims / 2 + this.blockDims / 4,
		quarter: this.blockDims / 4
	};
	
	// Throughout the program, the c field is used for various measures. If c is not the same as r-- or vice versa--, problems will occur.
	this.gridDims = {c: 32, r: 32};
	this.gridSize = {
		x: this.gridDims.c * this.blockSize.full,
		y: this.gridDims.r * this.blockSize.quarter,
		fullY: this.gridDims.r * this.blockSize.full
	};
	
	// Center of the window.
	this.center = {x: this.windowSize.x / 2, y: this.windowSize.y / 2};
	
	// Grid edges.
	this.edges = {
		left: this.center.x - this.gridSize.x / 2,
		right: this.center.x + this.gridSize.x / 2,
		top: this.windowSize.y - this.gridSize.y * 2,
		fullTop: this.windowSize.y - this.gridSize.y * 4
	};
	
	// This should technically be how far away from the left and top of the screen that the left-most, top-most corner of grid is located.
	this.offset = {
		x: 1,
		y: this.gridSize.y * 2 + 31
	};
	
	// From Tango Project colors:
	// http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
	this.palette = [
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
	this.selected = {
		color: 26624, // red
		lastColor: 0,
		tool: "color26624"
		// blocks: false,
		// area: {x: 0, y: 0, z: 0, l: 0, w: 0, h: 0},
		// initialSelection: {x: -1, y: -1, z: -1},
		// secondSelection: {x: -1, y: -1, z: -1}
	};
	
	this.layerOffset = {x: 0, y: 0, z: 0};
	
	// Updated as the marker is moved about the screen.
	this.markerPosition = {
		x: 31,
		y: 0,
		z: 0
	};

	// Position Indicator (which also contains the handy drawAll function)
	this.posInd = new PositionIndicator();
	
	// If the program is using the MouseMove event rather than an SVG grid, this will be enabled.
	this.mouseMove = false;
	
	// Make a new tools object containing all tool methods. (Separate from Input functions)
	this.tools = new Tools();
	
	this.toolNames = [
		"Load",
		"Save",
		"Fill",
		"Select",
		"Colors",
		"Delete"
	];
	
	this.toolMethods = [
		"load",
		"save",
		"fill",
		"select",
		"swatch",
		"remove"
	];
	
	// This is to make sure to not run another animation if an animation is already being run.
	this.animating = false;
	
	// Swatch only needs to be initialized once.
	this.swatchInit = false;
	
	// Used to tell if swatch is being displayed.
	this.swatchActive = false;
	
	// If swatch is fully drawn, this is true.
	this.swatchComplete = false;
	
	testCompat();
	
	this.selection = new Selection();
	
	this.palette = new Palette();
	
//	this.renderer = new Renderer();
	
	this.titleFieldSelected = false;
	
	this.newBlocks = false;
}

// 3D Voxel array must be initialized before adding variables to it.
function initVoxels (voxArr) {
	// Initialize the voxel array.
	for (var x = -1; x < $C.gridDims.r + 1; x++) {
		if (voxArr[x] == undefined) {
			voxArr[x] = new Array();
		}
		for (var y = -1; y < $C.gridDims.r + 1; y++) {
			if (voxArr[x][y] == undefined) {
				voxArr[x][y] = new Array();
			}
			for (var z = -1; z < $C.gridDims.c + 1; z++) {
				voxArr[x][y][z] = null;
			}
		}
	}
}

function testCompat () {
	var numTests = 1;
	var passedTests = 0;
	
	// Check for Native JSON:
	JSONtest = JSON.parse('{"works" : true}');
	if (JSONtest.works) {
		passedTests++;
	}
	
	if (passedTests == numTests) {
		// Do something meaningful.
	}
}

