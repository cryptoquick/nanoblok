function initO3D (clientElements)
{
	// Set some globals.
	var o3dElement = clientElements[0];
	G.client = o3dElement.client;
	G.o3d = o3dElement.o3d;
	G.math = o3djs.math;
	
	o3djs.base.init(o3dElement);
	
	// A pack manages all objects in the scene.
	G.pack = G.client.createPack();
	
	// Creates a render graph for the viewport.
	var viewport = o3djs.rendergraph.createBasicView(
		G.pack,
		G.client.root,
		G.client.renderGraphRoot
	);
	
	// Set up a perspective viewport.
	viewport.drawContext.projection = G.math.matrix4.perspective(
		G.math.degToRad(30), // 30 degree field of view.
		G.client.width / G.client.height, // Aspect ratio.
		1, // Near and...
		5000 // ...far clipping plane.
	);
	
	// Look begin by looking towards the center of the scene.
	viewport.drawContext.view = G.math.matrix4.lookAt(
		[0, 3, 8], // Camera / Eye / Observer
		[0, 0, 0], // Target, center of the scene.
		[0, 1, 0]  // Y-axis is up.
	);
	
	redEffect = G.pack.createObject("Effect");
	var shaderString = "shaders/test.shader";
	o3djs.effect.loadEffect(redEffect, shaderString);
	
	var redMaterial = G.pack.createObject('Material');
	
	redMaterial.drawList = viewport.performanceDrawList;
	
	redMaterial.effect = redEffect;
	
	var cube = o3djs.primitives.createCube(
		G.pack,
		redMaterial,
		Math.sqrt(2)
	);
	
	G.cubeTransform = G.pack.createObject('Transform');
	
	G.cubeTransform.addShape(cube);
	G.cubeTransform.parent = G.client.root;
	
	cube.createDrawElements(G.pack, null);
}