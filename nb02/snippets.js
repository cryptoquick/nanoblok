grid.rect(0, 0, 40, 40).attr({fill: "#000", stroke: "none"});

	var square = grid.rect(0, 0, 40, 40).attr({fill: "orange", stroke: "none"});
	//c.animate({cx: 20, r: 20}, 2000);
	square.animate({fill: 'brown'}, 500);
	
	var square_vecA = $V([0, 0, 0]);
	var square_vecB = $V([0, size, 0]);
	var square_vecC = $V([size, 0, 0]);
	var square_vecD = $V([size, size, 0]);
	
/*	var square_mx = $M([
		[0, size, 0],
		[size, 0, 0],
		[0, 0, 0]
	]);*/
	
	// Lines to make a square
	liA = Line.create([2,2], [2,4]);
	liB = Line.create([2,4], [4,4]);
	liC = Line.create([4,4], [4,2]);
	liD = Line.create([4,2], [2,2]);

	// Lines to make a square
	liA = Matrix.create([[2,2,0], [2,4,0], [0,0,0]]);
	liB = Matrix.create([[2,4,0], [4,4,0], [0,0,0]]);
	liC = Matrix.create([[4,4,0], [4,2,0], [0,0,0]]);
	liD = Matrix.create([[4,2,0], [2,2,0], [0,0,0]]);
	
// Top

	nobg.path({stroke: "red"}).moveTo(1 * size, (Math.atan(0.5) * size)).lineTo(2 * size, 1 * size);
	nobg.path({stroke: "green"}).moveTo(0 * size, 1 * size).lineTo(2 * size, 2 * size);
	nobg.path({stroke: "yellow"}).moveTo(2 * size, 2 * size).lineTo(2 * size, 1 * size);
	nobg.path({stroke: "blue"}).moveTo(1 * size, (Math.atan(0.5) * size)).lineTo(0 * size, 1 * size);
	
	
// Top
	nobg.path({stroke: "red"}).moveTo(0 * size, tansize).
	lineTo(1 * size, 0).
	lineTo(2 * size, 1 * tansize).
	lineTo(1 * size, 2 * tansize).
	lineTo(0, 1 * tansize);
	
// Rhombii
Top Rhombus = 130 deg
Left & Right = 114.5 deg

	// Place before or after a current block
		if (target = "before") {
			blokNano.insertBefore(target);
		}
		else if (target = "after") {
			blokNano.insertAfter(target);
		}
		else {
		 alert("bla");
		}
		
	// Test Script

	var firstblok = blokNano(0, 0, "null");
	for (var i = 0; i < 10; i++) {
		for (var ii = 0; ii < 10; ii++) {
			secondblok = blokNano(i * 40, ii * 40, firstblok, "before");
			firstblok = secondblok;
		}
	}


		//	nobg.path({stroke: "777"}).moveTo(gridW / 2 - blokSize * i, (blokSize / 2) * i).lineTo(gridW - blokSize * i, gridH - (blokSize / 2) * i);



	function blokNano(blokX, blokY, target) {
	// Creates a new block with the specified transform, before or after the supplied target.

	// blokZeta code with 26.565-degree angles for the dimetric projection. Each path is drawn directly on the nobg.
		var blokSideTop = nobg.path({fill: "rgb(211,175,118)"}, "M 51, 13 L 26, 26 L 1, 13 L 26, 0 z");
		var blokSideRight = nobg.path({fill: "rgb(191,155,98)"}, "M 51, 13 L 51, 43 L 26, 55 L 26, 26 z");
		var blokSideLeft = nobg.path({fill: "rgb(171,135,78)"}, "M 26, 26 L 26, 55 L 1, 43 L 1, 13 z");
		var blokLineLeft = nobg.path({stroke: "rgb(231,195,138)", "stroke-width": "2"}).moveTo(1, 13).lineTo(26, 26);
		var blokLineRight = nobg.path({stroke: "rgb(231,195,138)", "stroke-width": "2"}).moveTo(26, 26).lineTo(50, 13);
		var blokLineBottom = nobg.path({stroke: "rgb(231,195,138)", "stroke-width": "2"}).moveTo(26, 26).lineTo(26, 55);
		var blokOutline = nobg.path({fill: "none", stroke: "#444", "stroke-width": "2"}, "M 1, 13 L 26, 0 L 51, 13 L 51, 43 L 26, 55 L 1, 43 z");
		
	// Set all those paths in a set array for easy translation:
		var blokNano = nobg.set();
		blokNano.push(blokSideTop);
		blokNano.push(blokSideRight);
		blokNano.push(blokSideLeft);
		blokNano.push(blokLineLeft);
		blokNano.push(blokLineRight);
		blokNano.push(blokLineBottom);
		blokNano.push(blokOutline);
		
	// Move it accross the screen:
		blokNano.translate(blokX, blokY);
		
	}


			nobg.path({stroke: "#777"}).
			moveTo(blokSize * i, (gridH / 2) + (blokSize / 4) * i).
			lineTo((gridW / 2) - blokSize * i, gridH - (blokSize / 2) * i);
			
			
