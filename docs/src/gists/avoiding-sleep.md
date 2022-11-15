---
title: A workaround story with double locks 
tags: iot, esp8266
---

## TL;DR

I had some issues working with wipy ([picom micropython](https://pycom.io/product/wipy-3-0/))
for a multithreaded deployment. Specifically, I wanted the following:

1. Have the thread worker return its value to the main thread (this is pretty commmon,
   so there's a known patten for that).
1. Solve an issue with the library where you had to manually sleep in the main thread,
   or it would block the auxiliary threads.

!!! info "The problem"

    See the original description of the problem and the proposed workaround here:
    [pycom forums](https://forum.pycom.io/topic/5805/main-thread-blocks-auxiliary-threads-_thread-module/8?_=1614271595068)

## The solution

Insights:

* If the main thread does not allow the other threads to run, it means it is not waining
  enough for "something" to happen. Evidence of this is that manually sleeping in the
  main thread is the recommended workaround.
* As the code interacted with the `_thread` module mainly in the `_thread.start_new_thread`,
  there were two possible delays:
  1. The time it takes to run the `_thread.start_new_thread` instruction
  1. The time it takes from then until the target callback is called.

I first tried using a lock around the instruction (case 1), which did not solve the
problem. Finally, I implemented a solution where use an external lock before the
`_thread.start_new_thread` instruction, and release it at the beginning of the target
call.

### Sample implementation

This is a demo for the code I ended up using.

```python
import time
import _thread

class Thread:

    def init(self, target):
        self.result = None
        self.target = target
        self.lock = _thread.allocate_lock()
        self.aux_lock = _thread.allocate_lock()

    def real_call(self):
        with self.lock:
            self.aux_lock.release()
            self.result = self.target()

    def call(self):
        self.aux_lock.acquire()
        _thread.start_new_thread(self.real_call, ())
        with self.aux_lock:
            pass

    def join(self):
        with self.lock:
            pass

def demo():
    print("Starting")
    time.sleep(10)
    print("Ending")
    return 42


def main():

    t = Thread(target = demo)
    t()
    t.join()
    print("Result: " + str(t.result))

if name == "main":
    main()

```
