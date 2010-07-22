/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for effects.js:
 * This file is for all the canvas-based effects that don't have a home in any of the other files yet.
 * Right now it's mostly for the overlays cursors.
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
var PositionIndicator = function () {
	this.ctx = context('overlays');
	this.grids = document.getElementById('grids');
	this.blocks = document.getElementById('blocks');
	this.display = document.getElementById('display');
	this.overlays = document.getElementById('overlays');
	this.colors = document.getElementById('colors');
	this.displayCtx = context('display');
	
	this.redraw = function () {
		var offset = {x: 0, y: $C.windowSize.y};
		
		this.ctx.clearRect(0, 0, $C.windowSize.x, $C.windowSize.y);
		this.ctx.globalAlpha = 0.6;
	
		var gr1 = $C.blockSize.full;
		var gr2 = $C.blockSize.half;
		var gr4 = $C.blockSize.quarter;
	
		// Red Marker, and first of three color-coded small display offsets.
		var redOffs = -1;
		if ($C.smallDisplay) {redOffs = 0}
		// var offsY = offset.y - redOffs;
		var offsYtop = ($C.gridSize.y - redOffs)
			- ($C.markerPosition.x * $C.blockSize.quarter)
			+ ($C.gridDims.c - $C.layerOffset.z - 1) * $C.blockSize.half;
		var offsX = offset.x + $C.markerPosition.x * $C.blockSize.half;
	
		this.ctx.fillStyle = '#f00';
		this.ctx.beginPath();

		this.ctx.moveTo(offsX, 0 + offsYtop);
		this.ctx.lineTo(gr2 + offsX, offsYtop - gr4);
		this.ctx.lineTo(gr2 + offsX, gr4 + offsYtop);
		this.ctx.lineTo(0 + offsX, gr2 + offsYtop);

		this.ctx.closePath();
		this.ctx.fill();
	
		// Blue Marker
		var blueOffs = 6;
		if ($C.smallDisplay) {blueOffs = 4}
		offsYtop = (blueOffs)
			+ ($C.markerPosition.z * $C.blockSize.quarter)
			+ ($C.gridDims.c - $C.layerOffset.z - 1) * $C.blockSize.half;
		offsX = offset.x + $C.gridSize.x / 2 + ($C.markerPosition.z * $C.blockSize.half);
	
		this.ctx.fillStyle = '#00f';
		this.ctx.beginPath();
	
		this.ctx.moveTo(offsX, offsYtop - gr4);
		this.ctx.lineTo(gr2 + offsX, offsYtop);
		this.ctx.lineTo(gr2 + offsX, gr2 + offsYtop);
		this.ctx.lineTo(0 + offsX, gr4 + offsYtop);
	
		this.ctx.closePath();
		this.ctx.fill();
	
		// ($C.layerOffset.z * $C.blockSize.half) + ($C.markerPosition.z * $C.blockSize.quarter) + ($C.gridSize.y - $C.markerPosition.x * $C.blockSize.quarter) - greenOffs
	
		// Green Cursor
		var greenOffs = -306; // Couldn't figure out how to pare this down like the others, but this figure works.
		if ($C.smallDisplay) {greenOffs = -229}
		offsX = ($C.markerPosition.x * $C.blockSize.half) + ($C.markerPosition.z * $C.blockSize.half);
		offsYtop = -($C.layerOffset.z * $C.blockSize.half) + ($C.markerPosition.z * $C.blockSize.quarter) + ($C.gridSize.y - $C.markerPosition.x * $C.blockSize.quarter) - greenOffs;
	
		this.ctx.fillStyle = '#0f0';
		this.ctx.beginPath();
	
		// Points 1-6, in order.
		// ctx.moveTo(offsX + gr2, offsYtop);
		// ctx.lineTo(offsX + gr1, offsYtop + gr4);
		// ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
		// ctx.lineTo(offsX + gr2, offsYtop + gr1);
		// ctx.lineTo(offsX, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX + gr2, offsYtop + gr2);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX + gr2, offsYtop + gr1);
		this.ctx.lineTo(offsX, offsYtop + gr4 + gr2);
		// ctx.lineTo(offsX, offsYtop + gr4);
	
		this.ctx.closePath();
		this.ctx.fill();
	
		// Green Outline
		this.ctx.beginPath();
		this.ctx.moveTo(offsX + gr2, offsYtop);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX + gr2, offsYtop + gr1);
		this.ctx.lineTo(offsX, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX, offsYtop + gr4);
		this.ctx.closePath();
	
		this.ctx.strokeStyle = '#0f0';
		this.ctx.stroke();
		
		// Orange level outline.
		var levelOffs = 35 + $C.blockDims * $C.layerOffset.z * 0.5 + $C.edges.top;
		this.ctx.beginPath();
		this.ctx.moveTo($C.gridCorners[0].x - $C.edges.left, $C.gridCorners[0].y - levelOffs);
		this.ctx.lineTo($C.gridCorners[1].x - $C.edges.left, $C.gridCorners[1].y - levelOffs);
		this.ctx.lineTo($C.gridCorners[2].x - $C.edges.left, $C.gridCorners[2].y - levelOffs);
		this.ctx.lineTo($C.gridCorners[3].x - $C.edges.left, $C.gridCorners[3].y - levelOffs);
		this.ctx.closePath();
		
		this.ctx.globalAlpha = 1.0;
		this.ctx.strokeStyle = '#f90';
		this.ctx.stroke();
		
		// Clear display and draw all.
		this.drawAll();
	}
	
	this.drawAll = function () {
		this.displayCtx.clearRect(0, 0, $C.windowSize.x, $C.windowSize.y);
		this.displayCtx.globalCompositeOperation = "source-over";
		
		if ($C.swatchActive) {
			this.displayCtx.drawImage(this.colors, 0, 0);
		}
		else {
			this.displayCtx.drawImage(this.grids, 0, 0);
			this.displayCtx.drawImage(this.blocks, 0, 0);
		}
		
		this.displayCtx.drawImage(this.overlays, 0, 0);
	}
	
	this.clearBlocks = function () {
		context('blocks').clearRect(0, 0, $C.windowSize.x, $C.windowSize.y);
	}
	
	this.clearSwatch = function () {
		context('colors').clearRect(0, 0, $C.windowSize.x, $C.windowSize.y);
	}
	
	// Selection box
	// Enabled if there's a value in there.
	// if ($C.selected.blocks) {
	// 	offsX = $C.offset.x + ($C.selected.area.x * $C.blockSize.half) + ($C.selected.area.y * $C.blockSize.half);
	// 	offsYtop = 
	// 		   ($C.edges.top + $C.gridSize.y - 45)
	// 		 - ($C.selected.area.z * $C.blockSize.half)
	// 		 + ($C.selected.area.x * $C.blockSize.quarter)
	// 		 - ($C.selected.area.y * $C.blockSize.quarter)
	// 		 - ($C.selected.area.h * $C.blockSize.half)
	// 		 + ($C.blockSize.half);
	// 	// loggit(offsYtop);
	// 
	// 	ctx.strokeStyle = "rgba(255,0,127,10)";
	// 	ctx.beginPath();
	// 
	// 	// Points 1-6, in order.
	// 	ctx.moveTo(offsX + (gr2 * $C.selected.area.l), offsYtop);
	// 	ctx.lineTo(offsX + (gr1 * $C.selected.area.l), offsYtop + (gr4 * $C.selected.area.w));
	// 	ctx.lineTo(offsX + (gr1 * $C.selected.area.l), offsYtop + ($C.selected.area.h * gr2 + (gr4 * $C.selected.area.w)));
	// 	ctx.lineTo(offsX + (gr2 * $C.selected.area.l), offsYtop + ($C.selected.area.h * gr2 + (gr2 * $C.selected.area.w)));
	// 	ctx.lineTo(offsX, offsYtop + ($C.selected.area.h * gr2 + (gr4 * $C.selected.area.l)));
	// 	ctx.lineTo(offsX, offsYtop + (gr4 * $C.selected.area.w));
	// 
	// 	ctx.closePath();
	// 	ctx.stroke();
	// }
	
	// ctx.save();
}

