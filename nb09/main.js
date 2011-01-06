function Init () {
	// Common Data object.
	window.$C = new Data();
	
	// Initialize User Interface.
	$C.ui = new UI();
	$C.ui.init();
	
	// Make main scene.
	$C.scene = new Scene();
	$C.scene.init();
	
	// Create other key objects.
	$C.mouse = new Mouse();
	$C.key = new Key();
	$C.pick = new Pick();
	$C.state = new State();
	
	// Initialize Grid.
	$C.grid = new Grid();
	$C.grid.init(32, 32);
	
	// $C.ui.postInit();
	
	// Examples.
	$C.examples = new Examples();
	$C.examples.init();
	
	// Color Cube.
	$C.colors = new Colors();
	$C.colors.init();
	
	// Initial resize.
	$C.ui.resize();
	
	// Add event listeners.
	window.onresize = $C.ui.resize;
	window.onmousedown = $C.mouse.down;
	window.onmouseup = $C.mouse.up;
	window.onmousemove = $C.mouse.move;
	window.onmousewheel = $C.mouse.wheel;
	window.onkeypress = $C.key.press;
	
	// Trying to make it so WebGL-enabled users won't see this message. (Unsuccessful)
	document.getElementById("incompatible").innerHTML = "<br><br><br><br><br>Nanoblok requires a browser that supports WebGL.<br>See documentation for more details.";
	
	$C.initialized = true;
}

function Idle (scene) {
	// debugText = $C.ui.toolbar + "";
	if ($C.initialized) {
		// debugText = $C.ui.toolbar + "";
		// $C.ui.toolbar.move();
	}
}

