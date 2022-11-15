---
title: Using bin elements in Gstreamer from gstlaunch
tags: gstreamer
---

!!! note "TL;DR"

    ```bash
    export caps='video/x-raw(memory:NVMM),width=1280,height=720'
    export DISPLAY=:0 
    gst-launch-1.0 bin \
        \( videotestsrc pattern=snow ! videorate ! nvvideoconvert ! capsfilter caps=$caps  \) \
    ! mux.sink_0 nvstreammux name=mux width=1920 height=1080 batch-size=1 \
    ! nvvideoconvert \
    ! videoconvert \
    ! xvimagesink \
     bin \
        \( videotestsrc pattern=ball ! videorate ! nvvideoconvert ! capsfilter caps=$caps  \) \
    ! mux.sink_1
    ```

# Motivation

When woking with Gstreamer, a useful abstraction is the `bin` element, which
can be used to encapsulate sub-sections of a pipeline, like a black box.

When developing a GStreamer-based application, it is sometimes useful to isolate the 
gstreamer pipeine itself from the rest of the application logic (eg for performance
optimization). It happened to me that each time I wanted to ask a question in a forum,
I had to simplify the Pipeline and reduce it to a minimal example so as to concentrate
in the specific question at hand.

It was during this stage that we developed a small procedure to check the pipeline's
behavior: just run it using `gst-launch`. Problem is, I was dynamically building the
pipeline, and it used bins to achieve this blackbox effect on the source...

Which is why the command at the beginning of the post is useful: as a template to
reconstruct more complex pipelines which use bins and be able to run them with the
`gst-launch` utility.
