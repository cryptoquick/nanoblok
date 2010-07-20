function fillSquare () {
	var time0 = new Date();
	
	var location = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var w = 0;
	var l = 0;
	var i = 0;
	var t;
	
	if ($C.animating == false) {
		time0 = new Date();
		$C.animating = true;
		t = setInterval((function() {
			if (i >= 1023) {
				clearInterval(t);
				time1 = new Date();
				loggit("Square drawn in " + (time1 - time0) + " ms.");
				$C.animating = false;
			}
		
			blockColor = colorBlock($C.selected.color);

			location = {x: l, y: w, z: $C.layerOffset.z};

			var gridPosition = l * $C.gridDims.c + w;

			var coors = GridField["x-" + gridPosition].coors;

			Voxel[location.x][location.y][location.z] = $C.selected.color;

			canvasBlock(coors, location, blockColor);
		
			l++;
			if (l >= 32) {
				w++;
				l = 0;
				$C.posInd.redraw();
			}
			
			i++;
		}), 1);
	}
}