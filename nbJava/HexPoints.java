package nanoblok;

/**
 * This class is essential for rendering orthogonal isometric 'cubes' (in reality, hexagons).
 * @author alex
 */
public class HexPoints
{
    // These are all integers, as you cannot have float pixels.
    private int size0, size25, size50, size75, size100;
    private int pointX, pointY;
    private Coordinates coors;

	/**
	 * Constructor needed to assign proportions to a hexagon based on its overall size.
	 * Isometric hexagons only occupy a square, not a rectangle, and thus, need only one size value.
	 * @param hexSize
	 * @param coors
	 */
    public HexPoints(Coordinates coorsArg, int hexSize)
	{
		size0 = 0;
		size25 = hexSize / 4;
		size50 = hexSize / 2;
		size75 = hexSize / 4 + hexSize / 2; // Better integer division.
		size100 = hexSize;
		coors = coorsArg;
	}

    /**
     * Returns a Coordinate object with the coordinates of the specified point of the hexagon.
     */

    public void setPoint(int point)
    {
	//	int point = pointNumber;

        switch (point)
        {
        case 1 :
            pointX = size50;
            pointY = size0;
            break;
        case 2 :
            pointX = size100;
            pointY = size25;
            break;
        case 3 :
            pointX = size100;
            pointY = size75;
            break;
        case 4 :
            pointX = size50;
            pointY = size100;
            break;
        case 5 :
            pointX = size0;
            pointY = size75;
            break;
        case 6 :
            pointX = size0;
            pointY = size25;
            break;
        case 7 :
            pointX = size50;
            pointY = size50;
            break;
        }

        coors.setCoordinate(pointX, pointY);

    //    return coors;
    }

	public Coordinates getCoors ()
	{
		return coors;
	}
}
