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
	this.selection = document.getElementById('selection');
	// this.renderer = document.getElementById('renderer');
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
		this.ctx.lineTo(offsX + gr2, offsYtop + gr2);
		this.ctx.lineTo(offsX + gr1, offsYtop + gr4 + gr2);
		this.ctx.lineTo(offsX + gr2, offsYtop + gr1);
		this.ctx.lineTo(offsX, offsYtop + gr4 + gr2);
	
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
		this.displayCtx.clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
		this.displayCtx.globalCompositeOperation = "source-over";
		this.displayCtx.drawImage(this.grids, 0, 0);
		
		if ($C.swatchActive) {
			this.displayCtx.drawImage(this.colors, 0, 0);
		}
		else {
			this.displayCtx.drawImage(this.blocks, 0, 0);
			// Quick and easy trick to make selection transparent.
			this.displayCtx.globalAlpha = 0.5;
			this.displayCtx.drawImage(this.selection, 0, 0);
			this.displayCtx.globalAlpha = 1.0;
		}
		
		// this.displayCtx.drawImage(this.renderer, 0, 0);
		this.displayCtx.drawImage(this.overlays, 0, 0);
	}
	
	this.clearBlocks = function () {
		context('blocks').clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
	}
	
	this.clearSwatch = function () {
		context('colors').clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
	}
	
	this.clearSelection = function () {
		context('selection').clearRect(0, 0, $C.gridSize.x, $C.gridSize.y * 4);
	}
}

function perlNoise () {
	console.log(noise(0, 0, 0));
}

function NoiseGen () {
	perlNoise();
}