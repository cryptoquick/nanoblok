function drawUI (commonVars) {
	// Draw the nanoblok logo.
	var blockBlank = makeObject({x: 5, y: 5}, commonVars.blockSize);
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
}

// Animates the nanoblok logo in the upper left-hand corner.
// Order steps are: left, right, top (0, 1, 2)
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