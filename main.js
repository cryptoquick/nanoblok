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

//var initialized = false;

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

function transformGrid(rotation) {
	// Make the grid (x,y) by getting the width & height of the root SVG element
	gridTransform(grid_x, grid_y, window.innerWidth, window.innerHeight, rotation);
}

function Initialize(evt)
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

function Click(evt) {
	// Find out which element we clicked on
	var target = evt.target;

	// Set the block ID to the sequential number.
	blockID = 'block-' + blockTick;
	blockTick++;
	
	var axis = {x: false, y: false, z: false};
	
	if (target.id.substr(0,6) == 'bgGrid') {
		axis.z = +1;
		var position = GridField[target.id];
		attachBlock(position, axis);
	} else if (target.id == 'left') {
		axis.y = -1;
		var targetBlock = Field[target.parentNode.id];
		attachBlock(targetBlock.position, targetBlock.axis); // y-
	} else if (target.id == 'right') {
		axis.x = 1;
		var targetBlock = Field[target.parentNode.id];
		attachBlock(targetBlock.position, targetBlock.axis); // x+
	} else if (target.id == 'top') {
		var targetBlock = Field[target.parentNode.id];
		attachBlock(targetBlock.position, targetBlock.axis); // z+
	}

//	attachBlock(targetElement, 'blue', '123');
}