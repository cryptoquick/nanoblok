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

function overhead (field) {
	var voxels = expand(field);
	var pixels = [];
	
	for (var x = 0; x < 32; x++) {
		pixels.push(new Array());
		for (var y = 0; y < 32; y++) {
			pixels[x][y] = {r: 255, g: 255, b: 255};
			for (var z = 0; z < 32; z++) {
				if (voxels[x] != null && voxels[x][y] != null && voxels[x][y][z] != null) {
				//	console.log(pixels
					
				/*	var color = {
						r: SwatchField[example1[0]][3].r,
						g: SwatchField[example1[1]][3].g,
						b: SwatchField[example1[2]][3].b
					}*/
				
					pixels[x][y] = voxels[x][y][z];
					break;
				}
			}
		}
	}
	
	console.log('Overhead rendering.');
	rectRender(pixels);
}

// Pixel Width
var pX = 6;
var pY = 6;
var dbg0 = 0;
var dbg1 = 1;

function rectRender(pixArr) {
	var canvas = document.getElementById('nbRender');
	var ctx = canvas.getContext('2d');
	
	for (var x = 0; x < Math.floor(canvas.width / pX); x++) {
		for (var y = 0; y < Math.floor(canvas.height / pY); y++) {
		//	var xx = x % 32;
		//	var yy = y % 32;
		
			if (x < 32 && y < 32) {
			/*	ctx.fillStyle = "rgb(" +
					SwatchField[Swatch[x][y][0]][3].r + "," +
					SwatchField[Swatch[x][y][0]][3].g + "," +
					SwatchField[Swatch[x][y][0]][3].b + ")";*/
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

function pixelRender () {
	var canvas = document.getElementById('nbRender');
	var ctx = canvas.getContext('2d');
	var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var i = 0;
	for (var y = 0, yyy = Math.floor(canvasData.height / pY); y < yyy; y += pY)  {
		var line = [];
		for (var x = 0, xxx = Math.floor(canvasData.width / pX); x < xxx; x += pX)  {
			var xx = x % 32;
			var yy = y % 32;
			
		//	var i = (x + y * canvasData.width) * 4;
			var r = 0;
			var g = 0;
			var b = 0;
			var a = 255;
			
			if (xx < 32 && yy < 32) {
				r = SwatchField[Swatch[xx][yy][0]][3].r;
				g = SwatchField[Swatch[xx][yy][0]][3].g;
				b = SwatchField[Swatch[xx][yy][0]][3].b;
			}
			
		//	i -= canvasData.width * 4;
			
	//		if (x < 480 && y < 320) {
			//	var i = (x + y * canvasData.width) * 4;
			//	if (x % pY) {
			for (var j = 0, jj = pX; j < jj; j++) {
				i = (x + (y * (canvasData.width * pY))) * 4;
				
				canvasData.data[i + 0] = r;
				canvasData.data[i + 1] = g;
				canvasData.data[i + 2] = b;
				canvasData.data[i + 3] = a;
			//	i += 4;
				
				dbg0++;
				line.push(r, g, b, a);
			}
			//	}
			/*	else {
					for (var k = 0, kk = pY; k < kk; k++) {
						canvasData.data[i + 0] = canvasData.data[i - (x % 2) * canvasData.width];
						canvasData.data[i + 1] = canvasData.data[i - (x % 2) * canvasData.width];;
						canvasData.data[i + 2] = canvasData.data[i - (x % 2) * canvasData.width];;
						canvasData.data[i + 3] = canvasData.data[i - (x % 2) * canvasData.width];;
						dbg1++;
					}
				//	i += canvasData.width * 4;
				//	i = (x + y * canvasData.width) * 4;
				}*/
		//	}
		}
		
		if (y % pY != 0) {
			for (var l = 0, ll = canvasData.width * pY; l < ll; l++) {
				i = x * pX + (pY - y % pY);
				
				canvasData.data[i + 0] = line[l];
				canvasData.data[i + 1] = line[l + 1];
				canvasData.data[i + 2] = line[l + 2];
				canvasData.data[i + 3] = line[l + 3];
				
				dbg1++;
			}
		}
		console.log(line.length);
	}
	
	ctx.putImageData(canvasData, 0, 0);
	console.log(dbg0 + ', ' + dbg1);
}
