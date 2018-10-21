import java.util.AbstractMap.SimpleEntry;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;

import javax.swing.JTextArea;
import javax.swing.JTextField;

public class Probie {

	static char[][] field;
	final static Map<Character, Character> symbol;
	final static Map<Character, Function<Probe, Void>> func1, func2, func3, func4, func5, func6;
	static String buffer = "";
	static Probe p = new Probe();

	static JTextArea out;
	static JTextField in;

	static boolean stop = false;

	static {
		symbol = new HashMap<>();
		symbol.put('¡Û', (char) 0);
		symbol.put('¨ç', (char) 1);
		symbol.put('¨è', (char) 2);
		symbol.put('¨é', (char) 3);
		symbol.put('¨ê', (char) 4);
		symbol.put('¨ë', (char) 5);
		symbol.put('¨ì', (char) 6);
		symbol.put('¨í', (char) 7);
		symbol.put('¨î', (char) 8);
		symbol.put('¨ï', (char) 9);
		symbol.put('¨ð', (char) 10);
		symbol.put('¨ñ', (char) 11);
		symbol.put('¨ò', (char) 12);
		symbol.put('¨ó', (char) 13);
		symbol.put('¨ô', (char) 14);
		symbol.put('¨õ', (char) 15);
		symbol.put('¡Ý', (char) 16);
		symbol.put('¨Í', (char) 17);
		symbol.put('¨Î', (char) 18);
		symbol.put('¨Ï', (char) 19);
		symbol.put('¨Ð', (char) 20);
		symbol.put('¨Ñ', (char) 21);
		symbol.put('¨Ò', (char) 22);
		symbol.put('¨Ó', (char) 23);
		symbol.put('¨Ô', (char) 24);
		symbol.put('¨Õ', (char) 25);
		symbol.put('¨Ö', (char) 26);
		symbol.put('¨×', (char) 27);
		symbol.put('¨Ø', (char) 28);
		symbol.put('¨Ù', (char) 29);
		symbol.put('¨Ú', (char) 30);
		symbol.put('¨Û', (char) 31);
		for (int i = 32; i < 127; i++) {
			symbol.put((char) i, (char) i);
		}
		symbol.put('¡Ü', (char) 127);

		// 1st Priority
		func1 = new HashMap<>();
		func1.put('!', Probie::comment);

		// 2nd Priority
		func2 = new HashMap<>();
		func2.put('>', Probie::speedUp);
		func2.put('<', Probie::speedDown);
		func2.put('R', Probie::rotateR);
		func2.put('L', Probie::rotateL);
		func2.put('¡æ', Probie::writerR);
		func2.put('¡ç', Probie::writerL);
		func2.put('¡è', Probie::writerU);
		func2.put('¡é', Probie::writerD);
		func2.put('¡â', Probie::memU);
		func2.put('¡ä', Probie::memD);
		func2.put('¢·', Probie::memL);
		func2.put('¢¹', Probie::memR);
		func2.put('¡ã', Probie::memUU);
		func2.put('¡å', Probie::memDD);
		func2.put('¢¸', Probie::memLL);
		func2.put('¢º', Probie::memRR);

		// 3rd Priority
		func3 = new HashMap<>();
		func3.put('S', Probie::set1);
		func3.put('s', Probie::set2);
		func3.put('P', Probie::print);
		func3.put('I', Probie::input);
		func3.put('X', Probie::cancel);

		// 4th Priority
		func4 = new HashMap<>();
		func4.put('{', Probie::cond1);
		func4.put('}', Probie::cond2);
		func4.put('¡ü', Probie::cond3);
		func4.put('¡ý', Probie::cond4);
		func4.put('¡ê', Probie::cond5);
		func4.put('¢Õ', Probie::cond6);

		// 5th Priority
		func5 = new HashMap<>();
		func5.put('+', Probie::plus);
		func5.put('-', Probie::subtract);
		func5.put('¡¿', Probie::times);
		func5.put('¡À', Probie::quotient);
		func5.put('%', Probie::remainder);
		func5.put('A', Probie::add);
		func5.put('D', Probie::difference);
		func5.put('M', Probie::multiply);
		func5.put('d', Probie::divide);
		func5.put('m', Probie::mod);

		// 6th Priority
		func6 = new HashMap<>();
		func6.put('[', Probie::memRead);
		func6.put(']', Probie::memWrite);
		func6.put('_', Probie::memx);
		func6.put('|', Probie::memy);
	}

