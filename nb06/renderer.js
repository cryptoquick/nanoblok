// Contains a great deal of example code from this really helpful site:
// http://www.sergemeunier.com/blog/

function initO3D (clientElements)
{
	  // Initializes global variables and libraries.
	  var o3dElement = clientElements[0];
	  G.client = o3dElement.client;
	  G.o3d = o3dElement.o3d;
	  G.math = o3djs.math;

	  // Create a pack to manage the objects created.
	  G.pack = G.client.createPack();

	  // Create the render graph for a view.
	  G.viewInfo = o3djs.rendergraph.createBasicView(
	      G.pack,
	      G.client.root,
	      G.client.renderGraphRoot);

	  // Set up a perspective projection.
	  G.viewInfo.drawContext.projection = G.math.matrix4.perspective(
	      G.math.degToRad(30), // 30 degree fov.
	      G.client.width / G.client.height,
	      1,                  // Near plane.
	      5000);              // Far plane.
	
	G.viewInfo.clearBuffer.clearColor = [0, 0, 0, 1]; 

	  // Set up our view transformation to look towards the world origin where the
	  // cube is located.
	 G.viewInfo.drawContext.view = G.math.matrix4.lookAt([0, 3, 7.5],  // eye
	                                            [0, 0, 0],  // target
	                                            [0, 1, 0]); // up


	// Shader Stuffs

	  // Create an Effect object and initialize it using the shaders from the
	  // text area.
	  var redEffect = G.pack.createObject('Effect');
	
	// # var shaderString = 'shaders/solidred.shader';  
	// # o3djs.effect.loadEffect(redEffect, shaderString);
	
	var material = G.pack.createObject('Material');  
	o3djs.effect.attachStandardShader(
		G.pack,
		material,
		G.lightPosition,
		'phong'
	);
	material.drawList = G.viewInfo.performanceDrawList;

	var baseColor = [1, 0.5, 0, 1];

	// Assign parameters to the phong material.  
	material.getParam('emissive').value = [0, 0, 0, 1];  
	material.getParam('ambient').value = G.math.mulScalarVector(0.1, baseColor);  
	material.getParam('diffuse').value = G.math.mulScalarVector(0.9, baseColor);  
	material.getParam('specular').value = [.2, .2, .2, 1];  
	material.getParam('shininess').value = 20;

	// Make me some cubes.

		cubeInstance({x: -1, y: 0, z: 0}, material);
		cubeInstance({x: 1, y: 0, z: 0}, material);
		cubeInstance({x: 0, y: 0, z: -2}, material);


	  // Set our render callback for animation.
	  // This sets a function to be executed every time a frame is rendered.
	G.client.setRenderCallback(renderCallback);
}

function cubeInstance (position, material)
{
  // Create the Shape for the cube mesh and assign its material.

// {shape: cube, translation: [-2, 1, 0]}, 

	var cubeShape = o3djs.primitives.createCube(  
		G.pack,  
		material,  
		Math.sqrt(2)
	);

  // Create a new transform and parent the Shape under it.
  G.cubeTransform = G.pack.createObject('Transform');
  G.cubeTransform.addShape(cubeShape);

	// Translate the cube.
  G.cubeTransform.translate(position.x, position.y, position.z);

  // Parent the cube's transform to the client root.
  G.cubeTransform.parent = G.client.root;
}

function renderCallback(renderEvent) {
  G.clock += renderEvent.elapsedTime * G.timeMult;
  // Rotate the cube around the Y axis.
  G.cubeTransform.identity();
  G.cubeTransform.rotateY(2.0 * G.clock);
}