//(gridW / 2) + i * (blokSize / 2)
		//			moveTo((blokSize / 2) * i, (gridH / 2) + (blokSize / 4) * i).
		//  i * (blokSize / 2)  -- descending
//		nobg.path({stroke: "red", "stroke-width": "2"}).moveTo(gridW / 2, 0).lineTo(gridW, gridH / 2);



//	var W = document.body.clientWidth;
//	var H = document.body.clientHeight;

	var testrect = nobg.rect(0, W, 0, H);
	testrect.attr({stroke: "red", "stroke-width": "3"});
	
	
	// This function places the block on the grid based on its own coordinate system
	function blokPlace(gridblokX, gridblokY) {
		axisX = 0;
		// Checks remainder of gridnum to determine how much the block should be pushed over
//		if (gridblokX % 2) {
		blokplaceX = (gridblokX - 1) * blok2;
		
		halfgrid = gridnum / 2;
		
		if (gridblokY < halfgrid) {
			blokplaceY = (gridH / 2) - ((gridblokY - 1) * blok2);
		} else {
			blokplaceY = (gridH / 2) + ((gridblokY - 1) * blok2)
		}
		
		blokNano(blokplaceX, blokplaceY);
	}
	
	
		// Checks remainder of gridnum to determine how much the block should be pushed over
		if (gridblokY % 2) { // Y odd
			blokplaceX = (blok1 * gridblokX) - blok1; // Move over half spaces for odd
		} else { // Y even
			blokplaceX = (blok1 * gridblokX) - blok1; // And move full space when even
		}
		
		blokplaceX = (blok1 * gridblokX) - blok1;
		
		blokplaceY = 163; // (Y middle)
		
		// Checks remainder of gridnum to determine how much the block should be pushed over
		if (gridblokY % 2) { // Y odd
			blokplaceX = (blok1 * gridblokX) - blok1; // Move horizontally half spaces for odd
			blokplaceY = (gridH / 2 + blok2) - (blok4 * gridblokY);
		} else { // Y even
			blokplaceX = (blok1 * gridblokX) - blok2; // And move horizontally full space when even
			blokplaceY = (gridH / 2 + blok2) - (blok4 * gridblokY);
		}
		
		if (gridblokY % 2) { // if Y is odd
			blokplaceY = (gridH / 2 - blok2) - (blok4 * gridblokY);
			if (gridblokX % 2) { // if X is odd
				blokplaceX = (blok1 * gridblokX);
			} else {
			
			}
		} else { // if Y is even
			blokplaceY = (gridH / 2 + blok2) - (blok4 * gridblokY);
		}
		
			blokplaceX = ((blok1 * gridblokX) - blok1) + ((gridblokY - 1) * blok2); // Move horizontally half spaces for odd
			
 + blok1 * (gridblokY + 1)
 
 - (blok4 * gridblokY)
 
 
 	/*
	blokplaceX = (blok1 * gridblokX) - blok1;
	
	blokplaceY = 163; // (Y middle)
	*/

