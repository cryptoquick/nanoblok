function toolSelect (tool) {
	// Top-side mode/settings buttons.
	// Save button.
	if (tool == "save") {
		saveField();
		loggit("Blocks saved.");
	}
	
	// Load button.
	else if (tool == "load") {
		loadField();
		drawBlocks("Blocks loaded.");
	}

	// Refresh button.
	else if (tool == "refresh") {
		Update("refresh", {gridMode: "standard"});
		loggit("Canvas refreshed.");
	}
	
	// Delete button, its state can be toggled by the user.
	else if (tool == "delete") {
		if ($C.selected.tool != "delete") {
			document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			$C.selected.tool = "delete";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Deletion tool selected.");
		}
		else if ($C.selected.tool == "delete") {
			$C.selected.tool = "color";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "0.0");
			loggit("Deletion tool deselected.");
		}
	}
	
	// Select button.
	else if (tool == "select") {
		if ($C.selected.tool != "select") {
			document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			$C.selected.tool = "select";
			document.getElementById("selectButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Selection tool selected.");
		}
		else if ($C.selected.tool == "select") {
			$C.selected.tool = "color";
			document.getElementById("selectButton").setAttributeNS(null, "stroke-opacity", "0.0");
			loggit("Selection tool deselected.");
		}
	}

	// Fill button.
	else if (tool == "fill") {
		fillRandom();
	}
	
	// Grid Up button.
	else if (tool == "gridup") {
		if($C.layerOffset.z < ($C.gridDims.r - 1)) {
			$C.layerOffset.z++;
			positionIndicator();
			// Raise the SVG grid.
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(0," + (-35 - $C.layerOffset.z * $C.blockSize.half) + ")");
		}
	}
	
	// Grid Down button.
	else if (tool == "griddown") {
		if($C.layerOffset.z > 0) {
			$C.layerOffset.z--;
			positionIndicator();
			// Lower the SVG grid.
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(0," + (-35 - $C.layerOffset.z * $C.blockSize.half) + ")");
		}
	}
	
	// Color selection.
	if (tool == "color") {
		document.getElementById($C.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		
		// Get the color swatch (its name corresponds to its color), then set its black outline to transparent, making it appear deselected.
		document.getElementById("color" + $C.selected.lastColor + $C.palette[$C.selected.lastColor][3] + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		
		$C.selected.tool = "color" + $C.selected.color + $C.palette[$C.selected.color][3];
		loggit("Selected color is: " + $C.palette[$C.selected.color][3] + ".");
	}
}