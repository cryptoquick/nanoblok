// Handles click events from its corresponding event listener.
function Click (evt) {
	var target = evt.target;
	
	// Top-side mode/settings buttons.
	// Save button.
	if (target.id == "saveButton" || target.id == "saveText") {
		toolSelect("save");
	}
	
	// Load button.
	else if (target.id == "loadButton" || target.id == "loadText") {
		toolSelect("load");
	}

	// Refresh button.
	else if (target.id == "refreshButton" || target.id == "refreshText") {
		toolSelect("refresh");
	}
	
	// Delete button, its state can be toggled by the user.
	else if (target.id == "deleteButton" || target.id == "deleteText") {
		toolSelect("save");
	}
	
	// Select button.
	else if (target.id == "selectButton" || target.id == "selectText" || target.id == "selectLogo") {
		toolSelect("select");
	}

	// Fill button.
	else if (target.id == "fillButton" || target.id == "fillText") {
		toolSelect("fill");
	}
	
	// Grid Up button.
	else if (target.id == "gridUpButton" || target.id == "gridUpText") {
		toolSelect("gridup");
	}
	
	// Grid Down button.
	else if (target.id == "gridDownButton" || target.id == "gridDownText") {
		toolSelect("griddown");
	}
	
	// Color selection.
	if (target.id.substr(0,5) == "color") {
		// The last color is used to deselect the last color.
		$C.selected.lastColor = $C.selected.color;
		
		// Get the color value from its id and set the currently selected color as this. (not the best way to do this...)
		$C.selected.color = parseInt(target.id.substr(5,1));
		toolSelect("color");
		
		// 'Select' the clicked-on color swatch.
		document.getElementById(target.id).setAttributeNS(null, "stroke-opacity", "1.0");
	}
	
	// Block placement (first click, and if only one single click)
	if ($C.selected.tool == "delete") {
		deleteBlock(target);
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
	var target = evt.target;
	
	// Place a block on the x-grid as long as the mouse is down and place it only when moving into the cell, otherwise the block would be placed twice.
	if ((target.id.substr(0,2) == 'x-') && mouseDown && inout == "in") {
		placeBlock(target);
	}
	
	// Puts information about the position of the cursor over the grid into the markerPosition field in $C, allowing that to be used by the positionIndicator function.
	if (target.id.substr(0,2) == 'x-' && inout == "in") {
		$C.markerPosition.x = target.getAttribute("c");
		$C.markerPosition.z = target.getAttribute("r");
		positionIndicator();
	}
}

function Key (evt) {
	if (evt.type == "keydown") {
		if (evt.keyCode == 68) {
			$C.selected.tool = "delete";
		}
	}
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