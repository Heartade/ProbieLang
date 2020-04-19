import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.StringSelection;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.event.ActionEvent;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;

import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.ActionMap;
import javax.swing.BorderFactory;
import javax.swing.InputMap;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingUtilities;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.filechooser.FileFilter;

public class ProbieIDE extends JFrame {

	JTextArea a;
	JScrollPane sp;
	JMenuBar mb;

	static Object holder = new Object();

	private static ProbieIDE ps;
	ProbieConsole pc;
	ProbieGUI pg;
	ProbieHelp ph = ProbieHelp.getInstance();
	ProbieFind pf = ProbieFind.getInstance();

	static final Dimension d = Toolkit.getDefaultToolkit().getScreenSize();
	static Font f, f2;

	boolean edited = false;

	File fileBuf = null;

	final FileFilter ff = new FileFilter() {

		@Override
		public boolean accept(File f) {
			if (f.getAbsolutePath().endsWith(".bie"))
				return true;
			if (f.isDirectory())
				return true;
			return false;
		}

		@Override
		public String getDescription() {
			return "Probie Source File(.bie)";
		}

	};

	static JFileChooser fc = new JFileChooser();

	static {
		try {
			f = Font.createFont(Font.TRUETYPE_FONT, new File("Monospace.ttf"));
			f2 = Font.createFont(Font.TRUETYPE_FONT, new File("Monospace.ttf"));
			f2 = f2.deriveFont(14f);
			f = f.deriveFont(18f).deriveFont(Font.BOLD);
		} catch (FontFormatException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}

	static ProbieIDE getInstance() {
		return (ps == null ? ps = new ProbieIDE() : ps);
	}

	private ProbieIDE() {
		ps = this;
		JPanel p = new JPanel();
		p.setLayout(new BorderLayout());
		p.setFocusable(true);
		p.requestFocusInWindow();

		mb = new JMenuBar();

		// Menu File

		JMenu file = new JMenu("File(1)");
		file.setMnemonic(KeyEvent.VK_1);

		JMenuItem file_N = new JMenuItem("New...");
		file_N.addActionListener((e) -> file_new());
		file_N.setMnemonic(KeyEvent.VK_N);
		file_N.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_N, InputEvent.CTRL_DOWN_MASK));
		file.add(file_N);

