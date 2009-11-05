/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * Version 0.6 Alpha
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for math.js:
 * Functions that operate graphics-oriented matrix math.
 */

function Matrix ()
{
	// Result.
	var matrix;
	// Benchmark.
	var init0;
	var init1;
	
	this.setMatrix = function (inputMatrix)
	{
		// Validation?
		matrix = inputMatrix;
	}
	
	this.multiply = function (b)
	{
		init0 = new Date();
		
		// Find the number of elements in each dimension of the array.
		// check(a,b,c);
		var a = matrix;
		var m = a.length;
		// if (m < a[0].length) m = a[0].length;
		var n = b.length;
		var p = b[0].length;
		
		var c = new Array(n);
		for (var q = 0; q < p; q++)
		{
			c[q] = new Array(p);
		}
		var Bcolj = new Array(n);
		
		for (var j = 0; j < p; j++) {
			for (var k = 0; k < n; k++) {
				Bcolj[k] = b[k][j];
			}
			for (var i = 0; i < m; i++) {
				var Arowi = a[i];
				var s = 0;

				for (var k = 0; k < n; k++) {
					s += Arowi[k] * Bcolj[k];
				}
				c[i][j] = s;
			}
		}
		
		matrix = c;
		
		init1 = new Date();
	}
	
	// Vector must be in the format of [x, y, z, 1]
	this.translate = function (vector) {
		this.multiply (vector, matrix);
	}
	
	// Formats and outputs the contents of a 2D array.
	this.flatten = function ()
	{
		var str = "Transformation matrix:<br>";
		
		for (var i = 0; i < matrix.length; i++)
		{
			str += "[";
			for (var j = 0; j < matrix[0].length; j++)
			{
				str += matrix[i][j];
				if (j < matrix[0].length - 1)
				{
					str += ", ";
				}
			}
			str += "]";
			if (i < matrix.length - 1) {
				str += "<br>";
			}
		}
		
		return str;
	}
	
	this.getMatrix = function ()
	{
		return matrix;
	}
	
	this.setElement = function (row, column)
	{
		
	}

	this.setIdentity = function ()
	{
		matrix = [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]
	}
	
	this.benchmark = function ()
	{
		return "Matrix calculated in " + (init1 - init0) + "ms.";
	}
}

function Perspective ()
{
	var matrix;
	
	this.setMatrix = function (matrixInput)
	{
		// Might want some matrix validation here?
		matrix = matrixInput;
	}
	
	// For orthographic projection.
	this.ortho = function (left, right, bottom, top, near, far)
	{
		// var tx = (left + right) / (left - right);
		// var ty = (top + bottom) / (top - bottom);
		// var tz = (far + near) / (far - near);

		var tx = - (right + left) / (right - left);
		var ty = - (top + bottom) / (top - bottom);
		var tz = - (far + near) / (far - near);

		var orthoProj = [
			[2 / (right - left), 0, 0, tx],
			[0, 2 / (top - bottom), 0, ty],
			[0, 0, -2 / (far - near), tz],
			[0, 0, 0, 1]
		];
		
		matrix.multiply(orthoProj);
	}
	
	// Based on Safari WebGL Demo code.
	this.lookAt = function (eye, center, up) {
		// Z vector.
		var zV = {
			x: eye.x - center.x,
			y: eye.y - center.y,
			z: eye.z - center.z
		};
		
		var magnitude = Math.sqrt(zV.x * zV.x + zV.y * zV.y + zV.z * zV.z);
		
		if (magnitude) {
			zV.x /= magnitude,
			zV.y /= magnitude,
			zV.z /= magnitude
		};
		
		// Y vector.
		var yV = up;

		// X vector = Y cross Z.
		var xV = {
			x: yV.y * zV.z - yV.z * zV.y,
			y:-yV.x * zV.z - yV.z * zV.x,
			z: yV.x * zV.y - yV.y * zV.x
		};
		// xx =  yy * zz - yz * zy;
		// xy = -yx * zz + yz * zx;
		// xz =  yx * zy - yy * zx;

		// Recompute Y = Z cross X.
		var yV = {
			x: zV.y * xV.z - zV.z * xV.y,
			y:-zV.x * xV.z + zV.z * xV.x,
			z: zV.x * xV.y - zV.y * xV.x
		};
		// yx = zy * xz - zz * xy;
		// yy = -zx * xz + zz * xx;
		// yx = zx * xy - zy * xx;

		// cross product gives area of parallelogram, which is < 1.0 for
		// non-perpendicular unit-length vectors; so normalize x, y here

		magnitude = Math.sqrt(xV.x * xV.x + xV.y * xV.y + xV.z * xV.z);
		if (magnitude) {
			xV.x /= magnitude;
			xV.y /= magnitude;
			xV.z /= magnitude;
		};
		
		var lookAtMatrix = [
			[xV.x, xV.y, xV.z, 0],
			[yV.x, yV.y, yV.z, 0],
			[zV.x, zV.y, zV.z, 0],
			[0, 0, 0, 1]
		];
		
		matrix.translate(-eyex, -eyey, -eyez);

		this.multRight(matrix);
	}
	
	this.debug = function ()
	{
		return matrix.flatten;
	}
}