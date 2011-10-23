BLOK.Event = function () {
	return this;
};

BLOK.Event.prototype = {
	constructor: BLOK.Event,
	
	event: {},
	element: {},
	
	set: function (name, el, f) {
		this.element = el;
		this.event = document.createEvent("HTMLEvents");
		this.event.initEvent(name, true, true);
	},
	
	trigger: function () {
		this.element.dispatchEvent(this.event);
	}
};

// Test for document.createEvent
