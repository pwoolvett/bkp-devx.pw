---
title: Blackini
---

!!! tldr
    Just install with pip 

    <div id="termynal1" data-termynal >
        <span data-ty="input">pip install blackini</span>
        <span data-ty>Successfully installed blackini</span>
        <span data-ty="input">cat tox.ini</span>
        <span data-ty data-ty-delay="250">
        [tool.black]
        </span>
        <span data-ty data-ty-delay="250">
        line-length = 79
        </span>
        <span data-ty data-ty-delay="250">
        target-version = py36,
        </span>
        <span data-ty="input">black --config-file=tox.ini</span>
        <span data-ty>...</span>
    </div>


??? attention "Deprecation Notice"
    Although the project is fully functional, I no longer use this method as the rest of
    the python ecosystem has evolved and now most tools accept configuration from
    `pyproject.toml`.

# Motivation

This is a [black](https://github.com/psf/black) wrapper to allow it to read configuration from .ini files.

The developer toolbox for python includes formatters, linters, and testing libraries. In my case, this means (at least): black, flake8, pytest and tox.

For code formatting, although black demands no configuration, you can tweak some minor settings (mainly max-line-length, in my case) by either of two options: calling black with command-line args, or by defining a [tool.black] table in a pyproject.toml file.

While the former rapidly becomes tedious and error-prone, the latter also has its own drawbacks, as most other tools (flake8, mypy, isort, bandit, tox, to name a few) can be configured with a single tox.ini...

Enter blackini, "A black wrapper to read config from .ini files."

# How does it work?

By changing just two lines in the [read_pyproject](https://github.com/psf/black/blob/9b484d1bcc2e15dcd5544cddab729c76b4d1d2e9/black.py#L216) function, we can make black load configuration from another source (or format): that's exactly what blackini does.

## Create a patched configfile loader

Basically, just read the `.ini` file as `dict`, and return the same structure `toml.decoder.load` would. If anything fails, use normal `toml` mode for a graceful fallback.

```Python hl_lines="15-36"
{!docs/src/code/blackini.py!}
```

## Patch `toml` loader to allow `.ini`

Next, we make sure that `black` uses this version instead of the original one by monkeypatching `toml.load`:

```Python hl_lines="10 43"
{!docs/src/code/blackini.py!}
```

## Call `black`'s main

Finally, just call black:

```Python hl_lines="12 44"
{!docs/src/code/blackini.py!}
```

Et voilà, you have a black callable which loads config form tox.ini.

# Closing

`blackini` is available on PyPI  [here](https://pypi.org/project/blackini/), and it has a loose dependency on `black`, so you can just `pip install blackini` (or pin a specific `black` version, by installing it before `blackini`). Once installed, it will overwrite the black executable. 

This is enough for my most common use case scenario, and allows to move the black configuration inside the same tox.ini file, just like the rest of the tools.
