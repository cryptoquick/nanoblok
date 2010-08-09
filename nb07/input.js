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
	
	// References toolNames in ui.js.
	for (var i = 0; i < $C.toolNames.length; i++) {
		if (target.id == "toolButton" + toolNames[i] || target.id == "toolText" + toolNames[i]) {
			eval("$C.tools." + $C.toolMethods[i] + "()");
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

		// Set the current color to the element's color ID.
		$C.selected.color = parseInt(target.getAttribute('colorID'));
		
		$C.tools.color();
	}
	
	// Block placement (first click, and if only one single click)
	if ($C.selected.tool == "toolButtonDelete" && target.id.substr(0,2) == 'x-') {
		removeBlock(target);
	}
	else if ($C.selected.tool == "toolButtonSelect" && target.id.substr(0,2) == 'x-') {
		$C.selection.select(target);
	}
	else if ($C.swatchActive && target.id.substr(0,2) == 'x-') {
		pickColor(target);
	}
	else if (target.id.substr(0,2) == 'x-')
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
	else if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in" && $C.selected.tool == "toolButtonDelete") {
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
	ctrlPressed = evt.ctrlKey;
	
	if (evt.type == "keydown") {
		// DKEY for delete.
		if (evt.keyCode == 68) {
			$C.tools.remove();
		}
		// CKEY for color cube.
		if (evt.keyCode == 67) {
			$C.tools.swatch();
		}
		// FKEY for fill.
		if (evt.keyCode == 70) {
			$C.tools.fill();
		}
		// SKEY for select.
		if (evt.keyCode == 83 && !ctrlPressed) {
			$C.tools.select();
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
		// CTRL+SKEY for save.
		if (evt.keyCode == 83 && ctrlPressed) {
			$C.tools.save();
		}
		// CTRL+LKEY for load.
		if (evt.keyCode == 76 && ctrlPressed) {
			$C.tools.load();
		}
	}
}

