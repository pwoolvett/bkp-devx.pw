---
title: Drytoml
---

# Drytoml

!!! tldr
    Just install with pip 

    <div id="termynal1" data-termynal >
        <span data-ty="input">pip install drytoml</span>
        <span data-ty>Successfully installed drytoml</span>
    </div>

    ```toml
    # contents of pyproject.dry.toml
    ...
    [tool.black]
    __extends = "../../common/black.toml"
    target-version = ['py37']
    include = '\.pyi?$'
    ...
    ```

    ```toml
    # contents of ../../common/black.toml
    [tool.black]
    line-length = 100
    ```

    <div id="termynal1" data-termynal >
        <span data-ty="input">dry export --file=pyproject.dry.toml > pyproject.toml</span>
    </div>

    ```toml
    # contents of pyproject.toml
    [tool.black]
    line-length = 100
    target-version = ['py37']
    include = '\.pyi?$'
    ```

    See the official documentation and usage at [the official docs](https://drytoml.readthedocs.io/en/latest/)

## Motivation

I have several developer tools, each with its own configuration.
For formatting, there's 
[black](https://pypi.org/project/black/),
[isort](https://pypi.org/project/isort/),
[docformatter-toml](https://pypi.org/project/docformatter-toml),
then, for linting, thanfully theres
[flakehell](https://pypi.org/project/flakehell/)
(actually, I required a fork, published as 
[flakeheaven](https://pypi.org/project/flakeheaven/)
)

Gone are the days where the mere presence of a `pyproject.toml` would
cause `pip` to fail installing a package, even with a healthy `setup.py`.
Tools like [blackini](https://pypi.org/project/blackini) (RIP) have become obsolete, and there's a new sheriff in town: `drytoml` - which is
the same as `blackini`, but reversed.

Since all of the mentioned tools (and everyday more) have native support
for `pyproject.toml`-based configurations, that has become my standard.
However, I like to keep my configurations DRY and manageable, which is
why I created drytoml: a tool which lets you reference another `.toml` or
parts of it to configure yout tools.

## Another tool? what about flakehell, or nitpick?

* flakehell is a great tool, and it actually inspired me to extend its functionality
  outside of the "lint" scope to a "vonfigure-all" scope. Kinda like `.editorconfig`,
  but for the devtools.

* nitpick is a checker, at least for the moment.

## How does it work?

There are two workflows: you can transclude your "source" into an output file, like in the example above, or you can run the included wrappers
(see the official documentation for details.)

The first mode is straightforward:

1. Read the source document
2. Each time the special codeword (`__extends` by default) is found as a
   key in the source document, recursively merge its respective value with
   the contents of the referenced section

On the other hand, the wrappers have extra work to do:

1. After the previous two steps, create a temporary file (in `pwd` to ensure)
   relative paths are not broken)
1. Configure a tool (eg `black`) to use said temporary file as its configuration
   file.


This enables to have a single source of truth in a repo. For example, a
`pyproject.base.toml` with references on its own sections, like
`[tool.flakehell]`, to another file in the same repo, `flakehell.toml`, which,
in turn, contains whatever the most up-to-date nitpicky configuration I happen to have
at the moment of running.

* Got a pylint false positive issue fixed? Time to re-enable that fix in the upstream
  repo, then run `dry cache clear` to make `drytoml` forget about the current
  (now outdated) version.
* Continuous integration pipelines usually are stateless, so clearing the cache is not
  required. Dont want to have the lates upstream version because of fear of breaking
  the CI pipeline? You can either use a cache for persistence, or use `drytoml`'s
  `export` command instead of the wrappers.
* I'm currently using `drytoml` in all my ci pipelines.


# Closing

`drytoml` is available on PyPI  [here](https://pypi.org/project/drytoml/), and it has a loose dependency on `black`, so you can just `pip install blackini` (or pin a specific `black` version, by installing it before `blackini`). Once installed, it will overwrite the black executable. 

This is enough for my most common use case scenario, and allows to move
the black configuration inside the same tox.ini file, just like the rest of the tools.
