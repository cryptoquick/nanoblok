// package nanoblok;

//import java.awt.*;
//import java.awt.Graphics;
//import java.awt.Graphics2D;
//import java.awt.geom.*;
//import javax.swing.*;

/**
 * A prototype class I used once, but now I've moved on and separated much of
 * its functionality to separate classes.
 * @author alex
 */
/*
public class DrawBlock extends JPanel
{
    private int hexSize = 150;
    private HexPoints hexagon;

    // Regular Graphics class.
    private Graphics g;

	public DrawBlock() {
      setBackground(Color.white);
      setPreferredSize(new Dimension(800, 600));
    }

    public void paintComponent(Graphics g)
    {

        // 2D graphics class.
		super.paintComponent(g);
		
        /// Remember to ask about this; why does Graphics2D need parentheses here?
        Graphics2D g2 = (Graphics2D) g;
		
        // Anti-aliasing, to remove jaggies.
		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

		// Color of the object.
		g2.setPaint(Color.blue);

		// Width of the stroke.
		g2.setStroke(new BasicStroke(1));

        // Top Side.
        Coordinates coors;
        coors = new Coordinates();

        hexagon = new HexPoints(coors, hexSize);
        hexagon.setPoint(1);
		hexagon.setPoint(2);
		hexagon.setPoint(7);
		hexagon.setPoint(6);

        // Draw a polygon with four points.
        GeneralPath polygon =
			new GeneralPath(GeneralPath.WIND_EVEN_ODD, 4); // 4 points

        polygon.moveTo(coors.getX(0), coors.getY(0));
        polygon.lineTo(coors.getX(1), coors.getY(1));
        polygon.lineTo(coors.getX(2), coors.getY(2));
        polygon.lineTo(coors.getX(3), coors.getY(3));
        polygon.closePath();

		// Fill the polygon with color, then draw it.
		g2.fill(polygon);
		g2.draw(polygon);
    }
}
*/