var Key = function () {
	this.press = function (evt) {
		// Shift-R for Reset
		if (evt.charCode == 82 && evt.shiftKey) {
			Reset();
		}
		// Up / Down for Slice
		
		// CKEY for Color Cube
		if (evt.charCode == 99 || evt.charCode == 67) {
			var t0 = new Date();
			$C.colors.toggle();
			var t1 = new Date();
			console.log("Color cube took " + (t1 - t0) + " ms to render.")
		}
		// EKEY for Example Models
		if (evt.charCode == 101 || evt.charCode == 69) {
			$C.examples.selectNext();
			$C.ui.resize();
		}
		// QKEY for to Clear all blocks
		if (evt.charCode == 113) {
			$C.scene.clearBlocks();
		}
		
		// Escape key for pause.
		if (evt.charCode == 96) {
			var pauseDiv = document.getElementById('paused');
			
			pauseDiv.style.left = $C.ui.window.width / 2 - 100;
			pauseDiv.style.top = $C.ui.window.width / 2 - 20;
			
			if ($C.state.paused) {
				$C.scene.start();
				
				pauseDiv.style.visibility = 'hidden';
				$C.state.paused = false;
				console.log("Continuing.");
			}
			else {
				$C.scene.stop();
				
				pauseDiv.style.visibility = 'visible';
				$C.state.paused = true;
				console.log("Paused!");
			}
		}
		console.log("Key pressed: " + evt.charCode);
	}
}

function Reset () {
	$C.scene.yaw = 225.0; $C.scene.pitch = 26.565;
	$C.scene.rotate(225.0, -26.565, 0.0);
	$C.ui.resize();
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
		
		this.cube();
	}
	
	this.cube = function () {
		var s = 4.0;
		var s4 = Math.floor($C.grid.dims.cols / 4);
		
		SceneJS.createNode({
			type: "scale",
			id: "cubeColor",
			x: 2.0,
			y: 2.0,
			z: 2.0,
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
		
		// Instantiate each individual cube in the color cube.
		for (var x = -s4; x < s4; x++) {
			for (var y = -s4; y < s4; y++) {
				for (var z = -s4; z < s4; z++) {
					var colorIndex = 1024 * (x * 2 + 1) + 32 * (y * 2 + 1) + (z * 2 + 1) + 15855;
					
					SceneJS.createNode({
						type: "material",
						id: "color" + colorIndex,
						baseColor: $C.examples.swatch[colorIndex],
						nodes: [{
							type: "translate",
							x: -x * s,
							y: y * s,
							z: z * s,
							nodes: [{
								type: "instance",
								target: "cubeColor"
							}]
						}]
					});
					
					SceneJS.withNode("cubeRoot").add("nodes", [{
						type: "instance",
						target: "color" + colorIndex
					}]);
				}
			}
		}
	}
		
	this.toggle = function () {
		if (!this.showing) {
			$C.state.showColors(true);
			$C.state.showGrid(false);
			$C.state.showExamples(false);
			$C.state.showBlocks(false);
			this.showing = true;
		}
		else {
			$C.state.showColors(false);
			$C.state.showGrid(true);
			$C.state.showExamples(false);
			$C.state.showBlocks(true);
			this.showing = false;
			Reset();
		}
	}
}