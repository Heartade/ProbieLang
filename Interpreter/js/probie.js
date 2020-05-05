var symbols = [
    "○",
    "①",
    "②",
    "③",
    "④",
    "⑤",
    "⑥",
    "⑦",
    "⑧",
    "⑨",
    "⑩",
    "⑪",
    "⑫",
    "⑬",
    "⑭",
    "⑮",
    "◎",
    "ⓐ",
    "ⓑ",
    "ⓒ",
    "ⓓ",
    "ⓔ",
    "ⓕ",
    "ⓖ",
    "ⓗ",
    "ⓘ",
    "ⓙ",
    "ⓚ",
    "ⓛ",
    "ⓜ",
    "ⓝ",
    "ⓞ",
    " ",
    "!",
    '"',
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "[",
    "\\",
    "]",
    "^",
    "_",
    "`",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "{",
    "|",
    "}",
    "~",
    "●",
];
var values = {};
for (i = 0; i < 128; i++) {
    values[symbols[i]] = i;
}

var Probie = class {
    static check_coor(x, l) {
        return x < 0 || x >= l;
    }

    static get_value(x) {
        return x in values ? values[x] : 0;
    }

    static replace(s, index, c) {
        return s.substring(0, index) + c + s.substring(index + 1);
    }

    constructor(text, stdoutcb, stderrcb, stdcodecb) {
        this.stdin = "";
        this.stdout = "";
        this.stderr = "";

        this.nvstate = 0;

        this.r = [0, 0];
        this.w = [0, 0];
        this.m = [0, 0];
        this.dir = 0;
        this.dist = 1;
        this.data = "○";
        this.iscomment = false;
        this.isbackslash = false;
        this.isstop = false;
        this.isinput = false;

        this.field = text.split("\n");
        this.stdoutcb = stdoutcb;
        this.stderrcb = stderrcb;
        this.stdcodecb = stdcodecb;

        this.func1 = {
            "!": () => (this.iscomment = !this.iscomment),
        }; // comment
        this.func2 = {
            ">": () => (this.dist += 1),
            "<": () => {
                this.dist -= 1;
                if (this.dist === 0) {
                    this.stop();
                }
            },
            R: () => (this.dir = (this.dir + 1) % 4),
            L: () => (this.dir = (this.dir + 3) % 4),
            "→": () => this.w[1]++,
            "←": () => this.w[1]--,
            "↑": () => this.w[0]--,
            "↓": () => this.w[0]++,
            "△": () => this.m[0]--,
            "▽": () => this.m[0]++,
            "◁": () => this.m[1]--,
            "▷": () => this.m[1]++,
            "▲": () => (this.m[0] -= this.dist),
            "▼": () => (this.m[0] += this.dist),
            "◀": () => (this.m[1] -= this.dist),
            "▶": () => (this.m[1] += this.dist),
        }; // move related
        this.func3 = {
            S: () => (this.nvstate = 1),
            s: () => (this.nvstate = 2),
            P: () => (this.nvstate = 3),
            I: () => (this.nvstate = 4),
            X: () => (this.nvstate = 0),
        }; // nonvolatile
        this.func4 = {
            "{": () => {
                if (Probie.check_coor(this.r[0] - 1, this.field.length - 2)) {
                    this.error_comp(
                        "{",
                        this.r[0] - 1,
                        this.r[1],
                        this.r[0] + 1,
                        this.r[1]
                    );
                    return;
                }
                var t = this.get_value_coor(this.r[0] - 1, this.r[1]);
                var u = this.get_value_coor(this.r[0] + 1, this.r[1]);
                this.r[1] += t > u ? -1 : 1;
            },
            "}": () => {
                if (Probie.check_coor(this.r[0] - 1, this.field.length - 2)) {
                    this.error_comp(
                        "}",
                        this.r[0] - 1,
                        this.r[1],
                        this.r[0] + 1,
                        this.r[1]
                    );
                    return;
                }
                var t = this.get_value_coor(this.r[0] - 1, this.r[1]);
                var u = this.get_value_coor(this.r[0] + 1, this.r[1]);
                this.r[1] += t > u ? 1 : -1;
            },
            "∧": () => {
                if (
                    Probie.check_coor(this.r[0], this.field.length) ||
                    Probie.check_coor(
                        this.r[1] - 1,
                        this.field[this.r[0]].length - 2
                    )
                ) {
                    this.error_comp(
                        "∧",
                        this.r[0],
                        this.r[1] - 1,
                        this.r[0],
                        this.r[1] + 1
                    );
                    return;
                }
                var t = this.get_value_coor(this.r[0], this.r[1] - 1);
                var u = this.get_value_coor(this.r[0], this.r[1] + 1);
                this.r[0] += t > u ? -1 : 1;
            },
            "∨": () => {
                if (
                    Probie.check_coor(this.r[0], this.field.length) ||
                    Probie.check_coor(
                        this.r[1] - 1,
                        this.field[this.r[0]].length - 2
                    )
                ) {
                    this.error_comp(
                        "∨",
                        this.r[0],
                        this.r[1] - 1,
                        this.r[0],
                        this.r[1] + 1
                    );
                    return;
                }
                var t = this.get_value_coor(this.r[0], this.r[1] - 1);
                var u = this.get_value_coor(this.r[0], this.r[1] + 1);
                this.r[0] += t > u ? 1 : -1;
            },
            "↔": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("↔");
                    return;
                }
                var t = this.data in values ? values[this.data] : 0;
                var u = this.get_value_write();
                this.r[1] += t > u ? -1 : 1;
            },
            "↕": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("↕");
                    return;
                }
                var t = Probie.get_value(this.data);
                var u = this.get_value_write();
                this.r[0] += t > u ? -1 : 1;
            },
        }; // condition
        this.func5 = {
            "+": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("+");
                    return;
                }
                var c = this.get_value_write();
                c += Probie.get_value(this.data);
                c = (c + 128) % 128;
                var s = this.field[this.w_y()];
                s = Probie.replace(s, this.w_x(), symbols[c]);
                this.field[this.w_y()] = s;
            },
            "-": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("-");
                    return;
                }
                var c = this.get_value_write();
                c -= Probie.get_value(this.data);
                c = (c + 128) % 128;
                var s = this.field[this.w_y()];
                s = Probie.replace(s, this.w_x(), symbols[c]);
                this.field[this.w_y()] = s;
            },
            "×": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("×");
                    return;
                }
                var c = this.get_value_write();
                c *= Probie.get_value(this.data);
                c = (c + 128) % 128;
                var s = this.field[this.w_y()];
                s = Probie.replace(s, this.w_x(), symbols[c]);
                this.field[this.w_y()] = s;
            },
            "÷": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("÷");
                    return;
                }
                var c = this.get_value_write();
                c /= Probie.get_value(this.data);
                c = (c + 128) % 128;
                var s = this.field[this.w_y()];
                s = Probie.replace(s, this.w_x(), symbols[c]);
                this.field[this.w_y()] = s;
            },
            "%": () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("%");
                    return;
                }
                var c = this.get_value_write();
                c %= Probie.get_value(this.data);
                c = (c + 128) % 128;
                var s = this.field[this.w_y()];
                s = Probie.replace(s, this.w_x(), symbols[c]);
                this.field[this.w_y()] = s;
            },
            A: () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("A");
                    return;
                }
                var c = this.get_value_write();
                c += Probie.get_value(this.data);
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            D: () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("D");
                    return;
                }
                var c = this.get_value_write();
                c -= Probie.get_value(this.data);
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            M: () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("M");
                    return;
                }
                var c = this.get_value_write();
                c *= Probie.get_value(this.data);
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            d: () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("d");
                    return;
                }
                var c = this.get_value_write();
                c /= Probie.get_value(this.data);
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            m: () => {
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("m");
                    return;
                }
                var c = this.get_value_write();
                c %= Probie.get_value(this.data);
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
        }; // arithmetic
        this.func6 = {
            "[": () => {
                if (
                    Probie.check_coor(this.m[0], this.field.length) ||
                    Probie.check_coor(this.m[1], this.field[this.m[0]].length)
                ) {
                    this.error_mem("[");
                    return;
                } else {
                    this.data = this.field[this.m[0]][this.m[1]];
                }
            },
            "]": () => {
                if (
                    Probie.check_coor(this.m[0], this.field.length) ||
                    Probie.check_coor(this.m[1], this.field[this.m[0]].length)
                ) {
                    this.error_mem("]");
                    return;
                } else {
                    var s = this.field[this.m[0]];
                    s = Probie.replace(s, this.m[1], this.data);
                    this.field[this.m[0]] = s;
                }
            },
            _: () => (this.m[1] = Probie.get_value(this.data)),
            "|": () => (this.m[0] = Probie.get_value(this.data)),
        }; // mem interaction
    }

    moveStep() {
        switch (this.dir) {
            case 0:
                this.r[1] += this.dist;
                break;
            case 1:
                this.r[0] += this.dist;
                break;
            case 2:
                this.r[1] -= this.dist;
                break;
            case 3:
                this.r[0] -= this.dist;
                break;
        }
        if (
            Probie.check_coor(this.r[0], this.field.length) ||
            Probie.check_coor(this.r[1], this.field[this.r[0]].length)
        ) {
            this.error_read();
            return;
        }
    }

    get_value_coor(y, x) {
        return Probie.get_value(this.field[y][x]);
    }

    get_value_write() {
        return this.get_value_coor(this.w_y(), this.w_x());
    }

    w_y() {
        return this.r[0] + this.w[0];
    }

    w_x() {
        return this.r[1] + this.w[1];
    }

    // console input
    read_c(c) {
        for (i = 0; i < c.length; i++) {
            switch (c[i]) {
                case "\\":
                    this.stdin += "\\\\";
                    break;
                case "\n":
                    this.stdin += "\\n";
                    break;
                case "\t":
                    this.stdin += "\\t";
                    break;
                default:
                    this.stdin += c[i];
            }
        }
        this.stdin += c;
    }

    // console output
    write_c(c) {
        this.stdout += c;
        //print event, added character and whole output as parameter
        this.stdoutcb(c, this.stdout);
    }

    // compare operation error log
    error_comp(op, y1, x1, y2, x2) {
        this.error_c(
            "'" +
                op +
                "': comparing cells out of field: [" +
                y1 +
                ", " +
                x1 +
                "], [" +
                y2 +
                ", " +
                x2 +
                "]"
        );
    }

    error_read() {
        this.error_c(
            "READ pointer out of field: [" + this.r[0] + ", " + this.r[1] + "]"
        );
    }

    error_write(op) {
        this.error_c(
            "'" +
                op +
                "': WRITE pointer out of field: [" +
                this.w_y() +
                ", " +
                this.w_x() +
                "]"
        );
    }

    error_mem(op) {
        this.error_c(
            "'" +
                op +
                ": MEM cursor out of field: [" +
                this.m[0] +
                ", " +
                this.m[1] +
                "]"
        );
    }

    // error output
    error_c(c) {
        this.stderr += c;
        //print event, added character and whole output as parameter
        this.stderrcb(c, this.stderr);
        this.stop();
        throw Error(c);
    }

    operate() {
        switch (this.nvstate) {
            case 1:
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.data = "○";
                } else {
                    this.data = this.field[this.w_y()][this.w_x()];
                    console.log(
                        "setting PROBE value as cell [" +
                            this.w_y() +
                            ", " +
                            this.w_x() +
                            "] (" +
                            this.data +
                            ")"
                    );
                }
                break;
            case 2:
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("s");
                    return;
                } else {
                    console.log(
                        "setting cell [" +
                            this.w_y() +
                            ", " +
                            this.w_x() +
                            "] as PROBE value(" +
                            this.data +
                            ")"
                    );
                    var s = this.field[this.w_y()];
                    Probie.replace(s, this.w_x(), this.data);
                    this.field[this.w_y()] = s;
                }
                break;
            case 3:
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("P");
                    return;
                } else {
                    var c = this.field[this.w_y()][this.w_x()];
                    if (c === "\\") {
                        if (this.isbackslash) {
                            this.write_c("\\");
                        } else {
                            this.isbackslash = true;
                        }
                    } else if (this.isbackslash) {
                        switch (c) {
                            case "n":
                                this.write_c("\n");
                                break;
                            case "t":
                                this.write_c("\t");
                                break;
                            default:
                                this.write_c(c);
                        }
                        this.isbackslash = false;
                    } else {
                        this.write_c(c);
                    }
                }
                break;
            case 4:
                this.isinput = true;
                while (this.stdin.length === 0) {
                    var input_text = prompt(
                        "Input needed. Please fill below.",
                        ""
                    );
                    this.read_c(input_text);
                }
                this.isinput = false;
                if (
                    Probie.check_coor(this.w_y(), this.field.length) ||
                    Probie.check_coor(this.w_x(), this.field[this.w_y()].length)
                ) {
                    this.error_write("I");
                    return;
                } else {
                    var s = this.field[this.w_y()];
                    Probie.replace(s, this.w_x(), this.stdin[0]);
                    this.field[this.w_y()] = s;
                }
                this.stdin = this.stdin.substring(1);
                break;
        }
    }

    interpret(c) {
        var b = true;
        if (c in this.func1 && !this.isstop) {
            var f = this.func1[c].bind(this);
            f();
        }

        if (!this.iscomment && c in this.func2 && !this.isstop) {
            var f = this.func2[c].bind(this);
            f();
        }

        if (!this.iscomment && c in this.func3 && !this.isstop) {
            var f = this.func3[c].bind(this);
            f();
        }

        if (!this.isstop) {
            this.operate();
        }

        if ((this.iscomment || this.nvstate != 0) && !this.isstop) {
            this.moveStep();
            b = false;
        }

        if (!this.iscomment && c in this.func4 && !this.isstop) {
            var f = this.func4[c].bind(this);
            f();
            b = false;
        }

        if (!this.iscomment && c in this.func5 && !this.isstop) {
            var f = this.func5[c].bind(this);
            f();
        }

        if (!this.iscomment && c in this.func6 && !this.isstop) {
            var f = this.func6[c].bind(this);
            f();
        }

        if (b && !this.isstop) {
            this.moveStep();
        }

        console.log(
            "READ    : [" +
                this.r[0] +
                ", " +
                this.r[1] +
                "]\nWRITE   : [" +
                this.w_y() +
                ", " +
                this.w_x() +
                "]\nMEM     : [" +
                this.m[0] +
                ", " +
                this.m[1] +
                "]\nPROBE   : " +
                this.data +
                "\nSTATE   : " +
                this.nvstate
        );
    }

    //////////////////
    //////////////////

    run_step() {
        if (!this.isstop && !this.isinput) {
            var a = this.field[this.r[0]][this.r[1]];
            this.interpret(a);
            this.stdcodecb(this.field);
        }
    }

    run_auto() {
        var a;
        while (!this.isstop) {
            a = this.field[this.r[0]][this.r[1]];
            this.interpret(a);
        }
        this.stdcodecb(this.field);
    }

    stop() {
        this.isstop = true;
    }

    isstopped() {
        return this.isstop;
    }

    get_output() {
        return this.stdout;
    }
};
