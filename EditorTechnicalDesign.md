# Blocks - block.js #

## hexiso ##
The function hexiso provides two arrays of seven points based upon simple hexagonal proportions. This is the basis for the isometric values used within the program to draw grid and block components. It cannot provide points from different perspectives, because it uses very simple addition, not matrix transformations.

The array indices correspond to the following points:

![http://nanoblok.googlecode.com/hg/extras/block-grid.png](http://nanoblok.googlecode.com/hg/extras/block-grid.png)

Understanding how to this function and these points work is important for using other drawing functions in this program, such as the canvas and SVG-based ones in grid.js.

## canvasDrawSet ##
This function performs much of the heavy-lifting for drawing actual points to the screen from a list of coordinates provided from hexiso().

It also makes use of an offset which is a 2D coordinate usually gotten from a reference point such as a position on the grid beneath the block being drawn.

Finally, some settings such as fill, stroke, and whether the shape's line is closed or left open can be passed.

The function is able to tell which canvas is appropriate to use when drawing blocks. It can then call its context using the function of the same name in effects.js. It then uses the appropriate HTML5 Canvas path methods to paint to the screen.

## colorBlokNew ##
This version of the colorBlok function is takes a color object which contains r, g, b values and attributes for each which go from 0 to 255. It then shifts those values a certain amount (not being careful about clamping them to a certain range, which is unnecessary). The shifting is to give the blocks their characteristic shading. These numbers are hardcoded for appearance.

## canvasBlock ##
This function checks for adjacent blocks using the 3D Voxel array, then uses that to perform simple occlusion tests, i.e., if the new block is behind another block, don't draw one or more of the faces. This is to keep canvas from painting over existing blocks, which would cause an Escher effect.

Once the check is done, it will draw one of the sides using shapes created by the points on the hexagon in the figure above.

## placeBlock ##
This function places only one block on the grid, and is called directly from input.js, whereas most other tools are called from tools.js.

First, we make an object containing the block's location, for ease of use. It takes this information from the Grid Field, which returns the position of the block from an index given by the ID passed to the function through the target. It also adds the current layer offset.

Now it must check to see if a block is already there before drawing, which is wasteful of blocks and also doesn't look as nice. To do this, the drawing function must be placed in another function in order to account for two conditions: 1) If there is no block there (-1), draw the block. 2) If there is a block there, but it is of a different color, paint over it.

## placeBlockDraw ##

## removeBlock ##

## drawAllBlocks ##

## popField ##

# Data - data.js #

## Common Variables ##
The Common object stores attributes which should be accessible to all other parts of the program. These are accessed using the $C variable, as assigned in main.js.

Things such as window size, block size, block proportions, grid and other UI dimensions, as well as persistent tool states inside the program are kept here.

## Fields and Voxels ##
The Nanoblok Editor stores block information in both Voxel and Field arrays.

Field is a list of arrays, in the following format:

```
Field = [x, y, z, Color ID, Visibility],[...]
```

Field is used to redraw blocks to the screen, and to transmit between the server. It also stores a color ID, which an integer meant as an array index that corresponds to the color on the color cube in the order of which it is drawn. Visibility is true when the cube is supposed to be visible, and false when it's not. This is checked by the gridUp and gridDown methods of the Tools class.

Voxel is a 3D array. It is used for occlusion, which needs to know the spatial orientation of the blocks. It has the following format:

```
Voxel[x][y][z] = Field Index
```

The Field Index is the array index in the Field which corresponds to that block.
A -1 field index means that there is no block there.

Between these two data formats, as well as the color IDs in SwatchField, colors are coordinated throughout the entire program, including the blocks and color cube.

Also, voxels are one unit larger on each 'side', as a quick fix for the occlusion code searching for blocks outside the gridspace.