// ScreenX = OriginX - (MapY * TileWidth / 2) + (MapX * TileWidth / 2) - (TileWidth / 2)
// ScreenY = OriginY + (MapY * TileDepth / 2) + (MapX * TileDepth / 2)
/*
	blokplaceX = OriginX - (gridblokY * blok1 / 2) + (gridblokX * blok1 / 2) - (blok1 / 2);
	blokplaceY = OriginY + (gridblokY * blok2 / 2) + (gridblokX * blok2 / 2);
*/		
//		blokplaceX = (- blokplaceX + gridW);
/*		
	if (gridblokY < halfgrid) {
		blokplaceY = (gridH / 2) - ((gridblokY - 1) * blok2);
	} else {
		blokplaceY = (gridH / 2) + ((gridblokY - 1) * blok2);
	}
*/		
	//alert(blokplaceY);
	

	if (gridblokY % 2) { // if Y is odd
		blokplaceY = ((gridH / 2 - blok2) - (blok4 * gridblokY)) + (gridblokX - 1) * blok4;
	} else { // if Y is even
		blokplaceY = ((gridH / 2 - blok2)) + ((gridblokX - 1) * blok4);
	//	blokplaceY = gridH / 2 - (gridblokX * blok2); // + (gridblokX / 2 * blok4)
	}
	
	
	var transform = $M([
		[Math.cos(angle), -Math.sin(angle), offsX],
		[Math.sin(angle), Math.cos(angle), offsY],
		[0, 0, 1]
	]);
	

	// 45 deg. in radians
//	var angle = Math.PI / 4;
	var angle = 45;

/*	var transform = $M([
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	]); */
	
	var transform = $M([
		[Math.cos(angle), Math.sin(angle), 0],
		[-Math.sin(angle), Math.cos(angle), 0],
		[0, 0, 1]
	]);
	
	var OriginXY = $M([
		[Ax1, Ax2, 0],
		[Ay1, Ay2, 0],
		[0, 0, 1]
	]);
	
	var ScreenXY = OriginXY.x(transform);
	
	alert(ScreenXY.inspect());
	
	
	
	nobg.path({fill: "red"}).
	moveTo(sqtest.x1, sqtest.y1).
	lineTo(sqtest.x1, sqtest.y2).
	lineTo(sqtest.x2, sqtest.y2).
	lineTo(sqtest.x2, sqtest.y1).
	lineTo(sqtest.x1, sqtest.y1);
	
	Bx1 = Ax1 * Math.cos(angle) - Ay1 * Math.sin(angle) + offsX;
	By1 = Ax1 * Math.sin(angle) + Ay1 * Math.cos(angle) + offsY;
	Bx2 = Ax2 * Math.cos(angle) - Ay2 * Math.sin(angle) + offsX;
	By2 = Ax2 * Math.sin(angle) + Ay2 * Math.cos(angle) + offsY;
	
	Bx1 = Ax1 * 1 + Ay1 * Math.cos(angle);
	By1 = Ax1 * Math.cos(angle) + Ay1 * 0;
	Bx2 = Ax2 * 1 + Ay2 * Math.cos(angle);
	By2 = Ax2 * Math.cos(angle) + Ay2 * 0;
	Bx3 = Ax1 * 1 + Ay1 * Math.cos(angle);
	By3 = Ax2 * Math.cos(angle) + Ay1 * 0.5;
	Bx4 = Ax1 * 1 - Ay2 * Math.cos(angle);
	By4 = Ax2 * Math.cos(angle) - Ay2 * 0;
	
	nobg.path({stroke: "red"}).
	moveTo(sqtest.x1, sqtest.y1).
	lineTo(sqtest.x2, sqtest.y2).
	lineTo(sqtest.x3, sqtest.y3).
	lineTo(sqtest.x4, sqtest.y4).
	lineTo(sqtest.x1, sqtest.y1);
	
		Bx[i] = Sq[0] * a + Sq[1] * b; // 1
		By[i] = Sq[0] * c + Sq[1] * d;
		Bx[i] = Sq[1] * a + Sq[0] * b; // 2
		By[i] = Sq[1] * c + Sq[0] * d;
		Bx[i] = Sq[0] * a + Sq[0] * b; // 3
		By[i] = Sq[1] * c + Sq[1] * d;
		Bx[i] = Sq[0] * a + Sq[1] * b; // 4
		By[i] = Sq[1] * c + Sq[0] * d;
		
	return { x1 : x1, y1 : y1, x2 : x2, y2 : y2 , x3 : x3, y3 : y3 , x4 : x4, y4 : y4};
	

