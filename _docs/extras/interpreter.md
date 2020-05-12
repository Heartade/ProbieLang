---
title: 인터프리터
description: Probie 인터프리터입니다.
tags:
    - code
---

# 인터프리터

Probie 코드를 실행해볼 수 있는 페이지입니다.

**코드**
<textarea style="resize:both;font-family:'Monospace';" id="code"></textarea>

**출력**
<textarea style="resize:both;font-family:'Monospace'" id="output" disabled="true"></textarea>

<button onclick="run()">실행</button>

<script src="{{ site.baseurl }}/assets/js/probie_short.min.js"></script>
<script>
var p = undefined;

function run() {
    var t = document.getElementById("code").value;
    p = new Probie(t, stdoutcb, stderrcb, stdcodecb);
    p.run_auto();
    console.log("Done");
}

var stdoutcb = function (c, text) {
    document.getElementById("output").value = text;
}

var stderrcb = function (c, text) {
    console.error(c);
    alert(c);
}

var stdcodecb = function (c) {
    document.getElementById("code").value = c.join('\n');
}
</script>
<style>
@font-face{
  font-family: Monospace;
  src: url("{{ site.baseurl }}/assets/webfonts/Monospace.ttf");
}
</style>
