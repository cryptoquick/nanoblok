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