/*
	Bx1 = Ax1 * 1 + Ay1 * Math.cos(angle);
	By1 = Ax1 * Math.cos(angle) + Ay1 * 0.5;
	Bx2 = Ax2 * 1 + Ay2 * Math.cos(angle);
	By2 = Ax2 * Math.cos(angle) + Ay2 * 0.5;
	Bx3 = Ax1 * 1 + Ay1 * Math.cos(angle);
	By3 = Ax2 * Math.cos(angle) + Ay1 * 0.5;
	Bx4 = Ax1 * 1 - Ay2 * Math.cos(angle);
	By4 = Ax2 * Math.cos(angle) - Ay2 * 0.5;
*/

	x1 = Math.floor(Bx1);
	y1 = Math.floor(By1);
	x2 = Math.floor(Bx2);
	y2 = Math.floor(By2);
	x3 = Math.floor(Bx3);
	y3 = Math.floor(By3);
	x4 = Math.floor(Bx4);
	y4 = Math.floor(By4);
	
	nobg.path({stroke: "blue"}).
	moveTo(sqtest.x1, sqtest.y1).
	lineTo(sqtest.x2, sqtest.y2).
	lineTo(sqtest.x3, sqtest.y3).
	lineTo(sqtest.x4, sqtest.y4).
	lineTo(sqtest.x1, sqtest.y1);
	
	
	// Identity
	a = 1; b = 0;
	c = 0; d = 1;
	
	// Do not touch, this is how a square is made. (I think... It's necessary, regardless.)
	var iA = [1, 0, 0, 1];
	var iB = [0, 1, 1, 0];
	var iC = [1, 0, 1, 0];
	var iD = [0, 1, 0, 1];



/* NEW DIRECTION, 040609 */


	var hex1 = hexiso(110, 110, 50);
	
	nobg.path({stroke: "#333", "stroke-width":"2"}).
	moveTo(hex1.x[1],hex1.y[1]).
	lineTo(hex1.x[2],hex1.y[2]).
	lineTo(hex1.x[3],hex1.y[3]).
	lineTo(hex1.x[4],hex1.y[4]).
	lineTo(hex1.x[5],hex1.y[5]).
	lineTo(hex1.x[6],hex1.y[6]).
	lineTo(hex1.x[7],hex1.y[7]);
	
	var backbox = hexiso(0, 0, gridW);

	nobg.path({stroke: "#777", fill: "#DDD"}).	// Bottom rhombus
	moveTo(grid.x[7], grid.y[7]).
	lineTo(grid.x[3], grid.y[3]).
	lineTo(grid.x[4], grid.y[4]).
	lineTo(grid.x[5], grid.y[5]).
	lineTo(grid.x[7], grid.y[7]);
	
			
			drawhex(7, 3, 4, 5, set, nobg);
			
			nobg.path({stroke: "#777", fill: "#DDD"}).	// Bottom rhombus
			moveTo(grid.x[7], grid.y[7]).
			lineTo(grid.x[3], grid.y[3]).
			lineTo(grid.x[4], grid.y[4]).
			lineTo(grid.x[5], grid.y[5]).
			lineTo(grid.x[7], grid.y[7]);
			
click(function () {		// Not sure if this piece of code needs less OOP. Based on a nanoael example. REVIEW
			}).mouseover(function () {
				this.animate({fill: "#f57900"}, 0);
			}).mouseout(function () {
				this.animate({fill: "#DDD"}, 200);
			});
			
			
			gridElement.click(gridElement.mouseover(gridElement.animate({fill: "#f57900"}, 0)));
			gridElement.click(gridElement.mouseout(gridElement.animate({fill: "#DDD"}, 200)));
			
			
			
			
.click(function () {
			//	alert('click');
				blok = placeBlok(gridX, gridY, nano);
				blok.insertAfter(gridElement); // TEMP
			});
			gridX = 0;
			gridY = 0;		