	/////////////
	// Comment //
	/////////////

	// !

	static Void comment(Probe p) {
		p.comment = !p.comment;
		return null;
	}

	///////////////////////////
	// Nonvolatile Movements //
	///////////////////////////

	// >

	static Void speedUp(Probe p) {
		p.speed(true);
		return null;
	}

	// <

	static Void speedDown(Probe p) {
		p.speed(false);
		return null;
	}

	// R

	static Void rotateR(Probe p) {
		p.rotate(true);
		return null;
	}

	// L

	static Void rotateL(Probe p) {
		p.rotate(false);
		return null;
	}

	// ¡æ

	static Void writerR(Probe p) {
		p.wx++;
		return null;
	}

	// ¡ç

	static Void writerL(Probe p) {
		p.wx--;
		return null;
	}

	// ¡è

	static Void writerU(Probe p) {
		p.wy--;
		return null;
	}

	// ¡é

	static Void writerD(Probe p) {
		p.wy++;
		return null;
	}

	// ¡â

	static Void memU(Probe p) {
		p.memMove(1, (byte) 1);
		return null;
	}

	// ¡ä

	static Void memD(Probe p) {
		p.memMove(1, (byte) 3);
		return null;
	}

	// ¢·

	static Void memL(Probe p) {
		p.memMove(1, (byte) 2);
		return null;
	}

	// ¢¹

	static Void memR(Probe p) {
		p.memMove(1, (byte) 0);
		return null;
	}

	// ¡ã

	static Void memUU(Probe p) {
		p.memMove(p.skip, (byte) 1);
		return null;
	}

	// ¡å

	static Void memDD(Probe p) {
		p.memMove(p.skip, (byte) 3);
		return null;
	}

	// ¢¸

	static Void memLL(Probe p) {
		p.memMove(p.skip, (byte) 2);
		return null;
	}

	// ¢º

	static Void memRR(Probe p) {
		p.memMove(p.skip, (byte) 0);
		return null;
	}

	////////////////////////////
	// Nonvolatile Operations //
	////////////////////////////

	// S

	static Void set1(Probe p) {
		p.state = 1;
		return null;
	}

	// s

	static Void set2(Probe p) {
		p.state = 2;
		return null;
	}

	// P

	static Void print(Probe p) {
		p.state = 3;
		return null;
	}

	// I

	static Void input(Probe p) {
		p.state = 4;
		return null;
	}

	// X

	static Void cancel(Probe p) {
		p.state = 0;
		return null;
	}

	/////////////////////////
	// Volatile Conditions //
	/////////////////////////

	// {

	static Void cond1(Probe p) {
		char t = symbol.getOrDefault(field[p.ry - 1][p.rx], (char) 0);
		char u = symbol.getOrDefault(field[p.ry + 1][p.rx], (char) 0);
		if (t > u)
			p.moveInd((byte) 2);
		else
			p.moveInd((byte) 0);
		return null;
	}

	// }

	static Void cond2(Probe p) {
		char t = symbol.getOrDefault(field[p.ry - 1][p.rx], (char) 0);
		char u = symbol.getOrDefault(field[p.ry + 1][p.rx], (char) 0);
		if (t > u)
			p.moveInd((byte) 0);
		else
			p.moveInd((byte) 2);
		return null;
	}

	// ¡ü

	static Void cond3(Probe p) {
		char t = symbol.getOrDefault(field[p.ry][p.rx - 1], (char) 0);
		char u = symbol.getOrDefault(field[p.ry][p.rx + 1], (char) 0);
		if (t > u)
			p.moveInd((byte) 1);
		else
			p.moveInd((byte) 3);
		return null;
	}

	// ¡ý

	static Void cond4(Probe p) {
		char t = symbol.getOrDefault(field[p.ry][p.rx - 1], (char) 0);
		char u = symbol.getOrDefault(field[p.ry][p.rx + 1], (char) 0);
		if (t > u)
			p.moveInd((byte) 3);
		else
			p.moveInd((byte) 1);
		return null;
	}

