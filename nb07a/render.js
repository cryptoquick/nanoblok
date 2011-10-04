var size = 64;

function colorOverhead () {
	var pixArr = [];
	
	for (var x = 0; x < 32; x++) {
		pixArr.push(new Array());
		for (var y = 0; y < 32; y++) {
			var color = {
				r: SwatchField[Swatch[x][y][0]][3].r,
				g: SwatchField[Swatch[x][y][0]][3].g,
				b: SwatchField[Swatch[x][y][0]][3].b
			}
			
			pixArr[x][y] = color;
		}
	}
	
	rectRender(pixArr);
}

function voxArr (dim) {
	var voxels = [];	
	
	for (var x = 0; x < dim; x++) {
		voxels[x] = [];
		for (var y = 0; y < dim; y++) {
			voxels[x][y] = [];
			for (var z = 0; z < dim; z++) {
				voxels[x][y][z] = null;
			}
		}
	}
	
	return voxels;
}

function expand (field) {
	var voxels = voxArr(32);
//	console.log(field[0]);
//	console.log(SwatchField[field[2][0]]);
	for (var i = 0, ii = field.length; i < ii; i++) {
		var x = field[i][0];
		var y = field[i][1];
		var z = field[i][2];
		var color = SwatchField[field[i][3]][3];
		
		voxels[x][y][z] = color;
	}
	console.log("Model expanded into voxel array.");
	return voxels;
}

function blank () {
	var pixels = [];
	
	for (var px = 0; px < size; px++) {
		pixels[px] = new Array();
		for (var py = 0; py < size; py++) {
			pixels[px][py] = {r: 255, g: 255, b: 255};
		}
	}
	
	return pixels;
}

// For testing performance (big O) of the following algorithms.
// Tested against the absolute worst case, the color cube.
// Approach 1 (isoPass) writes pixels 3071 times.
// Approach 2 (arriso/reciso) writes pixels xx times.
var test = 0;

function iso (voxels) {
	test = 0;
	var pixels = blank();
	
	pixels = isoPass(voxels, pixels, isoTop);
	pixels = isoPass(voxels, pixels, isoRight);
	pixels = isoPass(voxels, pixels, isoLeft);
	
//	pixels = arriso(voxels, pixels);
//	console.log(test);
	return pixels;
}

function arriso (voxels, pixels) {
	for (var px = 0; px < size; px++) {
		for (var py = 0; py < size; py++) {
			if (px > size / 2 - py * 2 // Top Left
				&&	size - px > size / 2 - py * 2 // Top Right
				&&	size / 4 - px / 2 < size - py // Lower Left
				&&	px / 2 < size * 1.25 - py // Lower Right
			) {
				pixels[px][py] = {r: 123, g: 123, b: 123};
				test++;
			}
		}
	}
	
	return pixels;
}

function reciso (voxels, pixels) {
	
}

var runY = true;
var runZ = true;

function isoPass (voxels, pixels, func) {
//	for (var x = 0; x < 32; x++) {
	//	for (var y = 0; y < 32; y++) {
		//	for (var z = 0; z < 32; z++) {
		
	var x = 32; while (x--) {
		runY = true;
		var y = 32; while (y-- && runY) {
			runZ = true;
			var z = 32; while (z-- && runZ) {
				pixels = func(voxels, pixels, x, y, z);
			}
		}
	}
	
	return pixels;
}

function isoTop (voxels, pixels, x, y, z) {
	if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
		var px = Math.floor(x + y);
		var py = Math.floor(y / 2 + (size - x) / 2) - z + size / 4;
		if (px > 0 && px < size && py > 0 && py < size) {
			// if ($C.swatchActive) {
				var color = voxels[x][y][z];
			// }
			// else {
			// 	var color = SwatchField[Field[voxels[x][y][z]][3]][3];
			// }
			pixels[px][py-1] = color;
			pixels[px+1][py-1] = color;
			test++;
		}
		
		runZ = false;
	}
	
	return pixels;
}

function isoRight (voxels, pixels, x, z, y) {
	if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
	//	var px = Math.floor((x * 2 - z));
	//	var py = Math.floor(63 - z) + 16;
		var px = Math.floor(x + y);
		var py = Math.floor(y / 2 + (size - x) / 2) - z + size / 4; // + 16;
		if (px >= 0 && px < size && py >= 0 && py < size) {
			// if ($C.swatchActive) {
				var color = shade(voxels[x][y][z], 'right');
			//var color = {r: 0, g: 0, b: 0};
			// }
			// 	else {
			// 		var color = shade(SwatchField[Field[voxels[x][y][z]][3]][3], 'right');
			// 	}
			pixels[px][py] = color;
			pixels[px+1][py] = color;
			pixels[px][py+1] = color;
			pixels[px+1][py+1] = color;
			test++;
		}
		
		runZ = false;
	}
	
	return pixels;
}
var cube = 31;
function isoLeft (voxels, pixels, z, y, x) {
	if (voxels[cube-x] != null && voxels[cube-x][cube-y] != null && voxels[cube-x][cube-y][cube-z] != null) {
		var px = Math.floor(size - (x + y)); // + 16;
		var py = Math.floor(size - ((y / 2 + (size - x) / 2) - z + size / 4)); //((y/2 + (x/2)) - z));
	//	if (px > 0 && px < size && py > 0 && py < size) {
		if (px >= 0 && px < size && py >= 0 && py < size) {
			// if ($C.swatchActive) {
				var color = shade(voxels[cube-x][cube-y][cube-z], 'left');
			// }
			// else {
				// var color = shade(SwatchField[Field[voxels[cube-x][cube-y][cube-z]][3]][3], 'left');
			// }
			pixels[px-1][py+1] = color;
			pixels[px][py+1] = color;
			
			test++;
		}
		
		runZ = false;
	}
	
	return pixels;
}

