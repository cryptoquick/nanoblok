function drawSingleBlock (location, color) {
	var block = Field[i];

	var gridPosition = block[0] * $C.gridDims.c + block[1];
	var coors = GridField["x-" + gridPosition].coors;

	canvasBlock(coors, location, color);
}

var t = new Object();
var time1 = new Object();
var time0 = new Object();

function fillColorSwatch () {
	var color = "";
	
	if ($C.animating == false) {
		time0 = new Date();
		$C.animating = true;
		t = setInterval(buildColorSwatch, 1);
	}
	else {
		loggit("Animation already being run!");
	}
}

var h = 0;

function buildColorSwatch () {
	if (h >= 31) {
		clearInterval(t);
		time1 = new Date();
		loggit("Color cube drawn in " + (time1 - time0) + " ms.");
		$C.animating = false;
	}
	
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	for (var w = 0; w < 32; w++) {
		for (var l = 0; l < 32; l++) {
			color = {
						r: (w + 1) * 8,
						g: 256 - (l + 1) * 8,
						b: (h + 1) * 8
					};
			
			blockColor = colorBlockNew(color);
			
			location = {x: l, y: w, z: h};
			
			var gridPosition = l * $C.gridDims.c + w;
			var coors = GridField["x-" + gridPosition].coors;
			
			Voxel[location.x][location.y][location.z] = $C.selected.color;
			
			canvasBlock(coors, location, blockColor);
		}
	}
	
	$C.posInd.redraw();
	h++;
}