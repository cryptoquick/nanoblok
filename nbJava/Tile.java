// package nanoblok;

import java.awt.Color;
import java.awt.Graphics2D;

/**
 * Similar to the Block class, but for Grid tiles.
 *
 * @author alex
 */
public class Tile
{
	private int size, offsX, offsY;
	private Coordinates tile;
	private Color tileColor;

	// A public tile number that can be set to keep track of the tile.
	public int tileNum;

	public Tile (int sizeArg, int offsXarg, int offsYarg)
	{
		size = sizeArg;
		offsX = offsXarg;
		offsY = offsYarg;
	}

	public void setTile ()
	{
		tile = new Coordinates();
		HexPoints hexagon = new HexPoints(tile, size);

		hexagon.setPoint(1);
		hexagon.setPoint(2);
		hexagon.setPoint(7);
		hexagon.setPoint(6);
	}

	public void setAttrs (Color newColor)
	{
		tileColor = newColor;
	}

	public void drawTile (boolean solid, Graphics2D g2)
	{
		tile.offsetCoors(offsX, offsY);

		Draw canvas = new Draw();

		canvas.drawPath (4, tile, tileColor, 1, solid, g2);
	}
}
