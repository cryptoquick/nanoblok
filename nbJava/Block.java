/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package nanoblok;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import javax.swing.JPanel;


/**
 * Creates the coordinates for a graphical 'block' with 3 sides (quads), and an outline.
 * @author alex
 */
public class Block extends JPanel
{
    private Coordinates sideTop, sideLeft, sideRight, outline;
	private int blockSize, offsetX, offsetY;

	public Block(int blockSizeArg, int offsetXarg, int offsetYarg)
	{
		setBackground(Color.white);
		setPreferredSize(new Dimension(800, 600));

		blockSize = blockSizeArg;
		offsetX = offsetXarg;
		offsetY = offsetYarg;
    }

	/**
	 * Depending on which side is called, it will return those coordinates in a new coordinate object.
	 * @param side
	 */
    public void setSide(char side)
    {
	//	Coordinates coors;
	//	coors = new Coordinates();
		HexPoints hexagon;// = new HexPoints(blockSize, coors);
		
        switch (side) {
            case 'T' : // T for Top
				sideTop = new Coordinates();
				hexagon = new HexPoints(sideTop, blockSize);

				hexagon.setPoint(1);
				hexagon.setPoint(2);
				hexagon.setPoint(7);
				hexagon.setPoint(6);

				break;

            case 'L' : // L for Left
				sideLeft = new Coordinates();
				hexagon = new HexPoints(sideLeft, blockSize);

				hexagon.setPoint(2);
				hexagon.setPoint(3);
				hexagon.setPoint(4);
				hexagon.setPoint(7);

				break;

            case 'R' : // R for Right
				sideRight = new Coordinates();
				hexagon = new HexPoints(sideRight, blockSize);

				hexagon.setPoint(4);
				hexagon.setPoint(5);
				hexagon.setPoint(6);
				hexagon.setPoint(7);

				break;
        }
    }

	// Six-point outline.
	public void setOutline() {
		outline = new Coordinates();
		HexPoints hexagon = new HexPoints(outline, blockSize);

		hexagon.setPoint(1);
		hexagon.setPoint(2);
		hexagon.setPoint(3);
		hexagon.setPoint(4);
		hexagon.setPoint(5);
		hexagon.setPoint(6);
	}

	public void makeBlock(Block newBlock)
    {
        newBlock.setSide('T');
		newBlock.setSide('L');
		newBlock.setSide('R');

		newBlock.setOutline();
    }

	public Coordinates getSide(char side)
	{
		Coordinates coors = new Coordinates();

		switch (side)
		{
			case 'T' :
			coors = sideTop;
			break;

			case 'L' :
			coors = sideLeft;
			break;

			case 'R' :
			coors = sideRight;
			break;
		}

		return coors;
	}

	public Coordinates getOutline()
	{
		Coordinates coors = new Coordinates();

		coors = outline;

		return coors;
	}

	public void drawBlock(Graphics2D g2)
	{
	//	GraphicsHandler gHandler = new GraphicsHandler();
	//	Graphics2D g2 = gHandler.getGraphics();
		int offsX = 50;
		int offsY = 50;

		sideTop.offsetCoors(offsX, offsY);
		sideLeft.offsetCoors(offsX, offsY);
		sideRight.offsetCoors(offsX, offsY);
		outline.offsetCoors(offsX, offsY);

		Draw canvas = new Draw();

		Coordinates outlineCoors = this.getOutline();
		Color outlineColor = new Color(51, 51, 51); // Dark Gray
		canvas.drawPath (6, outlineCoors, outlineColor, 10, true, g2);

		Coordinates topCoors = this.getSide('T');
		Color topColor = new Color(211, 175, 118); // Light Brown
		canvas.drawPath (4, topCoors, topColor, 1, true, g2);

		Coordinates leftCoors = this.getSide('L');
		Color leftColor = new Color(171, 135, 78); // Medium Brown
		canvas.drawPath (4, leftCoors, leftColor, 1, true, g2);

		Coordinates rightCoors = this.getSide('R');
		Color rightColor = new Color(191, 155, 98); // Dark Brown
		canvas.drawPath (4, rightCoors, rightColor, 1, true, g2);

				//public void drawPath (int numPoints, Coordinates coors, Graphics2D g2)
	}
}
