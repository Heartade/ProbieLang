## Probie 언어 인터프리터

Made by Orb_H

---

### 사용법

1. 사용하고싶은 페이지에 `<script>` 태그를 이용하여 probie.js를 추가합니다. ex) `<script src="probie_short.min.js" charset="utf-8">`
2. 코드, 출력이 될 TextArea를 만듭니다.
3. 또 다른 `<script>`를 추가하여 표준 출력 콜백, 표준 에러 콜백, 표준 코드 콜백 함수를 지정합니다. 코드와 이 세 개의 콜백을 매개 변수로 새 Probie 인스턴스를 만든 후, run_auto()를 호출하면 Probie 코드를 실행할 수 있습니다.

예시는 [test.html](./test.html)에서 찾아볼 수 있습니다.

### 특징

- JavaScript로 만든 인터프리터입니다.
- Java로 만든 인터프리터를 포팅하고 일부 변형했습니다.
