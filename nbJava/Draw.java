package nanoblok;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.geom.GeneralPath;

/**
 * The Draw class draws graphics on the screen using the Graphics2D class.
 * @author alex
 */
public class Draw {

	// A good way to keep GeneralPath options sorted.
	private int[] caps = { BasicStroke.CAP_SQUARE, BasicStroke.CAP_BUTT,
		BasicStroke.CAP_ROUND };
	private int[] joins = { BasicStroke.JOIN_MITER, BasicStroke.JOIN_BEVEL,
		BasicStroke.JOIN_ROUND };

	/**
	 * Requires the number of points, a coordinates object, a color object,
	 * the width of the stroke, and a Graphics2D object, in order to draw
	 * any object on the screen from a set number of points.
	 * 
	 * @param numPoints
	 * @param coors
	 * @param fillColor
	 * @param strokeWidth
	 * @param g2
	 */
	public void drawPath (int numPoints, Coordinates coors, Color fillColor,
			float strokeWidth, boolean solid, Graphics2D g2)
	{
		// Color of the object.
		g2.setPaint(fillColor);

		// Width of the stroke.
		g2.setStroke(new BasicStroke(strokeWidth, caps[1], joins[0]));

		// Draw a polygon with four points.
		GeneralPath polygon =
			new GeneralPath(GeneralPath.WIND_EVEN_ODD, numPoints); // 4 points

		/**
		 * Adds the path's points into the polygon in the proper order.
		 */
		for (int count = 0; count < numPoints; count++)
		{
			if (count == 0)
			{
				polygon.moveTo(coors.getX(count), coors.getY(count));
			}

			if (count > 0 && count < numPoints)
			{
				polygon.lineTo(coors.getX(count), coors.getY(count));
			}
		
			if (count == numPoints - 1)
			{
				polygon.closePath();
			}
			
			// Fill the polygon with color, then draw it.
			if (solid == true)
			{
				g2.fill(polygon);
			}

			g2.draw(polygon);
			
		}
	}
}
