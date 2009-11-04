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