/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
/* Global constants */

// Average size of blocks and tiles.
var size = 30;

// How many rows and columns should the grid have.
var grid = {r: 16, c: 16};

// Global scale and angle variables; these change.
var scale = {x: 1, y: 1};
var angle = degrad(45);

// SVG Namespace, required for instantiating new SVG elements.
var svgNS = 'http://www.w3.org/2000/svg';

//
var scaleY = 5000;

// Grid offset
var gridoffs = {x: 0, y: 100};

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Center the grid to the window resolution.
	gridoffs.x = 400;
	
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	// Call my experimental functions directly.
	drawGrid();
	testInput();
//	drawBlock({x: 0, y: 10});

//	canvasGrid(0.5, angle, true);
	
	// Enables the cool little loader bar
	lodr = window.setInterval('loaderBar(100)', 30);
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	
	gridPerspPlace({c: 3, r: 5});
}

window.addEventListener('click', function (evt) {
	var target = evt.target;
	var c = target.getAttribute('c');
	var r = target.getAttribute('r');
	gridPerspPlace({c: c, r: r});
//	alert(x +', '+ y + ', ' + target.id);
}, false);

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerText = input;
}

// Returns a canvas context based on its element id.
function context(element) {
	// Get the canvas element.
	var canvas = document.getElementById(element);
	// Get its 2D context
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
	}
	return context;
}

// Degrees into radians
function degrad (deg) {
	return (Math.PI * deg) / 180;
}

// Radians into degrees
function raddeg (rad) {
	return (rad * 180) / Math.PI;
}

function getEl (id) {
	var element = document.getElementById(id);
	return element;
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
	
	// Set the column and row of the tile
	rect.setAttributeNS(null, 'c', coors.x);
	rect.setAttributeNS(null, 'r', coors.y);
	
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
	group.setAttributeNS(null, 'transform', 'scale(1, 0.5), translate('+ gridoffs.x +', '+ gridoffs.y +')'); // Centers the grid.
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
	group.setAttributeNS(null, 'transform', 'scale(1, '+ scaleY +'), translate('+ gridoffs.x +', 0)');
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

function drawBlock(trans) {
	// Make a block in the specified place.
	var blokID = document.getElementById('blok');	
	var block = document.createElementNS(svgNS, 'g');
	
	// Block position & perspective.
//	var grid = {c: 3, r: 5};
//	var trans = {x: 0, y: 10};
	var skew = 26.565;
	var skew2 = 45;
	
	// Draw block's sides, with appropriate transformations and colors.
	drawRects(block, {x: 0, y: 0}, 'skewY('+ skew +'), scale(1)', 'rgb(171,135,78)'); // Left Side
	drawRects(block, {x: 1, y: 1}, 'skewY('+ -skew +'), scale(1)', 'rgb(191,155,98)'); // Right Side
	drawRects(block, {x: 0, y: 0}, 'skewY('+ -skew +'), skewX('+ skew2 +')', 'rgb(211,175,118)'); // Top Side

	// Block Attributes
	block.setAttributeNS(null, 'stroke', 'rgb(231,195,138)');
	block.setAttributeNS(null, 'stroke-width', 1.5);
	block.setAttributeNS(null, 'transform', 'translate('+ trans.x +', '+ trans.y +'), scale(.7)');
	block.setAttributeNS(null, 'id', 'grid');
	
	blokID.appendChild(block);
}

// Draw a block to a certain angle of perspective, at a certain location on the grid.
function drawPerspBlock(angle, gridloc) {
	var blok = getEl('blok');
	var blokGroup = document.createElementNS(svgNS, 'g');
}

// Transform grid coordinates (column, row) into pixel coordinates.
function gridPerspPlace (grid) {
	
//	grid = {c: 4, r: 4};
	// Flat 2D grid
	var col = grid.c * size;
	var row = grid.r * size;
	
//	var skewX = -26.565;
//	var skewY = 45;
	
	var angle = 45;
	
	// Come up with a proper block offset (not perspective-proof, unfortunately)
	//	var blockoffs = {x: -20 + grid.c * 8, y: -60 + grid.r * 4}; // 0, 0
	//	var blockoffs = {x: -14 + grid.c * 8, y: -74 + grid.r * 4}; // 4, 4
	//	var blockoffs = {x: -8 + grid.c * 8, y:  -85 + grid.r * 4}; // 7, 7
	//	var blockoffs = {x: -3 + grid.c * 8, y:  -95 + grid.r * 4}; // 10, 10
	//	var blockoffs = {x: + 6 + grid.c * 8, y: -112 + grid.r * 4}; // 15, 15
//	var blockoffs = {x: -14 + grid.c * 8, y: -74 + grid.r * 4};
	
	var blockoffs = {x: 0, y: 0};
	
	// Transform rotation and scale
	x = Math.cos(angle) * col - Math.sin(angle) * row + gridoffs.x + blockoffs.x;
	y = (Math.sin(angle) * col + Math.cos(angle) * row) / 2 + gridoffs.y + blockoffs.y;
	
//	alert(x + ', ' + y);
	drawBlock ({x: x, y: y});
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
        // If we're in isometric perspective, gradually move towards flat perspective.
        if (flat === false) {
                // Change the angle by half-degrees.
                angle += .5;
                scaleY += 40; // .0055
                // Set the place value here. This is important due to rounding errors with floating-point numbers within JavaScript.
                perspective(scaleY / 10000, angle);
        }
        // If the grid is flat, switch directions.
        if (angle > 90) {
                flat = true;
        }
        if (flat === true) {
                angle -= .5;
                scaleY -= 40; // .0055
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