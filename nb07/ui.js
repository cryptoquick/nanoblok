/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for ui.js:
 * Organizes a static user interface layout based upon window size and absolute positioning, but with proportions so that the interface looks similar from window to window.
 * Contains some flawed animation code that needs to be deprecated.
 */

function drawUI () {
	// Nanoblok logo text	
	var logoText = document.getElementById('logoText');
	logoText.setAttributeNS(null, "transform", "skewY(-26.565) scale(" + Common.blockDims / 20 + ")");
/*	logoText.setAttributeNS(null, "x", 49 / 20 * Common.blockDims);
	logoText.setAttributeNS(null, "y", 90 / 20 * Common.blockDims);
	logoText.setAttributeNS(null, "font-size", 16 * (Common.blockDims / 20));*/
		
	// Set viewport height.
	var gridElement = document.getElementById('grid');
	gridElement.setAttributeNS(null, "height", Common.windowSize.y - 5);
	
	// Set effects canvas dimensions.
	var effectsElement = document.getElementById("effects");
	effectsElement.setAttributeNS(null, "height", Common.windowSize.y - 5);
	effectsElement.setAttributeNS(null, "width", Common.windowSize.x);
	
	// Same for overlays canvas.
	var overlaysElement = document.getElementById("overlays");
	overlaysElement.setAttributeNS(null, "height", Common.windowSize.y - 5);
	overlaysElement.setAttributeNS(null, "width", Common.windowSize.x);
	
	// Position debug / status.
	var debugBox = document.getElementById("statusContainer");
	debugBox.setAttributeNS(null, "transform", "translate(" + Common.edges.left + ", " + (Common.edges.top - Common.gridSize.y - 145) + ")");
	
	// Position buttons on the top.
	var sideButtonsTop = document.getElementById("sideButtonsTop");
	sideButtonsTop.setAttributeNS(null, "transform", "translate(" + (Common.center.x + 5) + ", " + (Common.edges.top - Common.gridSize.y * 2 - 120) + ")");
	
	// Position arrows on the left side.
	var sideButtonsLeft = document.getElementById("sideButtonsLeft");
	sideButtonsLeft.setAttributeNS(null, "transform", "translate(" + (Common.edges.left - 25) + ", " + (Common.edges.top - Common.gridSize.y - 20) + ")");
	
	populatePalette();
}

// Place all the colors on the right side.
function populatePalette () {
	var sideColorsRight = document.getElementById("sideColorsRight");
	sideColorsRight.setAttributeNS(null, "transform", "translate(" + (Common.edges.right + 40) + ", " + (Common.edges.top - Common.gridSize.y - 9) + ")");
	
	for (var i = 0; i < 9; i++) {
		var colorBlock = document.createElementNS(svgNS, 'rect');
		
		colorBlock.setAttributeNS(null, "id", "color" + i + Common.palette[i][3] + "Button");
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
		+ (Common.palette[paletteNum][0] + 40) + ", "
	 	+ (Common.palette[paletteNum][1] + 40) + ", "
		+ (Common.palette[paletteNum][2] + 40) + ")";
	return rgbOutput;
}