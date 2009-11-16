package nanoblok;

import javax.swing.*;
import java.awt.*;

/**
 *
 * @author alex
 */
public class MainWindow extends JFrame {
	
	public MainWindow()
	{
		// Window title.
		super("nanoblok j0.1-dev");

//		final int WINDOW_WIDTH = 800,
//				  WINDOW_HEIGHT = 600;

		// Window size.
		setSize(800, 600);

		// Close window.
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		Container content = getContentPane();

		JPanel testPanel = new JPanel();
		testPanel.setBackground(Color.white);

		GraphicsHandler paintFrame = new GraphicsHandler();

		testPanel.add(paintFrame, BorderLayout.SOUTH);
		content.add(testPanel);

		// Display window.
		setVisible(true);

	/*	addWindowListener(new WindowAdapter()
		{
			public void windowClosing(WindowEvent e)
			{
				dispose();
				System.exit(0);
			}
		} */

	}
}