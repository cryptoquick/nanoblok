function makeGrid (ctx)
{
	var vertices = new CanvasFloatArray(
		[  0, 0, 1,	 0, 0, -5 ]
	);
	
	var indices = new CanvasUnsignedByteArray(
		[  0, 1 ]
	);
	
	var retval = { };
 
	retval.vertexObject = ctx.createBuffer();
	ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.vertexObject);
	ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);
	
	ctx.bindBuffer(ctx.ARRAY_BUFFER, 0);
 
	retval.indexObject = ctx.createBuffer();
	ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, retval.indexObject);
	ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indices, ctx.STATIC_DRAW);
	ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, 0);
	
	retval.numIndices = indices.length;
 
	return retval;
}