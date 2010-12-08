// package nanoblok;

import java.util.*;

/**
 * Graphical helper to hold all X/Y coordinates used by the program.
 * @author alex
 */
public class Coordinates {
//	private List<Integer> xArray;
//	private List<Integer> yArray;
	// private ArrayList xArray;
	// private ArrayList yArray;
	private int arrSize = 32 * 32;
	
	private int[] xArray = new int[arrSize];
	private int[] yArray = new int[arrSize];
	
	private int arrPlace = 0;
	
//	private int place = 0;

	public void Coordinates()
	{

	}

	public int getX(int place)
	{
		return (Integer) xArray[place];
	}

	public int getY(int place)
	{
		return (Integer) yArray[place];
	}

	@SuppressWarnings("unchecked")
	public void setCoordinate(int x, int y)
	{
		xArray[arrPlace] = x;
		yArray[arrPlace] = y;
		arrPlace++;
	}

	@SuppressWarnings("unchecked") 
	public void offsetCoors(int xOffs, int yOffs)
	{
		for (int i = 0; i < arrSize; i++)
		{
			int x, y;
			x = (Integer) xArray[i];
			xArray[i] = x + xOffs;
			y = (Integer) yArray[i];
			yArray[i] = y + yOffs;
		}
	}
}
