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

function iso (voxels) {
	var pixels = blank();
	
	pixels = isoPass(voxels, pixels, isoLeft);
	pixels = isoPass(voxels, pixels, isoRight);
	pixels = isoPass(voxels, pixels, isoTop);
	
	return pixels;
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
		var py = Math.floor(y / 2 + (size - x) / 2) - z;
		if (px > 0 && px < size && py > 0 && py < size) {
			pixels[px][py] = voxels[x][y][z];
			pixels[px + 1][py] = voxels[x][y][z];
		}
		
		runZ = false;
	}
	
	return pixels;
}

function isoLeft (voxels, pixels, x, z, y) {
	if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
	//	var px = Math.floor((x * 2 - z));
	//	var py = Math.floor(63 - z) + 16;
		var px = Math.floor(x + y);
		var py = Math.floor(y / 2 + (size - x) / 2) - z // + 16;
		if (px > 0 && px < size && py > 0 && py < size) {
			var color = shade(voxels[x][y][z], 'left');
			pixels[px][py] = color;
			pixels[px + 1][py] = color;
		}
		
		runZ = false;
	}
	
	return pixels;
}

function isoRight (voxels, pixels, z, y, x ) {
	if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
		var px = Math.floor(x + y) // + 16;
		var py = Math.floor(y / 2 + (size - x) / 2) - z;
		if (px > 0 && px < size && py > 0 && py < size) {
			var color = shade(voxels[x][y][z], 'right');
			pixels[px][py] = color;
			pixels[px + 1][py] = color;
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

/*function diagonal(voxels, pixels, x) {
	var color = 
	
	for (var y = 0; y < x; y++) {
		for (var z = 0; z < x; z++) {
			if (voxels[x] != null && voxels[x][y+1] != null && voxels[x][y+1][z+1] != null) {
				
				return 
			}
		}
		
		return diagonal(voxels, x, );
	}
	else {
		return 
	}
}*/


/*
function overhead (voxels) {
	var pixels = [];
	
	// Loop Controls
	var l = {
		xIt: 0, yIt: 0, zIt: 0,
		xHi: 0, yHi: 0, zHi: 0,
		xLo: 0, yLo: 0, zLo: 0
	}
	
	for (var px = 0; px < 32; px++) {
		pixels[px] = new Array();
		for (var py = 0; py < 64; py++) {
			pixels[px][py] = {r: 255, g: 255, b: 255};
		}
	}
	
	var px = 0, py = 0;
	
	var x = 31; while (x--) {
		px++;
		py = 0;
		var y = 31; while (y--) {
			py+=1;
			var z = 31; while (z--) {
				if (voxels[x+0] != null && voxels[x][y] != null && voxels[x+0][y][z+0] != null) {
					pixels[px][py] = voxels[x+0][y][z+0];
					break;
				}
			}*/
		/*	var z2 = 31; while (z2--) {
				if (voxels[x+2] != null && voxels[x+2][y+0] != null && voxels[x+2][y+0][z2] != null) {
					pixels[px][py+1] = voxels[x+2][y+0][z2];
					break
				}
			}
		}/*
	}
	
	console.log('Overhead rendering.');
	return pixels;
}*/

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
	var canvas = document.getElementById('nbRender');
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
