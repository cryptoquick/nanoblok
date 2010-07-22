/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for ui.js:
 * Organizes a static user interface layout based upon window size and absolute positioning, but with proportions so that the interface looks similar from window to window.
 * Contains some flawed animation code that needs to be deprecated.
 */

var canvases = [
	'grids',
	'blocks',
	'overlays',
	'display',
	'debug',
	'colors'
];

var toolNames = [
	"Load",
	"Save",
	"Fill",
	"Select",
	"Colors",
	"Delete",
]

function moveElement (name, operation) {
	var element = document.getElementById(name);
	
	var str = "";
	
	if (operation.move) {
		str += "translate(" + operation.move.x + "," + operation.move.y + ")";
		if (operation.skewX || operation.skewY) {
			str += ",";
		}
	}
	if (operation.skewY) {
		str += "skewY(" + operation.skewY + ")";
		if (operation.skewX) {
			str += ",";
		}
	}
	if (operation.skewX) {
		str += "skewX(" + operation.skewX + ")";
	}

	element.setAttributeNS(null, "transform", str);
}

function drawUI () {
	// Nanoblok logo text
	moveElement('logoText', {skewY: -$C.isoAngle});
		
	// Set viewport height.
	var gridElement = document.getElementById('grid');
	gridElement.setAttributeNS(null, "height", $C.windowSize.y - 5);
	
	// Set positions and dimensions of all canvases.
	for (var i = 0; i < canvases.length; i++) {
		var effectsElement = document.getElementById(canvases[i]);
		effectsElement.setAttributeNS(null, "height", $C.gridSize.y * 4 + 2);
		effectsElement.setAttributeNS(null, "width", $C.gridSize.x);
		effectsElement.style.top = $C.edges.top - $C.gridSize.y * 2 - 34 + "px";
		effectsElement.style.left = $C.edges.left + "px";
	}
	
	// Position SVG grid.
	var gridOffset = -389;
	if ($C.smallDisplay) {gridOffset = -309};
	moveElement('gridContainer', {move: {x: -1, y: gridOffset}});
	
	// Position debug / status.
	moveElement('statusContainer', {move: {x: $C.edges.left, y: ($C.edges.top - $C.gridSize.y - 145)}});
	
	// Position buttons on the top.
	moveElement('sideButtonsTop', {move: {x: $C.center.x + 5, y: $C.edges.top - $C.gridSize.y * 2 - 121}});
	
	// Position arrows on the left side.
	moveElement('sideButtonsLeft', {move: {x: $C.edges.left - 25, y: $C.edges.top - $C.gridSize.y - 20}});

	// Position axis labels.
	moveElement('yAxis', {move: {x: $C.edges.left + $C.gridSize.x / 4, y: $C.edges.top + $C.gridSize.y * 1.5},  skewY: 26.565, skewX: -45});
	moveElement('xAxis', {move: {x: $C.edges.left + $C.gridSize.x / 2 + $C.gridSize.x / 4 - 20, y: $C.edges.top + $C.gridSize.y * 1.5 + 10}, skewY: -26.565, skewX: 45});

	// Draw color palette.
	populatePalette();
	
	// Draw toolbar. Won't work with numbers greater than 10.
	for (var i = 0; i < 6; i++) {
		var x = 0;
		var y = 0;
		
		if(i % 2) {x = 30 * i - 30} else {x = 30 * i};
		if(i % 2) {y = 0} else {y = 38};
		
		// Create a rect and give it all its attributes.
		var toolButton = document.createElementNS(svgNS, 'rect');
		toolButton.setAttributeNS(null, "id", "toolButton" + i);
		toolButton.setAttributeNS(null, "x", x);
		toolButton.setAttributeNS(null, "y", y);
		toolButton.setAttributeNS(null, "height", 30);
		toolButton.setAttributeNS(null, "width", 52);
		toolButton.setAttributeNS(null, "rx", 3);
		toolButton.setAttributeNS(null, "transform", "skewY(26.565)");
		
		var toolText = document.createElementNS(svgNS, 'text');
		toolText.setAttributeNS(null, "id", "toolText" + i);
		toolText.setAttributeNS(null, "x", x + 4);
		toolText.setAttributeNS(null, "y", y + 24);
		toolText.setAttributeNS(null, "fill", "white");
		toolText.setAttributeNS(null, "fill-opacity", "1");
		toolText.setAttributeNS(null, "stroke", "none");
		toolText.setAttributeNS(null, "transform", "skewY(26.565)");
		toolText.textContent = toolNames[i];
		
		var sideButtonsTop = document.getElementById("sideButtonsTop");
		sideButtonsTop.appendChild(toolButton);
		sideButtonsTop.appendChild(toolText);
	}
	
	moveElement('renderDisplay', {move: {x: $C.edges.right - 96, y: $C.edges.fullTop}});
	
	// If it's a small display, the size of the debug box should be smaller.
	if ($C.smallDisplay) {
		document.getElementById('debugBox').setAttributeNS(null, "width", 234);
	}
}

// Place all the colors on the right side.
function populatePalette () {
	var sideColorsRight = document.getElementById("sideColorsRight");
	sideColorsRight.setAttributeNS(null, "transform", "translate(" + ($C.edges.right + 40) + ", " + ($C.edges.top - $C.gridSize.y - 9) + ")");
	
	// This is very similar to what was done for the toolbar.
	for (var i = 0; i < 9; i++) {
		var colorBlock = document.createElementNS(svgNS, 'rect');
		
		colorBlock.setAttributeNS(null, "id", "color" + i + $C.palette[i][3] + "Button");
		colorBlock.setAttributeNS(null, "x", -35);
		colorBlock.setAttributeNS(null, "y", 35 * i);
		colorBlock.setAttributeNS(null, "height", 30);
		colorBlock.setAttributeNS(null, "width", 30);
		colorBlock.setAttributeNS(null, "fill", getDefaultColor(i));
		colorBlock.setAttributeNS(null, "rx", 3);
		colorBlock.setAttributeNS(null, "transform", "skewY(26.565)");
		
		sideColorsRight.appendChild(colorBlock);
	}
}

function getDefaultColor (paletteNum) {
	rgbOutput = "rgb("
		+ ($C.palette[paletteNum][0] + 40) + ", "
	 	+ ($C.palette[paletteNum][1] + 40) + ", "
		+ ($C.palette[paletteNum][2] + 40) + ")";
	return rgbOutput;
}