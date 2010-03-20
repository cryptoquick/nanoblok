/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for data.js:
 * Handles data structures within the client, as well as requests to the server. Also computes common variables used throughout the program.
 */
	
// Field is short for Playfield, and each element contains 4 values; X, Y, Z, and color. This is strictly for serialization, and is in the order by which the user placed the blocks.
var Field = new Array();

// GridField stores the positions of the grid tiles. These are set by gridCoors() in grid.js. Used by the other grid functions to render.
var GridField = new Object();

// Voxels are volumetric pixels, 3D coordinates. This keeps track of those in order to speed up spatial determinations, such as if a block is close by to another block.
var Voxel = new Array();



// Many common variables used throughout the program.
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
		tool: "color0red",
		blocks: false,
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

// Serialization.
function saveField () {
	var fieldString = JSON.stringify(Field);
	document.getElementById("saveFile").value = fieldString;
}

// Deserialization.
function loadField () {
	var fieldString = document.getElementById("saveFile").value;
	Field = JSON.parse(fieldString);
}

