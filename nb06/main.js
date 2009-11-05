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
	ctx.gl.clearColor(1.0, 0.9, 0.0, 1.0);
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

function TextHandler (outputID)
{
	var out = document.getElementById(outputID);
	
	this.write = function (str)
	{
		out.innerHTML += (str + "<br>");
	}
}