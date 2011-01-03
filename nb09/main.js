function Init () {
	// Common Data object.
	window.$C = new Data();
	
	// Make main scene.
	$C.scene = new Scene();
	$C.scene.init();
	$C.scene.render();
	
	// Test
	var blok = new Block("blok");
	blok.make({r: 0.9, g: 0.3, b: 0.9}, {x: 0.0, y: 0.0, z: 0.0});
	$C.scene.add([blok.instance({x: 0, y: 1.0, z: 0})]);
	
	// Initialize Grid.
	$C.grid = new Grid();
	$C.grid.init(32, 32);
	
	// Initial resize.
	Resize();
	
	// Mouse object.
	$C.mouse = new Mouse();
	$C.key = new Key();
	$C.colors = new Colors();
	
	// Add event listeners.
	window.onresize = Resize;
	window.onmousedown = $C.mouse.down;
	window.onmouseup = $C.mouse.up;
	window.onmousemove = $C.mouse.move;
	window.onmousewheel = $C.mouse.wheel;
	window.onkeypress = $C.key.press;
}

// This implements 2xAA by rendering to a 2x larger canvas, then scales it down with styles.
function Resize () {
	var canvasElement = document.getElementById("nanoCanvas");
	
	if ($C.AA) {
		canvasElement.setAttribute("height", window.innerHeight * 2);
		canvasElement.setAttribute("width", window.innerWidth * 2);
		canvasElement.style.height = window.innerHeight;
		canvasElement.style.width = window.innerWidth;
	}
	else {
		canvasElement.setAttribute("height", window.innerHeight);
		canvasElement.setAttribute("width", window.innerWidth);
	}
	
	$C.scene.camera(window.innerWidth, window.innerHeight);
	$C.scene.render();
}

var Mouse = function () {
	this.last = {x: null, y: null};
	this.dragging = false;
	this.clicked = false;
	
	this.down = function (evt) {
		this.last = {x: evt.clientX, y: evt.clientY};
		this.dragging = true;
		this.clicked = true;
	}
	
	this.up = function () {
		this.dragging = false;
		this.clicked = false;
	}
	
	this.move = function (evt) {
		if (this.dragging) {
			var yaw = (evt.clientX - this.last.x) * 0.5;
			var pitch = (evt.clientY - this.last.y) * 0.5;
			
			if (pitch + $C.scene.pitch > 0 && pitch + $C.scene.pitch < 90) {
				$C.scene.yaw += yaw;
				$C.scene.pitch += pitch;
				$C.scene.rotate($C.scene.yaw, -$C.scene.pitch, 0.0);
			}
			
			this.last.x = evt.clientX;
			this.last.y = evt.clientY;
			
			$C.scene.render();
		}
	}
	
	this.wheel = function (evt) {
		var scale = evt.wheelDelta * 0.00005;
		
		if (scale + $C.scene.scale > 0.01 && scale + $C.scene.scale < 0.10) {
			$C.scene.scale += scale;
			Resize();
		}
	}
}

var Scene = function () {
	this.yaw = 45.0;
	this.pitch = 26.565;
	this.scale = 0.05;
	
	this.init = function () {
		SceneJS.createNode({
			type: "scene",
			id: "mainScene",
			canvasId: "nanoCanvas",
			nodes: [{
				type: "lookAt",
				eye: {x: 0.0, y: 0.0, z: -100.0},
				look: {x: 0.0, y: 0.0, z: 0.0},
				up: {x: 0.0, y: 1.0, z: 0.0},
				nodes: [{
					type: "camera",
					id: "mainCamera",
					optics: {
						type: "ortho",
						left : -30.0,
						right : 30.0,
						bottom : -30.0,
						top : 30.0,
						near : 0.1,
						far : 1000.0
					},
					nodes: [{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: false,
						dir: {x: 1.0, y: 1.0, z: -1.0}
					},
					{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: false,
						dir: {x: -1.0, y: -1.0, z: -1.0}
					},
					{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: false,
						dir: {x: 1.0, y: 1.0, z: 1.0}
					},
					{
						type: "material",
						baseColor: {r: 0.9, g: 0.9, b: 0.9},
						nodes: [{
							type: "cube",
							xSize: 200,
							ySize: 200,
							zSize: 200,
							nodes: [{
								type: "rotate",
								id: "pitch",
								angle: -26.565,
								x: 1.0,
								nodes: [{
									type: "rotate",
									id: "yaw",
									angle: 45.0,
									y: 1.0,
									nodes: [{
										type: "rotate",
										id: "roll",
										angle: 0.0,
										z: 1.0,
										nodes: [{
											type: "node",
											id: "root"
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		});
	}
	
	this.render = function () {
		SceneJS.withNode("mainScene").render();
	}
	
	this.rotate = function (rx, ry, rz) {
		SceneJS.withNode("yaw").set("angle", rx);
		SceneJS.withNode("pitch").set("angle", ry);
		SceneJS.withNode("roll").set("angle", rz);
	}
	
	this.add = function (node) {
		SceneJS.withNode("root").add("nodes", node);
	}
	
	this.camera = function (width, height) {
		SceneJS.withNode("mainCamera").set("optics", {
			type: "ortho",
			left : -width * this.scale,
			right : width * this.scale,
			bottom : -height * this.scale,
			top : height * this.scale,
			near : 0.1,
			far : 1000.0
		});
	}
}

var Block = function (name) {
	this.color = {};
	this.position = {};
	this.size = {x: 1.0, y: 1.0, z: 1.0};
	this.solid = true;
	this.node = {};
	this.name = name;
	this.scale = {x: 1.0, y: 1.0, z: 1.0};
	
	this.make = function (color, position, size, scale) {
		if (this.position == {}) {
			console.log ("Block position not set.");
			return null;
		}
		
		if (this.color == {}) {
			console.log ("Color not set.");
			return null;
		}
		
		if (arguments.length == 2) {
			this.color = color;
			this.position = position;
		}
		
		if (arguments.length == 3) {
			this.color = color;
			this.position = position;
			this.size = size;
		}
		
		if (arguments.length == 4) {
			this.color = color;
			this.position = position;
			this.size = size;
			this.scale = scale;
		}
		
		// Build Node object.
		this.node = {
			type: "library",
			nodes: [{
				type: "translate",
				x: this.position.x,
				y: this.position.y,
				z: this.position.z,
				nodes: [{
					type: "node",
					id: this.name,
					nodes: [{
						type: "material",
						baseColor: this.color,
						specularColor: this.color,
						specular: 0.9,
						shine: 1.0,
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
								type: "scale",
								x: this.scale.x,
								y: this.scale.y,
								z: this.scale.z,
								nodes: [{
									type: "cube",
							        xSize: this.size.x,
							        ySize: this.size.y,
							        zSize: this.size.z,
							        solid: this.solid
								}]
							}]
						}]
					}]
				}]
			}]
		}
		
		$C.scene.add([this.node]);
	}
	
	this.instance = function (location) {
		var instanceNode = {
			type: "translate",
			x: location.x,
			y: location.y,
			z: location.z,
			nodes: [{
				type: "instance",
				target: this.name
			}]
		}
		
		return instanceNode;
	}
}