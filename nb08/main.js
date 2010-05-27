var ns = 'http://www.w3.org/TR/SVG';
var windowSize = new Object();

window.addEventListener('load', function () {
	Initialize();
}, false);

// Single function so console.logs can be easily disabled for production.
function debug (str) {
	console.log(str);
}

var Window = Class.extend({
	size: null,
	resizeID: null,
	grid: null,
	
	init: function () {
		// size = window.getSize();
	},
	
	addEvents: function (grid) {
		this.grid = grid;
		// window.addEvent('resize', this.resize());
	},
	
	resize: function () {
		// window.clearTimeout(this.resizeID);
		// this.resizeID = window.setTimeout(
			this.grid.resize()
		// , 25);
	}
});

var El = Class.extend({
	el: null,
	svgNS: "http://www.w3.org/2000/svg",
	
	init: function (type) {
		// var bla = document.getElementById('main');
		this.el = document.createElementNS(this.svgNS, type);
		// bla.appendChild(this.el);
	},
	
	set: function (name, attr) {
		this.el.setAttributeNS(null, name, attr);
//		return this.el;
	},
	
	get: function (el, name) {
		var attr = this.el.getAttributeNS(null, name);
		return attr;
	},
	
	add: function (targEl) {
		targEl.el.appendChild(this.el);
	},
	
	remove: function (targEl) {
		targEl.el.removeChild(this.el);
	},
	
	setEl: function (docId) {
		this.el = document.getElementById(docId);
	}
});

var Grid = Class.extend({
	initialize: function () {
		
	},
	
	resize: function () {
		console.log('Window has been resized.');
	}
});

var Data = Class.extend({
	size: null,
	hex: null,
	
	init: function () {
		this.setSize();
		this.setHex();
	},
	
	setSize: function () {
		var dimension = 32;
		
		this.size = {
			full: dimension,
			half: dimension / 2,
			third: dimension / 2 + dimension / 4,
			quarter: dimension / 4
		}
	},
	
	setHex: function () {
		this.hex = [
			{x: this.size.half, y: 0},
			{x: this.size.full, y: this.size.quarter},
			{x: this.size.full, y: this.size.third},
			{x: this.size.half, y: this.size.full},
			{x: 0, y: this.size.third},
			{x: 0, y: this.size.quarter},
			{x: this.size.half, y: this.size.half}
		]
	}
});

var Blok = Class.extend({
	element: null,
	sides: {top: null, left: null, right: null},
	offset: {x: 0, y: 0},
	color: 'red',
	
	init: function () {
		this.sides.top = new El('path');
		this.sides.left = new El('path');
		this.sides.right = new El('path');
		
		this.sides.top.set('id', 'top');
		this.sides.left.set('id', 'left');
		this.sides.right.set('id', 'right');
		
		this.sides.top.set('d', this.makePath('top'));
		this.sides.left.set('d', this.makePath('left'));
		this.sides.right.set('d', this.makePath('right'));
		
		this.element = new El('g');
		this.element.add(this.sides.top);
		this.element.add(this.sides.left);
		this.element.add(this.sides.right);
	},
	
	makePath: function (side) {
		var points = null;
		
		if (side == 'top') {
			points = {a: 0, b: 5, c: 6, d: 1};
		}
		if (side == 'left') {
			points = {a: 5, b: 6, c: 3, d: 4};
		}
		if (side == 'right') {
			points = {a: 1, b: 6, c: 3, d: 2};
		}
		
		var str = 'M' + 
		(data.hex[points.a].x + this.offset.x) + ' ' + (data.hex[points.a].y + this.offset.y) + 'L' +
		(data.hex[points.b].x + this.offset.x) + ' ' + (data.hex[points.b].y + this.offset.y) + 'L' +
		(data.hex[points.c].x + this.offset.x) + ' ' + (data.hex[points.c].y + this.offset.y) + 'L' +
		(data.hex[points.d].x + this.offset.x) + ' ' + (data.hex[points.d].y + this.offset.y) + 'z'
		
		return str;
	},
	
	updateSides: function () {
		
	}
});

var data = null;
var doc = null;

function Initialize() {
	// var bla = new El('g');
	// bla.set('id', 'bla');
	// document.getElementById('main').appendChild(bla.el);
	
	
	data = new Data();
	editorWindow = new Window;
	// grid = new Grid;
	var blok = new Blok();
		
	var main = new El('g');
	main.setEl('main');
	main.add(blok.element);
	
	// editorWindow.addEvents(grid);
}