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
		"gridUp",
		"gridDown",
		"rotLeft",
		"rotRight"
	];
	
	var toolNames = [
		"Load",
		"Save",
		"Fill",
		"Select",
		"Colors",
		"Delete"
	]
	
	var toolMethods = [
		"load",
		"save",
		"fill",
		"select",
		"swatch",
		"remove"
	]
	
	// References toolNames in ui.js.
	for (var i = 0; i < toolNames.length; i++) {
		if (target.id == "toolButton" + i || target.id == "toolText" + i) {
			eval("$C.tools." + toolMethods[i] + "()");
		}
	}
	
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
		if (evt.keyCode == 68) {
			if ($C.selected.tool == "remove") {
				$C.tools.deselectRm();
			}
			else {
				$C.tools.selectRm();
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
}