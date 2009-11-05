/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * Version 0.6 Alpha
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for main.js:
 * Initializes the program and ties together all necessary functions.
 */

window.addEventListener('load', function () {
	initializeProgram();
}, false);

function initializeProgram ()
{
	var debug = new TextHandler("stats");
	var ctx = new GLContext("mainViewport");
	
	var glSuccess = ctx.setContext();
	
	if (glSuccess)
	{
		debug.write("WebGL loaded successfully.");
	}
	else
	{
		debug.write("WebGL failed to load.");
	}
	
	var gl = ctx.getGL();
	
	var vertShader = new ShaderProgram(gl);
	var vertShaderLog = vertShader.makeShader("vertex", vertexShaderCode);
	
	var fragShader = new ShaderProgram(gl);
	var fragShaderLog = fragShader.makeShader("fragment", fragmentShaderCode);
	
	if (vertShaderLog && fragShaderLog)
	{
		debug.write("Shaders loaded.");
	}
	else
	{
		debug.write(vertShaderLog);
		debug.write(fragShaderLog);
	}
	
	testMatrix = new Matrix();
	
	var tMa = [
	[7, 3],
	[2, 5],
	[6, 8],
	[9, 11]
		];
	var tMb = [
	[7, 4, 9, 1],
	[8, 1, 5, 12]
		];
		
	testMatrix.multiply(tMa, tMb);
	var tMc = testMatrix.flatten();
	debug.write(tMc);
	debug.write(testMatrix.benchmark());
	
	// Needs to be OOPized?
	gl.clearColor(1.0, 0.9, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	
	// scene = new Scene;
	// view = new View;
	// 
	// setInterval(scene.render(view), 15);
}

/* Is this necessary? Maybe.
function InitTests () {
	var contextLoaded;
	var contextNeeded = 1;
	var shadersBuilt;
	var shadersNeeded = 2;

	this.setLoaded (type)
	{
		
	}
	
	this.checkAll ()
	{
		
	}
}*/

function TextHandler (outputID)
{
	var out = document.getElementById(outputID);
	
	this.write = function (str)
	{
		out.innerHTML += (str + "<br>");
	}
}