/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var size = 30;
var scale = {x: 1, y: 1};
var grid = {r: 16, c: 16};
var svgNS = 'http://www.w3.org/2000/svg';

var angle = 45;
var scaleY = 5000;

var gridPosX = 0;

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	gridPosX = window.innerWidth / 2;
	
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	drawGrid();
	testInput();
	drawBlock();
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.textContent = input;
}

function drawRects(group, coors) {
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttributeNS(null, 'x', coors.x * size);
	rect.setAttributeNS(null, 'y', coors.y * size);
	rect.setAttributeNS(null, 'width', size);
	rect.setAttributeNS(null, 'height', size);
	rect.setAttributeNS(null, 'name', 'tile');
	
	// matrix(scaleX, 0, transformX, 0, )
	rect.setAttributeNS(null, 'transform', 'rotate(45)');
	
	group.appendChild(rect);
}

function drawGrid() {
	var nano = document.getElementById('nano');
	
	var group = document.createElementNS(svgNS, 'g');
	
	for (x = 0; x <= 15; x++) {
		for (y = 0; y <= 15; y++) {
			drawRects(group, {x: x, y: y});
		}
	}
	
	group.setAttributeNS(null, 'stroke', '#777');
	group.setAttributeNS(null, 'stroke-width', 1.5);
	group.setAttributeNS(null, 'fill', '#DDD');
	group.setAttributeNS(null, 'transform', 'scale(1, 0.5), translate('+ gridPosX +', 100)');
	group.setAttributeNS(null, 'id', 'grid');
//	group.setAttributeNS(null, 'transform', 'matrix(1, 0, 100, 0, 0.5, 100)');
	
	nano.appendChild(group);
}

function perspective(scaleY, angle) {
	var init0 = new Date();
	
	var group = document.getElementById('grid');
	group.setAttributeNS(null, 'transform', 'scale(1, '+ scaleY +'), translate('+ gridPosX +', 100)');
	var rects = group.getElementsByTagName('rect');
	for (var i = 0; i < 256; i++) {
		rects[i].setAttributeNS(null, 'transform', 'rotate('+ angle +')');
	}
	
	var init1 = new Date();
	debug('Grid updated in ' + (init1 - init0) + 'ms. Angle: ' + angle + ', Scale: ' + scaleY);
}

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
			if (spaceToggle === false) {
				spaceToggle = true;
				smoothRotate = window.setInterval("animateGrid()", 30);
			} else { // spaceToggle = true;
				spaceToggle = false;
				window.clearInterval(smoothRotate);
			}
		}
	}, false);
}

var flat = false;

function animateGrid() {
	if (flat === false) {
		angle += .5;
		scaleY += 55; // .0055
		perspective(scaleY / 10000, angle);
	}
	if (angle > 90) {
		flat = true;
	}
	if (flat === true) {
		angle -= .5;
		scaleY -= 55; // .0055
		perspective(scaleY / 10000, angle);
	}
	if (angle < 45) {
		flat = false;
	}
}

function drawSide(block, coors, transform, color) {
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttributeNS(null, 'x', coors.x * size);
	rect.setAttributeNS(null, 'y', coors.y * size);
	rect.setAttributeNS(null, 'width', size);
	rect.setAttributeNS(null, 'height', size);
	rect.setAttributeNS(null, 'transform', transform);
	rect.setAttributeNS(null, 'fill', color);
	
	var group = document.createElementNS(svgNS, 'g');
	
	
	var group2 = document.createElementNS(svgNS, 'g');
	
	
	group.appendChild(rect);
	group2.appendChild(group);
	block.appendChild(group2);
}

function drawBlock() {
	var blokID = document.getElementById('blok');
	
	var block = document.createElementNS(svgNS, 'g');
	
	var skew = Math.atan(0.5) * (180 / Math.PI);
	var skew2 = Math.atan(1) * (180 / Math.PI);
	
	drawSide(block, {x: 0, y: 0}, 'skewY('+ skew +'), scale(1)', 'rgb(171,135,78)'); // Left Side
	drawSide(block, {x: 1, y: 1}, 'skewY('+ -skew +'), scale(1)', 'rgb(191,155,98)'); // Right Side
	drawSide(block, {x: 0, y: -1}, 'skewY('+ skew +'), skewX('+ -skew2 +')', 'rgb(211,175,118)'); // Top Side
	
	block.setAttributeNS(null, 'stroke', 'rgb(231,195,138)');
	block.setAttributeNS(null, 'stroke-width', 1.5);
	block.setAttributeNS(null, 'transform', 'translate('+ 100 +', 100)');
	block.setAttributeNS(null, 'id', 'grid');
	
	blokID.appendChild(block);
}