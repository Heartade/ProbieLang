---
title: 소식
permalink: /news/
---

# 소식

<p>Subscribe with <a href="{{ site.baseurl }}/feed.xml">RSS</a> to keep up with the latest news.
For site changes, see the <a href="https://github.com/{{ site.github_user }}/{{ site.github_repo }}/blob/master/CHANGELOG.md">changelog</a> kept with the code base.</p>

<br>

{% for post in site.posts limit:10 %}
   <div class="post-preview">
   <h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
   <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span><br>
   {% if post.badges %}{% for badge in post.badges %}<span class="badge badge-{{ badge.type }}">{{ badge.tag }}</span>{% endfor %}{% endif %}
   {{ post.content | split:'<!--more-->' | first }}
   {% if post.content contains '<!--more-->' %}
      <a href="{{ site.baseurl }}{{ post.url }}">read more</a>
   {% endif %}
   </div>
   <hr>
{% endfor %}

더 많은 내용은 <a href="{{ site.baseurl }}/archive/">아카이브</a>에서 찾아보세요.
