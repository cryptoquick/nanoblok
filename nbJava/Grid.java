/**
 *
 * @author alex
 */

package nanoblok;

import java.awt.Color;
import java.awt.Graphics2D;

public class Grid {
	private int tile25, tile50, tile100;
	private int height, columns, rows;
	private Tile tiles[];

	/**
	 * Construct a Grid object with a number of columns and rows,
	 * and also the tile of its tiles.
	 *
	 * @param colArg
	 * @param rowArg
	 * @param tileArg
	 */
	public Grid (int colArg, int rowArg, int tileArg) {
		columns = colArg;
		rows = rowArg;

		tile100 = tileArg;
		tile25 = tileArg / 4;
		tile50 = tileArg / 2;
		height = tileArg * colArg / 2;
		
		tiles = new Tile[colArg * rowArg];
	}

	public void setGridTile (Tile tile, int location)
	{
		tiles[location] = tile;
	}

	public Tile getGridTile (int location)
	{
		return tiles[location];
	}

	/**
	 * Creates coordinates in an isometric grid pattern.
	 */
	public void makeGrid (Graphics2D g2)
	{
		int tileOffsX, tileOffsY;
		int tileNumber = 0;
		Color tileColor = new Color(221, 221, 221); // Lighter Gray

		for (int y = 0; y < columns; y++)
		{
			for (int x = 0; x < rows; x++)
			{
				tileOffsX = (x * tile50) + (y * tile50);
				tileOffsY = (y * tile25) + (height - x * tile25);

				Tile tile = new Tile(tile100, tileOffsX, tileOffsY);
				tile.setTile();
				tile.setAttrs(tileColor);
				tile.tileNum = tileNumber;
				tile.drawTile(true, g2);

				this.setGridTile(tile, tileNumber);

				tileNumber++;
			}
		}
	}

	public void makeGridLines (Graphics2D g2)
	{
		Tile currentTile;
		Color tileColor = new Color(170, 170, 170); // Light Gray

		for (int i = 0; i < columns * rows; i++)
		{
			currentTile = getGridTile(i);
			currentTile.setTile();
			currentTile.setAttrs(tileColor);
			currentTile.drawTile(false, g2);
		}
	}
}
