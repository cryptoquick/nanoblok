var ns = 'http://www.w3.org/TR/SVG';
var windowSize = new Object();

window.addEventListener('load', function () {
	Initialize();
}, false);

// Single function so console.logs can be easily disabled for production.
function debug (str) {
	console.log(str);
}

var Window = new Class({
	resizeID: null,
	grid: null,
	
	addEvents: function (grid) {
		this.grid = grid;
		window.addEvent('resize', this.resize());
	},
	
	resize: function () {
		// window.clearTimeout(this.resizeID);
		// this.resizeID = window.setTimeout(
			this.grid.resize()
		// , 25);
	}
});

var Grid = new Class({
	initialize: function () {
		
	},
	
	resize: function () {
		console.log('Window has been resized.');
	}
});

var Data = new Class({
	size: null,
	hex: null,
	
	initialize: function () {
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

var Blok = new Class({
	element: null,
	sides: {top: null, left: null, right: null},
	offset: {x: 0, y: 0},
	color: 'red',
	
	initialize: function () {
		this.sides.top = new Element('path', {
			'id': 'top',
			'd': this.makePath('top')
		});
		this.sides.left = new Element('path', {
			'id': 'left',
			'd': this.makePath('left')
		});
		this.sides.right = new Element('path', {
			'id': 'right',
			'd': this.makePath('right')
		});
		
		this.element = new Element('g');
		this.element.inject(this.sides.top);
		this.element.inject(this.sides.left);
		this.element.inject(this.sides.right);
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

function Initialize() {
	data = new Data;
	// editorWindow = new Window;
	// grid = new Grid;
	blok = new Blok;
	$('grid').inject(blok.element, 'top');
	
	// editorWindow.addEvents(grid);
}