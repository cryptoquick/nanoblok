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

function overhead (voxels, direction) {
//	var voxels = expand(field);
	var pixels = [];
	
	// Loop Controls
	var l = {
		xIt: 0, yIt: 0, zIt: 0,
		xHi: 0, yHi: 0, zHi: 0,
		xLo: 0, yLo: 0, zLo: 0
	}
	
	switch (direction) {
	/*	case 0:
			l.xIt = 1;		l.yIt = 1;		l.zIt = 1;
			l.xHi = 32;		l.yHi = 32;		l.zHi = 32;
			l.xLo = 0; 		l.yLo = 0;		l.zLo = 0;
			break;*/
		case 0:
			l.xIt = -1;		l.yIt = -1;		l.zIt = -1;
			l.xHi = 0;		l.yHi = 0;		l.zHi = 0;
			l.xLo = 31;		l.yLo = 31;		l.zLo = 31;
			break;
	/*	case 2:
			l.xIt = -1;		l.yIt = 1;		l.zIt = 1;
			l.xHi = 0;		l.yHi = 32;		l.zHi = 32;
			l.xLo = 32; 	l.yLo = 0;		l.zLo = 0;
			break;
		case 3:
			l.xIt = 1;		l.yIt = 1;		l.zIt = 1;
			l.xHi = 32;		l.yHi = 32;		l.zHi = 32;
			l.xLo = 0; 		l.yLo = 0;		l.zLo = 0;
			break;
		case 4:
			l.xIt = 1;		l.yIt = 1;		l.zIt = 1;
			l.xHi = 32;		l.yHi = 32;		l.zHi = 32;
			l.xLo = 0; 		l.yLo = 0;		l.zLo = 0;
			break;
		case 5:
			l.xIt = 1;		l.yIt = 1;		l.zIt = 1;
			l.xHi = 32;		l.yHi = 32;		l.zHi = 32;
			l.xLo = 0; 		l.yLo = 0;		l.zLo = 0;
			break;
		case 6:
			l.xIt = -1;		l.yIt = -1;		l.zIt = -1;
			l.xHi = 0;		l.yHi = 0;		l.zHi = 0;
			l.xLo = 32; 	l.yLo = 32;		l.zLo = 32;
			break;*/
	}
	
	for (var x = 0; x < 32; x++) {
		pixels.push(new Array());
		for (var y = 0; y < 32; y++) {
			pixels[x] = new Array();
		}
	}
	
	for (var x = 32; x >= 0; x++) {
	//	console.log(x);
		
		for (var y = 0; y < 32; y++) {
			pixels[x][y] = {r: 255, g: 255, b: 255};
			for (var z = 0; z >= ; z += l.zIt) {
				if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null && direction == 0) {
					pixels[x][y] = voxels[x][y][z];
					break;
				}
				if (voxels[32-x] != null && voxels[32-x][y] != null && voxels[32-x][y][z] != null && direction == 1) {
					pixels[x][y] = voxels[32-x][y][z];
					break;
				}
			/*	if (voxels[x] != null && voxels[x][32-y] != null && voxels[x][32-y][z] != null && direction == 2) {
					pixels[x][y] = voxels[x][32-y][z];
					break;
				}
				if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][32-z] != null && direction == 3) {
					pixels[x][y] = voxels[x][y][32-z];
					break;
				}
				if (voxels[32-x] != null && voxels[32-x][32-y] != null && voxels[32-x][32-y][z] != null && direction == 4) {
					pixels[x][y] = voxels[32-x][32-y][z];
					break;
				}
				if (voxels[x] != null && voxels[x][32-y] != null && voxels[x][32-y][32-z] != null && direction == 5) {
					pixels[x][y] = voxels[x][32-y][32-z];
					break;
				}
				if (voxels[32-x] != null && voxels[32-x][32-y] != null && voxels[32-x][32-y][32-z] != null && direction == 6) {
					pixels[x][y] = voxels[32-x][32-y][32-z];
					break;
				}*/
			}
		}
	}
	
	console.log('Overhead rendering.');
	return pixels;
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
	var canvas = document.getElementById('nbRender');
	var ctx = canvas.getContext('2d');
	var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	for (var y = 0, yy = canvasData.height; y < yy; y++)  {
		for (var x = 0, xx = canvasData.width; x < xx; x++)  {
			
			var i = (x + y * canvasData.width) * 4;
			var r, g, b, a = 255;
			
			if (x < 32 && y < 32) {
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
	ctx.drawImage(sprite, offset.x, offset.y, 32, 32);
}
