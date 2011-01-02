function Init () {
	// Common Data object.
	window.$C = new Data();
	
	// Make main scene.
	$C.scene = new Scene();
	$C.scene.init();
	$C.scene.render();
	
	// Mouse object.
	$C.mouse = new Mouse();
	
	// Initial resize.
	Resize();
	
	// Add event listeners.
	window.addEventListener('resize', Resize, false);
	window.addEventListener('mousedown', $C.mouse.down, true);
	window.addEventListener('mouseup', $C.mouse.up, true);
	window.addEventListener('mousemove', $C.mouse.move, true);
}

function Resize () {
	var canvasElement = document.getElementById("nanoCanvas");
	canvasElement.setAttribute("height", window.innerHeight);
	canvasElement.setAttribute("width", window.innerWidth);
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
			$C.scene.yaw += (evt.clientX - this.last.x) * 0.5;
			$C.scene.pitch += (evt.clientY - this.last.y) * 0.5;

			SceneJS.withNode("yaw").set("angle", $C.scene.yaw);
			SceneJS.withNode("pitch").set("angle", $C.scene.pitch);
			SceneJS.withNode("roll").set("angle", $C.scene.pitch);
			
			this.last.x = evt.clientX;
			this.last.y = evt.clientY;
			
			$C.scene.render();
		}
	}
}

var Scene = function () {
	this.yaw = 0.0;
	this.pitch = 0.0;
	
	this.init = function () {
		SceneJS.createNode({
			type: "scene",
			id: "mainScene",
			canvasId: "nanoCanvas",

			nodes: [{
				type: "lookAt",
				eye: {x: 0.0, y: 0.0, z: -10.0},
				look: {x: 0.0, y: 0.0, z: 0.0},
				up: {x: 0.0, y: 1.0, z: 0.0},

				nodes: [{
					type: "camera",
					optics: {
						type: "perspective",
						fovy: 45.0,
						aspect: window.innerWidth / window.innerHeight,
						near: 0.10,
						far: 300.0
					},

					nodes: [{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: true,
						dir: {x: 1.0, y: 1.0, z: -1.0}
					},
					{
						type: "material",
						baseColor: {r: 0.9, g: 0.9, b: 0.9},
						specularColor: {r: 0.9, g: 0.9, b: 0.9},
						specular: 0.9,
						shine: 0.0,
						
						nodes: [{
							type: "cube",
							xSize: 200,
							ySize: 200,
							zSize: 200,
							
							nodes: [{
								type: "material",
								baseColor: {r: 0.3, g: 0.3, b: 0.9},
								specularColor: {r: 0.9, g: 0.9, b: 0.9},
								specular: 0.9,
								shine: 6.0,
								
								nodes: [{
									type: "rotate",
									id: "pitch",
									angle: 0.0,
									x: 1.0,
									
									nodes: [{
										type: "rotate",
										id: "yaw",
										angle: 0.0,
										y: 1.0,
										
										nodes: [{
											type: "rotate",
											id: "roll",
											angle: 0.0,
											z: 1.0,
											
											nodes: [{
												type: "teapot"
											}]
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
		SceneJS.withNode("pitch").set
	}
	
	this.add = function (node, offset) {
		
	}
}
