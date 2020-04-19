---
layout: page
title: 문서 목록
permalink: /docs/
---

# 문서 목록

{{ site.title }}의 문서를 목록으로 정리한 페이지입니다. 특정 페이지로 바로 이동할 수 있습니다.

<div class="section-index">
    <hr class="panel-line">
    {% for post in site.docs %}
    <div class="entry">
    <h5><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h5>
    <p>{{ post.description }}</p>
    </div>{% endfor %}
</div>
