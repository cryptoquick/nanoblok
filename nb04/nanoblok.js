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
	
	drawRects();
	
	var init1 = new Date();
	debug('Program initialized in ' + (init1 - init0) + ' milliseconds.');
	}

/* Utility Functions */
function debug(input) {
	var debug = document.getElementById('debug');
	debug.innerHTML = debug.innerHTML + '<br>' + input;
}

function drawRects() {
	var nano = document.getElementById('nano');
	
	var group = document.createElementNS(svgNS, 'g');
	
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttributeNS(null, 'x', 0);
	rect.setAttributeNS(null, 'y', 0);
	rect.setAttributeNS(null, 'width', 25);
	rect.setAttributeNS(null, 'height', 50);
	
	rect.setAttributeNS(null, 'transform', 'rotate(45)');
//	rect.setAttributeNS(null, 'scale', 0.5);
	
	group.appendChild(rect);
	group.setAttributeNS(null, 'stroke', 'black');
	group.setAttributeNS(null, 'stroke-width', 2);
	group.setAttributeNS(null, 'fill', 'white');
	
	nano.appendChild(group);
}