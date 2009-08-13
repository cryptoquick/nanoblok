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
var angle = degrad(45);

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
//	drawGrid();
	testInput();
	drawBlock();
	canvasGrid(0.5, angle, true);
	
	// Enables the cool little loader bar
	lodr = window.setInterval('loaderBar(100)', 30);
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerText = input;
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

function degrad (deg) {
	return (Math.PI * deg) / 180;
}

function raddeg (rad) {
	return (rad * 180) / Math.PI;
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
	group.setAttributeNS(null, 'transform', 'scale(1, 0.5), translate('+ gridPosX +', 0)'); // Centers the grid.
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
	group.setAttributeNS(null, 'transform', 'scale(1, '+ scaleY +'), translate('+ gridPosX +', 0)');
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
	block.setAttributeNS(null, 'transform', 'translate('+ 400 +', 192), scale(.7)');
	block.setAttributeNS(null, 'id', 'grid');
	
	blokID.appendChild(block);
}

/* Canvas Graphics Functions */

function canvasGrid (scaleY, angle, init) {	
	var c = context('canvasGrid');
	// Grid styles
	c.fillStyle   = '#ddd';
	c.strokeStyle = '#777';
	c.lineWidth   = 1.5;
	// Grid transforms
	c.translate(400, 0);
	c.scale(1, scaleY);
	c.rotate(angle);

	// If init is true, Draw tiles.
	// if (init) {
		for (x = 0; x <= 15; x++) {
			for (y = 0; y <= 15; y++) {
				c.fillRect(x * size, y * size, size, size);
				c.strokeRect(x * size, y * size, size, size);
			}
		}
	// }

}

function canvasPersp (scaleY, angle) {
	var c = context('canvasGrid');
	c.scale(1, scaleY);
	c.rotate(angle);
	c.save;
}

/// Fancy little Loader Bar function
var numr = 0; // Numerator
var lodr
var lodrRun = false;

function loaderBar (dnom) { // Denominator
	// Compute the width
	var width = numr / dnom * 100;
	
	// Get the context
	var c = context('lodrBar');
	
	// Run the outline code only once
	if (lodrRun === false) {
		// The outline box
		c.fillStyle   = '#fff';
		c.strokeStyle = '#333';
		c.lineWidth   = 2;
	
		// End caps
		c.beginPath();
		// Left cap
		c.arc(11, 18, 8, 1.57079633, 4.71238898, false); // 90 deg, 270 deg.
		// Top line
		c.lineTo(230, 10);
		c.stroke();
		c.beginPath();
		c.moveTo(11, 26);
		// Right cap
		c.arc(230, 18, 8, 1.57079633, 4.71238898, true); // 90 deg, 270 deg.
		c.stroke();
		c.closePath();
		
		// Left barometer cap
		c.fillStyle   = '#333';
		c.beginPath();
		c.arc(11, 18, 5, 1.57079633, 4.71238898, false);
		c.fill();
		c.closePath();
		
		// Don't draw this again.
		lodrRun = true;
	}
	
	// The progress fill barometer
	c.fillStyle = '#333';
	c.fillRect(10, 13, width, 10);
	
	// Right barometer cap
	c.fillStyle   = '#333';
	c.beginPath();
	c.arc(width + 10, 18, 5, 1.57079633, 4.71238898, true);
	c.fill();
	c.closePath();
	
	// Increment, determines how fast the loader goes.
	numr += 5;
	
	// Stop going once the bar has reached the end
	if (numr > 220) {
		window.clearInterval(lodr);
	}
}

/* Animation Functions */

// Used to determine which direction to animate.
var flat = false;

function animateGrid() {
	scaleIncr = 0.00; // Scale Increment
	angleIncr = degrad(0.0); // Angle Increment
	
	// If we're in isometric perspective, gradually move towards flat perspective.
	if (flat === false) {
		// Change the angle by half-degrees.
		// angle += angleIncr;
		// scaleY += scaleIncr; // .0055
		// Set the place value here. This is important due to rounding errors with floating-point numbers within JavaScript.
		canvasGrid(scaleY, angle, false);
	}
	// If the grid is flat, switch directions.
	if (angle > 90) {
		flat = true;
	}
	if (flat === true) {
		// angle -= angleIncr;
		// scaleY -= scaleIncr; // .0055
		canvasGrid(scaleY, angle, false);
	}
	// If the grid is fully isometric, switch directions.
	if (angle < 45) {
		flat = false;
	}
	debug(raddeg(angle));
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
				// Animate the grid4
				smoothRotate = window.setInterval("animateGrid()", 50);
			} else { // spaceToggle = true;
				spaceToggle = false;
				window.clearInterval(smoothRotate);
			}
		}
	}, false);
}