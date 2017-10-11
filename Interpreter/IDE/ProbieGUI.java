import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.util.Map.Entry;

import javax.swing.AbstractAction;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;

public class ProbieGUI extends JFrame {

	JLabel[][] f;
	final Dimension d = new Dimension(20, 20);
	final Color red = new Color(255, 191, 191);
	final Color green = new Color(191, 255, 191);
	final Color blue = new Color(191, 191, 255);
	final Color pink = new Color(255, 191, 255);

	int rx = 0, ry = 0, wx = 0, wy = 0, mx = 0, my = 0, tx = 0, ty = 0;

	static boolean doMore = true;

	public ProbieGUI() {
		int max = 0;
		f = new JLabel[Probie.field.length][];
		for (int i = 0; i < f.length; i++) {
			f[i] = new JLabel[Probie.field[i].length];
			if (max < Probie.field[i].length)
				max = Probie.field[i].length;
			for (int j = 0; j < f[i].length; j++) {
				f[i][j] = new JLabel(Probie.field[i][j] + "");
				f[i][j].setOpaque(true);
				f[i][j].setSize(d);
				f[i][j].setPreferredSize(d);
				f[i][j].setHorizontalAlignment(SwingConstants.CENTER);
				f[i][j].setBackground(Color.WHITE);
				f[i][j].setBorder(null);
			}
		}

		JPanel p = new JPanel();
		p.setLayout(new GridLayout(f.length, max, 0, 0));

		for (int i = 0; i < f.length; i++) {
			for (int j = 0; j < max; j++) {
				try {
					p.add(f[i][j]);
				} catch (Exception e) {
					p.add(new JLabel());
				}
			}
		}

		p.getInputMap().put(KeyStroke.getKeyStroke(KeyEvent.VK_RIGHT, 0), "RIGHT");
		p.getActionMap().put("RIGHT", new AbstractAction() {

			@Override
			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				if (doMore) {
					new Thread(() -> next()).start();
				}
			}

		});

		add(p);
		pack();

		setResizable(false);
		setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
		setVisible(true);
		setTitle("Value of Probe : (¡Û)");

		f[0][0].setBackground(red);
		p.setFocusable(true);
		p.requestFocusInWindow();
	}

	void next() {
		doMore = false;
		Probie.interpret2(Probie.p.read());
		Entry<Integer, Integer> r = Probie.p.getRead(), w = Probie.p.getWrite(), m = Probie.p.getMem();

		try {
			f[ty][tx].setBackground(Color.WHITE);
		} catch (Exception ignored) {
		}

		try {
			f[my][mx].setBackground(Color.WHITE);
		} catch (Exception ignored) {
		}
		try {
			f[wy][wx].setBackground(Color.WHITE);
		} catch (Exception ignored) {
		}
		try {
			f[ry][rx].setBackground(Color.WHITE);
		} catch (Exception ignored) {
		}
		try {
			f[m.getValue()][m.getKey()].setBackground(blue);
		} catch (Exception ignored) {
		}
		try {
			f[w.getValue()][w.getKey()].setBackground(green);
		} catch (Exception ignored) {
		}
		try {
			f[r.getValue()][r.getKey()].setBackground(red);
		} catch (Exception ignored) {
		}
		for (int i = 0; i < f.length; i++) {
			for (int j = 0; j < f[i].length; j++) {
				if (!(f[i][j].getText().charAt(0) == Probie.field[i][j])) {
					f[i][j].setBackground(pink);
					ty = i;
					tx = j;
					f[i][j].setText(Probie.field[i][j] + "");
				}
			}
		}

		my = m.getValue();
		mx = m.getKey();
		wy = w.getValue();
		wx = w.getKey();
		ry = r.getValue();
		rx = r.getKey();
		doMore = true;
	}

	void detach() {
		setVisible(false);
	}

}
