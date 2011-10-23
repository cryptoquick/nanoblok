NANO.Events = function () {
	return this;
};

NANO.Events.prototype = {
	constructor: NANO.Events,
	
	resize: function (f) {
		resolution = new BLOK.Vector2(window.innerWidth, window.innerHeight);
		
		f(resolution);
	}
};
