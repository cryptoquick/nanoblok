function drawUI (windowSize, gridSize, center, edges, blockSize) {
	// Draw the nanoblok logo.
	var blockBlank = makeObject({x: 5, y: 5}, blockSize); //offset.x, offset.y);
	var block = setColor(blockBlank, 'bla');
	block.setAttributeNS(null, 'id', 'nanoblok-logo');
	block.setAttributeNS(null, 'transform', 'scale(3)');
	var gridElement = document.getElementById('grid');
	var statusContainer = document.getElementById('gridContainer');
	gridElement.insertBefore(block, statusContainer);
	
	// Set viewport height.
	gridElement.setAttributeNS(null, "height", windowSize.y - 5);
	
	// Set effects canvas dimensions.
	var effectsElement = document.getElementById("effects");
	effectsElement.setAttributeNS(null, "height", windowSize.y - 5);
	effectsElement.setAttributeNS(null, "width", windowSize.x);
	
	// Position debug / status
	var debugBox = document.getElementById("statusContainer");
	debugBox.setAttributeNS(null, "transform", "translate(" + edges.left + ", " + (edges.top - 40) + ")");
}