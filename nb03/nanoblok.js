/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo (http://superluminon.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var blockscale = 20;

window.addEventListener('load', function () {
	Init();
}, false);

function Init () {
	var nano = Raphael("nano", 800, 650);
	
	var charCode;
	
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

var angle = 0;
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

//var rotation = Matrix.Rotation(degRads(angle));

function degRads (angle) {
	return angle * Math.PI / 180;
}

var squareCoors;
var lastSquare;

function rotateSquare (direction, nano) {	
	if (direction == 'left') {
		angle-= 0.5;
	} else if (direction == 'right') {
		angle+= 0.5;
	}
	
	var cos = Math.cos(degRads(angle));
	var sin = Math.sin(degRads(angle));
	
	var rotation =
	{x: $M([
			[cos, -sin],
			[sin, cos]
		]),
	 y: $M([
			[cos, sin],
			[-sin, cos]
		])
	};
	
	var square = $M([
		[200, 200, 300, 300],
		[200, 300, 300, 200]
	]);
	
	var sq = new Array(4);
	
	for (i = 0; i < 4; i++) {
		sq[i] = rotation.x.x(square.col(i + 1));
	}
//	alert(rotation.x.x(square.col(3)).inspect());
	
	var degsDiv = document.getElementById('degs');	
	degsDiv.innerHTML = 'Angle: ' + angle;
	
	if (lastSquare) {
		lastSquare.remove();
	}
	
	lastSquare = drawSquare(sq, nano);
}

function drawSquare (sq, nano) {
	var rhombus = nano.path().
	moveTo(sq[0].e(1,1), sq[0].e(2,1)).
	lineTo(sq[1].e(1,2), sq[1].e(2,2)).
	lineTo(sq[2].e(1,3), sq[2].e(2,3)).
	lineTo(sq[3].e(1,4), sq[3].e(2,4)).
	lineTo(sq[0].e(1,1), sq[0].e(2,1));
	
	rhombus.attr('stroke', 'black');
	
	return rhombus;
}