function selectArea (target, select) {
	// var row = target.getAttributeNS(null, "r");
	
	var position = {
		x: target.getAttributeNS(null, "r"),
		y: target.getAttributeNS(null, "c"),
		z: $C.layerOffset.z
	}
	
	var area = {
		l: 0,
		w: 0,
		h: 0
	}
	
	if ($C.selected.secondSelection.x == -1 && $C.selected.initialSelection.x != -1) {
		$C.selected.secondSelection = position;
		var length = Math.abs(position.x - $C.selected.initialSelection.x) + 1;
		var width = Math.abs(position.y - $C.selected.initialSelection.y) + 1;
		var height = 1;
		area = {l: length, w: width, h: height};
		loggit(length + ", " + width);
	}
	
	if ($C.selected.initialSelection.x == -1 && position.x != -1) {
		loggit("bla");
		$C.selected.initialSelection = position;
		area = {l: 1, w: 1, h: 1};
	}
	
	// Clear selection if select is false
	if (select === false) {
		// $C.selected.area = {x: 0, y: 0, z: 0, l: 0, w: 0, h: 0};
		// $C.selected.blocks = false;
		// Clear initial and second selections
	}
	
	$C.selected.blocks = true;
	$C.selected.area = {x: position.x, y: position.y, z: position.z, l: area.l, w: area.w, h: area.h};
	
	positionIndicator();
}