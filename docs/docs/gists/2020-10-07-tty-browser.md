---
layout: post
title: Browsing the web from the terminal
---

!!! tldr
    To browse the web from a TTY (!), with docker installed:

    <div id="termynal1" data-termynal >
      <span data-ty="input">curl -L git.io/netsurf | python3</span>
      <span data-ty="input">netsurf -w 1920 -h 1080 google.com/search?q="terry tao"</span>
    </div>




## Why

Two reasons:

* I've been, for some time now, interested on not depending on x11
* In remote debugging session, or in general in abscence of X server (not by choice),
  I end up needing google something. 
  
While it is true you can just use your mobile, another machine, or text based browsers
like lynx, none of these hit the tradeoff between speed and interactivity (not with me
behind the keyboard)

This was the perfect excuse to play a little bit with the framebuffer:

Turns out, with appropiate permisions (eg being in the `video` group),
you can directly "draw" pixels on the screen

<div id="termynal" class="centerDiv" data-termynal>
  <span data-ty="input">cat /dev/urandom > /dev/fb0</span>
</div>

(Here, the framebuffer is located at `/dev/fb0` )

## How

The netsurf browser has several drawing backends. One of them is (SDL) framebuffer. The
challenge here was to find out the compile and runtime reqs and params to make it work.

Once the correct parameters, configurations and commands are correct, you can run
netsurf to surf the net from the tty, without X server.

The results can be found in this [dockerfile](https://raw.githubusercontent.com/pwoolvett/netsurf-docker/master/Dockerfile)
