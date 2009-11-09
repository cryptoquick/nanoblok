// Contains a great deal of example code from this really helpful site:
// http://www.sergemeunier.com/blog/

function initO3D (clientElements)
{
	// Set some globals.
	var o3dElement = clientElements[0];
	G.client = o3dElement.client;
	G.o3d = o3dElement.o3d;
	G.math = o3djs.math;
	G.clock = 0;
	G.timeMult = 1;
	G.camera = {
		eye: [0, 0, 10],
		target: [0, 0, 0]
	};
	
	o3djs.base.init(o3dElement);
	
	// A pack manages all objects in the scene.
	G.pack = G.client.createPack();
	
	G.sceneRoot = G.pack.createObject("Transform");  
	
	// Creates a render graph for the viewport.
	G.viewport = o3djs.rendergraph.createBasicView(
		G.pack,
		G.sceneRoot,
		G.client.renderGraphRoot
	);
	
	// Set up a perspective viewport.
	G.viewport.drawContext.projection = G.math.matrix4.perspective(
		G.math.degToRad(30), // 30 degree field of view.
		G.client.width / G.client.height, // Aspect ratio.
		1, // Near and...
		5000 // ...far clipping plane.
	);
	
	// Look begin by looking towards the center of the scene.
	G.viewport.drawContext.view = G.math.matrix4.lookAt(
		G.camera.eye, // Camera / Eye / Observer
		G.camera.target, // Target, center of the scene.
		[0, 1, 0]  // Y-axis is up.
	);
	
	// HUD viewport.

	G.hudRoot = G.pack.createObject("Transform");
	
	G.hudViewInfo = o3djs.rendergraph.createBasicView(
		G.pack,
		G.hudRoot,
		G.client.renderGraphRoot
	);
	
	G.hudViewInfo.root.priority = G.viewport.root.priority + 1;
	G.hudViewInfo.clearBuffer.clearColorFlag = false;
	
	// 2D ortho view for hud/text.
	G.hudViewInfo.drawContext.projection = G.math.matrix4.orthographic(
		0 + 0.5,
		G.client.width + 0.5,
		G.client.height + 0.5,
		0 + 0.5,
		0.0001,
		1000
	);
	
	G.hudViewInfo.drawContext.view = G.math.matrix4.lookAt(
		[0, 0, 1],
		[0, 0, 0],
		[0, 1, 0]
	);
	
	G.fpsManager = o3djs.fps.createFPSManager(
		G.pack,
		G.client.width,
		G.client.renderGraphRoot
	);
	
	// Text stuffs.
	G.paint = G.pack.createObject("CanvasPaint");
	G.canvasLib = o3djs.canvas.create(G.pack, G.client.root, G.hudViewInfo);
	G.textCanvas = G.canvasLib.createXYQuad(200, 0, 0, 100, 50, true);
	
	redEffect = G.pack.createObject("Effect");
	var shaderString = "shaders/test.shader";
	o3djs.effect.loadEffect(redEffect, shaderString);
	
	var redMaterial = G.pack.createObject("Material");
	
	redMaterial.drawList = G.viewport.performanceDrawList;
	
	redMaterial.effect = redEffect;
	
	var cube = o3djs.primitives.createCube(
		G.pack,
		redMaterial,
		Math.sqrt(2)
	);
	
	G.cubeTransform = G.pack.createObject("Transform");
	
	G.cubeTransform.addShape(cube);
	G.cubeTransform.parent = G.client.root;
	
	cube.createDrawElements(G.pack, null);
	
	G.client.setRenderCallback(renderCallback);
	
	window.document.onkeypress = keyPressedCallback; 
}

function renderCallback(renderEvent)
{
	G.drawText("asdl;fsklas;dfjl;sakjdfl;kasjdfl;jkasdlfas;ldkfja;sldkjfoiwhjj as;ijdflasjdofmasl;djioj wejiwjdiohiaoshgu wijdoujvisjf iad jdlkashint 8nydljaislyd ;4o8yroihj4p8 yalsnfg lan igjasl khuij ashdghoasje ylasj;dhs o");
	G.fpsManager.update(renderEvent);
	G.clock += renderEvent.elapsedTime * G.timeMult;
	G.cubeTransform.identity();
	G.cubeTransform.rotateY(2.0 * G.clock);
	
}

function drawText(str) {
	G.textCanvas.canvas.clear([0.5, 0.5, 0.5, 0.5]);
	
	var paint = G.paint;
	paint.color = [1, 1, 1, 1];
	paint.textSize = 12;
	paint.textTypeface = "Verdana";
	paint.textAlign = G.o3d.CanvasPaint.LEFT;
	paint.shader = null;
	G.textCanvas.canvas.drawText(str, 10, 30, paint);
	G.textCanvas.updateTexture();
}

// # // Create the global paint object that's used by draw operations.  
// #   g_paint = g_pack.createObject('CanvasPaint'); 
// #  
// #   // Creates an instance of the canvas utilities library. 
// #   g_canvasLib = o3djs.canvas.create(g_pack, g_hudRoot, g_hudViewInfo); 
// #  
// #   // Create a canvas that will be used to display the text. 
// #   g_textCanvas = g_canvasLib.createXYQuad(200, 0, 0, 100, 50, true);
// 
// # var paint = g_paint;  
// #   paint.color = [1, 1, 1, 1];  
// #   paint.textSize = 12;  
// #   paint.textTypeface = 'Comic Sans MS';  
// #   paint.textAlign = g_o3d.CanvasPaint.LEFT;  
// #   paint.shader = null;  
// #   g_textCanvas.canvas.drawText(str, 10, 30, paint);  
// #   
// #   g_textCanvas.updateTexture();
// 
// 
// 
// 


function keyPressedAction(keyPressed, delta) {  
  var actionTaken = false;  
  switch(keyPressed) {  
    case 'a':  
      G.sceneRoot.localMatrix =  
          G.math.matrix4.mul(G.sceneRoot.localMatrix,  
                             G.math.matrix4.rotationY(-delta));  
      actionTaken = true;  
      break;  
    case 'd':  
      G.sceneRoot.localMatrix =  
          G.math.matrix4.mul(G.sceneRoot.localMatrix,  
                             G.math.matrix4.rotationY(delta));  
      actionTaken = true;  
      break;  
    case 'w':  
      G.sceneRoot.localMatrix =  
          G.math.matrix4.mul(G.sceneRoot.localMatrix,  
                             G.math.matrix4.rotationX(-delta));  
      actionTaken = true;  
      break;  
    case 's':  
      G.sceneRoot.localMatrix =  
          G.math.matrix4.mul(G.sceneRoot.localMatrix,  
                             G.math.matrix4.rotationX(delta));  
      actionTaken = true;  
      break;  
  }  
  return actionTaken;  
}

function keyPressedCallback(event) {  
  event = event || window.event;  
  
  // Ignore accelerator key messages.  
  if (event.metaKey)  
    return;  
  
  var keyChar =String.fromCharCode(o3djs.event.getEventKeyChar(event));  
  // Just in case they have capslock on.  
  keyChar = keyChar.toLowerCase();  
  
  if (keyPressedAction(keyChar, G.keyPressDelta)) {  
    o3djs.event.cancel(event);  
  }  
}