---
layout: post
title: Web Search from a terminal
---


<div class="message">
  To browse the web from a TTY with docker installed:

  {% highlight bash %}
    curl -sSl https://raw.githubusercontent.com/pwoolvett/netsurf-docker/master/manage.py | python3
    netsurf -w 1920 -h 1080 google.com/search?q="now what?" 
  {% endhighlight %}

</div>

## Why

In a remote debugging session, or in general in abscence of X 
server, you have to google / stackoverflow (one day it'll be
promoted as a verb too...) something.

Once or twice I used another machine, or text based browsers
like lynx. But sometimes its just not fast/colorful enough.

This was the perfect excuse to find out what the framebuffer
is all about... or at least play a little with it.

Turns out, with appropiate permisions (eg being in the `video`
group), you can directly "draw" pixels on the screen

{% highlight bawh %}
  cat /dev/urandom > /dev/fb0
{% endhighlight %}

Here, the framebuffer is located at `/dev/fb0`

## How

The netsurf browser has several drawing backends. One of them
is (SDL) framebuffer. The callwnge here was to find out the
compile and runtime reqs and params to make it work.

The results can be found in the dockerfile:

https://raw.githubusercontent.com/pwoolvett/netsurf-docker/master/Dockerfile


