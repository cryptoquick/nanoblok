y: $M([
		[Math.cos(angle), 0, Math.sin(angle)],
		[0, 1, 0],
		[-Math.sin(angle), 0, Math.cos(angle)]
	])
	
	
rotation =
{x: $M([
		[1, 0, 0],
		[0, Math.cos(angle), -Math.sin(angle)],
		[0, Math.sin(angle), Math.sin(angle)],
	]),
 y: $M([
		[Math.cos(angle), -Math.sin(angle), 0],
		[Math.sin(angle), Math.cos(angle), 0],
		[0, 0, 1]
	])
};

rotation =
{x: $M([
		[1, 0, 0],
		[0, cos, -sin],
		[0, sin, cos],
	]),
 y: $M([
		[cos, 0, sin],
		[0, 1, 0],
		[-sin, 0, cos]
	])
};

rotation =
{x: $M([
		[cos, -sin],
		[sin, cos]
	]),
 y: $M([
		[cos, sin],
		[-sin, cos]
	])
};

,
[150, 200, 0],
[200, 150, 0]

var angle = 0;
var square = $M([
	[200, 200, 0],
	[200, 300, 0],
	[300, 300, 0],
	[300, 200, 0]
]);


var sq = new Array(4);

for (i = 0; i < 4; i++) {
	sq[i] = square.row(i + 1).x(rotation.x);
}


[200, 200],
[200, 300],
[300, 300],
[300, 200]



/*var rotation =
{x: $M([
		[cos, -sin],
		[sin, cos]
	]),
 y: $M([
		[cos, sin],
		[-sin, cos]
	])
}; */

translate = $M([
		[trans.x],
		[trans.y],
		[1],
		[1]
	]);
	
/* var square = $M([
	[200, 200],
	[200, 300],
	[300, 300],
	[300, 200]
]); */
var sq1 = $V([200, 200]);
var sq2 = $V([200, 300]);
var sq3 = $V([300, 300]);
var sq4 = $V([300, 200]);

//	var transform = rotation.x.x(rotation.y);
//	var transform = rotation.z.x(translation);
	
	
function rotateSquare (direction, nano) {	
	if (direction == 'left') {
	//	angle-= 0.5;
		angle++;
	} else if (direction == 'right') {
	//	angle+= 0.5;
		angle--;
	}
}


// Function not being used right now, but might be useful later.
function testInput() {
	window.addEventListener("keydown", function(evt) {
		// Input Handling
		if (evt.type == "keydown") {
			// Some browsers support evt.charCode, some only evt.keyCode
			if (evt.charCode) {
				charCode = evt.charCode;
			}
			else {
				charCode = evt.keyCode;
			}
		}
		// Right arrow key
		if (charCode == 37) {
			rotateSquare('right', nano);
		}
		// Left arrow key
		if (charCode == 39) {
			rotateSquare('left', nano);
		}
	}, false);
}

//	return matrix.x(rotation[axis]);
//	return rotation[axis].x(matrix);	
	
/*	if (axis == 'x'){
		return matrix.x(rotation.x);
	} else if (axis == 'y'){
		return matrix.x(rotation.y);
	} else if (axis == 'z'){
		return matrix.x(rotation.z);
	} */
	
	
function buildGrid (grid, nano) {
/*	var sz = {
		full: size,
		half: size / 2,
		quarter: size / 4,
		three: size / 2 + size / 4
	} */

	sz = {full: 50, half: 40, quarter: 20, three: 37.5};

	var dim = {
		w: grid.c * sz.full,
		h: grid.c * sz.full / 2
	}

	for (x = 0; x < grid.c; x++) {
		for (y = 0; y < grid.r; y++) {
			var tile = {
				x: (x * sz.half) + (y * sz.half),
				y: (y * sz.quarter) + (dim.h - x * sz.quarter)
			};

		//	var num = nano.text(gridX + sc2, gridY + sc3, x + ", " + y); // TEMP

			var gridElement = buildSquare(size, 'z', angle, scale, {x: tile.x, y: tile.y}, nano);
/*
			gridElement.attr({stroke: "#777", fill: "#DDD"})

			gridElement.click(function () {		// Not sure if this piece of code needs less OOP. Based on a Raphael example. REVIEW
				blok = placeBlok(gridX, gridY, nano);
			}).mouseover(function () {
				this.animate({fill: "#fcaf3e"}, 0);
			}).mouseout(function () {
				this.animate({fill: "#DDD"}, 200);
			});

//			voxArray[gridX][gridY][-1] = gridElement;*/
		}
	}


}