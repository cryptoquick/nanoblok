function blokNoise (seed) {
//	noiseDetail (0.24, 0.5);
	noiseSeed(seed);
	
	Field = [];
	Voxel = [];
	
	var arr = [];
	var largest = 0;
	var t0 = new Date();
	
	for (var x = 31; x >= 0; x--) {
		arr[x] = [];
		for (var y = 31; y >= 0; y--) {
		//	
			var perl = noise(x + Math.random(), y + Math.random());
		//	var perl = Math.random() / 2;
		/*	if (perl < largest) {
				largest = perl;
			}*/
			var safe = Math.floor(perl * 32);
		//	var safe = Math.floor(perl * 16) + 8;
		//	arr[x][y] = safe;
			var color = Math.floor((noise(Math.random(), Math.random(), Math.random()) * 32768));
			
			for (var z = safe - 1; z >= 0; z--) {
				Field.push([x, y, z, 32767]);
			}
			Field.push([x, y, safe, color]);
		}
	}
	
	var t1 = new Date();
	
	var arrS = "";
	
	for (var x = 0; x < 32; x++) {
		for (var y = 0; y < 32; y++) {
			arrS += arr[x][y] + ", ";
		}
		arrS += "\n";
	}
	
	loggit("Noise demo rendered in " + (t1 - t0) + "ms.");
}

function clamp (val, min, max) {
	return Math.max(min, Math.min(max, val));
}

// Multiply With Carry
// From: http://www.rlmueller.net/Programs/MWC32.txt
// lngX and lngC are integers greater than or equal to 0  and less than M
/*function Noise (lngX, lngC) {
		var S_Hi, S_Lo, C_Hi, C_Lo
	    var F1, F2, F3, T1, T2, T3

	    // Constants for Multiply With Carry Generator.
	    // A = 4,164,903,690 = (A_Hi * 2^16) + A_Lo
	    var A_Hi = 63551
	    var A_Lo = 25354
	    // M = 2^32 = 4,294,967,296
	    var M = 4294967296

	    // Constant for breaking numbers into High and Low 16-bit parts.
	    // 2^16 = 65,536
	    var H = 65536

	    // Break up values into high and low 16-bit parts.
	    S_Hi = Math.floor(lngX / H)
	    S_Lo = lngX - (S_Hi * H)
	    C_Hi = Math.floor(lngC / H)
	    C_Lo = lngC - (C_Hi * H)

	    // Calculate intermediate results.
	    //     Xi = [(F1 * 2^32) + (F2 * 2^16) + F3] Mod M
	    //     Ci = Int[((F1 * 2^32) + (F2 * 2^16) + F3) / M]
	    F1 = A_Hi * S_Hi
	    F2 = (A_Hi * S_Lo) + (A_Lo * S_Hi) + C_Hi
	    F3 = (A_Lo * S_Lo) + C_Lo

	    // Calculate Xi = [(F1 * 2^32) + (F2 * 2^16) + F3] Mod M.
	    T1 = Math.floor(F2 / H)
	    T2 = F2 - (T1 * H)
	    lngX = (T2 * H) + F3
	    T3 = Math.floor(lngX / M)
	    lngX = lngX - (T3 * M)

	    // Calculate Ci = Int[((F1 * 2^32) + (F2 * 2^16) + F3) / M].
	    lngC = Math.floor((F2 / H) + F1)

	    MWC = lngX;
		
		return MWC;
}*/

var harbl = [];

function Noise (x, y) {
	var n = x + y * 57
	n = Math.pow(n<<13, n);
	var result = ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 2147483647) / 1073741824.0);
	harbl.push(result);
	return result;  
}

function blarbl () {
	console.log(harbl + "");
}

// Cosine Interpolate
// From http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 function Interpolate(a, b, x) {
	var ft = x * Math.PI;
	var f = (1 - Math.cos(ft)) * .5;

	return  a*(1-f) + b*f;
}

// From http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
function SmoothedNoise(x, y) {
	var corners = ( Noise(x-1, y-1)+Noise(x+1, y-1)+Noise(x-1, y+1)+Noise(x+1, y+1) ) / 16;
	var sides   = ( Noise(x-1, y)  +Noise(x+1, y)  +Noise(x, y-1)  +Noise(x, y+1) ) /  8;
	var center  =  Noise(x, y) / 4;

	return corners + sides + center;
}

function InterpolatedNoise(x, y) {
	var integer_X    = Math.floor(x)
	var fractional_X = x - integer_X

	var integer_Y    = Math.floor(y)
	var fractional_Y = y - integer_Y

	var v1 = SmoothedNoise(integer_X,     integer_Y)
	var v2 = SmoothedNoise(integer_X + 1, integer_Y)
	var v3 = SmoothedNoise(integer_X,     integer_Y + 1)
	var v4 = SmoothedNoise(integer_X + 1, integer_Y + 1)
	
	var i1 = Interpolate(v1 , v2 , fractional_X)
	var i2 = Interpolate(v3 , v4 , fractional_X)

	return Interpolate(i1 , i2 , fractional_Y)
}

var totalAmplitude = 0;

function PerlinNoise2D(x, y) {
	var total = 0;
	var p = 0.5; // Persistence
	var n = 4; // - 1 (Number_Of_Octaves)
	
	for (var i = 0; i < n; i++) {
		var frequency = Math.pow(2, i);
		var amplitude = Math.pow(p, i);
		totalAmplitude += amplitude;
		total = total + InterpolatedNoise(x * frequency, y * frequency) * amplitude;
	}

	return total; // /= totalAmplitude;
//	return Math.sqrt(total);
}