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
		for (var py = 0; py < 32; py++) {
			pixels[px][py] = {r: 255, g: 255, b: 255};
		}
	}
	
	var x = 32; while (x--) {
		var y = 32; while (y--) {
			var z = 32; while (z--) {
				if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
					pixels[x][y] = voxels[x][y][z];
					break;
				}
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
}pixels[x][y] = {r: 255, g: 255, b: 255};
