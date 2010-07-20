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
	
	this.dimensions = {x: canvas.clientWidth, y: canvas.clientHeight};
	
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

}

function Scene ()
{
	this.setViewport = function (ctx)
	{
		var viewportMatrix = new Matrix();
		viewportMatrix.setIdentity();
		
		var gl = ctx.getGL();
		
		gl.viewport(0, 0, ctx.dimensions.x, ctx.dimensions.y);
		gl.viewportMatrix = new Perspective();
		gl.viewportMatrix.setMatrix(viewportMatrix);
		// eye, center, up; xyz for each.
		gl.viewportMatrix.lookAt({x: 0, y: 0, z: 1}, {x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0});
		gl.viewportMatrix.ortho(0, ctx.dimensions.x, ctx.dimensions.y, 0, 1, 10000);
	}
	
	this.render = function (ctx) {
		var gl = ctx.getGL();
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
}