	// ¡ê

	static Void cond5(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		if (symbol.getOrDefault(p.data, (char) 0) > c)
			p.moveInd((byte) 2);
		else
			p.moveInd((byte) 0);
		return null;
	}

	// ¢Õ

	static Void cond6(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		if (symbol.getOrDefault(p.data, (char) 0) > c)
			p.moveInd((byte) 1);
		else
			p.moveInd((byte) 3);
		return null;
	}

	///////////////////////
	// Volatile Operator //
	///////////////////////

	// +

	static Void plus(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c += symbol.getOrDefault(p.data, (char) 0);
		c %= 128;
		field[e.getValue()][e.getKey()] = getChar(c);
		return null;
	}

	// -

	static Void subtract(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c -= symbol.getOrDefault(p.data, (char) 0);
		c %= 128;
		field[e.getValue()][e.getKey()] = getChar(c);
		return null;
	}

	// ¡¿

	static Void times(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c *= symbol.getOrDefault(p.data, (char) 0);
		c %= 128;
		field[e.getValue()][e.getKey()] = getChar(c);
		return null;
	}

	// ¡À

	static Void quotient(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c /= symbol.getOrDefault(p.data, (char) 0);
		c %= 128;
		field[e.getValue()][e.getKey()] = getChar(c);
		return null;
	}

	// %

	static Void remainder(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c %= symbol.getOrDefault(p.data, (char) 0);
		c %= 128;
		field[e.getValue()][e.getKey()] = getChar(c);
		return null;
	}

	// A

	static Void add(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(p.data, (char) 0);
		c += symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c %= 128;
		p.data = getChar(c);
		return null;
	}

	// D

	static Void difference(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(p.data, (char) 0);
		c -= symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c %= 128;
		p.data = getChar(c);
		return null;
	}

	// M

	static Void multiply(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(p.data, (char) 0);
		c *= symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c %= 128;
		p.data = getChar(c);
		return null;
	}

	// d

	static Void divide(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(p.data, (char) 0);
		c /= symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c %= 128;
		p.data = getChar(c);
		return null;
	}

	// m

	static Void mod(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		char c = symbol.getOrDefault(p.data, (char) 0);
		c %= symbol.getOrDefault(field[e.getValue()][e.getKey()], (char) 0);
		c %= 128;
		p.data = getChar(c);
		return null;
	}

	//////////////////////////////
	// Volatile MEM Interaction //
	//////////////////////////////

	// [

	static Void memRead(Probe p) {
		p.data = field[p.my][p.mx];
		return null;
	}

	// ]

	static Void memWrite(Probe p) {
		field[p.my][p.mx] = p.data;
		return null;
	}

	// _

	static Void memx(Probe p) {
		p.mx = symbol.getOrDefault(p.data, (char) 0);
		return null;
	}

	// |

	static Void memy(Probe p) {
		p.my = symbol.getOrDefault(p.data, (char) 0);
		return null;
	}

	////////////
	// Finish //
	////////////

	static void init() {
		p = new Probe();
		field = new char[0][0];
		buffer = "";
	}

	static void read(String[] s) {
		field = new char[s.length][];
		for (int i = 0; i < s.length; i++) {
			field[i] = s[i].toCharArray();
		}
	}

	static void setOutput(JTextArea a) {
		out = a;
	}

	static void setInput(JTextField f) {
		in = f;
	}

	static void print(char c) {
		String s = out.getText();
		s += c;
		out.setText(s);
	}

	static void interpret() {
		char a;
		while (!stop) {
			a = p.read();
			interpret2(a);
		}
		stop = false;
	}

	static void stop() {
		stop = true;
	}

	static void interpret2(char a) {
		boolean b = true;
		if (func1.containsKey(a) && !stop) {
			func1.get(a).apply(p);
		}

		if (!p.comment && !stop) {
			if (func2.containsKey(a)) {
				func2.get(a).apply(p);
			}
		}

		if (!p.comment && func3.containsKey(a) && !stop) {
			func3.get(a).apply(p);
		}

		if (!stop)
			operate(p);

		if ((p.comment || p.state != 0) && !stop) {
			p.move();
			b = false;
		}

		if (!p.comment && func4.containsKey(a) && !stop) {
			func4.get(a).apply(p);
			b = false;
		}

		if (!p.comment && func5.containsKey(a) && !stop) {
			func5.get(a).apply(p);
		}

		if (!p.comment && func6.containsKey(a) && !stop) {
			func6.get(a).apply(p);
		}

		if (b && !stop)
			p.move();
	}

