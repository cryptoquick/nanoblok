var UI = function () {
	this.window = {};
	this.canvas;
	this.toolbar;
	
	this.init = function () {
		this.window = {width: window.innerWidth, height: window.innerHeight};
		this.canvas = document.getElementById("nanoCanvas");
		this.toolbar = new Toolbar();
		this.toolbar.init();
	}
	
	// This can implement 2xAA by rendering to a 2x larger canvas, then scale it down with styles.
	this.resize = function () {
		if ($C.AA) {
			this.canvas.setAttribute("height", $C.ui.window.height * 2);
			this.canvas.setAttribute("width", $C.ui.window.width * 2);
			this.canvas.style.height = $C.ui.window.height;
			this.canvas.style.width = $C.ui.window.width;
		}
		else {
			this.canvas.setAttribute("height", $C.ui.window.height);
			this.canvas.setAttribute("width", $C.ui.window.width);
		}

		$C.scene.camera($C.ui.window.width, $C.ui.window.width);
		$C.scene.render();
	}
}

var Toolbar = function () {
	this.element;
	this.width = 300;
	this.height = 100;
	
	this.init = function () {
		this.element = document.getElementById("toolbar");
		this.element.style.left = ($C.ui.window.width - this.width - 40) + "px";
		this.element.style.top = "100px";
	}
}

var Button = function () {
	
}