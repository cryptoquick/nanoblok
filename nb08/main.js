//var windowSize = new Object();

window.addEventListener('load', function () {
	Initialize();
}, false);

// Single function so console.logs can be easily disabled for production.
function debug (dbg) {
	console.log(dbg);
}
/*
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
*/
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
	
	this.paths = {top: null, left: null, right: null};
	this.sides = ['top', 'left', 'right', 'bottom'];
	
	this.makePath = function (side) {
		var points = null;
		
		// Points from extras/block-grid.png, but decremented by one.
		if (side == 'top') {
			points = {a: 0, b: 5, c: 6, d: 1};
		}
		if (side == 'left') {
			points = {a: 5, b: 6, c: 3, d: 4};
		}
		if (side == 'right') {
			points = {a: 1, b: 6, c: 3, d: 2};
		}
		if (side == 'bottom') {
			points = {a: 6, b: 2, c: 3, d: 4};
		}
		
		var str = 'M' + 
		this.hex[points.a].x + ' ' + this.hex[points.a].y + 'L' +
		this.hex[points.b].x + ' ' + this.hex[points.b].y + 'L' +
		this.hex[points.c].x + ' ' + this.hex[points.c].y + 'L' +
		this.hex[points.d].x + ' ' + this.hex[points.d].y + 'z'
		
		return str;
	}
	
	for (var i = 0; i < 4; i++) {
		this.paths[this.sides[i]] = this.makePath(this.sides[i]);
	}
	
	this.cube = {x: 32, y: 32, z: 32};
	
	this.grid = {};
	this.grid.x = this.cube.x * this.size.full;
	this.grid.y = this.cube.y * this.size.half;
	
	this.coors = {x: 0, y: 0, z: 0};
}

var Voxel = function () {
	this.cube = new Array();
	this.grid = new Array();
	
	this.makeCube = function () {
		for (var z = 0; z < data.cube.z; z++) {
			this.cube[z] = new Array();
			for (var y = 0; y < data.cube.y; y++) {
				this.cube[z][y] = new Array();
				for (var x = 0; x < data.cube.x; x++) {
					this.cube[z][y][z] = null;
				}
			}
		}
	}
	
	this.makeGrid = function () {
		for (var y = 0; y < data.cube.y; y++) {
			this.grid[y] = new Array();
			for (var x = 0; x < data.cube.x; x++) {
				this.grid[y][x] = null;
			}
		}
	}
	
	this.makeCube();
	this.makeGrid();
}

var blokCount = 0;

var Blok = function (pos, visible) {
	this.sides = {top: null, left: null, right: null};
	this.visible = visible; // same format as sides
	this.pos = pos; // {x: 0, y: 0}
	this.color = "red";
	this.element = new El('g');
	this.element.set('id', 'block' + blokCount);
	blokCount++;
	
	this.makeColor = function (it) {
		var col = data.defaultPalette[this.color];
		var rgb = 'rgb(' + (col[0] + 20 * it) + ', ' + (col[1] + 20 * it) + ', ' + (col[2] + 20 * it) + ')';
		return rgb;
	}
	
	for (var i = 0; i < 3; i++) {
		this.sides[data.sides[i]] = new El('path');
		this.sides[data.sides[i]].set('id', data.sides[i]);
		this.sides[data.sides[i]].set('fill', this.makeColor(i));
		this.sides[data.sides[i]].set('d', data.paths[data.sides[i]]);
		
		// Display sides only if they're visible, while still keeping side data in the object.
		// if (this.visible[data.sides[i]]) {
			this.element.add(this.sides[data.sides[i]]);
		// }
	}
	/*
	this.updateSides = function (sidesVisible) {
		if (sidesVisible[data.sides[i]]) {
			if(!this.visible[data.sides[i]]) {
				this.element.add(this.sides[data.sides[i]]);
			}
		}
		else {
			this.element.remove(this.sides[data.sides[i]]);
		}
	} */
	
	this.updatePos = function (newPos) {
		this.element.set('transform', 'translate(' + newPos.x + ',' + newPos.y + ')');
		this.pos = newPos;
	}
	
	this.updatePos(this.pos);
}

var tileCount = 0;
var mouseDown = false;

window.addEventListener('mousedown', function (evt) {
	mouseDown = true;
}, false);

