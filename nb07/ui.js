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
	'colors',
	'selection'
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
	for (var i = 0, ii = canvases.length; i < ii; i++) {
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

	// Position color palette.
	moveElement("sideColorsRight", {move: {x: $C.edges.right + 40, y: $C.edges.top - $C.gridSize.y - 9}});
	
	// Make color palette from default colors.
	$C.palette.draw();
	
	// Draw toolbar. Won't work with numbers greater than 10.
	for (var i = 0; i < 6; i++) {
		var x = 0;
		var y = 0;
		
		if(i % 2) {x = 30 * i - 30} else {x = 30 * i};
		if(i % 2) {y = 0} else {y = 38};
		
		// Create a rect and give it all its attributes.
		var toolButton = document.createElementNS(svgNS, 'rect');
		toolButton.setAttributeNS(null, "id", "toolButton" + $C.toolNames[i]);
		toolButton.setAttributeNS(null, "x", x);
		toolButton.setAttributeNS(null, "y", y);
		toolButton.setAttributeNS(null, "height", 30);
		toolButton.setAttributeNS(null, "width", 52);
		toolButton.setAttributeNS(null, "rx", 3);
		toolButton.setAttributeNS(null, "transform", "skewY(26.565)");
		
		// Same for that tool's text.
		var toolText = document.createElementNS(svgNS, 'text');
		toolText.setAttributeNS(null, "id", "toolText" + $C.toolNames[i]);
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
	
	var renderOffset = 96;
	if($C.smallDisplay) {renderOffset = 20};
	moveElement('renderDisplay', {move: {x: $C.edges.right - renderOffset, y: $C.edges.fullTop}});
	var rendererCanvas = document.getElementById('renderer');
	
	rendererCanvas.setAttributeNS(null, "height", 64);
	rendererCanvas.setAttributeNS(null, "width", 64);
	rendererCanvas.style.left = $C.edges.right - renderOffset + "px";
	rendererCanvas.style.top = $C.edges.fullTop + "px";
	
	// If it's a small display, the size of the debug box should be smaller.
	if ($C.smallDisplay) {
		document.getElementById('debugBox').setAttributeNS(null, "width", 234);
	}
	
	// Position rotation buttons.
	// moveElement('rotLeftButton', {move: {x: $C.edges.right - 96, y: $C.edges.fullTop}});
	
	// Move save dialog into position.
	var savePos = {x: $C.edges.left + $C.gridSize.x / 2 + 15, y: $C.edges.fullTop - 125};
	
	var saveDialog = document.getElementById('dialogSave');
	saveDialog.style.posLeft = savePos.x + 75;
	saveDialog.style.posTop = savePos.y;
	
	moveElement('saveBG', {move: {x: savePos.x, y: savePos.y}, skewX: -116.565});
}