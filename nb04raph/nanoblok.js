/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
/* Global constants */

// Average size of blocks & tiles
var size = 25;
var scale = {x: 1, y: 1};
var grid = {r: 16, c: 16};
var svgNS = 'http://www.w3.org/2000/svg';

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	// Helps to know how fast things are going -- TEMP
	var init0 = new Date();
	
	var nano = Raphael("nano", 800, 400);
	
	drawGrid(nano);
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerHTML = debug.innerHTML + '<br>' + input;
}

/* Graphics Functions */

function drawGrid(nano) {
	var group = nano.set();
	
	// Draw a 2D grid.
	for (x = 0; x <= 15; x++) {
		for (y = 0; y <= 15; y++) {
			var rect = nano.rect(x * size, y * size, size, size);
			group.push(rect);
		}
	}
	
	group.attr({
		stroke: '#333',
		'stroke-width': 1.5,
		fill: '#ddd',
	});
	
	group.rotate(45);
	
		// rotation: 45,
		// scale: '1, 0.5',
	
//	rect.scale(1, 0.5);
	//		scale: '1, 0.5',
}