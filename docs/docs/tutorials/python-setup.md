---
layout: post
title:  Snakes and Ladders I - The pythoning
date:   2019-05-07 20:16:00 -0400
categories:
  - python/tutorial
tags:
  - hello world
  - python
---
![python yaay](../img/snake_ladder.jpg#center)

This is the first of several posts about common python stuff, starting from installation, through configuration of a project, and explaining an opinionated (and maybe over-complicated) python setup.
As a whole, they explain my road to to [My Template](https://github.com/pwoolvett/python_template "My template")

### Topics covered
0. [TL;WR](#tl-wdr)
1. [Python installation](#python)
2. [Virtual environments](#venv)
3. [Installing libraries with pip](#pip)
4. [Project Structure](#project-structure)


---

Too long, Won't Read
-

* Install python:
    ```bash
    sudo apt install python3.7
    ```
* Install virtualenv lib:
    ```bash
    sudo apt install python3.7-venv
    ```
* Create project:
    ```bash
    cd ~
    mkdir project_a
    cd project_a
    touch README
    echo "print('hola mundo')" > script_a.py
    python3.7 -m venv .venv
    ```
* Activate virtualenv:
    ```bash
    source .venv/bin/activate
    ```
* install and declare libs:
    ```bash
    pip install antigravity
    pip freeze > requirements.txt
    ```
* Run a script:
    ```bash
    python script_a.py
    ```
    
That's it. Next sections talk about what, how, and why these commands make sense to me.
---


I. Python installation
-

![picture alt](/img/pkmn.png#center "howdoyouturnthison")

You will want to install / download python, regardless if you and/or your os already have/has one.

1. Go to [Download Python](https://www.python.org/downloads/)
2. Click on "download Python 3.x.y" (as of today, latest version is 3.7.3)

    The numbers represent [MAJOR.MINOR.PATCH](https://semver.org/): 
    
    * MAJOR version when you make incompatible API changes
    * MINOR version when you add functionality in a backwards-compatible manner
    * PATCH version when you make backwards-compatible bug fixes.

Which version should I install?

Check any library dependencies / restrictions. If starting from scratch, start with the highest available.

In the following, I'll assume you have python 3.7:

```bash
sudo apt install python3.7
```

Now, if all went OK, you can now do this:

```bash
python3.7 -c "print('hola mundo')"
```
, which just runs the comand inside the `"` in the python interpreter,

The ´3.7´ might not be necessary, but if you had another python version installed, it'll make sure we're calling the right one.


Virtual environments
-

Before python, I was used to Matlab/Octave. There, when you need an extra library, you just add the "package" to the whole program, and that was it. For research purposes, it was more than enough.

In python, the (standard) way to do this (install a library), is by invoking the ancestral magic: `pip install [xxx]`, where `xxx` is a any package available in [PYPI](https://pypi.org/). Don't do this yet.

So now you have a project (let's call it "project A"). You can execute python, run scripts, install libraries, etc. Before continuing, it might be useful to ask yourself: who's the intended receipient for the code?

It most likely won't be (just) you -sorry if you are-. I certainly hope it's not your OS either -really sorry if it really is-. Even if that is the case, you wouldn't want to install your packages/libraries into your system, right? ...

Right?

What if later, you have another project called "project B" (I know, very original, right?), but project B has different dependencies? Or if a library update breaks your awesome code?

You want to have an environment for your project which is as reproducible and controllable as possible, Regardless of the (un)tidyness of the recipient's python interpreter. Bfe it your own OS's python or your buddy's, your bossesses' or your client's, you want a python as clean as possible, with all and only the required libraries for project A. What about project B then?

Enter virtual environments [python docs](https://docs.python.org/3/library/venv.html) [pep 0405](https://www.python.org/dev/peps/pep-0405/). From the docs: "lightweight 'virtual environments' with their own site directories, optionally isolated from system site directories. Each virtual environment has its own Python binary (which matches the version of the binary that was used to create this environment) and can have its own independent set of installed Python packages in its site directories."

This translates to: put python stuff inside a bubble specifically tailored for "project A". To do this, we need another python library called ´venv´:

```bash
python3.7 -m venv my_first_virtualenv
```

That command creates a folder "my_first_virtualenv" containing all necessary stuff to run python isolated from your system, or "project B". Now, the last piece of the puzzle is to make sure that we use the "new" python instead of the system's. This is called "activating" the virtual environment. For example, with ´source path_to_my_virtualenv/bin/activate´ (linux) or ´path_to_my_virtualenv/Scripts/activate.bat´ (win). This is just a trick wich pre-pends the folders of the respective virtualenv in the ´PATH´ [environment variable](https://en.wikipedia.org/wiki/Environment_variable). Now, calling ´python´ will use the virtualenv executable instead of your system's.

If the activation is correct, you should see a ´(virtualenv_name)´ before the command prompt. In order to deactivate it, just run ´deactivate´, or close the terminal (don't worry, your ´PATH´ variable is only altered for the running session, inside the terminal)

Once activated, you can just run `python [whatever]` and it'll fint the python in the activated. Try playing with `which python` (unix) or `where python` (windows) before and after activation, and see what happens. Try again with `pip` instead of `python`.


Installing libraries and pip
-

Finally, when installing libraries, we'll want to install them inside the virtualenv. So just make sure the virtualenv is activated, and perform the ritual: `pip install xxx`.

At any moment, if you with to see installed libraries, just run `pip freeze` (with the venv activated). Except for `pkg-resources==0.0.0` (if present, it's a [known bug](https://stackoverflow.com/questions/39577984/what-is-pkg-resources-0-0-0-in-output-of-pip-freeze-command)), every line is a package with its respective version.

Now, if you want someone else to replicate your environment, you have to tell them which libraries are required:

```bash
pip freee > requirements.txt
```
With this, you can send them your code together with the requirements file, and they can install all requirements:
```bash
pip install -r requirements.txt
```
(whithin a proper virtualenv, if they're civilized)
