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
	
	this.setElement = function (row, column)
	{
		
	}
	
	this.benchmark = function ()
	{
		return "Matrix calculated in " + (init1 - init0) + "ms.";
	}
}