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
                    this.error_c(
                        "'{': comparing cells out of field: [" +
                            (this.r[0] - 1) +
                            ", " +
                            this.r[1] +
                            "], [" +
                            (this.r[0] + 1) +
                            ", " +
                            this.r[1] +
                            "]"
                    );
                    return;
                }
                var t =
                    this.field[this.r[0] - 1][this.r[1]] in values
                        ? values[this.field[this.r[0] - 1][this.r[1]]]
                        : 0;
                var u =
                    this.field[this.r[0] + 1][this.r[1]] in values
                        ? values[this.field[this.r[0] + 1][this.r[1]]]
                        : 0;
                if (t > u) {
                    this.r[1] -= 1;
                } else {
                    this.r[1] += 1;
                }
            },
            "}": () => {
                if (Probie.check_coor(this.r[0] - 1, this.field.length - 2)) {
                    this.error_c(
                        "'}': comparing cells out of field: [" +
                            (this.r[0] - 1) +
                            ", " +
                            this.r[1] +
                            "], [" +
                            (this.r[0] + 1) +
                            ", " +
                            this.r[1] +
                            "]"
                    );
                    return;
                }
                var t =
                    this.field[this.r[0] - 1][this.r[1]] in values
                        ? values[this.field[this.r[0] - 1][this.r[1]]]
                        : 0;
                var u =
                    this.field[this.r[0] + 1][this.r[1]] in values
                        ? values[this.field[this.r[0] + 1][this.r[1]]]
                        : 0;
                if (t > u) {
                    this.r[1] += 1;
                } else {
                    this.r[1] -= 1;
                }
            },
            "∧": () => {
                if (
                    Probie.check_coor(this.r[0], this.field.length) ||
                    Probie.check_coor(
                        this.r[1] - 1,
                        this.field[this.r[0]].length - 2
                    )
                ) {
                    this.error_c(
                        "'∧': comparing cells out of field: [" +
                            this.r[0] +
                            ", " +
                            (this.r[1] - 1) +
                            "], " +
                            this.r[0] +
                            ", " +
                            (this.r[1] + 1) +
                            "]"
                    );
                    return;
                }
                var t =
                    this.field[this.r[0]][this.r[1] - 1] in values
                        ? values[this.field[this.r[0]][this.r[1] - 1]]
                        : 0;
                var u =
                    this.field[this.r[0]][this.r[1] + 1] in values
                        ? values[this.field[this.r[0]][this.r[1] + 1]]
                        : 0;
                if (t > u) {
                    this.r[0] -= 1;
                } else {
                    this.r[0] += 1;
                }
            },
            "∨": () => {
                if (
                    Probie.check_coor(this.r[0], this.field.length) ||
                    Probie.check_coor(
                        this.r[1] - 1,
                        this.field[this.r[0]].length - 2
                    )
                ) {
                    this.error_c(
                        "'∨': comparing cells out of field: [" +
                            this.r[0] +
                            ", " +
                            (this.r[1] - 1) +
                            "], " +
                            this.r[0] +
                            ", " +
                            (this.r[1] + 1) +
                            "]"
                    );
                    return;
                }
                var t =
                    this.field[this.r[0]][this.r[1] - 1] in values
                        ? values[this.field[this.r[0]][this.r[1] - 1]]
                        : 0;
                var u =
                    this.field[this.r[0]][this.r[1] + 1] in values
                        ? values[this.field[this.r[0]][this.r[1] + 1]]
                        : 0;
                if (t > u) {
                    this.r[0] += 1;
                } else {
                    this.r[0] -= 1;
                }
            },
            "↔": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'↔': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var t = this.data in values ? values[this.data] : 0;
                var u =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                if (t > u) {
                    this.r[1] -= 1;
                } else {
                    this.r[1] += 1;
                }
            },
            "↕": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'↕': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var t = this.data in values ? values[this.data] : 0;
                var u =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                if (t > u) {
                    this.r[0] -= 1;
                } else {
                    this.r[0] += 1;
                }
            },
        }; // condition
        this.func5 = {
            "+": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'+': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c += this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                var s = this.field[this.r[0] + this.w[0]];
                s =
                    s.substring(0, this.r[1] + this.w[1]) +
                    symbols[c] +
                    s.substring(this.r[1] + this.w[1] + 1);
                this.field[this.r[0] + this.w[0]] = s;
            },
            "-": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'-': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c -= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                var s = this.field[this.r[0] + this.w[0]];
                s =
                    s.substring(0, this.r[1] + this.w[1]) +
                    symbols[c] +
                    s.substring(this.r[1] + this.w[1] + 1);
                this.field[this.r[0] + this.w[0]] = s;
            },
            "×": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'×': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c *= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                var s = this.field[this.r[0] + this.w[0]];
                s =
                    s.substring(0, this.r[1] + this.w[1]) +
                    symbols[c] +
                    s.substring(this.r[1] + this.w[1] + 1);
                this.field[this.r[0] + this.w[0]] = s;
            },
            "÷": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'÷': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c /= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                var s = this.field[this.r[0] + this.w[0]];
                s =
                    s.substring(0, this.r[1] + this.w[1]) +
                    symbols[c] +
                    s.substring(this.r[1] + this.w[1] + 1);
                this.field[this.r[0] + this.w[0]] = s;
            },
            "%": () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'%': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c %= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                var s = this.field[this.r[0] + this.w[0]];
                s =
                    s.substring(0, this.r[1] + this.w[1]) +
                    symbols[c] +
                    s.substring(this.r[1] + this.w[1] + 1);
                this.field[this.r[0] + this.w[0]] = s;
            },
            A: () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'A': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c += this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            D: () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'D': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c -= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            M: () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'M': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c *= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            d: () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'d': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c /= this.data in values ? values[this.data] : 0;
                c = (c + 128) % 128;
                this.data = symbols[c];
            },
            m: () => {
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'m': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                }
                var c =
                    this.field[this.r[0] + this.w[0]][this.r[1] + this.w[1]] in
                    values
                        ? values[
                              this.field[this.r[0] + this.w[0]][
                                  this.r[1] + this.w[1]
                              ]
                          ]
                        : 0;
                c %= this.data in values ? values[this.data] : 0;
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
                    this.error_c(
                        "'[': MEM cursor out of field: [" +
                            this.m[0] +
                            ", " +
                            this.m[1] +
                            "]"
                    );
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
                    this.error_c(
                        "'[': MEM cursor out of field: [" +
                            this.m[0] +
                            ", " +
                            this.m[1] +
                            "]"
                    );
                    return;
                } else {
                    var s = this.field[this.m[0]];
                    s =
                        s.substring(0, this.m[1]) +
                        this.data +
                        s.substring(this.m[1] + 1);
                    this.field[this.m[0]] = s;
                }
            },
            _: () => (this.m[1] = this.data in values ? values[this.data] : 0),
            "|": () =>
                (this.m[0] = this.data in values ? values[this.data] : 0),
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
            this.r[0] < 0 ||
            this.r[0] >= this.field.length ||
            this.r[1] < 0 ||
            this.r[1] >= this.field[this.r[0]].length
        ) {
            this.error_c(
                "READ pointer out of field: [" +
                    this.r[0] +
                    ", " +
                    this.r[1] +
                    "]"
            );
            return;
        }
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

    // error output
    error_c(c) {
        this.stderr += c;
        //print event, added character and whole output as parameter
        this.stderrcb(c, this.stderr);
        this.stop();
        throw Error(c);
    }

    // code output
    code_c() {
        this.stdcodecb(this.field);
    }

    async operate() {
        switch (this.nvstate) {
            case 1:
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.data = "○";
                } else {
                    this.data = this.field[this.r[0] + this.w[0]][
                        this.r[1] + this.w[1]
                    ];
                    console.log(
                        "setting PROBE value as cell [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "] (" +
                            this.data +
                            ")"
                    );
                }
                break;
            case 2:
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'s': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                } else {
                    console.log(
                        "setting cell [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "] as PROBE value(" +
                            this.data +
                            ")"
                    );
                    var s = this.field[this.r[0] + this.w[0]];
                    s =
                        s.substring(0, this.r[1] + this.w[1]) +
                        this.data +
                        s.substring(this.r[1] + this.w[1] + 1);
                    this.field[this.r[0] + this.w[0]] = s;
                }
                break;
            case 3:
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'P': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                } else {
                    var c = this.field[this.r[0] + this.w[0]][
                        this.r[1] + this.w[1]
                    ];
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
                        "Input text is needed. Please enter text below.",
                        ""
                    );
                    this.stdin += input_text;
                }
                this.isinput = false;
                if (
                    Probie.check_coor(
                        this.r[0] + this.w[0],
                        this.field.length
                    ) ||
                    Probie.check_coor(
                        this.r[1] + this.w[1],
                        this.field[this.r[0] + this.w[0]].length
                    )
                ) {
                    this.error_c(
                        "'I': WRITE pointer out of field: [" +
                            (this.r[0] + this.w[0]) +
                            ", " +
                            (this.r[1] + this.w[1]) +
                            "]"
                    );
                    return;
                } else {
                    var s = this.field[this.r[0] + this.w[0]];
                    s =
                        s.substring(0, this.r[1] + this.w[1]) +
                        this.stdin[0] +
                        s.substring(this.r[1] + this.w[1] + 1);
                    this.field[this.r[0] + this.w[0]] = s;
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
                (this.r[0] + this.w[0]) +
                ", " +
                (this.r[1] + this.w[1]) +
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
