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
function positionIndicator (commonVars) {
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
	offsYtop = commonVars.edges.top - (commonVars.layerOffset.z * commonVars.blockSize.half) + (commonVars.markerPosition.z * commonVars.blockSize.quarter) + (commonVars.gridSize.y - commonVars.markerPosition.x * commonVars.blockSize.quarter) - 45;
	
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
	
	// Selection box
	// Enabled if there's a value in there.
	if (commonVars.selected.blocks) {
		offsX = commonVars.offset.x + (commonVars.selected.area.x * commonVars.blockSize.half) + (commonVars.selected.area.y * commonVars.blockSize.half);
		offsYtop = (commonVars.edges.top + commonVars.gridSize.y - 45) - (commonVars.selected.area.z * commonVars.blockSize.half) + (commonVars.selected.area.x * commonVars.blockSize.quarter) - (commonVars.selected.area.y * commonVars.blockSize.quarter);

		ctx.strokeStyle = "rgba(255,0,127,10)";
		ctx.beginPath();

		// Points 1-6, in order.
		ctx.moveTo(offsX + (gr2 * commonVars.selected.area.l), offsYtop);
		ctx.lineTo(offsX + (gr1 * commonVars.selected.area.l), offsYtop + (gr4 * commonVars.selected.area.w));
		ctx.lineTo(offsX + (gr1 * commonVars.selected.area.l), offsYtop + (commonVars.selected.area.h * gr2 + (gr4 * commonVars.selected.area.w)));
		ctx.lineTo(offsX + (gr2 * commonVars.selected.area.l), offsYtop + (commonVars.selected.area.h * gr2 + (gr2 * commonVars.selected.area.w)));
		ctx.lineTo(offsX, offsYtop + (commonVars.selected.area.h * gr2 + (gr4 * commonVars.selected.area.w * commonVars.selected.area.l)));
		ctx.lineTo(offsX, offsYtop + (gr4 * commonVars.selected.area.w));

		ctx.closePath();
		ctx.stroke();
	}
	
	// ctx.save();
}

function selectArea (commonVars, target, select) {
	var position = {
		x: target.getAttributeNS(null, "r"),
		y: target.getAttributeNS(null, "c"),
		z: commonVars.layerOffset.z
	}
	
	// Clear selection if select is false
	if (select === false) {
		commonVars.selected.area = {x: 0, y: 0, z: 0, l: 0, w: 0, h: 0};
		commonVars.selected.blocks = false;
	}
	
	commonVars.selected.blocks = true;
	commonVars.selected.area = {x: position.x, y: position.y, z: position.z, l: 1, w: 5, h: 1};
	
	positionIndicator(commonVars);
}