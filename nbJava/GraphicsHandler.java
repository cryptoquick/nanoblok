/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package nanoblok;

// import java.awt.*;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import javax.swing.*;

/**
 * All surfaces to be painted must be sent to this function. I expect this to
 * grow and evolve as time goes on.
 * @author alex
 */
public class GraphicsHandler extends JPanel {

	public GraphicsHandler () {
		setPreferredSize(new Dimension(800, 600));
		setBackground(Color.white);
	}
//	private Graphics g;
	@Override
	public void paintComponent(Graphics g)
	{
		// 2D graphics class.
		super.paintComponent(g);
		
		Graphics2D g2 = (Graphics2D) g;

        // Anti-aliasing, to remove jaggies.
		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
				RenderingHints.VALUE_ANTIALIAS_ON);

		Block demoBlock = new Block(100, 50, 50);
		demoBlock.makeBlock(demoBlock);
		demoBlock.drawBlock(g2);

		Grid mainGrid = new Grid(32, 32, 25);
		mainGrid.makeGrid(g2);
		mainGrid.makeGridLines(g2);
	}
}