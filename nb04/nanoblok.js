/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
/* Global constants */

// Average size of blocks
var size = 30;

// 
var grid = {r: 16, c: 16};

// Global scale and angle variables; these change.
var scale = {x: 1, y: 1};
var angle = 45;

// SVG Namespace, required for instantiating new SVG elements.
var svgNS = 'http://www.w3.org/2000/svg';

var scaleY = 5000;

var gridPosX = 0;

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Center the grid to the window resolution.
	gridPosX = 400;
	
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	// Call my experimental functions directly.
	drawGrid();
	testInput();
	drawBlock();
	canvasGrid();
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.textContent = input;
}

function context(element) {
	// Get the canvas element.
	var canvas = document.getElementById(element);
	// Get its 2D context
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
	}
	return context;
}

/* Scalable Graphics Functions */
function drawRects(group, coors, transform, color) {
	// First, create the rect element.
	var rect = document.createElementNS(svgNS, 'rect');
	// Set its position based on how many units x or y offset (columns multiplied by tile/block size).
	rect.setAttributeNS(null, 'x', coors.x * size);
	rect.setAttributeNS(null, 'y', coors.y * size);
	// Size of the rectangle itself.
	rect.setAttributeNS(null, 'width', size);
	rect.setAttributeNS(null, 'height', size);
	// Set its transform and color, as specified by the function call.
	rect.setAttributeNS(null, 'transform', transform);
	rect.setAttributeNS(null, 'fill', color);
	
	// Finally, make that rect a child of the specified group.
	group.appendChild(rect);
}

function drawGrid() {
	// Get the nano <g> element.
	var nano = document.getElementById('nano');
	
	// Make a new grid group and set its attributes.
	var group = document.createElementNS(svgNS, 'g');
	group.setAttributeNS(null, 'stroke', '#777');
	group.setAttributeNS(null, 'stroke-width', 1.5);
	group.setAttributeNS(null, 'transform', 'scale(1, 0.5), translate('+ gridPosX +', 100)'); // Centers the grid.
	group.setAttributeNS(null, 'id', 'grid');
	
	// Draw a 2D grid. This rotates the entire grid 45 degrees, just to keep things simple.
	for (x = 0; x <= 15; x++) {
		for (y = 0; y <= 15; y++) {
			drawRects(group, {x: x, y: y}, 'rotate(45)', '#DDD');
		}
	}
	
	// Add the grid group to nano.
	nano.appendChild(group);
}

function perspective(scaleY, angle) {
	var init0 = new Date();
	
	// Get the grid group
	var group = document.getElementById('grid');
	// Set the transform; scaling it vertically. Its grid position remains static, however, it changes due to window size.
	group.setAttributeNS(null, 'transform', 'scale(1, '+ scaleY +'), translate('+ gridPosX +', 100)');
	// Get all rects within the group.
	var rects = group.getElementsByTagName('rect');
	// The length attribute was sketchy, so I just multiplied.
	for (var i = 0; i < 256; i++) {
		// Change each rect's angle.
		rects[i].setAttributeNS(null, 'transform', 'rotate('+ angle +')');
	}
	
	// Benchmark
	var init1 = new Date();
	debug('Grid updated in ' + (init1 - init0) + 'ms. Angle: ' + angle + ', Scale: ' + scaleY);
}

function drawBlock() {
	var blokID = document.getElementById('blok');
	
	var block = document.createElementNS(svgNS, 'g');
	
	var skew = Math.atan(0.5) * (180 / Math.PI);
	var skew2 = Math.atan(1) * (180 / Math.PI);
	
	// Draw block's sides, with appropriate transformations and colors.
	drawRects(block, {x: 0, y: 0}, 'skewY('+ skew +'), scale(1)', 'rgb(171,135,78)'); // Left Side
	drawRects(block, {x: 1, y: 1}, 'skewY('+ -skew +'), scale(1)', 'rgb(191,155,98)'); // Right Side
	drawRects(block, {x: 0, y: -1}, 'skewY('+ skew +'), skewX('+ -skew2 +')', 'rgb(211,175,118)'); // Top Side

	// Block Attributes
	block.setAttributeNS(null, 'stroke', 'rgb(231,195,138)');
	block.setAttributeNS(null, 'stroke-width', 1.5);
	block.setAttributeNS(null, 'transform', 'translate('+ 402 +', 199), scale(.7)');
	block.setAttributeNS(null, 'id', 'grid');
	
	blokID.appendChild(block);
}

/* Canvas Graphics Functions */

function canvasGrid () {
	var c = context('canvasGrid');
	// Grid styles
	c.fillStyle   = '#ddd';
	c.strokeStyle = '#777';
	c.lineWidth   = 1.5;

	for (x = 0; x <= 15; x++) {
		for (y = 0; y <= 15; y++) {
			c.fillRect(x * size, y * size, x * size + size, y * size + size);
		}
	}
}

/* Animation Functions */

// Used to determine which direction to animate.
var flat = false;

function animateGrid() {
	// If we're in isometric perspective, gradually move towards flat perspective.
	if (flat === false) {
		// Change the angle by half-degrees.
		angle += .5;
		scaleY += 55; // .0055
		// Set the place value here. This is important due to rounding errors with floating-point numbers within JavaScript.
		perspective(scaleY / 10000, angle);
	}
	// If the grid is flat, switch directions.
	if (angle > 90) {
		flat = true;
	}
	if (flat === true) {
		angle -= .5;
		scaleY -= 55; // .0055
		perspective(scaleY / 10000, angle);
	}
	// If the grid is fully isometric, switch directions.
	if (angle < 45) {
		flat = false;
	}
}

/* Input Functions */
function testInput() {
	var smoothRotate;
	var spaceToggle = false;
	window.addEventListener('keydown', function(evt) {
		// Input Handling
		if (evt.type == 'keydown') {
			// Some browsers support evt.charCode, some only evt.keyCode
			if (evt.charCode) {
				charCode = evt.charCode;
			}
			else {
				charCode = evt.keyCode;
			}
		}
		// Left arrow key
		if (charCode == 37) {
			angle += .5;
			scaleY += 55; // .0055
			perspective(scaleY / 10000, angle);
		}
		// Right arrow key
		if (charCode == 39) {
			angle -= .5;
			scaleY -= 55; // .0055
			perspective(scaleY / 10000, angle);
		}
		// Space Bar
		if (charCode == 32) {
			// Space toggles animation play.
			if (spaceToggle === false) {
				spaceToggle = true;
				// Animate the grid at, ideally, 33FPS.
				smoothRotate = window.setInterval("animateGrid()", 30);
			} else { // spaceToggle = true;
				spaceToggle = false;
				window.clearInterval(smoothRotate);
			}
		}
	}, false);
}