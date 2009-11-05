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
	var c;
	// Benchmark.
	var init0;
	var init1;
	
	this.multiply = function (a, b)
	{
		init0 = new Date();
		
		// Find the number of elements in each dimension of the array.
		// check(a,b,c);
		var m = a.length;
		// if (m < a[0].length) m = a[0].length;
		var n = b.length;
		var p = b[0].length;
		
		c = new Array(n);
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
		
		init1 = new Date();
	}
	
	// Formats and outputs the contents of a 2D array.
	this.flatten = function ()
	{
		var str = "Transformation matrix:<br>";
		
		for (var i = 0; i < c.length; i++)
		{
			str += "[";
			for (var j = 0; j < c[0].length; j++)
			{
				str += c[i][j];
				if (j < c[0].length - 1)
				{
					str += ", ";
				}
			}
			str += "]";
			if (i < c.length - 1) {
				str += "<br>";
			}
		}
		
		return str;
	}
	
	this.getMatrix = function ()
	{
		return c;
	}
	
	this.setElement = function (row, column)
	{
		
	}

	this.setIdentity = function ()
	{
		c = [
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
	
	this.lookAt = function (eye, center, up) {
		
	}
	
	this.debug = function ()
	{
		return matrix.flatten;
	}
}