window.addEventListener('mouseup', function (evt) {
	mouseDown = false;
}, false);

var Tile = function (pos, coors, grid) {
	this.pos = null;
	this.coors = null;
	this.element = new El('path');
	this.element.set('id', 'tile' + tileCount);
	this.element.set('d', data.paths.bottom);
	tileCount++;
	
	this.updatePos = function (newPos, newCoors) {
		this.element.set('transform', 'translate(' + newPos.x + ',' + newPos.y + ')');
		this.pos = newPos;
		this.coors = newCoors;
	}
	
	this.updatePos(pos, coors);
	
	if (!grid) {
		// Add events using fancy closures.
		this.element.el.onmousedown = function (parent, coors){
			return function () {
				makeBlok(parent, coors);
			}
		}(this.element, this.coors);
		this.element.el.onmouseover = function (parent, coors){
			return function () {
				hover(parent, coors);
			}
		}(this.element, this.coors);
	}

	this.highlightOn = function () {
		this.element.set('fill', '#ff0');
	}
	
	this.highlightOff = function () {
		this.element.set('fill', '');
	}
}

function makeBlok(parent, coors) {
	if (voxel.cube[data.coors.z][coors.y][coors.x] == null) {
		// Side Display Logic
		var sides = {top: true, left: true, right: true};
		
		var pos = parent.el.getCTM();
		var blok = new Blok({x: pos.e, y: pos.f}, sides);
		
		// y+1
		if (voxel.cube[data.coors.z][coors.y + 1][coors.x] != null) {
			// sides.right = false;
			document.getElementById('main').insertBefore(blok.element.el, voxel.cube[data.coors.z][coors.y + 1][coors.x].element.el);
		}
		// x-1
		else if (voxel.cube[data.coors.z][coors.y][coors.x - 1] != null) {
			// sides.left = false;
			document.getElementById('main').insertBefore(blok.element.el, voxel.cube[data.coors.z][coors.y][coors.x - 1].element.el);
		}
		else if (voxel.cube[data.coors.z][coors.y + 1][coors.x - 1]) {
			document.getElementById('main').insertBefore(blok.element.el, voxel.cube[data.coors.z][coors.y + 1][coors.x - 1].element.el);
		}
		else {
			document.getElementById('main').appendChild(blok.element.el);
		}
		
		voxel.cube[data.coors.z][coors.y][coors.x] = blok;
		debug('Blok placed at ' + coors.x + ', ' + coors.y + ', ' + data.coors.z);
	}
}

var lastHighlight = {x: 0, y: 0};

function hover(parent, coors) {
	if (mouseDown) {
		makeBlok(parent, coors);
	}
	
	voxel.grid[lastHighlight.y][lastHighlight.x].highlightOff();
	voxel.grid[coors.y][coors.x].highlightOn();
	lastHighlight = coors;
	
}

var Grid = function (style, grid) {
	this.grid = new El('g');
	this.grid.set('stroke', style.stroke);
	this.grid.set('fill', style.fill);
	this.grid.set('fill-opacity', style.opacity);
	
	for (var y = 0; y < data.cube.y; y++) {
		for (var x = 0; x < data.cube.x; x++) {
			var tile = new Tile({
					x: x * data.size.half + y * data.size.half,
					y: ((y * data.size.quarter) + (data.grid.y / 2 - x * data.size.quarter))
				},
				{x: x, y: y},
				grid
			);
			this.grid.add(tile.element);
			if (grid) {
				voxel.grid[y][x] = tile;
			}
		}
	}
	
	this.resize = function () {
		
	}
}

var data = null;
var doc = null;
var voxel = null;

function Initialize() {
	time0 = new Date();
	
	data = new Data();
	voxel = new Voxel();
//	editorWindow = new Window();
	
	inputEl = new Grid({stroke: 'none', fill: '#fff', opacity: '0.0'}, false);
	var input = new El('g');
	input.setEl('input');
	input.add(inputEl.grid);
	
	gridEl = new Grid({stroke: '#777', fill: '#ddd', opacity: '1.0'}, true);
	var grid = new El('g');
	grid.setEl('grid');
	grid.add(gridEl.grid);

	var main = new El('g');
	main.setEl('main');
	
	time1 = new Date();
	debug('Program started in ' + (time1 - time0) + 'ms.');
}
