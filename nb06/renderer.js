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
		// var tx = (left + right) / (left - right);
		// var ty = (top + bottom) / (top - bottom);
		// var tz = (far + near) / (far - near);

		var tx = - (right + left) / (right - left);
		var ty = - (top + bottom) / (top - bottom);
		var tz = - (far + near) / (far - near);

		return [
			[2 / (right - left), 0, 0, tx],
			[0, 2 / (top - bottom), 0, ty],
			[0, 0, -2 / (far - near), tz],
			[0, 0, 0, 1]
		];
	}
}