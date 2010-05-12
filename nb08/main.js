var ns = 'http://www.w3.org/TR/SVG';
var windowSize = new Object();

window.addEventListener('load', function () {
	Initialize();
}, false);

var displayElement;
var inputElement;
var bottomGrid;

/* Main Functions */
function Initialize () {
	displayElement = document.getElementById('display');
	inputElement = document.getElementById('input');
	
	bottomGrid = document.getElementById('bottomGrid');
	leftGrid = document.getElementById('leftGrid');
	rightGrid = document.getElementById('rightGrid');
	
	// windowSize = {x: window.innerWidth, y: window.innerHeight};
	windowSize = {x: document.documentElement.clientWidth + 10, y: document.documentElement.clientHeight - 4};

	var tileSize = 32;
	var gridSize = Math.ceil((windowSize.x / tileSize) * 2);
	
	// For testing.
	document.getElementById('grids').focus();
	document.getElementById('tiles').value = tileSize;
	document.getElementById('grids').value = gridSize;
	
	displayElement.width = windowSize.x;
	displayElement.height = windowSize.y;
	inputElement.setAttribute('width', windowSize.x);
	inputElement.setAttribute('height', windowSize.y);
	
	bottomGrid.width = windowSize.x * 2;
	bottomGrid.height = windowSize.y * 4;
	leftGrid.width = windowSize.x * 2;
	leftGrid.height = windowSize.y * 4;
	rightGrid.width = windowSize.x * 2;
	rightGrid.height = windowSize.y * 4;

	// drawGrid(bottomGrid, gridSize, tileSize, 'bottom');
	// displayCanvas(bottomGrid, gridSize, tileSize);
	drawGrid(leftGrid, gridSize, tileSize, 'left');
	displayCanvas(leftGrid, gridSize, tileSize);
}

// Returns a canvas context based on its element id.
function context(element) {
	var canvas;
	// Get the canvas element if a string is passed.
	if (element.constructor.name == 'String') {
		canvas = document.getElementById(element);
	}
	else if (element.constructor.name == 'HTMLCanvasElement') {
		canvas = element;
	}
	// Get its 2D context
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
	}
	return context;
}

// Can be put into a getCanvas method
function drawGrid (element, gridSize, tileSize, orientation) {
	ctx = context(element);
	
	// Reset canvas.
	element.width = element.width;
	ctx.clearRect(-10, -10, element.width, element.height);
	
	// ctx.fillStyle = "blue";
	// ctx.fillRect(0,0, element.width, element.height);
	
	// Colors
	var color = {
		top: '#5B87E9',
		left: '#3461C1',
		right: '#4874D5',
		stroke: '#4C78D9'
	};
	
	if (orientation == 'bottom') {
		ctx.translate(gridSize * tileSize / Math.sqrt(2), 0);
		ctx.scale(1, 0.5);
		ctx.rotate((45 * Math.PI) / 180);
	}
	else if (orientation == 'left') {
		// ctx.transform(1,0,((-45 * Math.PI) / 180),1, 0, 0);
		ctx.translate(gridSize * tileSize / Math.sqrt(2), 0);
		ctx.scale(0.5, 1);
		ctx.rotate((45 * Math.PI) / 180);
	}
	// ctx.translate(-((gridSize * tileSize) / 4 / Math.sqrt(2)), -(gridSize * tileSize));
	
	for (var x = 0; x < gridSize; x++) {
		for (var y = 0; y < gridSize; y++) {
			ctx.fillStyle = color.left;
			ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
			ctx.strokeStyle = color.stroke;
			ctx.lineWidth = '5px';
			ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
		}
	}
}

function buttonPressed (event) {
	if ((event.type == 'keypress' && event.keyCode == 13) || (event.type == 'click' && !(event.id == 'tiles' || event.id == 'grids'))) {
		var tileSize = parseInt(document.getElementById('tiles').value);
		var gridSize = parseInt(document.getElementById('grids').value);
			
		drawGrid(leftGrid, gridSize, tileSize, 'left');
		displayCanvas(leftGrid, gridSize, tileSize);
	}
}

function displayCanvas (element, gridSize, tileSize) {
	var offset = {
		x: windowSize.x / 2 - (gridSize * tileSize / Math.sqrt(2)),
		y: windowSize.y / 2 - (gridSize * tileSize * Math.sqrt(2)) / 4
	};
	
	display = context(displayElement);
	
	// Reset canvas.
	displayElement.width = displayElement.width;
	display.clearRect(-10, -10, windowSize.x, windowSize.y);
	
	display.drawImage(element, offset.x, offset.y);
}