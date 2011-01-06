var UI = function () {
	this.window = {};
	this.canvas;
	this.toolbar;
	
	this.init = function () {
		this.window = {width: window.innerWidth, height: window.innerHeight};
		this.canvas = document.getElementById("nanoCanvas");
	}
	
	this.postInit = function () {
		this.toolbar = new Toolbar();
	//	this.toolbar.init();
	}
	
	// This can implement 2xAA by rendering to a 2x larger canvas, then scale it down with styles.
	this.resize = function () {
		$C.ui.window = {width: window.innerWidth, height: window.innerHeight};
		
		if ($C.AA) {
			$C.ui.canvas.setAttribute("height", $C.ui.window.height * 2);
			$C.ui.canvas.setAttribute("width", $C.ui.window.width * 2);
			$C.ui.canvas.style.height = $C.ui.window.height;
			$C.ui.canvas.style.width = $C.ui.window.width;
		}
		else {
			$C.ui.canvas.setAttribute("height", $C.ui.window.height);
			$C.ui.canvas.setAttribute("width", $C.ui.window.width);
		}

		$C.scene.camera($C.ui.window.width, $C.ui.window.width);
		$C.scene.render();
		console.log("Resized.");
	}
}

var Toolbar = function () {
	this.element;
	this.width = 300;
	this.height = 100;
	this.position = {x: 0, y: 0};
	this.query;
	
	this.init = function () {
		this.element = document.getElementById("toolbar");
		this.element.style.left = ($C.ui.window.width - this.width - 40) + "px";
		this.element.style.top = "100px";
	}
	
	this.move = function () {
		this.query = new SceneJS.utils.query.QueryNodePos({
		    canvasWidth : $C.ui.window.width,
		    canvasHeight : $C.ui.window.height
		});
		
		this.query.execute({
	        nodeId: "grid-0"
	    });
		
		var results = this.query.getResults();
		// console.log(results.canvasPos.x);
		this.element.style.left = results.canvasPos.x + "px";
		this.element.style.top = results.canvasPos.y + "px";
		
		// console.log(this.element.style.left);
	}
}

var Button = function () {
	
}

var Pick = function () {
	this.tile = function (UID) {
		console.log(UID);
	}
}