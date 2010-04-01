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
		if (Common.selected.tool != "delete") {
			document.getElementById(Common.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			Common.selected.tool = "delete";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Deletion tool selected.");
		}
		else if (Common.selected.tool == "delete") {
			Common.selected.tool = "color";
			document.getElementById("deleteButton").setAttributeNS(null, "stroke-opacity", "0.0");
			loggit("Deletion tool deselected.");
		}
	}
	
	// Select button.
	else if (tool == "select") {
		if (Common.selected.tool != "select") {
			document.getElementById(Common.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
			Common.selected.tool = "select";
			document.getElementById("selectButton").setAttributeNS(null, "stroke-opacity", "1.0");
			loggit("Selection tool selected.");
		}
		else if (Common.selected.tool == "select") {
			Common.selected.tool = "color";
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
		if(Common.layerOffset.z < (Common.gridDims.r - 1)) {
			Common.layerOffset.z++;
			positionIndicator();
			// Raise the SVG grid.
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(0," + (-35 - Common.layerOffset.z * Common.blockSize.half) + ")");
		}
	}
	
	// Grid Down button.
	else if (tool == "griddown") {
		if(Common.layerOffset.z > 0) {
			Common.layerOffset.z--;
			positionIndicator();
			// Lower the SVG grid.
			document.getElementById("gridContainer").setAttributeNS(null, "transform", "translate(0," + (-35 - Common.layerOffset.z * Common.blockSize.half) + ")");
		}
	}
	
	// Color selection.
	if (tool == "color") {
		document.getElementById(Common.selected.tool + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		
		// Get the color swatch (its name corresponds to its color), then set its black outline to transparent, making it appear deselected.
		document.getElementById("color" + Common.selected.lastColor + Common.palette[Common.selected.lastColor][3] + "Button").setAttributeNS(null, "stroke-opacity", "0.0");
		
		Common.selected.tool = "color" + Common.selected.color + Common.palette[Common.selected.color][3];
		loggit("Selected color is: " + Common.palette[Common.selected.color][3] + ".");
	}
}