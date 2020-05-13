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
