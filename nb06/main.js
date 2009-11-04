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
}

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
		out.innerHTML = str;
	}
}