/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * Version 0.6 Alpha
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for geometry.js:
 * Methods to construct vertex and triangle 3D geometry within the editor.
 */

function Cube (pos)
{
	// Front face
	
	var testMatrix;
	
	this.makeVerts = function ()
	{
		var face1 = [
			[-1.0, -1.0, 1.0, 0],
			[1.0, -1.0, 1.0, 0],
			[1.0, 1.0, 1.0, 0],
			[-1.0, 1.0, 1.0, 1]
		];
	
		// var faceVec2 = [
		// 	[]
		// ];
	
		testMatrix = new Matrix();

		testMatrix.setMatrix(face1);
		testMatrix.rotate({x: -1, y: 1, z: 5});
	}
	
	this.printVerts = function ()
	{
		return testMatrix.flatten();
	}
}