function drawUI (commonVars) {
	// Initialize all SVG tags.
	
	// Draw the Nanoblok logo.
	var blockBlank = makeObject({x: 5, y: 5}, commonVars);
	var block = setColor(blockBlank, 'bla');
	block.setAttributeNS(null, 'id', 'nanoblok-logo');
	block.setAttributeNS(null, 'transform', 'scale(3)');
	var gridElement = document.getElementById('grid');
	var statusContainer = document.getElementById('gridContainer');
	gridElement.insertBefore(block, statusContainer);
	
	// Nanoblok logo text	
	var logoText = document.getElementById('logoText');
	logoText.setAttributeNS(null, "transform", "skewY(-26.565) scale(" + commonVars.blockDims / 20 + ")");
/*	logoText.setAttributeNS(null, "x", 49 / 20 * commonVars.blockDims);
	logoText.setAttributeNS(null, "y", 90 / 20 * commonVars.blockDims);
	logoText.setAttributeNS(null, "font-size", 16 * (commonVars.blockDims / 20));*/
		
	// Set viewport height.
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
		colorBlock.setAttributeNS(null, "fill", getDefaultColor(i));
		colorBlock.setAttributeNS(null, "rx", 3);
		colorBlock.setAttributeNS(null, "transform", "skewY(26.565)");
		
		sideColorsRight.appendChild(colorBlock);
	}
}

function getDefaultColor (paletteNum) {
	rgbOutput = "rgb("
		+ (palette[paletteNum][0] + 40) + ", "
	 	+ (palette[paletteNum][1] + 40) + ", "
		+ (palette[paletteNum][2] + 40) + ")";
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