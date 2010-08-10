var Renderer = function () {
	this.canvas = document.getElementById('renderer');
	this.ctx = context('renderer');
	
	this.test = function () {
		var ctx = context('grids');
		ctx.fillStyle = 'orange';
		ctx.fillRect(0,0,3,3);
		var img = ctx.getImageData(0, 0, 3, 3);
		console.log(img);
	}
	
	this.render = function () {
		this.clear();
		
		var color = {r: 255, g: 255, b: 255};
		var img = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		var index = 0;
		
		for (var y = 0; y < 64; y++) {
			for (var x = 0; x < 64; x++) {
				for (var z = 0; z < 32; z++) {
					if (Voxel[Math.floor(x / 2)][Math.floor(y / 2)][z] != -1) {
						color = SwatchField[Field[Voxel[Math.floor(x / 2)][Math.floor(y / 2)][z]][3]][3];
						console.log(color);
					}
				}
				
				index = (x + y * 64) * 4;
				
				img.data[index + 0] = color.r;
				img.data[index + 1] = color.g;
				img.data[index + 2] = color.b;
				img.data[index + 3] = 255;
				
				color = {r: 255, g: 255, b: 255};
			}
		}
		
		this.ctx.putImageData(img, 0, 0);
	}
	
	this.clear = function () {
		this.ctx.clearRect(0, 0, 64, 64);
	}
}

