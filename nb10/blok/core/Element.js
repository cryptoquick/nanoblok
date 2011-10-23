BLOK.Element = function (type, id) {
	this.element = document.createElement(type);
	this.set("id", id);
	
	return this;
};

BLOK.Element.prototype = {
	constructor: BLOK.Element,
	
	element: {},
	
	set: function (name, attribute) {
		this.element.setAttribute(name, attribute);
		
		return this;
	},
	
	style: function (name, val) {
		this.element.style[name] = val;
		
		return this;
	},
	
	get: function (name) {
		var attribute = this.element.getAttribute(name);
		
		return attribute;
	},
	
	add: function (target) {
		this.element.appendChild(target.element);
		
		return this;
	},
	
	remove: function (target) {
		this.element.removeChild(target.element);
		
		return this;
	},
	
	put: function (target) {
		if (target.element)
			target.element.appendChild(this.element);
		else
			target.appendChild(this.element);
		
		return this;
	}
};
