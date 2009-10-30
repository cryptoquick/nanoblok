/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for effects.js:
 * This file is for all the canvas-based effects that don't have a home in any of the other files yet.
 */

// Returns a canvas context based on its element id.
function context(element) {
	// Get the canvas element.
	var canvas = document.getElementById(element);
	// Get its 2D context
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
	}
	return context;
}

// Updates the position indicators
function positionIndicator (commonVars, inout) {
	var ctx = context('overlays');
	
	ctx.clearRect(0, 0, commonVars.windowSize.x, commonVars.windowSize.y);
	ctx.globalAlpha = 0.7;
	
	var gr1 = commonVars.blockSize.full;
	var gr2 = gr1 / 2;
	var gr4 = gr1 / 4;
	
	// Red Marker
	var offsY = commonVars.offset.y - 30;
	var offsYtop = (commonVars.edges.top - commonVars.gridSize.y - 30)
		- (commonVars.markerPosition.x * commonVars.blockSize.quarter)
		+ (commonVars.gridDims.c - commonVars.layerOffset.z - 1) * commonVars.blockSize.half;
	var offsX = commonVars.offset.x + commonVars.markerPosition.x * commonVars.blockSize.half;
	
	ctx.fillStyle = '#f00';
	ctx.beginPath();
	
	ctx.moveTo(offsX, 0 + offsYtop);
	ctx.lineTo(gr2 + offsX, offsYtop - gr4);
	ctx.lineTo(gr2 + offsX, gr4 + offsYtop);
	ctx.lineTo(0 + offsX, gr2 + offsYtop);
	
	ctx.closePath();
	ctx.fill();
	
	// Blue Marker
	offsYtop = (commonVars.edges.top - commonVars.gridSize.y - 185)
		+ (commonVars.markerPosition.z * commonVars.blockSize.quarter)
		+ (commonVars.gridDims.c - commonVars.layerOffset.z - 1) * commonVars.blockSize.half;
	offsX = commonVars.offset.x + commonVars.gridSize.x / 2 + (commonVars.markerPosition.z * commonVars.blockSize.half);
	
	ctx.fillStyle = '#00f';
	ctx.beginPath();
	
	ctx.moveTo(offsX, offsYtop - gr4);
	ctx.lineTo(gr2 + offsX, offsYtop);
	ctx.lineTo(gr2 + offsX, gr2 + offsYtop);
	ctx.lineTo(0 + offsX, gr4 + offsYtop);
	
	ctx.closePath();
	ctx.fill();
	
	// Green Cursor
	offsX = commonVars.offset.x + (commonVars.markerPosition.x * commonVars.blockSize.half) + (commonVars.markerPosition.z * commonVars.blockSize.half);
	offsYtop = commonVars.edges.top + (commonVars.markerPosition.z * commonVars.blockSize.quarter) + (commonVars.gridSize.y - commonVars.markerPosition.x * commonVars.blockSize.quarter) - 45;
	
	ctx.strokeStyle = '#0f0';
	ctx.beginPath();
	
	// Points 1-6, in order.
	ctx.moveTo(offsX + gr2, offsYtop);
	ctx.lineTo(offsX + gr1, offsYtop + gr4);
	ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
	ctx.lineTo(offsX + gr2, offsYtop + gr1);
	ctx.lineTo(offsX, offsYtop + gr4 + gr2);
	ctx.lineTo(offsX, offsYtop + gr4);
	
	ctx.closePath();
	ctx.stroke();
	
	ctx.save();
}