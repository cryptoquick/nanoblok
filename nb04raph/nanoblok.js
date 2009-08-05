/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var size = 35;
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
	
	drawInitialRects(nano);
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerHTML = debug.innerHTML + '<br>' + input;
}

function drawInitialRects(nano) {
	
	var rect = nano.rect(100, 100, 50, 50);
	
//	rect.rotate(45);
	rect.attr({
	
		stroke: '#333',
		'stroke-width': 2,
		fill: '#ddd'
	});
	
		// rotation: 45,
		// scale: '1, 0.5',
	
//	rect.scale(1, 0.5);
	//		scale: '1, 0.5',
	return rect;
}