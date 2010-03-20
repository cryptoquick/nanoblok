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
function positionIndicator () {
	var ctx = context('overlays');
	
	ctx.clearRect(0, 0, Common.windowSize.x, Common.windowSize.y);
	ctx.globalAlpha = 0.7;
	
	var gr1 = Common.blockSize.full;
	var gr2 = gr1 / 2;
	var gr4 = gr1 / 4;
	
	// Red Marker
	var offsY = Common.offset.y - 30;
	var offsYtop = (Common.edges.top - Common.gridSize.y - 30)
		- (Common.markerPosition.x * Common.blockSize.quarter)
		+ (Common.gridDims.c - Common.layerOffset.z - 1) * Common.blockSize.half;
	var offsX = Common.offset.x + Common.markerPosition.x * Common.blockSize.half;
	
	ctx.fillStyle = '#f00';
	ctx.beginPath();
	
	ctx.moveTo(offsX, 0 + offsYtop);
	ctx.lineTo(gr2 + offsX, offsYtop - gr4);
	ctx.lineTo(gr2 + offsX, gr4 + offsYtop);
	ctx.lineTo(0 + offsX, gr2 + offsYtop);
	
	ctx.closePath();
	ctx.fill();
	
	// Blue Marker
	offsYtop = (Common.edges.top - Common.gridSize.y - 185)
		+ (Common.markerPosition.z * Common.blockSize.quarter)
		+ (Common.gridDims.c - Common.layerOffset.z - 1) * Common.blockSize.half;
	offsX = Common.offset.x + Common.gridSize.x / 2 + (Common.markerPosition.z * Common.blockSize.half);
	
	ctx.fillStyle = '#00f';
	ctx.beginPath();
	
	ctx.moveTo(offsX, offsYtop - gr4);
	ctx.lineTo(gr2 + offsX, offsYtop);
	ctx.lineTo(gr2 + offsX, gr2 + offsYtop);
	ctx.lineTo(0 + offsX, gr4 + offsYtop);
	
	ctx.closePath();
	ctx.fill();
	
	// Green Cursor
	offsX = Common.offset.x + (Common.markerPosition.x * Common.blockSize.half) + (Common.markerPosition.z * Common.blockSize.half);
	offsYtop = Common.edges.top - (Common.layerOffset.z * Common.blockSize.half) + (Common.markerPosition.z * Common.blockSize.quarter) + (Common.gridSize.y - Common.markerPosition.x * Common.blockSize.quarter) - 45;
	
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
	if (Common.selected.blocks) {
		offsX = Common.offset.x + (Common.selected.area.x * Common.blockSize.half) + (Common.selected.area.y * Common.blockSize.half);
		offsYtop = (Common.edges.top + Common.gridSize.y - 45) - (Common.selected.area.z * Common.blockSize.half) + (Common.selected.area.x * Common.blockSize.quarter) - (Common.selected.area.y * Common.blockSize.quarter);

		ctx.strokeStyle = "rgba(255,0,127,10)";
		ctx.beginPath();

		// Points 1-6, in order.
		ctx.moveTo(offsX + (gr2 * Common.selected.area.l), offsYtop);
		ctx.lineTo(offsX + (gr1 * Common.selected.area.l), offsYtop + (gr4 * Common.selected.area.w));
		ctx.lineTo(offsX + (gr1 * Common.selected.area.l), offsYtop + (Common.selected.area.h * gr2 + (gr4 * Common.selected.area.w)));
		ctx.lineTo(offsX + (gr2 * Common.selected.area.l), offsYtop + (Common.selected.area.h * gr2 + (gr2 * Common.selected.area.w)));
		ctx.lineTo(offsX, offsYtop + (Common.selected.area.h * gr2 + (gr4 * Common.selected.area.w * Common.selected.area.l)));
		ctx.lineTo(offsX, offsYtop + (gr4 * Common.selected.area.w));

		ctx.closePath();
		ctx.stroke();
	}
	
	// ctx.save();
}

function selectArea (target, select) {
	var position = {
		x: target.getAttributeNS(null, "r"),
		y: target.getAttributeNS(null, "c"),
		z: Common.layerOffset.z
	}
	
	// Clear selection if select is false
	if (select === false) {
		Common.selected.area = {x: 0, y: 0, z: 0, l: 0, w: 0, h: 0};
		Common.selected.blocks = false;
	}
	
	Common.selected.blocks = true;
	Common.selected.area = {x: position.x, y: position.y, z: position.z, l: 3, w: 3, h: 1};
	
	positionIndicator();
}