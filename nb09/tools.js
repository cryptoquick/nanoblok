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
		console.log("Key pressed: " + evt.keyCode);
	}
}

function Reset () {
	$C.scene.yaw = 225.0; $C.scene.pitch = 26.565;
	$C.scene.rotate(225.0, -26.565, 0.0);
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
		
		SceneJS.createNode({
			type: "scale",
			id: "cubeColor",
			x: 4.0,
			y: 4.0,
			z: 4.0,
			nodes: [{
				type: "texture",
				layers: [{
					uri: "grid128.png",
					minFilter: "linear",
					magFilter: "linear",
					wrapS: "repeat",
					wrapT: "repeat",
					isDepth: false,
					depthMode:"luminance",
					depthCompareMode: "compareRToTexture",
					depthCompareFunc: "lequal",
					flipY: false,
					width: 1,
					height: 1,
					internalFormat:"lequal",
					sourceFormat:"alpha",
					sourceType: "unsignedByte",
					applyTo:"baseColor",
					blendMode: "multiply"
				}],
				nodes: [{
					type: "cube"
				}]
			}]
		})
		
		if (!this.showing) {
			for (var x = -s4; x < s4; x++) {
				for (var y = -s4; y < s4; y++) {
					for (var z = -s4; z < s4; z++) {
						var colorID = "color" + (1024 * x + 32 * y + z);
						
						SceneJS.createNode({
							type: "material",
							id: colorID,
							baseColor: this.colors[x+s4][y+s4][z+s4],
							nodes: [{
								type: "translate",
								x: x * s + 3.0,
								y: (s4 - y) * s - 4.0 + $C.grid.offsY,
								z: z * s + 3.0,
								nodes: [{
									type: "instance",
									target: "cubeColor"
								}]
							}]
						});
						
						SceneJS.withNode("cubeRoot").add("nodes", [{
							type: "instance",
							target: colorID
						}]);
					}
				}
			}
			
			
			
		//	$C.scene.addCube(this.array);
			
			// An experiment. Didn't work, used the message-based implementation above.
	/*		var r = 0.0;
			var g = 0.0;
			var b = 0.0;
			
			
			SceneJS.withNode("cubeRoot").eachNode(function () {
				console.log(this.node(0).get("type"));
				if (this.node(0).get("type") == material") {
					this.node(0).set({baseColor: {r: r, g: g, b: b}});
					
					// Calculate color similar to a 3D color cube loop
					r += 0.12;
					if (r >= 0.96) {
						r = 0.0;
						g += 0.12;
						if (g >= 0.96) {
							g = 0.0;
							b += 0.12;
							if (b >= 0.96) {
								b = 0.0;
							}
						}
					}
				//	console.log(r + ", " + g + ", " + b)
				}
			})*/
			
			this.showing = true;
			
			Resize();
		}
		else {
			$C.scene.clearCube();
			this.showing = false;
		}
	}
}