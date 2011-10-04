// Create our single global namespace.
var BLOK = BLOK || {};

// In case the browser doesn't support a signed, 32-bit int array, just use the regular, JavaScript array.
// Only browsers that support WebGL support Int32Array, as this is defined as part of the Khronos WebGL spec.
// Typed arrays are much faster than regular arrays, but unfortunately, HTML5 has no specification for typed arrays.
if ( ! window.Int32Array ) {
	window.Int32Array = Array;
}
