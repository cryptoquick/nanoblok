var Key = function () {
	this.ex = 0;
	
	this.press = function (evt) {
		// Shift-R for Reset
		if (evt.keyCode == 82 && evt.shiftKey) {
			Reset();
		}
		// Up / Down for Slice
		
		// CKEY for Color Cube
		if (evt.keyCode == 99) {
			var t0 = new Date();
			$C.colors.cube();
			var t1 = new Date();
			console.log("Color cube took " + (t1 - t0) + " ms to render.")
		}
		// EKEY for Example Models
		if (evt.keyCode == 101) {
			$C.scene.clearBlocks();
			drawExample(JSON.parse(Examples[$C.key.ex]));
			
			if ($C.key.ex < Examples.length) {
				$C.key.ex++;
			}
			else {
				$C.key.ex = 0;
			}
			
			Resize();
		}
		// QKEY for to Clear all blocks
		if (evt.keyCode == 113) {
			$C.scene.clearBlocks();
		}
		console.log(evt.keyCode);
	}
}

function Reset () {
	$C.scene.yaw = 45.0; $C.scene.pitch = 26.565;
	$C.scene.rotate(45.0, -26.565, 0.0);
	Resize();
}

var Colors = function () {
	this.colors = [];
	this.array = [];
	this.showing = false;
	
	this.init = function () {
		for (var z = 0; z < $C.grid.dims.cols; z++) {
			this.colors[z] = new Array();
			for (var y = 0; y < $C.grid.dims.rows; y++) {
			this.colors[z][y] = new Array();
				for (var x = $C.grid.dims.height; x >= 0; x--) {
					color = {
						r: z * 0.12,
						g: 0.96 - y * 0.12,
						b: 0.96 - x * 0.12
					};
					
					this.colors[z][y][x] = color;
				}
			}
		}
	}
	
	this.cube = function () {
		var s = 8.0;
		var s4 = Math.floor($C.grid.dims.cols / 8);
		
		if (!this.showing) {
			for (var x = -s4; x < s4; x++) {
				for (var y = -s4; y < s4; y++) {
					for (var z = -s4; z < s4; z++) {
						var blok = new Block("color" + (1024 * x + 32 * y + z), "block");
						
						blok.make(
							this.colors[x+s4][y+s4][z+s4], // Color
							{x: 1.0, y: 1.0, z: 1.0}, // Position
							{x: 1.0, y: 1.0, z: 1.0},  // Size
							{x: 4.0, y: 4.0, z: 4.0} // Scale
						);
						
						this.array.push(blok.instance({x: x * s + 3.0, y: (s4 - y) * s - 4.0 + $C.grid.offsY, z: z * s + 3.0}));
					}
				}
			}
			
			$C.scene.addBlock(this.array);
			
			this.showing = true;
			
			Resize();
		}
		else {
			$C.scene.clearBlocks();
			this.showing = false;
		}
	}
}