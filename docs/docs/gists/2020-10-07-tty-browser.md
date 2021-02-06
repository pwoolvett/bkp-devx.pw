---
layout: post
title: Browsing the web from the terminal
---


!!! tldr
    To browse the web from a TTY (!), with docker installed:
    <aside class="aside">
      <div id="termynal" class="centerDiv" data-termynal>
      <span data-ty="input">curl -L git.io/netsurf | python3</span>
      <span data-ty="input">netsurf -w 1920 -h 1080 google.com/search?q="terry tao"</span>
    </aside>



## Why

In a remote debugging session, or in general in abscence of X server,
I've had to google / stackoverflow something. Once or twice I used another machine, or
text based browsers like lynx. But sometimes its just not fast/colorful enough.

This was the perfect excuse to play a little bit with the framebuffer:

Turns out, with appropiate permisions (eg being in the `video` group),
you can directly "draw" pixels on the screen

<div id="termynal" class="centerDiv" data-termynal>
  cat /dev/urandom > /dev/fb0
</div>

Here, the framebuffer is located at `/dev/fb0`

## How

The netsurf browser has several drawing backends. One of them
is (SDL) framebuffer. The callwnge here was to find out the
compile and runtime reqs and params to make it work.

The results can be found in this [dockerfile](https://raw.githubusercontent.com/pwoolvett/netsurf-docker/master/Dockerfile)
