/*
 * Nanoblok (Experimental) - Web-Based Graphical Editor for Game Sprite Development
 *
 * Copyright (c) 2009 Alex Trujillo (http://superluminon.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
// Universal constants
var blockscale = 50;
var gridC = 16; // Columns
var gridR = 16; // Rows

var gridOffsetX = 100;
var gridOffsetY = 100;

var gridX = 0;
var gridY = 0;

// General iso / block proportions
var sc1 = blockscale;
var sc2 = blockscale / 2;
var sc4 = blockscale / 4;
var sc3 = sc2 + sc4;

var Voxel = new Array();
var Field = new Object();
