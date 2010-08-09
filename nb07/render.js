var Renderer = function () {
	this.canvas = document.getElementById('renderer');
	
/*	this.test = function () {
		var ctx = context('grids');
		ctx.fillStyle = 'orange';
		ctx.fillRect(0,0,3,3);
		var img = ctx.getImageData(0, 0, 3, 3);
		console.log(img);
	}*/
	
	this.render = function () {
		var color = new Object();
		
		for (var y = 0; y < 32; y++) {
			for (var x = 0; x < 32; x++) {
				color = SwatchField[Field[y * 32 + x][3]][3];
			}
		}
	}
}

