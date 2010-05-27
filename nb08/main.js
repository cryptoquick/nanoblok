//var windowSize = new Object();

window.addEventListener('load', function () {
	Initialize();
}, false);

// Single function so console.logs can be easily disabled for production.
function debug (dbg) {
	console.log(dbg);
}

var Window = function () {
	this.size = null;
	this.resizeID = null;
	this.grid = null;

	this.addEvents = function (grid) {
		this.grid = grid;
		// window.addEvent('resize', this.resize());
	}
	
	this.resize = function () {
		// window.clearTimeout(this.resizeID);
		// this.resizeID = window.setTimeout(
			this.grid.resize()
		// , 25);
	}
}

var El = function (type) {
	var ns = 'http://www.w3.org/2000/svg';
	this.el = document.createElementNS(ns, type);
	
	this.set = function (name, attr) {
		this.el.setAttributeNS(null, name, attr);
	}
	
	this.get = function (el, name) {
		var attr = this.el.getAttributeNS(null, name);
		return attr;
	}
	
	this.add = function (targ) {
		this.el.appendChild(targ.el);
	}
	
	this.remove = function (targ) {
		this.el.removeChild(targ.el);
	}
	
	this.setEl = function (docId) {
		this.el = document.getElementById(docId);
		console.log(this.el);
	}
}

var Grid = function () {
	this.initialize = function () {
		
	}
	
	this.resize = function () {
		
	}
}

var Data = function () {
	var dimension = 32;
	
	this.size = {
		full: dimension,
		half: dimension / 2,
		third: dimension / 2 + dimension / 4,
		quarter: dimension / 4
	};
	
	this.hex = [
		{x: this.size.half, y: 0},
		{x: this.size.full, y: this.size.quarter},
		{x: this.size.full, y: this.size.third},
		{x: this.size.half, y: this.size.full},
		{x: 0, y: this.size.third},
		{x: 0, y: this.size.quarter},
		{x: this.size.half, y: this.size.half}
	];
	
	this.defaultPalette = {
		red:	[164, 0,   0],
		orange:	[211, 127, 4],
		yellow:	[213, 184, 8],
		green:	[42,  197, 18],
		blue:	[43,  84,  200],
		purple:	[147, 29,  199],
		pink:	[190, 67,  180],
		white:	[201, 202, 188],
		black:	[55,  48,  51],
		white:	[238, 238, 236]
	};
}

number = 0;

var Blok = function () {	
	this.makePath = function (side) {
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
	}
	
	var sides = ['top', 'left', 'right'];
	this.sides = {top: null, left: null, right: null};
	this.offset = {x: 0, y: 0};
	this.color = "red";
	this.element = new El('g');
	this.element.set('id', 'block' + number);
	number++;
	
	this.makeColor = function (it) {
		var col = data.defaultPalette[this.color];
		var rgb = 'rgb(' + (col[0] + 20 * it) + ', ' + (col[1] + 20 * it) + ', ' + (col[2] + 20 * it) + ')';
		return rgb;
	}
	
	for (var i = 0; i < 3; i++) {
		var el = this.sides[sides[i]]
		el = new El('path');
		el.set('id', sides[i]);
		el.set('fill', this.makeColor(i));
		el.set('d', this.makePath(sides[i]));
		this.element.add(el);
	}
	
	this.updateSides = function () {
		
	}
}

var data = null;
var doc = null;

function Initialize() {
	data = new Data();
	editorWindow = new Window();
	// grid = new Grid;
	var blok = new Blok();
	var main = new El('g');
	main.setEl('main');
	main.add(blok.element);
}