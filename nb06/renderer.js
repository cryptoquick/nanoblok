/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * Version 0.6 Alpha
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for renderer.js:
 * Contains WebGL-specific functionality.
 */

function GLContext (canvasID)
{
	var canvas = document.getElementById(canvasID);
	var dimensions = {x: canvas.clientWidth, y: canvas.clientHeight};
	// Sets the WebGL context of the CC object.
	this.setContext = function ()
	{
		try
		{
			this.gl = canvas.getContext("webkit-3d");
		}
		catch (e) {}
		if (!this.gl)
		{
			try
			{
				this.gl = canvas.getContext("moz-webgl");
			}
			catch (e) {}
		}
		if (!this.gl)
		{
			return false;
		}
		
		return true;
	}
	
	this.getGL = function ()
	{
		return this.gl;
	}
}

function Viewport ()
{
	this.setViewport = function (gl)
	{
		var viewportMatrix = new Matrix();
		viewportMatrix.setIdentity();
		
		gl.viewport(0, 0, gl.dimensions.x, gl.dimensions.y);
		gl.viewportMatrix = new Perspective();
		gl.viewportMatrix.setMatrix(viewportMatrix);
		// eye, center, up; xyz for each.
		gl.viewportMatrix.lookat({x: 0, y: 0, z: 100}, {x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0});
		gl.viewportMatrix.ortho(0, gl.dimensions.x, gl.dimensions.y, 0, 1, 10000);
	}
}

function Scene ()
{
	this.render = function () {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
}