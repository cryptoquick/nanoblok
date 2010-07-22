/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009-2010 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for input.js:
 * Event handlers and the functions they run.
 */

function InitEvents () {
	/* Event listeners */
	window.addEventListener('mousedown', function (evt) {
		Click(evt);
		mouseDown = true;
	}, false);
	
	window.addEventListener('mouseup', function (evt) {
		mouseDown = false;
	}, false);

	if (!$C.mouseMove) {
		window.addEventListener('mouseover', function (evt) {
			Hover(evt, 'in');
		}, false);

		window.addEventListener('mouseout', function (evt) {
			Hover(evt, 'out');
		}, false);
	}
	
	if ($C.mouseMove) {
		window.addEventListener('mousemove', function (evt) {
			MousePos(evt);
		}, false);
	}
	
	window.addEventListener('keydown', function (evt) {
		Key(evt);
	}, false);
	
	window.addEventListener('keyup', function (evt) {
		Key(evt);
	}, false);
	
	// window.addEventListener('mousemove', function (evt) {
	// 	Mouse(evt);
	// }, false);

	window.onresize = function() {
		if(initialized) {
			loggit('Resolution change detected, click refresh button.');
		}
		displayResized = true;
	}
}

// Handles click events from its corresponding event listener.
function Click (evt) {
	var target = evt.target;
	
	var inputs = [
		"save",
		"load",
		"refresh",
		"swatch",
		"fill",
		"gridUp",
		"gridDown",
	];
	
	for (var i = 0; i < inputs.length; i++) {
		if (target.id == inputs[i] + "Button" || target.id == inputs[i] + "Text") {
			eval("$C.tools." + inputs[i] + "()");
		}
	}
	
	// Color selection.
	if (target.id.substr(0,5) == "color") {
		// The last color is used to deselect the last color.
		$C.selected.lastColor = $C.selected.color;
		
		// Get the color value from its id and set the currently selected color as this. (not the best way to do this...)
		$C.selected.color = parseInt(target.id.substr(5,1));
		$C.tools.color();
		
		// 'Select' the clicked-on color swatch.
		document.getElementById(target.id).setAttributeNS(null, "stroke-opacity", "1.0");
	}
	
	// For the delete button.
	if (target.id.substr(0,6) == "remove" && $C.selected.tool == "remove")
	{
		$C.tools.remove.deselect();
	}
	else if (target.id.substr(0,6) == "remove") {
		$C.tools.remove.select();
	}
	
	
	// Block placement (first click, and if only one single click)
	if ($C.selected.tool == "remove" && target.id.substr(0,2) == 'x-') {
		removeBlock(target);
	}
	else if ($C.selected.tool == "select") {
		selectArea(target, true);
	}
	else if (target.id.substr(0,2) == 'x-' || target.id.substr(0,2) == 'y-' || target.id.substr(0,2) == 'z-')
	{
		placeBlock(target);
	}
}

// Gets hover events from its corresponding event listener, including whether the user hovered in or out of the object.
function Hover (evt, inout) {
	var target = null;
	
	if ($C.mouseMove) {
		target = evt;
	}
	else {
		target = evt.target;
	}
	// Place a block on the x-grid as long as the mouse is down and place it only when moving into the cell, otherwise the block would be placed twice.
	if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in" && $C.selected.tool.substr(0,5) == "color") {
		placeBlock(target);
	}
	else if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in" && $C.selected.tool == "remove") {
		removeBlock(target);
	}
	
	// Puts information about the position of the cursor over the grid into the markerPosition field in $C, allowing that to be used by the positionIndicator function.
	if (target.id.substr(0,2) == 'x-' && inout == "in") {
		$C.markerPosition.x = target.getAttribute("c");
		$C.markerPosition.z = target.getAttribute("r");
		$C.posInd.redraw();
	}
}

function Key (evt) {
	if (evt.type == "keydown") {
		// XKEY for delete.
		if (evt.keyCode == 88) {
			if ($C.selected.tool == "remove") {
				$C.tools.remove.deselect();
			}
			else {
				$C.tools.remove.select();
			}
		//	$C.selected.tool = "delete";
		}
		// BKEY for debug script.
		if (evt.keyCode == 66) {
			fillSquare();
		}
		// UP and DOWN arrows for changing Z level.
		if (evt.keyCode == 38) {
			$C.tools.gridUp();
		}
		if (evt.keyCode == 40) {
			$C.tools.gridDown();
		}
		// LEFT and RIGHT arrows for rotation.
		if (evt.keyCode == 37) {
			$C.tools.rotLeft();
		}
		if (evt.keyCode == 39) {
			$C.tools.rotRight();
		}
	}
	
/*	if (evt.type == "keyup") {
		if (evt.keyCode == 68) {
			
		//	$C.selected.tool = "delete";
		}
	} */
}

function Mouse (evt) {
	// loggit(evt.layerX + ", " + evt.layerY);
	
	/*
	// Place a block on the x-grid as long as the mouse is down and place it only when moving into the cell, otherwise the block would be placed twice.
	if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in") {
		placeBlock(target);
	}
	
	// Puts information about the position of the cursor over the grid into the markerPosition field in $C, allowing that to be used by the positionIndicator function.
	if (target.id.substr(0,2) == 'x-' && inout == "in") {
		$C.markerPosition.x = target.getAttribute("c");
		$C.markerPosition.z = target.getAttribute("r");
		positionIndicator();
	}*/
}

/*
function MousePos (evt) {
	var mouse = {x: evt.clientX, y: evt.clientY};
	
	var x = -1;
	var y = -1;
	var offsetY = -30;
	
	if ((mouse.x > $C.offset.x && mouse.x < ($C.offset.x + $C.gridSize.x)) && (mouse.y > ($C.offset.y + offsetY) && mouse.y < ($C.offset.y + $C.gridSize.y * 2 + offsetY))) {
		sqX = Math.floor((mouse.x - $C.offset.x) / $C.blockSize.full);
		sqY = Math.floor((mouse.y - offsetY - $C.offset.y) / $C.blockSize.half);
	}
	else {
		x = -1;
	}
	// if (mouse.y > ($C.offset.y + offsetY) && mouse.y < ($C.offset.y + $C.gridSize.y * 2 + offsetY)) {
	// 	y = Math.floor((mouse.y - offsetY - $C.offset.y) / $C.blockSize.half);
	// }
	// else {
	// 	y = -1;
	// }
	// 
	this.ctx = context('debug');
	this.ctx.clearRect(0, 0, $C.windowSize.x, $C.windowSize.y);
	this.ctx.fillText(x + ", " + y, mouse.x, mouse.y);
	$C.posInd.drawAll();
	
	var selectedElement = null;
	
	if (x != -1 && y != -1) {
		selectedElement = document.getElementById("x-" + (x * $C.gridDims.c + y));
		loggit("x-" + (x * $C.gridDims.c + y));
		Hover(selectedElement, "in");
	}
	else {
		selectedElement = null;
	}
	
	// x: (x * $C.blockSize.half) + (y * $C.blockSize.half) + $C.offset.x,
	// y: ((y * $C.blockSize.quarter) + ($C.gridSize.y - x * $C.blockSize.quarter)) + $C.offset.y
}*/