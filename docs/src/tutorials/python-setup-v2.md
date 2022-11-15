---
layout: post
title:  Snakes and Ladders II - Snakes Reloaded
date:   2019-05-07 20:16:00 -0400
categories:
  - python/tutorial
tags:
  - hello world
  - python
---

### Topics covered
0. [TL;WR](#tl-wdr)
1. [Python installation](#python)
2. [Virtual environments](#venv)
3. [Installing libraries with pip](#pip)
4. [Project Structure](#project-structure)


---

# Python setup tutorial

## Python Version management

### pyenv: THE python version manager

Do not install python on your own. Instead, use a version manager, like [pyenv](https://github.com/pyenv/pyenv):

```bash
curl https://pyenv.run | bash
```

### Build python prerequisites:

Before bein able to build python using pyenv, you'll probably need a bunch of tools
([See here for a reference and instructions for other OS](https://github.com/pyenv/pyenv/wiki/Common-build-problems)):

=== "Ubuntu/Debian"

    ```shell
    sudo apt-get install -y \
        build-essential \
        libssl-dev \
        zlib1g-dev \
        libbz2-dev \
        libreadline-dev \
        libsqlite3-dev \
        wget \
        curl \
        llvm \
        libncurses5-dev \
        libncursesw5-dev \
        xz-utils \
        tk-dev \
        libffi-dev \
        liblzma-dev \
        python-openssl \
        git
    ```

=== "Alpine"

    ```shell
    apk add --no-cache \
        bzip2-dev \
        coreutils \
        dpkg-dev \
        dpkg \
        expat-dev \
        findutils \
        gcc \
        gdbm-dev \
        libc-dev \
        libffi-dev \
        libnsl-dev \
        libtirpc-dev \
        linux-headers \
        make \
        ncurses-dev \
        openssl-dev \
        pax-utils \
        readline-dev \
        sqlite-dev \
        tcl-dev \
        tk \
        tk-dev \
        util-linux-dev \
        xz-dev \
        zlib-dev

    # And to use pyenv-installer
    apk add \
        git \
        curl \
        bash
    ```

=== "Arch"

    ```shell
    pacman -S --needed \
        base-devel \
        openssl \
        zlib \
        bzip2 \
        readline \
        sqlite \
        curl \
        llvm \
        ncurses \
        xz \
        tk \
        libffi \
        python-pyopenssl \
        git

    # And for ncurses5
    yay -S ncurses5-compat-libs
    ```

### Installing python versions

Use `pyenv` to install python versions. `pyenv isntall --list` will show available
versions: dev and stable, old and new. Even those outside the default implementation,
like pypy, jython, micropython, etc.

So, you know... a lot of versions

Pick one  and install:

```console
pyenv install 3.9.0
```

### Setting a custom interpreter

To set a custom python as THE python interprerer:

```console
pyenv local 3.9.0
```

This creates a `.python-version` file which tells the pyenv prompt command to ensure
that specific python is the first one found in $PATH.


## Managing Virtual Environments

Your system probably has a python.
Maybe two versions.
Avoid using them or installing stuff using those `pip`.

Instead, for each project you should use a different virtual environment.
This avoids having dependency issues and makes it easier to reproduce.

### The only exception

There are some tools which should be installed on your system. The only one I recommend is `pipx`

```python
python3 -m pip install --user pipx
```

now pypi is an application store!

### Install cross-project tools using pipx

This ensures every executable has its own, isolated virtualenv.

Go ahead and install poetry with this method.

```python
pipx install poetry
```

Whatever you find on pypi can be installed this way, so you could, for example:

```python
pipx install docker-compose
```

or

```python
pipx install youtube-dl
```


etc.



### Actually Managing Venvs

* python comes with a venv module
* there's a virtualenv package 
* pipx creates a venv for every 'app'
* pyenv can manage virtual envs
* poetry can manage virtual envs
* pipenv (similar to poetry)
* anaconda and friends also manage venvs

Also, there's docker, virtual machines, tox, ...

It does not matter how or which tool you use,
just use virtual envs.

Also, use poetry :wink:.

So, you have a project which requires `python3.7`:

```console
pyenv install 3.7.x # this is required once, after this, that version will ve available to use in your system.
# instead of x, press TAB and vhoose tha latest available

pyenv local 3.7.x # ensure while in this directory that is what "python" is bound to
poetry [install|shell|new|init|env] # the corresponding command for the project stage youre at
```

you can liat them with `poetry env --list`