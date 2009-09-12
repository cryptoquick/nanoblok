function drawUI (windowSize, blockSize) {
	var center = {x: windowSize.x / 2, y: windowSize.y / 2};
	var gridElement = document.getElementById("grid");
	
	// Draw the nanoblok logo:
	var blockBlank = makeObject({x: 30, y: 7}, blockSize); //offset.x, offset.y);
	var block = setColor(blockBlank, 'bla');
	block.setAttributeNS(null, 'id', 'nanoblok-logo');
	block.setAttributeNS(null, 'transform', 'scale(3)');
	var logoText = document.getElementById('logoText');
	gridElement.insertBefore(block, logoText);
	
	gridElement.setAttributeNS(null, "height", windowSize.y - 5);
	
	document.getElementById("debugText");
}