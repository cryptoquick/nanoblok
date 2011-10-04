BLOK.Events = function () {
	window.onresize = this.resize;
	
	return this;
};

BLOK.Events.prototype = {
	constructor: BLOK.Events,
	
	// Takes a prototype and instantiates it. The prototype should contain UI elements.
	resize: function (f) {
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;
		
		return new f();
	}
};
