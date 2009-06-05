//	Copyright 2009 Alex Trujillo
//	Full source available here: http://code.google.com/p/nanoblok/

//	SUMMARY	
//	To come as development progresses.

var SVGDocument = null;
var SVGRoot = document.rootElement;
var svgNS = 'http://www.w3.org/2000/svg';

var TrueCoords = null;
var GrabPoint = null;
var BackDrop = null;
var DragTarget = null;

var grid_x = 16;
var grid_y = 16;
//var rotation = 1.0;

var initialized = false;

// Field is short for Playfield, and each element contains 5 values; X, Y, Z, color, and functionality.
var Field = new Object();
Field.length = 0;

Voxel = new Array();

// Creates values within an associative arrray of established coordinates
function VoxArray(voxel, x, y, z, value) {
	if (voxel[x] == null) {
		voxel[x] = new Array(x);
	}

	if (voxel[x][y] == null) {
		voxel[x][y] = new Array(y);
	}

	voxel[x][y][z] = value;
}

var gridAngle = 0.0;

function spinGrid() {
//	for (i = 0.0; i <= 1.0; i + 0.1)	{
		var init0 = new Date();
		transformGrid(gridAngle);
		var init1 = new Date();
		gridAngle += 0.1;
		loggit('Rotation speed is ' + (init1 - init0) + ' milliseconds.');
//	}
}

function transformGrid(rotation) {
	// Make the grid (x,y) by getting the width & height of the root SVG element
	gridTransform(grid_x, grid_y, window.innerWidth, window.innerHeight, rotation);
}

function Init(evt)
{
	var init0 = new Date(); 
	
	transformGrid(1.0); // 45 degree rotation;
	
	var init1 = new Date(); 
	
	loggit('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	initialized = true;
}

window.onresize = function() {
	if(initialized) {
		loggit('Resolution change detected-- please refresh your browser for best results.');
	}
}

function Grab(evt) {
	// find out which element we moused down on
	var targetElement = evt.target;

	/*
	if (targetElement.parentNode.id.substr(0,6) == 'bgGrid') {
		attachBlock(targetElement, 'blue', 'bla');
	}*/

	attachBlock(targetElement, 'green', '123');	
}