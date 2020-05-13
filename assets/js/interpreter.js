document
    .getElementById("code")
    .addEventListener("keydown", code_mnemonic, false);

var p = undefined;

function run() {
    var t = document.getElementById("code").value;
    var start = performance.now();
    p = new Probie(t, stdoutcb, stderrcb, stdcodecb);
    p.run_auto();
    var end = performance.now();
    document.getElementById("time").innerHTML = (end - start).toFixed(3);
    console.log("Done");
}

var stdoutcb = function (c, text) {
    document.getElementById("output").value = text;
};

var stderrcb = function (c, text) {
    console.error(c);
    alert(c);
};

var stdcodecb = function (c) {
    document.getElementById("code").value = c.join("\n");
};

function code_mnemonic(event) {
    var c = document.getElementById("code");
    var s = c.selectionStart; //location of start cursor
    var e = c.selectionEnd; //location of end cursor
    var r = ""; //converted string
    var a = s + 1; //cursor location after conversion
    if (event.altKey) {
        var b = true; //manipulate code textarea?
        event.preventDefault();
        switch (event.keyCode) {
            case 0x57: //W
                r = c.value.substring(0, s) + "↑" + c.value.substring(e);
                break;
            case 0x41: //A
                r = c.value.substring(0, s) + "←" + c.value.substring(e);
                break;
            case 0x53: //S
                r = c.value.substring(0, s) + "↓" + c.value.substring(e);
                break;
            case 0x44: //D
                r = c.value.substring(0, s) + "→" + c.value.substring(e);
                break;
            case 0x49: //I
                r = c.value.substring(0, s) + "△" + c.value.substring(e);
                break;
            case 0x4a: //J
                r = c.value.substring(0, s) + "◁" + c.value.substring(e);
                break;
            case 0x4b: //K
                r = c.value.substring(0, s) + "▽" + c.value.substring(e);
                break;
            case 0x4c: //L
                r = c.value.substring(0, s) + "▷" + c.value.substring(e);
                break;
            case 0x54: //T
                r = c.value.substring(0, s) + "▲" + c.value.substring(e);
                break;
            case 0x46: //F
                r = c.value.substring(0, s) + "◀" + c.value.substring(e);
                break;
            case 0x47: //G
                r = c.value.substring(0, s) + "▼" + c.value.substring(e);
                break;
            case 0x48: //H
                r = c.value.substring(0, s) + "▶" + c.value.substring(e);
                break;
            case 0x5a: //Z
                r = c.value.substring(0, s) + "↔" + c.value.substring(e);
                break;
            case 0x58: //X
                r = c.value.substring(0, s) + "↕" + c.value.substring(e);
                break;
            case 0x4d: //M
                r = c.value.substring(0, s) + "×" + c.value.substring(e);
                break;
            case 0x4e: //N
                r = c.value.substring(0, s) + "÷" + c.value.substring(e);
                break;
            case 0x56: //V
                r = c.value.substring(0, s) + "∨" + c.value.substring(e);
                break;
            case 0x42: //B
                r = c.value.substring(0, s) + "∧" + c.value.substring(e);
                break;
            case 0x43: //C
                var n = parseInt(c.value.substring(e - 2, e), 16);
                if (n >= 0 && n <= 0x7f) {
                    r =
                        c.value.substring(0, e - 2) +
                        $P.Y[n] +
                        c.value.substring(e);
                    a = e - 1;
                } else {
                    b = false;
                }
                break;
            case 0xd: //Enter
                b = false;
                run();
                break;
            default:
                b = false;
        }
        if (b) {
            c.value = r;
            c.selectionStart = c.selectionEnd = a;
        }
    }
}
