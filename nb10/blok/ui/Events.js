BLOK.Events = function () {
	return this;
};

BLOK.Events.prototype = {
	constructor: BLOK.Events,
	
	resize: function (f) {
		resolution = new BLOK.Vector2(window.innerWidth, window.innerHeight);
		
		f(resolution);
	}
};