	static void operate(Probe p) {
		Entry<Integer, Integer> e = p.getWrite();
		switch (p.state) {
		case 1:
			p.data = field[e.getValue()][e.getKey()];
			break;
		case 2:
			field[e.getValue()][e.getKey()] = p.data;
			break;
		case 3:
			char c = field[e.getValue()][e.getKey()];
			if (c == '\\') {
				if (p.backslash)
					print('\\');
				else
					p.backslash = true;
			} else if (p.backslash) {
				switch (c) {
				case 'n':
					print('\n');
					break;
				case 't':
					print('\t');
					break;
				default:
					print(c);
				}
				p.backslash = false;
			} else {
				print(c);
			}
			break;
		case 4:
			synchronized (ProbieIDE.holder) {
				while (buffer.length() == 0) {
					System.out.println(buffer.length());// FIXME
					ProbieIDE.getInstance().enableInput();
					try {
						System.out.println("!");// FIXME
						ProbieIDE.holder.wait();
					} catch (InterruptedException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
				System.out.println("!");// FIXME
				field[e.getValue()][e.getKey()] = Probie.getChar(buffer.charAt(0));
				buffer = buffer.substring(1);
			}
			break;
		}
	}

	static void userInput(String s) {
		synchronized (ProbieIDE.holder) {
			char[] c = (s + "\n").toCharArray();
			for (char ch : c) {
				switch (ch) {
				case '\\':
					buffer = buffer.concat("\\\\");
					break;
				case '\n':
					buffer = buffer.concat("\\n");
					break;
				case '\t':
					buffer = buffer.concat("\\t");
					break;
				default:
					buffer = buffer.concat(ch + "");
				}
			}
			ProbieIDE.holder.notify();
		}
	}

	static char getChar(char x) {
		if (x < 32) {
			for (char i : symbol.keySet()) {
				if (symbol.get(i) == x) {
					return i;
				}
			}
		} else if (x == 127) {
			return '¡Ü';
		} else {
			return x;
		}
		return 0;
	}

	static class Probe {
		int rx = 0, ry = 0, wx = 0, wy = 0, skip = 1, mx = 0, my = 0;
		byte direction = 0;
		char data = '¡Û';
		byte state = 0;// X:0,S:1,s:2,P:3,I:4
		boolean comment = false;
		boolean backslash = false;

		char read() {
			return Probie.field[ry][rx];
		}

		void move() {
			switch (direction) {
			case 0:
				rx += skip;
				break;
			case 1:
				ry -= skip;
				break;
			case 2:
				rx -= skip;
				break;
			case 3:
				ry += skip;
				break;
			}
		}

		void moveInd(byte dir) {
			switch (dir) {
			case 0:
				rx += 1;
				break;
			case 1:
				ry -= 1;
				break;
			case 2:
				rx -= 1;
				break;
			case 3:
				ry += 1;
				break;
			}
		}

		void speed(boolean up) {
			skip += up ? 1 : -1;
			if (skip == 0) {
				stop();
				ProbieIDE.getInstance().stopConsole();
			}
		}

		void rotate(boolean clockwise) {
			if (clockwise)
				direction = (byte) ((direction + 3) % 4);
			else
				direction = (byte) (++direction % 4);
		}

		Entry<Integer, Integer> getRead() {
			return new SimpleEntry<Integer, Integer>(rx, ry);
		}

		Entry<Integer, Integer> getWrite() {
			return new SimpleEntry<Integer, Integer>(rx + wx, ry + wy);
		}

		Entry<Integer, Integer> getMem() {
			return new SimpleEntry<Integer, Integer>(mx, my);
		}

		void memMove(int n, byte dir) {
			switch (dir) {
			case 0:
				mx += n;
				break;
			case 1:
				my -= n;
				break;
			case 2:
				mx -= n;
				break;
			case 3:
				my += n;
				break;
			}
		}
	}

}