		JMenuItem file_O = new JMenuItem("Open...");
		file_O.addActionListener((e) -> file_open());
		file_O.setMnemonic(KeyEvent.VK_O);
		file_O.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_O, InputEvent.CTRL_DOWN_MASK));
		file.add(file_O);

		JMenuItem file_S = new JMenuItem("Save...");
		file_S.addActionListener((e) -> file_save());
		file_S.setMnemonic(KeyEvent.VK_S);
		file_S.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_S, InputEvent.CTRL_DOWN_MASK));
		file.add(file_S);

		JMenuItem file_A = new JMenuItem("Save As...");
		file_A.addActionListener((e) -> file_save_as());
		file_A.setMnemonic(KeyEvent.VK_A);
		file_A.setAccelerator(
				KeyStroke.getKeyStroke(KeyEvent.VK_S, InputEvent.CTRL_DOWN_MASK + InputEvent.SHIFT_DOWN_MASK));
		file.add(file_A);

		file.addSeparator();

		JMenuItem file_C = new JMenuItem("Close");
		file_C.addActionListener((e) -> file_close());
		file_C.setMnemonic(KeyEvent.VK_C);
		file_C.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F4, InputEvent.ALT_DOWN_MASK));
		file.add(file_C);

		mb.add(file);

		// Menu Edit

		JMenu edit = new JMenu("Edit(2)");
		edit.setMnemonic(KeyEvent.VK_2);

		JMenuItem edit_T = new JMenuItem("Cut");
		edit_T.addActionListener((e) -> edit_cut());
		edit_T.setMnemonic(KeyEvent.VK_T);
		edit_T.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_X, InputEvent.CTRL_DOWN_MASK));
		edit.add(edit_T);

		JMenuItem edit_C = new JMenuItem("Copy");
		edit_C.addActionListener((e) -> edit_copy());
		edit_C.setMnemonic(KeyEvent.VK_C);
		edit_C.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_C, InputEvent.CTRL_DOWN_MASK));
		edit.add(edit_C);

		JMenuItem edit_P = new JMenuItem("Paste");
		edit_P.addActionListener((e) -> edit_paste());
		edit_P.setMnemonic(KeyEvent.VK_P);
		edit_P.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_V, InputEvent.CTRL_DOWN_MASK));
		edit.add(edit_P);

		edit.addSeparator();

		JMenuItem edit_F = new JMenuItem("Find");
		edit_F.addActionListener((e) -> edit_find());
		edit_F.setMnemonic(KeyEvent.VK_F);
		edit_F.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F, InputEvent.CTRL_DOWN_MASK));
		edit.add(edit_F);

		JMenuItem edit_R = new JMenuItem("Replace");
		edit_R.addActionListener((e) -> edit_replace());
		edit_R.setMnemonic(KeyEvent.VK_R);
		edit_R.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_R, InputEvent.CTRL_DOWN_MASK));
		edit.add(edit_R);

		mb.add(edit);

		// Menu Run

		JMenu run = new JMenu("Run(3)");
		run.setMnemonic(KeyEvent.VK_3);

		JMenuItem run_C = new JMenuItem("Run with Console");
		run_C.addActionListener((e) -> runConsole());
		run_C.setMnemonic(KeyEvent.VK_C);
		run_C.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F11, InputEvent.ALT_DOWN_MASK));
		run.add(run_C);

		JMenuItem run_S = new JMenuItem("Run with Simulator");
		run_S.addActionListener((e) -> runSimulator());
		run_S.setMnemonic(KeyEvent.VK_S);
		run_S.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F12, InputEvent.ALT_DOWN_MASK));
		run.add(run_S);

		mb.add(run);

		// Menu Help

		JMenu help = new JMenu("Help(4)");
		help.setMnemonic(KeyEvent.VK_4);

		JMenuItem help_H = new JMenuItem("Help...");
		help_H.addActionListener((e) -> help_help());
		help_H.setMnemonic(KeyEvent.VK_H);
		help_H.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_F1, 0));
		help.add(help_H);

		mb.add(help);

		setJMenuBar(mb);

		a = new JTextArea();
		a.setEditable(true);
		a.setOpaque(true);
		a.setFont(f);

		sp = new JScrollPane(a);
		p.add(sp);

		InputMap im = p.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW);
		ActionMap am = p.getActionMap();

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_W, InputEvent.ALT_DOWN_MASK), "print W");
		am.put("print W", getAction(2));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_A, InputEvent.ALT_DOWN_MASK), "print A");
		am.put("print A", getAction(1));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_S, InputEvent.ALT_DOWN_MASK), "print S");
		am.put("print S", getAction(3));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_D, InputEvent.ALT_DOWN_MASK), "print D");
		am.put("print D", getAction(0));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_I, InputEvent.ALT_DOWN_MASK), "print I");
		am.put("print I", getAction(4));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_J, InputEvent.ALT_DOWN_MASK), "print J");
		am.put("print J", getAction(6));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_K, InputEvent.ALT_DOWN_MASK), "print K");
		am.put("print K", getAction(5));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_L, InputEvent.ALT_DOWN_MASK), "print L");
		am.put("print L", getAction(7));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_T, InputEvent.ALT_DOWN_MASK), "print T");
		am.put("print T", getAction(8));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_F, InputEvent.ALT_DOWN_MASK), "print F");
		am.put("print F", getAction(10));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_G, InputEvent.ALT_DOWN_MASK), "print G");
		am.put("print G", getAction(9));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_H, InputEvent.ALT_DOWN_MASK), "print H");
		am.put("print H", getAction(11));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_Z, InputEvent.ALT_DOWN_MASK), "print Z");
		am.put("print Z", getAction(16));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_X, InputEvent.ALT_DOWN_MASK), "print X");
		am.put("print X", getAction(17));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_M, InputEvent.ALT_DOWN_MASK), "print M");
		am.put("print M", getAction(12));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_N, InputEvent.ALT_DOWN_MASK), "print N");
		am.put("print N", getAction(13));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_V, InputEvent.ALT_DOWN_MASK), "print V");
		am.put("print V", getAction(15));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_B, InputEvent.ALT_DOWN_MASK), "print B");
		am.put("print B", getAction(14));

		im.put(KeyStroke.getKeyStroke(KeyEvent.VK_C, InputEvent.ALT_DOWN_MASK), "print C");
		am.put("print C", new AbstractAction() {

			@Override
			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				try {
					int pos = a.getCaretPosition();
					String s = a.getText().substring(pos - 2, pos).toLowerCase();
					char res = 0;

					switch (s.charAt(0)) {
					case '0':
					case '1':
					case '2':
					case '3':
					case '4':
					case '5':
					case '6':
					case '7':
					case '8':
					case '9':
						res += 16 * (s.charAt(0) - '0');
						break;
					case 'a':
					case 'b':
					case 'c':
					case 'd':
					case 'e':
					case 'f':
						res += 16 * (s.charAt(0) - 'a' + 10);
						break;
					default:
						throw new Exception();
					}

					switch (s.charAt(1)) {
					case '0':
					case '1':
					case '2':
					case '3':
					case '4':
					case '5':
					case '6':
					case '7':
					case '8':
					case '9':
						res += s.charAt(1) - '0';
						break;
					case 'a':
					case 'b':
					case 'c':
					case 'd':
					case 'e':
					case 'f':
						res += s.charAt(1) - 'a' + 10;
						break;
					default:
						throw new Exception();
					}

					StringBuffer sb = new StringBuffer(a.getText());
					sb.replace(pos - 2, pos, Probie.getChar(res) + "");
					a.setText(sb.toString());
					a.setCaretPosition(pos - 1);
				} catch (Exception ex) {
					JOptionPane.showMessageDialog(ps,
							"Given characters are not available to convert\n\nUsage: type two hexadecimal characters and use this.",
							"Conversion Error", JOptionPane.ERROR_MESSAGE);
				}
			}

		});

		add(p);

		setSize(800, 600);
		setLocation(400, 300);
		setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
		setResizable(true);
		setTitle("Probie IDE");
		setVisible(true);

		addWindowListener(new WindowListener() {

			@Override
			public void windowOpened(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowClosing(WindowEvent e) {
				// TODO Auto-generated method stub
				if (edited) {
					if (ask_save()) {
						dispose();
						System.exit(0);
					}
				}
			}

			@Override
			public void windowClosed(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowIconified(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowDeiconified(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowActivated(WindowEvent e) {
				// TODO Auto-generated method stub

			}

			@Override
			public void windowDeactivated(WindowEvent e) {
				// TODO Auto-generated method stub

			}

		});

		a.getDocument().addDocumentListener(new DocumentListener() {

			@Override
			public void insertUpdate(DocumentEvent e) {
				// TODO Auto-generated method stub
				if (!edited)
					edit(true);
			}

			@Override
			public void removeUpdate(DocumentEvent e) {
				// TODO Auto-generated method stub
				if (!edited)
					edit(true);
			}

			@Override
			public void changedUpdate(DocumentEvent e) {
				// TODO Auto-generated method stub

			}

		});

		a.requestFocusInWindow();
	}

	Action getAction(int i) {
		return new AbstractAction() {

			@Override
			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				printChar(i);
			}

		};
	}

	void printChar(int i) {
		String c = "";
		switch (i) {
		case 0:
			c = "→";
			break;
		case 1:
			c = "←";
			break;
		case 2:
			c = "↑";
			break;
		case 3:
			c = "↓";
			break;
		case 4:
			c = "△";
			break;
		case 5:
			c = "▽";
			break;
		case 6:
			c = "◁";
			break;
		case 7:
			c = "▷";
			break;
		case 8:
			c = "▲";
			break;
		case 9:
			c = "▼";
			break;
		case 10:
			c = "◀";
			break;
		case 11:
			c = "▶";
			break;
		case 12:
			c = "×";
			break;
		case 13:
			c = "÷";
			break;
		case 14:
			c = "∧";
			break;
		case 15:
			c = "∨";
			break;
		case 16:
			c = "↔";
			break;
		case 17:
			c = "↕";
			break;
		}

		int pos = a.getCaretPosition();
		StringBuffer sb = new StringBuffer(a.getText());
		sb.replace(pos, pos, c);
		a.setText(sb.toString());
		a.setCaretPosition(pos + 1);
	}

	void runConsole() {
		String[] s = a.getText().split("\n");

		pc = new ProbieConsole();
		Probie.init();
		Probie.stop = false;
		Probie.read(s);
		Probie.setOutput(pc.a);
		Probie.setInput(pc.f);
		new Thread(() -> {
			try {
				Probie.interpret();
			} catch (Exception e) {
				pc.a.setText(pc.a.getText() + "\nIndexError: " + e.getMessage());
				Probie.stop();
			}
		}).start();
	}

	void stopConsole() {
		ProbieGUI.doMore = false;
		try {
			pg.detach();
		} catch (Exception ignored) {
		}
		pc.a.setText(pc.a.getText() + "\n\nFinished operating. Close the console to exit.");
		pc.stop();
	}

	void enableInput() {
		pc.f.setEditable(true);
	}

	void runSimulator() {
		String[] s = a.getText().split("\n");

		pc = new ProbieConsole();
		Probie.init();
		Probie.stop = false;
		Probie.read(s);
		Probie.setOutput(pc.a);
		Probie.setInput(pc.f);
		new Thread(() -> {
			try {
				ProbieGUI.doMore = true;
				pg = new ProbieGUI();
			} catch (Exception e) {
				pc.a.setText(pc.a.getText() + "\nIndexError: " + e.getMessage());
				Probie.stop();
			}
		}).start();
	}

	void edit(boolean edit) {
		if (edit && !edited) {
			setTitle(getTitle() + " *");
			edited = edit;
		} else if (!edit && edited) {
			setTitle(getTitle().substring(0, getTitle().lastIndexOf(" *")));
			edited = edit;
		}
	}

	boolean ask_save() {
		int res = JOptionPane.showConfirmDialog(ps, "File is not yet saved. Do you want to save it?", "Save File",
				JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
		if (res == JOptionPane.YES_OPTION) {
			file_save();
			return true;
		} else if (res == JOptionPane.NO_OPTION)
			return true;
		else
			return false;
	}

	void save() throws Exception {
		PrintWriter pw = new PrintWriter(new FileOutputStream(fileBuf));
		for (int i = 0; i < a.getLineCount(); i++) {
			pw.println(a.getText(a.getLineStartOffset(i), a.getLineEndOffset(i) - a.getLineStartOffset(i)));
			pw.flush();
		}
		pw.close();
		edit(false);
	}

	void find(String s) {
		int pos = a.getSelectedText() == null ? a.getCaretPosition() : a.getSelectionEnd();
		int res = a.getText().indexOf(s, pos);
		if (res == -1) {
			Toolkit.getDefaultToolkit().beep();
		} else {
			a.setSelectionStart(res);
			a.setSelectionEnd(res + s.length());
		}
	}

	void replace(String s, String t) {
		int pos = a.getSelectedText() == null ? a.getCaretPosition() : a.getSelectionStart();
		int res = a.getText().indexOf(s, pos);
		if (res == -1) {
			Toolkit.getDefaultToolkit().beep();
		} else {
			StringBuilder sb = new StringBuilder(a.getText());
			sb.replace(res, res + s.length(), t);
			a.setText(sb.toString());
			a.setCaretPosition(res + s.length());
		}
	}

	void replaceAll(String s, String t) {
		int pos = a.getCaretPosition();
		a.setText(a.getText().replace(s, t));
		a.setCaretPosition(pos);
	}

	// Menus

	void file_new() {
		if (edited) {
			if (!ask_save())
				return;
		}
		fileBuf = null;
		a.setText("");
		edit(false);
		setTitle("Probie IDE");
	}

	void file_save() {
		if (fileBuf == null) {
			if (!edited)
				return;
			fc.setFileFilter(ff);
			try {
				fc.setCurrentDirectory(fileBuf.getParentFile());
			} catch (Exception ignored) {
			}
			int res = fc.showSaveDialog(ps);
			if (res == JFileChooser.APPROVE_OPTION) {
				File f = fc.getSelectedFile();
				if (!f.getName().endsWith(".bie")) {
					f = new File(f.getAbsolutePath() + ".bie");
				}
				try {
					fileBuf = f;
					save();
					setTitle("Probie IDE - " + f.getName());
				} catch (Exception ignored) {
				}
			}
		} else {
			try {
				save();
			} catch (Exception ignored) {
			}
		}
	}

	void file_save_as() {
		fc.setFileFilter(ff);
		try {
			fc.setCurrentDirectory(fileBuf.getParentFile());
		} catch (Exception ignored) {
		}
		int res = fc.showSaveDialog(ps);
		if (res == JFileChooser.APPROVE_OPTION) {
			File f = fc.getSelectedFile();
			if (!f.getName().endsWith(".bie")) {
				f = new File(f.getAbsolutePath() + ".bie");
			}
			try {
				fileBuf = f;
				save();
				setTitle("Probie IDE - " + f.getName());
			} catch (Exception ignored) {
			}
		}
	}

	void file_open() {
		if (edited) {
			if (!ask_save())
				return;
		}
		fc.setFileFilter(ff);
		try {
			fc.setCurrentDirectory(fileBuf.getParentFile());
		} catch (Exception ignored) {
		}
		int res = fc.showOpenDialog(ps);
		if (res == JFileChooser.APPROVE_OPTION) {
			File f = fc.getSelectedFile();
			try {
				BufferedReader br = new BufferedReader(new FileReader(f));
				String out = "";
				String s = "";
				while ((s = br.readLine()) != null) {
					out += s.replaceAll("\\n", "") + "\n";
				}
				out = out.replaceAll("\\n\\n", "\n");
				out = out.substring(0, out.length() - 1);
				a.setText(out);
				fileBuf = f;
				edit(false);
				br.close();
				setTitle("Probie IDE - " + f.getName());
			} catch (Exception ignored) {
			}
		}
	}

	void file_close() {// FIXME Test it
		ps.dispatchEvent(new WindowEvent(ps, WindowEvent.WINDOW_CLOSING));
	}

	void edit_cut() {
		edit_copy();
		int start = a.getSelectionStart(), end = a.getSelectionEnd();

		StringBuffer sb = new StringBuffer(a.getText());
		sb.replace(start, end, "");
		a.setText(sb.toString());
		a.setCaretPosition(start);
	}

	void edit_copy() {
		StringSelection ss = new StringSelection(a.getSelectedText());
		Toolkit.getDefaultToolkit().getSystemClipboard().setContents(ss, ss);
	}

	void edit_paste() {
		try {
			Object o = Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor);
			if (!(o instanceof String))
				throw new IOException();
			String s = (String) o;
			int b = a.getCaretPosition();
			StringBuffer sb = new StringBuffer(a.getText());
			sb.replace(b, b, s);
			a.setText(sb.toString());
		} catch (HeadlessException | UnsupportedFlavorException | IOException e1) {
			JOptionPane.showMessageDialog(ps, "Can't paste contents in the clipboard!", "Paste Error",
					JOptionPane.ERROR_MESSAGE);
		}
	}

	void edit_find() {
		if (!pf.isVisible()) {
			pf.setVisible(true);
			pf.setReplace(false);
		} else {
			pf.requestFocusInWindow();
			Toolkit.getDefaultToolkit().beep();
		}
	}

	void edit_replace() {
		if (!pf.isVisible()) {
			pf.setVisible(true);
			pf.setReplace(true);
		} else {
			pf.requestFocusInWindow();
			Toolkit.getDefaultToolkit().beep();
		}
	}

	void run_console() {
		file_save();
		runConsole();
	}

	void run_simulator() {
		file_save();
		runSimulator();
	}

	void help_help() {
		ph.setVisible(true);
	}

	public static void main(String[] args) {
		SwingUtilities.invokeLater(() -> new ProbieIDE());
	}

	class ProbieConsole extends JFrame {
		JTextArea a;
		JScrollPane sp;
		JTextField f;

		public ProbieConsole() {
			Container p = getContentPane();
			p.setLayout(new BorderLayout());

			a = new JTextArea();
			a.setEditable(false);
			a.setOpaque(true);
			a.setBackground(Color.BLACK);
			a.setForeground(Color.WHITE);
			a.setFont(ProbieIDE.f);
			a.setAutoscrolls(true);
			a.getCaret().setVisible(true);

			sp = new JScrollPane(a);
			p.add(sp);

			f = new JTextField();
			f.setOpaque(true);
			f.setEditable(true);
			f.setFont(ProbieIDE.f);
			f.addKeyListener(new KeyListener() {

				@Override
				public void keyTyped(KeyEvent e) {
					// TODO Auto-generated method stub
				}

				@Override
				public void keyPressed(KeyEvent e) {
					// TODO Auto-generated method stub
					if (e.getKeyCode() == KeyEvent.VK_ENTER) {
						Probie.userInput(f.getText());
						f.setText("");
					}
				}

				@Override
				public void keyReleased(KeyEvent e) {
					// TODO Auto-generated method stub

				}

			});
			p.add(f, BorderLayout.SOUTH);

			setResizable(true);
			setTitle("Probie Console");
			setSize(800, 600);
			setLocation(d.width - 1200, d.height - 900);
			setVisible(true);
		}

		void stop() {
			f.setEditable(false);
			f.setEnabled(false);
		}
	}
}

class ProbieHelp extends JFrame {
	private static ProbieHelp ph = null;

	static ProbieHelp getInstance() {
		if (ph == null) {
			ph = new ProbieHelp();
		}
		return ph;
	}

	private ProbieHelp() {
		setLayout(new BorderLayout());

		JLabel l = new JLabel("<html>This IDE is for a cute two-dimensional esolang, PROBIE.<br><br>"
				+ "Since PROBIE uses many special characters,<br>"
				+ "this IDE has lots of shortcuts for entering such special characters.<br>"
				+ "Most shortcuts consists of alt key and a character.<br>" + "Below is the list of shortcuts:<br>"
				+ "<ul type=\"dot\"><li>↑, ←, ↓, →: (Alt-W), (Alt-A), (Alt-S), (Alt-D)<br></li>"
				+ "<li>△, ◁, ▽, ▷: (Alt-I), (Alt-J), (Alt-K), (Alt-L)</li>"
				+ "<li>▲, ◀ , ▶, ▼: (Alt-T), (Alt-F), (Alt-G), (Alt-H)</li>" + "<li>↔, ↕: (Alt-Z), (Alt-X)</li>"
				+ "<li>∧, ∨: (Alt-B), (Alt-V)</li>" + "<li>×, ÷: (Alt-M), (Alt-N)</li>"
				+ "<li>For characters representing 0~31, 127: __(hexadecimal value) + (Alt-C)</li>"
				+ "<li>Actually all the hexadecimal value in the range of ASCII is available to use Alt-C.</li></ul><br><br>"
				+ "For more information, visit the site below:<br></html>");
		l.setFont(ProbieIDE.f);
		l.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
		add(l);

		JLabel m = new JLabel("<html><font color=#0000FF><u>https://github.com/Heartade/ProbieLang</u></font></html>");
		m.setFont(ProbieIDE.f);
		m.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
		m.addMouseListener(new MouseListener() {

			@Override
			public void mouseClicked(MouseEvent e) {
				// TODO Auto-generated method stub
				try {
					Desktop.getDesktop().browse(new URI("https://github.com/Heartade/ProbieLang"));
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}

			@Override
			public void mousePressed(MouseEvent e) {
			}

			@Override
			public void mouseReleased(MouseEvent e) {
			}

			@Override
			public void mouseEntered(MouseEvent e) {
			}

			@Override
			public void mouseExited(MouseEvent e) {
			}

		});
		add(m, BorderLayout.SOUTH);

		pack();

		setTitle("Help");
		setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
		setLocation(ProbieIDE.d.width / 2 - getWidth() / 2, ProbieIDE.d.height / 2 - getHeight() / 2);
		setResizable(false);
	}
}

class ProbieFind extends JFrame {
	private static ProbieFind pf = null;

	private JTextField find, replace;
	private final Dimension min = new Dimension(200, 25);
	private JButton rnf_b, replace_b, ra_b;

	static ProbieFind getInstance() {
		if (pf == null) {
			pf = new ProbieFind();
		}
		return pf;
	}

	private ProbieFind() {
		Container c = getContentPane();
		c.setLayout(new GridBagLayout());

		GridBagConstraints g = new GridBagConstraints();

		g.gridx = 0;
		g.gridy = 0;
		JLabel label_f = new JLabel("To find:");
		c.add(label_f, g);

		g.gridx = 1;
		find = new JTextField();
		find.setMinimumSize(min);
		find.setSize(min);
		find.setPreferredSize(min);
		find.setFont(ProbieIDE.f2);
		c.add(find, g);

		g.gridx = 2;
		JButton find_b = new JButton("Find next");
		c.add(find_b, g);

		g.gridx = 3;
		rnf_b = new JButton("Replace/Find");
		c.add(rnf_b, g);

		g.gridx = 0;
		g.gridy = 1;
		JLabel label_r = new JLabel("Replace with:");
		c.add(label_r, g);

		g.gridx = 1;
		replace = new JTextField();
		replace.setMinimumSize(min);
		replace.setSize(min);
		replace.setPreferredSize(min);
		replace.setFont(ProbieIDE.f2);
		c.add(replace, g);

		g.gridx = 2;
		replace_b = new JButton("Replace");
		c.add(replace_b, g);

		g.gridx = 3;
		ra_b = new JButton("Replace All");
		c.add(ra_b, g);

		find_b.addActionListener((e) -> {
			if (find.getText().length() != 0) {
				ProbieIDE.getInstance().find(find.getText());
			}
		});

		rnf_b.addActionListener((e) -> {
			if (find.getText().length() != 0) {
				ProbieIDE.getInstance().replace(find.getText(), replace.getText());
				ProbieIDE.getInstance().find(find.getText());
			}
		});

		replace_b.addActionListener((e) -> {
			if (find.getText().length() != 0) {
				ProbieIDE.getInstance().replace(find.getText(), replace.getText());
			}
		});

		ra_b.addActionListener((e) -> {
			if (find.getText().length() != 0) {
				ProbieIDE.getInstance().replaceAll(find.getText(), replace.getText());
			}
		});

		pack();

		setResizable(false);
		setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
		setTitle("Find/Replace");
		setLocation(ProbieIDE.d.width / 2 - getWidth() / 2, ProbieIDE.d.height / 2 - getHeight() / 2);
	}

	void setReplace(boolean isReplace) {
		replace.setEnabled(isReplace);
		rnf_b.setEnabled(isReplace);
		replace_b.setEnabled(isReplace);
		ra_b.setEnabled(isReplace);
	}
}