var Mouse = function () {
	this.last = {x: null, y: null};
	this.dragging = false;
	this.clicked = false;
	
	this.down = function (evt) {
		this.last = {x: evt.clientX, y: evt.clientY};
		this.dragging = true;
		this.clicked = true;
		SceneJS.withNode("mainScene").pick(evt.clientX, evt.clientY);
	}
	
	this.up = function () {
		this.dragging = false;
		this.clicked = false;
	}
	
	this.move = function (evt) {
		if (this.dragging) {
			var yaw = (evt.clientX - this.last.x) * 0.5;
			var pitch = (evt.clientY - this.last.y) * 0.5;
			
			if (pitch + $C.scene.pitch > 0 && pitch + $C.scene.pitch < 90 && !$C.colors.showing) {
				$C.scene.yaw += yaw;
				$C.scene.pitch += pitch;
				$C.scene.rotate($C.scene.yaw, -$C.scene.pitch, 0.0);
			}
			else if ($C.colors.showing) {
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
		var scale = evt.wheelDelta * -0.00005;
		
		if (scale + $C.scene.scale > 0.01 && scale + $C.scene.scale < 0.10) {
			$C.scene.scale += scale;
			$C.ui.resize();
		}
	}
}

var Scene = function () {
	this.yaw = 225.0;
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
									angle: 225.0,
									y: 1.0,
									nodes: [{
										type: "rotate",
										id: "roll",
										angle: 0.0,
										z: 1.0,
										nodes: [{
											type: "selector",
											id: "root",
											selection: [0,1],
											nodes: [{
												type: "node",
												id: "gridRoot"
											},
											{
												type: "node",
												id: "blockRoot"
											},
											{
												type: "node",
												id: "cubeRoot"
											},
											{
												type: "selector",
												id: "exampleRoot",
												selection: [0]
											}]
										},
										{
											type: "node",
											id: "geom"
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		});
		
		// Renderer.
		this.start();
	}
	
	this.start = function () {
		SceneJS.withNode("mainScene").start({
			fps: 20,
			idleFunc: Idle
		});
	}
	
	this.stop = function () {
		
	}
	
	this.render = function () {
		SceneJS.withNode("mainScene").render();
	}
	
	this.rotate = function (rx, ry, rz) {
		SceneJS.withNode("yaw").set("angle", rx);
		SceneJS.withNode("pitch").set("angle", ry);
		SceneJS.withNode("roll").set("angle", rz);
	}
	
	this.addBlock = function (nodes) {
		SceneJS.withNode("blockRoot").add("nodes", nodes);
	}
	
	this.addGrid = function (nodes) {
		SceneJS.withNode("gridRoot").add("nodes", nodes);
	}
	
	this.addCube = function (nodes) {
		SceneJS.withNode("cubeRoot").add("nodes", nodes);
	}
	
	this.addExample = function (node, index) {
		SceneJS.withNode("exampleRoot").add("node", node);
		SceneJS.withNode("exampleRoot").set("selection", [index]);
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
	
	this.clearBlocks = function () {
	//	SceneJS.withNode("root").remove({nodes: ["blockRoot"]});
	//	SceneJS.withNode("root").add("node", {type: "node", id: "blockRoot"});
		SceneJS.withNode("blockRoot").eachNode(function () {
		//	var id = this.get("id");
			console.log(this.get("type"));
			if (this.get("type") == "translate") {
				this.remove({nodes: [this.get("id")]});
			}
		})
		$C.ui.resize();
	}
}
/*
var Block = function (name, type) {
	this.color = {};
	this.position = {};
	this.size = {x: 1.0, y: 1.0, z: 1.0};
	this.solid = true;
	this.node = {};
	this.name = name;
	this.scale = {x: 1.0, y: 1.0, z: 1.0};
	this.type = "";
	
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
		
		if (type == "block") {
			$C.scene.addBlock([this.node]);
		}
		else if (type == "grid") {
			$C.scene.addGrid([this.node]);
		}
		else if (type == "example") {
			$C.scene.addExample([this.node]);
		}
		else {
			console.log("No type supplied.");
		}
	}
	
	this.instance = function (location) {
		var instanceNode = {
			type: "translate",
			x: location.x,
			y: location.y,
			z: location.z,
			nodes: [{
				type: "material",
				baseColor: this.color,
				shine: 1.0,
				nodes: [{
					type: "instance",
					target: this.name
				}]
			}]
		}
		
		return instanceNode;
	}
}*/

var Block = function (blockID, uniqueID) {
	this.blockID = "" || blockID;
	this.uniqueID = "" || uniqueID;
	this.color = {};
	
	this.make = function () {
		if (this.blockID == "") {
			console.log ("Block ID not set.");
		}
		
		SceneJS.createNode({
			type: "texture",
			id: this.blockID,
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
		})
	}
	
	this.instance = function (color, position) {
		if (this.blockID == "") {
			console.log ("Block ID not set.");
		}
		
		if (this.uniqueID == "") {
			console.log ("Unique ID not set.");
		}
		
		this.color = color;
		this.position = position;
		
		SceneJS.createNode({
			type: "material",
			id: this.uniqueID,
			baseColor: this.color,
			nodes: [{
				type: "translate",
				x: this.position.x,
				y: this.position.y,
				z: this.position.z,
				nodes: [{
					type: "instance",
					target: this.blockID
				}]
			}]
		})
	}
	
	this.bind = function (callback) {
		var UID = this.uniqueID;
		SceneJS.withNode(UID).bind("picked", function (evt) {
			callback(UID);
		});
	}
}

var State = function () {
	this.grid = true;
	this.blocks = true;
	this.colors = false;
	this.examples = false;
	this.paused = false;
	
	this.showGrid = function (show) {
		this.grid = show;
		this.setSelection();
	}
	
	this.showBlocks = function (show) {
		this.blocks = show;
		this.setSelection();
	}
	
	this.showColors = function (show) {
		this.colors = show;
		this.setSelection();
	}
	
	this.showExamples = function (show) {
		this.examples = show;
		this.setSelection();
	}
	
	this.setSelection = function () {
		var displayed = [];
		
		if (this.grid) {
			displayed.push(0);
		}
		if (this.blocks) {
			displayed.push(1);
		}
		if (this.colors) {
			displayed.push(2);
		}
		if (this.examples) {
			displayed.push(3);
		}
		
		SceneJS.withNode("root").set("selection", displayed);
	}
}