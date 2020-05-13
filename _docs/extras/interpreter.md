---
title: 에디터
description: Probie 코드를 작성할 수 있는 에디터입니다.
tags:
    - code
---

# 온라인 에디터 v1.2.0

Probie 코드를 실행해볼 수 있는 페이지입니다. 코드 칸과 출력 칸은 크기를 마음대로 바꿀 수 있습니다.

**코드**
<textarea style="resize:both;font-family:'Monospace';" id="code"></textarea>

**출력**
<textarea style="resize:both;font-family:'Monospace';background-color:white;" id="output" disabled="true"></textarea>

<button onclick="run()">실행</button>
(실행 시간: <span id="time"></span> ms)

---

**기능 단축키**

|기능|단축키|
|:-:|:-:|
|코드 실행|<kbd>Alt</kbd> + <kbd>Enter</kbd>|

**특수기호 단축키**

|기호|단축키|
|:-:|:-:|
|<kbd>↑</kbd> / <kbd>←</kbd> / <kbd>↓</kbd> / <kbd>→</kbd>|<kbd>Alt</kbd> + (<kbd>W</kbd> / <kbd>A</kbd> / <kbd>S</kbd> / <kbd>D</kbd>)|
|<kbd>△</kbd> / <kbd>◁</kbd> / <kbd>▽</kbd> / <kbd>▷</kbd>|<kbd>Alt</kbd> + (<kbd>I</kbd> / <kbd>J</kbd> / <kbd>K</kbd> / <kbd>L</kbd>)|
|<kbd>▲</kbd> / <kbd>◀</kbd> / <kbd>▼</kbd> / <kbd>▶</kbd>|<kbd>Alt</kbd> + (<kbd>T</kbd> / <kbd>F</kbd> / <kbd>G</kbd> / <kbd>H</kbd>)|
|<kbd>↔</kbd> / <kbd>↕</kbd>|<kbd>Alt</kbd> + (<kbd>Z</kbd> / <kbd>X</kbd>)|
|<kbd>×</kbd> / <kbd>÷</kbd>|<kbd>Alt</kbd> + (<kbd>M</kbd> / <kbd>N</kbd>)|
|<kbd>∨</kbd> / <kbd>∧</kbd>|<kbd>Alt</kbd> + (<kbd>V</kbd> / <kbd>B</kbd>)|
|값에 해당하는 문자|<sup>※</sup>hex code + <kbd>Alt</kbd> + <kbd>C</kbd>|

※ hex code를 굳이 입력하지 않아도 hex code 뒤쪽으로 커서를 옮긴 후 Alt + C를 입력해도 코드 변환이 가능합니다.

<script src="{{ site.baseurl }}/assets/js/probie_short.min.js"></script>
<script src="{{ site.baseurl }}/assets/js/interpreter.js"></script>
<style>
@font-face{
  font-family: Monospace;
  src: url("{{ site.baseurl }}/assets/webfonts/Monospace.ttf");
}
</style>
