/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 * Version 0.6 Alpha
 * http://code.google.com/p/nanoblok/
 * Copyright (c) 2009 Alex Trujillo
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Summary for shaders.js:
 * Contains shader programs and handlers for those programs.
 */

// Bad multi-line implementation. Ideas?
var vertexShaderCode = "                                                        \
	attribute vec3 aVertexPosition;                                             \
                                                                                \
	uniform mat4 uMVMatrix;                                                     \
	uniform mat4 uPMatrix;                                                      \
                                                                                \
	void main(void)                                                             \
	{                                                                           \
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);        \
	}                                                                           \
";

var fragmentShaderCode = "                                                      \
	void main(void)                                                             \
	{                                                                           \
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);                                \
	}                                                                           \
";

function ShaderProgram (gl)
{
	var shaderProgram;
	
	this.makeShader = function (type, shaderCode)
	{		
		if (type == "vertex")
		{
			shaderProgram = gl.createShader(gl.VERTEX_SHADER);
		}
		else if (type == "fragment")
		{
			shaderProgram = gl.createShader(gl.FRAGMENT_SHADER);
		}
		
		gl.shaderSource(shaderProgram, shaderCode);
		gl.compileShader(shaderProgram);
		
		if (!gl.getShaderi(shaderProgram, gl.COMPILE_STATUS))
		{
			return gl.getShaderInfoLog(shaderProgram);
		}
		else
		{
			return true;
		}
	}
}