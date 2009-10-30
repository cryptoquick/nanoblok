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

function drawUI (commonVars) {	
	// Nanoblok logo text	
	var logoText = document.getElementById('logoText');
	logoText.setAttributeNS(null, "transform", "skewY(-26.565) scale(" + commonVars.blockDims / 20 + ")");
/*	logoText.setAttributeNS(null, "x", 49 / 20 * commonVars.blockDims);
	logoText.setAttributeNS(null, "y", 90 / 20 * commonVars.blockDims);
	logoText.setAttributeNS(null, "font-size", 16 * (commonVars.blockDims / 20));*/
		
	// Set viewport height.
	var gridElement = document.getElementById('grid');
	gridElement.setAttributeNS(null, "height", commonVars.windowSize.y - 5);
	
	// Set effects canvas dimensions.
	var effectsElement = document.getElementById("effects");
	effectsElement.setAttributeNS(null, "height", commonVars.windowSize.y - 5);
	effectsElement.setAttributeNS(null, "width", commonVars.windowSize.x);
	
	// Same for overlays canvas.
	var overlaysElement = document.getElementById("overlays");
	overlaysElement.setAttributeNS(null, "height", commonVars.windowSize.y - 5);
	overlaysElement.setAttributeNS(null, "width", commonVars.windowSize.x);
	
	// Position debug / status.
	var debugBox = document.getElementById("statusContainer");
	debugBox.setAttributeNS(null, "transform", "translate(" + commonVars.edges.left + ", " + (commonVars.edges.top - commonVars.gridSize.y - 145) + ")");
	
	// Position buttons on the left side.
	var sideButtonsLeft = document.getElementById("sideButtonsLeft");
	sideButtonsLeft.setAttributeNS(null, "transform", "translate(" + (commonVars.center.x + 5) + ", " + (commonVars.edges.top - commonVars.gridSize.y * 2 - 120) + ")");
	
	populatePalette(commonVars);
}

// Place all the colors on the right side.
function populatePalette (commonVars) {
	var sideColorsRight = document.getElementById("sideColorsRight");
	sideColorsRight.setAttributeNS(null, "transform", "translate(" + (commonVars.edges.right + 40) + ", " + (commonVars.edges.top - commonVars.gridSize.y - 10) + ")");
	
	for (var i = 0; i < 9; i++) {
		var colorBlock = document.createElementNS(svgNS, 'rect');
		
		colorBlock.setAttributeNS(null, "id", "color" + i + commonVars.palette[i][3]);
		colorBlock.setAttributeNS(null, "x", -35);
		colorBlock.setAttributeNS(null, "y", 35 * i);
		colorBlock.setAttributeNS(null, "height", 30);
		colorBlock.setAttributeNS(null, "width", 30);
		colorBlock.setAttributeNS(null, "fill", getDefaultColor(commonVars, i));
		colorBlock.setAttributeNS(null, "rx", 3);
		colorBlock.setAttributeNS(null, "transform", "skewY(26.565)");
		
		sideColorsRight.appendChild(colorBlock);
	}
}

function getDefaultColor (commonVars, paletteNum) {
	rgbOutput = "rgb("
		+ (commonVars.palette[paletteNum][0] + 40) + ", "
	 	+ (commonVars.palette[paletteNum][1] + 40) + ", "
		+ (commonVars.palette[paletteNum][2] + 40) + ")";
	return rgbOutput;
}