var fieldData = JSON.parse('[["block-1000",9,3,0,"yellow","s"],["block-1001",8,3,0,"yellow","s"],["block-1002",7,3,0,"yellow","s"],["block-1003",10,4,0,"yellow","s"],["block-1004",9,4,0,"black","s"],["block-1005",8,4,0,"yellow","s"],["block-1006",7,4,0,"black","s"],["block-1007",6,4,0,"yellow","s"],["block-1008",10,5,0,"yellow","s"],["block-1009",9,5,0,"yellow","s"],["block-1010",8,5,0,"yellow","s"],["block-1011",7,5,0,"yellow","s"],["block-1012",6,5,0,"yellow","s"],["block-1013",10,6,0,"yellow","s"],["block-1014",9,6,0,"black","s"],["block-1015",8,6,0,"black","s"],["block-1016",7,6,0,"black","s"],["block-1017",6,6,0,"yellow","s"],["block-1018",9,7,0,"yellow","s"],["block-1019",8,7,0,"yellow","s"],["block-1020",7,7,0,"yellow","s"]]');

window.addEventListener('load', function () {
	
	voxRender('voxCanvas', 16);
	voxRender('voxRender', 2);
		
}, false);

function getCanvas (canvasID) {
	// Get the canvas element.
	var elem = document.getElementById(canvasID);
	if (!elem || !elem.getContext) {
		alert('error');
		return;
	}

	// Get the canvas 2d context.
	var context = elem.getContext('2d');
	if (!context) {
		alert('error');
		return;
	}
	
	return context;
}

function voxRender (canvasID, size) {
	var context = getCanvas(canvasID);
	
	context.lineWidth = 0;
	context.strokeStyle = 'none';
	
	degrees = 45;
//	rotation = degrees * Math.PI / 180;

	context.scale(1, 0.5);
	context.rotate(degrees * Math.PI / 180);
	context.translate(16 * size, 0);
	
//	context.transform(m11, m12, m21, m22, dx, dy);
	
	context.strokeStyle = 'red';
	context.strokeRect(0, 0, 16 * size, 16 * size);

	for (var i = 0; i < fieldData.length; i++) {
		context.fillStyle = fieldData[i][4];
		// x, y, width, height
		context.fillRect(fieldData[i][1] * size, fieldData[i][2] * size, size, size);	
	}
}