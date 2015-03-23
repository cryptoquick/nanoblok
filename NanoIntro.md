# Introduction #
The Nanoblok Editor allows an artist to think in 3D space when making a voxel art model. This can be rendered and used as a standalone piece, or saved and used as a graphics asset as part of a game or other piece of software. See the sections below for details on its use.

The Nanoblok Renderer-- once finished-- will reproduce the subtle effects used in regular pixel art. It will provide real-time effects such as shading and lighting, as well as transparency. In addition, the renderer will be able to draw models in different orientations in space to provide rotational sprite sheets. Once the editor becomes more sophisticated, 'sockets' placed in the editor will enable the renderer to associate models with other models in various ways. This will allow for animations and interchangeable parts. Furthermore, eventually an interface will be provided for scripting per-voxel deformations, allowing the game program itself to alter graphical assets directly. The renderer will be written both in Python and JavaScript, for use on desktop and web applications, such as PyGame and Unity.

The Nanoblok Server is used to store model information, and is provided for web programs for storing their assets. It runs on Google App Engine and cannot be used on desktop clients.

Eventually, there will be a Nanoblok Game Engine which will employ a plethora of real-world physics rules. See: EnginePhysics.

# Editing #
To draw blocks on the grid, simply click the mouse button. It may also be held and lines can be drawn, but remember, a great deal of pixel art is manually done, and voxel art is no different.

# Movement #
Left and Right arrows rotate the model 90 degrees. Up and Down arrows raise and lower the level. If you lower the level below the top of the model, the program will automatically slice it to view and edit what's underneath.

# Colors #
Press C to bring up the color cube. This is how you select new colors. Slice at it with Down and Up arrows. Selecting a color will add it to the palette on the right.

Press Shift to remove a color from the palette.

At the moment, it is not yet possible to rotate the color cube.

# Save / Load #
  * Save: ctrl-shift-S, no dialog unless a title is not supplied, or there are no blocks placed.
  * Load: ctrl-shift-L, opens dialog window.

In order to keep the browser from highlighting its URL bar, ctrl-shift-L can be substituted for ctrl-L. The same goes for saving; remember to hold the shift key.

# Deletion #
Blocks will not write over other blocks. In order to delete a block, the D key toggles the deletion mode. Press the D key, delete what you need, then press it again to exit that mode.

# Fill and Select #
Fill and Selection are not entirely implemented at the moment, however, once they are, you will be able to

# Alpha #
Remember, this program is still in the alpha stages.

In an emergency, if you cannot save a model and you're using the Chrome browser, you may perform the following steps:
  * Press ctrl-shift-J.
  * Open the console by clicking on the console icon, the last of the icons at the top.
  * Type the following: JSON.stringify(Field)
  * Copy th entire field from the console output.
  * Paste into an email and send it to us: problems@nanoblok.com

Please be sure to include your username, and we'll see what we can do.

# Support #
Nanoblok has taken the official stance of not coding support for legacy browsers, including:
Internet Explorer 8, Firefox 3.0, Safari 4, and Opera 9.
Browsers that are nice:
Chrome 6, Firefox 4.0, Safari 5, Opera 10.60, and eventually, IE 9.