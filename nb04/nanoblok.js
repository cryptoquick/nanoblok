/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var size = 50;
var scale = {x: 1, y: 1};
var grid = {r: 16, c: 16};
var svgNS = 'http://www.w3.org/2000/svg';

var angle = 45;
var scaleY = 0.5;

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	drawGrid();
	testInput();
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.textContent = debug.textContent + ' ' + input;
}

function drawRects(group, coors) {
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttributeNS(null, 'x', coors.x * size);
	rect.setAttributeNS(null, 'y', coors.y * size);
	rect.setAttributeNS(null, 'width', size);
	rect.setAttributeNS(null, 'height', size);
	
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
	
	group.setAttributeNS(null, 'stroke', 'black');
	group.setAttributeNS(null, 'stroke-width', 1);
	group.setAttributeNS(null, 'fill', 'white');
	group.setAttributeNS(null, 'transform', 'scale(1, 0.5), translate(100, 100)');
	group.setAttributeNS(null, 'id', 'rect1');
//	group.setAttributeNS(null, 'transform', 'matrix(1, 0, 100, 0, 0.5, 100)');
	
	nano.appendChild(group);
}

function perspective(scaleY, angle) {
	rect = document.getElementById('rect1');
	rect.setAttributeNS(null, 'transform', 'scale(1, '+ scaleY +'), translate(100, 100)');
	rect.firstChild.setAttributeNS(null, 'transform', 'rotate('+ angle +')');
}

function testInput() {
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
			angle++;
			scaleY++;
			perspective(scaleY / 20, angle);
		}
		// Right arrow key
		if (charCode == 39) {
			angle--;
			scaleY--;
			perspective(scaleY / 20, angle);
		}
	}, false);
//	return isogrid;
}