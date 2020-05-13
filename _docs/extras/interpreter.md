---
title: 인터프리터
description: Probie 인터프리터입니다.
tags:
    - code
---

# 인터프리터 v1.1.0

Probie 코드를 실행해볼 수 있는 페이지입니다. 코드 칸과 출력 칸은 크기를 마음대로 바꿀 수 있습니다.

**코드**
<textarea style="resize:both;font-family:'Monospace';" id="code"></textarea>

**출력**
<textarea style="resize:both;font-family:'Monospace';background-color:white;" id="output" disabled="true"></textarea>

<button onclick="run()">실행</button>
(실행 시간:
<span id="time"></span> ms)

<script src="{{ site.baseurl }}/assets/js/probie_short.min.js"></script>
<script src="{{ site.baseurl }}/assets/js/interpreter.js"></script>
<style>
@font-face{
  font-family: Monospace;
  src: url("{{ site.baseurl }}/assets/webfonts/Monospace.ttf");
}
</style>