// Adapted color code from Nanoblok Editor.
var blokShift = {a: -40, b: 40, c: 0, d: -60};

function shade (color, side) {
	var shaded = {};
	shaded.r = color.r;
	shaded.g = color.g;
	shaded.b = color.b;
	
	if (side == 'left') {
		shaded.r = smartShift(color.r, blokShift.a)
		shaded.g = smartShift(color.g, blokShift.a)
		shaded.b = smartShift(color.b, blokShift.a);
	}
	else if (side == 'right') {
		shaded.r = smartShift(color.r, blokShift.b)
		shaded.g = smartShift(color.g, blokShift.b)
		shaded.b = smartShift(color.b, blokShift.b);
	}
	return shaded;
}

function smartShift (color, degree) {
	if (color + degree < 0) {
		// For dark black.
		var shifted = color - degree;
	}
	else if (color + degree > 255) {
		// For light white.
		var shifted = Math.min(color + degree, 255);
	}
	else {
		// And everything inbetween.
		var shifted = color + degree;
	}
	   
	return shifted;
}

var runs1 = 0;
var runs2 = 0;

function overhead (voxels) {
	var pixels = blank();
	
	for (var x = 0; x < 32; x++) {
		for (var y = 0; y < 32; y++) {
			runs1++;
			pixels = diagonal(voxels, pixels, x, y, 0);
		}
	}
	console.log(runs1 + ", " + runs2);
	return pixels;
}

function diagonal (voxels, pixels, x, y, z) {
//	var found = false;
	
	if (z >= 32) {
	//	console.log('bla');
	//	runs2++;
		return pixels;
	}
	else {
	//	console.log(x + ', ' + y + ', ' + z + ', ' + voxels[x][y][z]);
		var pixFound = false;
		
		if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
		//	console.log(voxels[x][y][z]);
			pixels[x][y * 2] = voxels[x][y][z];
			pixFound = true;
		}
		if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z + 1] != null) {
			pixels[x][y * 2] = voxels[x][y][z + 1];
			pixFound = true;
		}
		if (pixFound) {
			return pixels;
		}
		runs2++;
		return diagonal(voxels, pixels, x, y, z + 1);
	}
}

// Pixel Width
var pX = 6;
var pY = 6;
var dbg0 = 0;
var dbg1 = 1;

function rectRender (pixArr) {
	var canvas = document.getElementById('nbRender');
	var ctx = canvas.getContext('2d');
	
	for (var x = 0; x < Math.floor(canvas.width / pX); x++) {
		for (var y = 0; y < Math.floor(canvas.height / pY); y++) {
			if (x < 32 && y < 32) {
				ctx.fillStyle = "rgb(" +
					pixArr[x][y].r + "," +
					pixArr[x][y].g + "," +
					pixArr[x][y].b + ")";
				ctx.fillRect(x * pX, y * pY, pX, pY);
			}
		}
	}
	
	console.log('Rendering model with rects.');
}

function pixelRender (pixArr) {
	var canvas = document.getElementById('renderer');
	var ctx = canvas.getContext('2d');
	var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	for (var y = 0, yy = canvasData.height; y < yy; y++)  {
		for (var x = 0, xx = canvasData.width; x < xx; x++)  {
			
			var i = (x + y * canvasData.width) * 4;
			var r, g, b, a = 255;
			
			if (x > -1 && x < size && y > -1 && y < size) {
				r = pixArr[x][y].r;
				g = pixArr[x][y].g;
				b = pixArr[x][y].b;
			}
			
			canvasData.data[i + 0] = r;
			canvasData.data[i + 1] = g;
			canvasData.data[i + 2] = b;
			canvasData.data[i + 3] = a;
		}
	}
	
	ctx.putImageData(canvasData, 0, 0);
//	console.log(dbg0 + ', ' + dbg1);
	
	return canvas;
}

function displayDraw (img, offset) {
	var sprite = document.getElementById("nbRender");
	var canvas = document.getElementById("nbDisplay");
	var ctx = canvas.getContext('2d');
	ctx.drawImage(sprite, offset.x, offset.y, size, size);
}

function colorDemo () {
	var field = SwatchField;
	var voxels = voxArr(32);
	for (var i = 0, ii = field.length; i < ii; i++) {
		var x = field[i][0];
		var y = field[i][1];
		var z = field[i][2];
		var color = SwatchField[i][3];
		
		voxels[x][y][z] = color;
	}
	return voxels;
}