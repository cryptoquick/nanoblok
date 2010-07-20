/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for loggit.js:
 * Takes a message and outputs it to a debug box on the screen.
 * Because the box does not have a scroll bar, scrolling code had to be written.
 */

var svgNS = "http://www.w3.org/2000/svg";

function loggit(str) {
	var log = document.getElementById("debugText");
	
	var childCount = log.getElementsByTagName('tspan').length;

	var numLines = 1;

	if (navigator.userAgent.indexOf('Firefox') != -1)
	{
		numLines = 1;
	}

	if(childCount >= numLines){
		log.removeChild(log.firstChild);
		log.getElementsByTagName('tspan')[0].setAttributeNS(null, 'dy', 5);
	}
	
	var textElement = document.createElementNS(svgNS, 'tspan');
	textElement.setAttributeNS(null, 'x', '20');
	textElement.setAttributeNS(null, 'dy', '18');

	textElement.textContent = str;
	
	log.appendChild(textElement);
}