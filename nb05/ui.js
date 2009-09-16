function drawUI (commonVars) {
	// Draw the nanoblok logo.
	var blockBlank = makeObject({x: 5, y: 5}, commonVars);
	var block = setColor(blockBlank, 'bla');
	block.setAttributeNS(null, 'id', 'nanoblok-logo');
	block.setAttributeNS(null, 'transform', 'scale(3)');
	var gridElement = document.getElementById('grid');
	var statusContainer = document.getElementById('gridContainer');
	gridElement.insertBefore(block, statusContainer);
	
	// Set viewport height.
	gridElement.setAttributeNS(null, "height", commonVars.windowSize.y - 5);
	
	// Set effects canvas dimensions.
	var effectsElement = document.getElementById("effects");
	effectsElement.setAttributeNS(null, "height", commonVars.windowSize.y - 5);
	effectsElement.setAttributeNS(null, "width", commonVars.windowSize.x);
	
	// Position debug / status.
	var debugBox = document.getElementById("statusContainer");
	debugBox.setAttributeNS(null, "transform", "translate(" + commonVars.edges.left + ", " + (commonVars.edges.top - commonVars.gridSize.y - 145) + ")");
	
	// Position debug / status.
	var sideButtonsLeft = document.getElementById("sideButtonsLeft");
	sideButtonsLeft.setAttributeNS(null, "transform", "translate(" + (commonVars.edges.left - 40) + ", " + (commonVars.edges.top - commonVars.gridSize.y - 10) + ")");
	
	populatePalette(commonVars);
}

// From Tango Project colors:
// http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
var defaultPalette = new Array();
defaultPalette[0] = [164, 0, 0, 'red', null];
defaultPalette[1] = [211, 127, 4, 'orange', null];
defaultPalette[2] = [213, 184, 8, 'yellow', null];
defaultPalette[3] = [42, 197, 18, 'green', null];
defaultPalette[4] = [43, 84, 200, 'blue', null];
defaultPalette[5] = [147, 29, 199, 'purple', null];
defaultPalette[6] = [190, 67, 180, 'pink', null];
defaultPalette[7] = [201, 202, 188, 'white', null];
defaultPalette[8] = [55, 48, 51, 'black', null];
defaultPalette[9] = [255, 255, 255, 'transparent', null];

function populatePalette (commonVars) {
	var sideColorsRight = document.getElementById("sideColorsRight");
	sideColorsRight.setAttributeNS(null, "transform", "translate(" + (commonVars.edges.right + 40) + ", " + (commonVars.edges.top - commonVars.gridSize.y - 10) + ")");
	
	for (var i = 0; i < 9; i++) {
		var colorBlock = document.createElementNS(svgNS, 'rect');
		colorBlock.setAttributeNS(null, "id", "color" + i + defaultPalette[i][3]);
		colorBlock.setAttributeNS(null, "x", -35);
		colorBlock.setAttributeNS(null, "y", 40 * i);
		colorBlock.setAttributeNS(null, "height", 35);
		colorBlock.setAttributeNS(null, "width", 35);
		colorBlock.setAttributeNS(null, "fill", getDefaultColor(i));
		colorBlock.setAttributeNS(null, "rx", 3);
		colorBlock.setAttributeNS(null, "transform", "skewY(26.565)");
		sideColorsRight.appendChild(colorBlock);
	}
}

function getDefaultColor (paletteNum) {
	rgbOutput = "rgb("
		+ (defaultPalette[paletteNum][0] + 40) + ", "
	 	+ (defaultPalette[paletteNum][1] + 40) + ", "
		+ (defaultPalette[paletteNum][2] + 40) + ")";
	return rgbOutput;
}

// Animates the nanoblok logo in the upper left-hand corner.
// Order steps are: left, right, top (0, 1, 2)
// THIS TOTALLY DOESN'T WORK RIGHT.
var step = 0;
var nbLogo;
var timerRuns = 0;
	
function timeBlok () {	
	if (step == 0) {
		nbLogo[0].setAttributeNS(null, "fill-opacity", 0.3);
		nbLogo[2].setAttributeNS(null, "fill-opacity", 1.0);
	}
	else if (step == 1) {
		nbLogo[1].setAttributeNS(null, "fill-opacity", 0.3);
		nbLogo[0].setAttributeNS(null, "fill-opacity", 1.0);
	}
	else if (step == 2) {
		nbLogo[2].setAttributeNS(null, "fill-opacity", 0.3);
		nbLogo[1].setAttributeNS(null, "fill-opacity", 1.0);
		step = -1;
	}
}

// this is meant to run the loop at least once, just so the user knows that something has loaded.
function timeBlokLoop (toggle) {
	nbLogo = document.getElementById("nanoblok-logo").childNodes;
	
	if (toggle === true) {
		for (var i = 0; i < 3; i++) {
			window.setTimeout("timeBlok()", 100);
		}
	}
	
	if (toggle === false) {
		nbLogo[0].setAttributeNS(null, "fill-opacity", 1.0);
		nbLogo[1].setAttributeNS(null, "fill-opacity", 1.0);
		nbLogo[2].setAttributeNS(null, "fill-opacity", 1.0);
	}
	
	step++;
	timerRuns++;
}