var Probie = class {
    static Z() {
        //init
        for (var i = 0; i < 128; i++) {
            $P.X[$P.Y[i]] = i;
        }
    }

    constructor(z, y, x, v) {
        var _ = this;
        _.p = ""; //stdin
        _.r = ""; //stdout
        _.o = ""; //stderr

        _.b = 0; //nvstate

        _.i = [0, 0]; //r
        _.e = [0, 0]; //w
        _.h = [0, 0]; //m
        _.a = 0; //dir
        _.t = 1; //dist
        _.d = "○"; //data
        _.f = !1; //iscomment
        _.l = !1; //isbackslash
        _.m = !1; //isstop

        _.w = z.split("\n"); //field
        _.n = y; //stdoutcb
        _.s = x; //stderrcb
        _.c = v; //stdcodecb

        _.u = {
            //func2
            ">": () => (_.t += 1),
            "<": () => {
                if (!(_.t -= 1)) {
                    _.stop();
                }
            },
            R: () => (_.a = (_.a + 1) % 4),
            L: () => (_.a = (_.a + 3) % 4),
            "→": () => _.e[1]++,
            "←": () => _.e[1]--,
            "↑": () => _.e[0]--,
            "↓": () => _.e[0]++,
            "△": () => _.h[0]--,
            "▽": () => _.h[0]++,
            "◁": () => _.h[1]--,
            "▷": () => _.h[1]++,
            "▲": () => (_.h[0] -= _.t),
            "▼": () => (_.h[0] += _.t),
            "◀": () => (_.h[1] -= _.t),
            "▶": () => (_.h[1] += _.t),
        }; // move related
        _.g = {
            //func3
            X: 0,
            S: 1,
            s: 2,
            P: 3,
            I: 4,
        }; // nonvolatile
        _.j = {
            //func4
            "{": () => _.T(_, "{"),
            "}": () => _.T(_, "}"),
            "∧": () => _.D(_, "∧"),
            "∨": () => _.D(_, "∨"),
            "↔": () => _.F(_, "↔"),
            "↕": () => _.F(_, "↕"),
        }; // condition
        _.k = "+-×÷%".split(""); //arithmetic //func5
        _.q = "ADMdm".split(""); //arithmetic2 //func5
        _.v = {
            //func6
            "[": () => {
                if (_.I(_)) {
                    _.G(_, "[");
                } else {
                    _.d = _.w[_.h[0]][_.h[1]];
                }
            },
            "]": () => {
                if (_.I(_)) {
                    _.G(_, "]");
                } else {
                    _.w[_.h[0]] = _.H(_.w[_.h[0]], _.h[1], _.d);
                }
            },
            _: () => (_.h[1] = _.E(_.d)),
            "|": () => (_.h[0] = _.E(_.d)),
        }; // mem interaction
    }

    x(_) {
        //moveStep
        _.i[1] += !_.a ? _.t : _.a == 2 ? -_.t : 0;
        _.i[0] += _.a == 1 ? _.t : _.a == 3 ? -_.t : 0;
        if (_.O(_.i[0], _.w[$P.V]) || _.O(_.i[1], _.w[_.i[0]][$P.V])) {
            _.C(_);
        }
    }

    y(z, y) {
        //get_value_coor
        return this.E(this.w[z][y]);
    }

    z() {
        //get_value_write
        return this.y(this.P(), this.R());
    }

    P() {
        //w_y
        return this.i[0] + this.e[0];
    }

    R() {
        //w_x
        return this.i[1] + this.e[1];
    }

    O(x, l) {
        //check_coor
        return x < 0 || x >= l;
    }

    B(_) {
        //write_check_coor
        return _.O(_.P(), _.w[$P.V]) || _.O(_.R(), _.w[_.P()][$P.V]);
    }

    I(_) {
        //mem_check_coor
        return _.O(_.h[0], _.w[$P.V]) || _.O(_.h[1], _.w[_.h[0]][$P.V]);
    }

    E(z) {
        //get_value
        return z in $P.X ? $P.X[z] : 0;
    }

    H(s, index, c) {
        //replace
        return s[$P.Q](0, index) + c + s[$P.Q](index + 1);
    }

    A(z) {
        //mod128
        return (z + 128) % 128;
    }

    T(_, op) {
        if (_.O(_.i[0] - 1, _.w[$P.V] - 2)) {
            _.S(op, _.i[0] - 1, _.i[1], _.i[0] + 1, _.i[1]);
        } else {
            _.i[1] +=
                _.y(_.i[0] - 1, _.i[1]) > _.y(_.i[0] + 1, _.i[1]) != (op == "{")
                    ? 1
                    : -1;
        }
    }

    D(_, op) {
        if (_.O(_.i[0], _.w[$P.V]) || _.O(_.i[1] - 1, _.w[_.i[0]][$P.V] - 2)) {
            _.S(op, _.i[0], _.i[1] - 1, _.i[0], _.i[1] + 1);
        } else {
            _.i[0] +=
                _.y(_.i[0], _.i[1] - 1) > _.y(_.i[0], _.i[1] + 1) != (op == "∧")
                    ? 1
                    : -1;
        }
    }

    F(_, op) {
        if (_.B(_)) {
            _.U(op);
        } else {
            _.i[op == "↔" ? 1 : 0] += _.E(_.d) > _.z() ? -1 : 1;
        }
    }

    L(_, op) {
        if (_.B(_)) {
            _.U(op);
        } else {
            _.w[_.P()] = _.H(
                _.w[_.P()],
                _.R(),
                $P.Y[
                    _.A(
                        op == "+"
                            ? _.z() + _.E(_.d)
                            : op == "-"
                            ? _.z() - _.E(_.d)
                            : op == "×"
                            ? _.z() * _.E(_.d)
                            : op == "%"
                            ? _.z() % _.E(_.d)
                            : _.z() / _.E(_.d)
                    )
                ]
            );
        }
    }

    M(_, op) {
        if (_.B(_)) {
            _.U(op);
        } else {
            _.d =
                $P.Y[
                    _.A(
                        op == "A"
                            ? _.E(_.d) + _.z()
                            : op == "D"
                            ? _.E(_.d) - _.z()
                            : op == "M"
                            ? _.E(_.d) * _.z()
                            : op == "d"
                            ? _.E(_.d) / _.z()
                            : _.E(_.d) % _.z()
                    )
                ];
        }
    }

    // console input
    W(z) {
        //read_c
        for (i = 0; i < z[$P.V]; i++) {
            this.p +=
                z[i] == "\\"
                    ? "\\\\"
                    : z[i] == "\n"
                    ? "\\n"
                    : z[i] == "\t"
                    ? "\\t"
                    : z[i];
        }
    }

    // console output
    N(z) {
        //write_c
        this.r += z;
        //print event, added character and whole output as parameter
        this.n(z, this.r);
    }

    // compare operation error log
    S(op, y1, x1, y2, x2) {
        //error_comp
        this.K(
            _,
            `'${op}': comparing cells out of field: [${y1}, ${x1}], [${y2}, ${x2}]`
        );
    }

    C(_) {
        //error_read
        _.J("READ pointer", _.i[0], _.i[1]);
    }

    U(z) {
        //error_write(op)
        this.J(`'${z}': WRITE pointer`, this.P(), this.R());
    }

    G(_, z) {
        //error_mem(op)
        _.J(`'${z}': MEM cursor`, _.h[0], _.h[1]);
    }

    J(s, y, x) {
        //error_out_field(s,y,x)
        this.K(this, s + ` out of field: [${y}, ${x}]`);
    }

    // error output
    K(_, z) {
        //error_c
        _.o += z;
        //print event, added character and whole output as parameter
        _.s(z, _.o);
        _.stop();
    }

    Q(_) {
        //operate
        if (_.b == 1) {
            _.d = _.B(_) ? "○" : _.w[_.P()][_.R()];
        } else if (_.b == 2) {
            if (_.B(_)) {
                _.U("s");
            } else {
                _.w[_.P()] = _.H(_.w[_.P()], _.R(), _.d);
            }
        } else if (_.b == 3) {
            if (_.B(_)) {
                _.U("P");
            } else {
                var c = _.w[_.P()][_.R()];
                if (c == "\\") {
                    if (_.l) {
                        _.N(c);
                    } else {
                        _.l = true;
                    }
                } else if (_.l) {
                    _.N(c == "n" ? "\n" : c == "t" ? "\t" : c);
                    _.l = false;
                } else {
                    _.N(c);
                }
            }
        } else if (_.b == 4) {
            while (!_.p[$P.V]) {
                _.W(prompt("Input needed. Please fill below.", ""));
            }
            if (_.B(_)) {
                _.U("I");
            } else {
                _.w[_.P()] = _.H(_.w[_.P()], _.R(), _.p[0]);
            }
            _.p = _.p[$P.Q](1);
        }
    }

    V(c) {
        //interpret
        var _ = this;
        var b = true;
        if (!_.m && c == "!") {
            _.f = !_.f;
        }

        if (!_.m && !_.f) {
            if (c in _.u) {
                _.u[c]();
            } else if (c in _.g) {
                _.b = _.g[c];
            }
        }

        if (!_.m) {
            _.Q(_);
        }

        if ((!_.m && _.f) || !!_.b) {
            _.x(_);
            b = false;
        }

        if (!_.m && !_.f) {
            if (c in _.j) {
                _.j[c]();
                b = false;
            } else if (_.k.includes(c)) {
                _.L(_, c);
            } else if (_.q.includes(c)) {
                _.M(_, c);
            } else if (c in _.v) {
                _.v[c]();
            }
        }

        if (!_.m && b) {
            _.x(_);
        }
    }

    //////////////////
    //////////////////

    run_step() {
        var _ = this;
        if (!_.m) {
            _.V(_.w[_.i[0]][_.i[1]]);
            _.c(_.w);
        }
    }

    run_auto() {
        var _ = this;
        while (!_.m) {
            _.V(_.w[_.i[0]][_.i[1]]);
        }
        _.c(_.w);
    }

    stop() {
        this.m = true;
    }

    isstopped() {
        return this.m;
    }

    get_output() {
        return this.r;
    }
};

var $P = Probie;

$P.Y = "○①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮◎ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~●".split(
    ""
); //symbols
$P.X = {}; //values
$P.V = "length"; //length_alias
$P.Q = "substring"; //substring_alias

$P.Z();
