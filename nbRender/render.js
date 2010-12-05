// Pixel Width
var pX = 2;
var pY = 2;
var dbg0 = 0;
var dbg1 = 1;

function RectRender() {
	var canvas = document.getElementById('nbRender');
	var ctx = canvas.getContext('2d');
	
	for (var x = 0; x < Math.floor(canvas.width / pX); x++) {
		for (var y = 0; y < Math.floor(canvas.height / pY); y++) {
			var xx = x % 32;
			var yy = y % 32;
			
			ctx.fillStyle = "rgb(" +
				SwatchField[Swatch[xx][yy][0]][3].r + "," +
				SwatchField[Swatch[xx][yy][0]][3].g + "," +
				SwatchField[Swatch[xx][yy][0]][3].b + ")";
			ctx.fillRect(x * pX, y * pY, pX, pY);
		}
	}
}

function PixelRender () {
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
