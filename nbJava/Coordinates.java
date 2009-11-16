package nanoblok;

import java.util.*;

/**
 * Graphical helper to hold all X/Y coordinates used by the program.
 * @author alex
 */
public class Coordinates {
//	private List<Integer> xArray;
//	private List<Integer> yArray;
	private ArrayList xArray = new ArrayList();
	private ArrayList yArray = new ArrayList();
	
//	private int place = 0;

//	public void Coordinates()
//	{
//	//	xArray = new ArrayList<Integer>();
//	//	yArray = new ArrayList<Integer>();
//	}

	public int getX(int place)
	{
		return (Integer) xArray.get(place);
	}

	public int getY(int place)
	{
		return (Integer) yArray.get(place);
	}

	public void setCoordinate(int x, int y)
	{
		xArray.add(x);
		yArray.add(y);
	//	place++;
	}

	public void offsetCoors(int xOffs, int yOffs)
	{
		for (int i = 0; i < xArray.size(); i++)
		{
			int x, y;
			x = (Integer) xArray.get(i);
			xArray.set(i, x + xOffs);
			y = (Integer) yArray.get(i);
			yArray.set(i, y + yOffs);
		}
	}
}
