function drawUI (windowSize, gridSize, blockSize) {
	var center = {x: windowSize.x / 2, y: windowSize.y / 2};
	
	// Grid edges
	var edges = {
		left: center.x - gridSize.x / 2,
		top: windowSize.y - gridSize.y * 2
	}

	// Draw the nanoblok logo.
	var blockBlank = makeObject({x: 5, y: 5}, blockSize); //offset.x, offset.y);
	var block = setColor(blockBlank, 'bla');
	block.setAttributeNS(null, 'id', 'nanoblok-logo');
	block.setAttributeNS(null, 'transform', 'scale(3)');
	var gridElement = document.getElementById('grid');
	var statusContainer = document.getElementById('gridContainer');
	gridElement.insertBefore(block, statusContainer);
	
	// Set grid height.
	gridElement.setAttributeNS(null, "height", windowSize.y - 5);
	
	// Position debug / status
	var debugBox = document.getElementById("statusContainer");
	debugBox.setAttributeNS(null, "transform", "translate(" + edges.left + ", " + edges.top + ")");
}