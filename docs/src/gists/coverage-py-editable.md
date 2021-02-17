---
title: Coverage.py does not like non-editable installs
---

I was recently having some issues in a CI pipeline where the coverage report was being sent empty to codecov.io.

It took me a while to figure it out, so here's the TL;DR

1. `coverage.py` won't gather tests when testing a non-editable installed 
1. poetry by default installs in editable mode, which is why I had a hard time reproducing the issues locally.
1. I was using `pip install .[test]`in the CI pipeline, which installs in non-editable mode.
1. `pip` does not (yet) allow editable installs for `pyproject.toml`

current solution:

Use `poetry` in the CI pipeline to install project.
