/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for text.js:
 * Takes a message and outputs it to a debug box on the screen.
 * Because the box does not have a scroll bar, scrolling code had to be written.
 */

var svgNS = "http://www.w3.org/2000/svg";
var loggitLog = new Array();

function loggit (str) {
	var log = document.getElementById("debugText");
	
	var childCount = log.getElementsByTagName('tspan').length;

	var numLines = 5;
	
	if (childCount >= numLines){
		log.removeChild(log.firstChild);
	}
	
	var textElement = maketext(log, str);
	
	// Save all messages for later.
	loggitLog.push(str);
}

function maketext (element, str) {
	var textElement = document.createElementNS(svgNS, 'tspan');
	textElement.setAttributeNS(null, 'x', '7');
	textElement.setAttributeNS(null, 'dy', '15');

	textElement.textContent = str;

	element.appendChild(textElement);
	element.getElementsByTagName('tspan')[0].setAttributeNS(null, 'dy', 2);
	
	return textElement;
}

