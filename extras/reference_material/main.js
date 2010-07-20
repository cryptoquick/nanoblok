var gl;

function initGL()
{
	var canvas = document.getElementById("mainCanvas");
	
	try
	{
		gl = canvas.getContext("webkit-3d");
	}
	catch (e) {}
	if (!gl)
	{
		try
		{
			gl = canvas.getContext("moz-webgl");
		}
		catch (e) {}
	}
	if (!gl)
	{
		alert("WebGL not enabled.");
	}
}

function getShader(gl, id)
{
	var shaderScript = document.getElementById(id);
	if (!shaderScript)
		return null;

	var str = "";
	var k = shaderScript.firstChild;
	while (k)
	{
	if (k.nodeType == 3) 
		str += k.textContent;
	k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment")
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if (shaderScript.type == "x-shader/x-vertex")
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else
	{
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderi(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

var shaderProgram;
var vertexPositionAttribute;
function initShaders()
{
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgrami(shaderProgram, gl.LINK_STATUS))
	{
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
}


var mvMatrix;

function loadIdentity()
{
	mvMatrix = Matrix.I(4);
}


function multMatrix(m)
{
	mvMatrix = mvMatrix.x(m);
}


function mvTranslate(v)
{
	var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}


var pMatrix;
function perspective(fovy, aspect, znear, zfar)
{
	pMatrix = makePerspective(fovy, aspect, znear, zfar)
}

function setMatrixUniforms()
{
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new CanvasFloatArray(pMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new CanvasFloatArray(mvMatrix.flatten()));
}

function drawScene()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// 45 degree field of view, 1:1 height-width ratio, display between 0.1 and 100 units.
	perspective(45, 1.0, 0.1, 100.0);
	loadIdentity();
	
	mvTranslate([-1.5, 0.0, -7.0]);
	
	var triangleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	
	var vertices = [
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0, -1.0,  0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new CanvasFloatArray(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	
	mvTranslate([3.0, 0.0, 0.0])
	squareBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
	vertices = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new CanvasFloatArray(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

window.addEventListener('load', function () {
	webGLStart();
}, false);

function webGLStart()
{
	initGL();
	initShaders();
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	
	setInterval(drawScene, 100);
}