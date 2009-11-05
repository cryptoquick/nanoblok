window.addEventListener('load', function () {
	initializeProgram();
}, false);

function initializeProgram ()
{
	var debug = new TextHandler("stats");
	var ctx = new CanvasContext();
	
	var ctxSuccess = ctx.setContext("mainViewport");
	
	if (ctxSuccess)
	{
		debug.write("WebGL loaded successfully.");
	}
	else
	{
		debug.write("WebGL failed to load.");
	}
	
	var vertShader = new ShaderProgram(ctx.gl);
	var vertShaderLog = vertShader.makeShader("vertex", vertexShaderCode);
	
	var fragShader = new ShaderProgram(ctx.gl);
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
	[6, 8]
		];
	var tMb = [
	[7, 4, 9],
	[8, 1, 5]
		];
		
	testMatrix.multiply(tMa, tMb);
	var tMc = testMatrix.flatten();
	debug.write(tMc);
	debug.write(testMatrix.benchmark());
	
	// Needs to be OOPized?
	ctx.gl.clearColor(1.0, 1.0, 1.0, 1.0);
	ctx.gl.clearDepth(1.0);
	ctx.gl.enable(ctx.gl.DEPTH_TEST);
	ctx.gl.depthFunc(ctx.gl.LEQUAL);
	
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

function CanvasContext ()
{
	// Sets the WebGL context of the CC object.
	this.setContext = function (canvasID)
	{
		var canvas = document.getElementById(canvasID);
		
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
}

function TextHandler (outputID)
{
	var out = document.getElementById(outputID);
	
	this.write = function (str)
	{
		out.innerHTML += (str + "<br>");
	}
}

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

function Scene ()
{
	this.render = function () {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
}

function View ()
{
	this.ortho = function(left, right, bottom, top, near, far)
	{
	    var tx = (left + right) / (left - right);
	    var ty = (top + bottom) / (top - bottom);
	    var tz = (far + near) / (far - near);

	    var matrix = new Matrix();
	    matrix.m11 = 2 / (left - right);
	    matrix.m12 = 0;
	    matrix.m13 = 0;
	    matrix.m14 = 0;
	    matrix.m21 = 0;
	    matrix.m22 = 2 / (top - bottom);
	    matrix.m23 = 0;
	    matrix.m24 = 0;
	    matrix.m31 = 0;
	    matrix.m32 = 0;
	    matrix.m33 = -2 / (far - near);
	    matrix.m34 = 0;
	    matrix.m41 = tx;
	    matrix.m42 = ty;
	    matrix.m43 = tz;
	    matrix.m44 = 1;

	    this.multRight(matrix);
	}
}

function Matrix ()
{
	// Result.
	var c;
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
	
	this.benchmark = function ()
	{
		return "Matrix calculated in " + (init1 - init0) + "ms.";
	}
}