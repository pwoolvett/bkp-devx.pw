---
title: Integrating behave into pytest
tags: behave, pytest
---

# Motivation

I genreally use two testing frameworks for python: [pytest](https://docs.pytest.org/en/stable/) for unit and integration testing, and [behave](https://behave.readthedocs.io/en/stable/) for [bdd](https://skillsmatter.com/skillscasts/923-how-to-sell-bdd-to-the-business). Depending on what role i take in the project, I
tend to suggest / enforce one of them.

However, I recently found myself requiring a combination of the two, as I was supervising
a project development (thus behave), bus also tracking down an issue produced by a combination of edge cases.

Because of this, I started my quest for the holy grial: running behave from within
pytest.


## TLDR

There was an [unmaintained, broken project](https://github.com/behave-contrib/behave-pytest), and [another framework](https://github.com/pytest-dev/pytest-bdd) for python+bdd, which could be run directly from pytest! Naturally, I did what any sane
person would do: consider implementing the integration yourself and tollay disregard the
alternatives (:


### Sample implementation

There's [an example](https://docs.pytest.org/en/stable/example/nonpython.html#yaml-plugin)
for a `yaml` checker in the official pytest docs. The only thing I had to do was copy
and paste, replacing `.yaml` for `.feature`.

```python
# content of conftest.py

import pytest
def pytest_collect_file(parent, path):
    """Allow .feature files to be parsed for bdd."""
    if path.ext == ".feature":
        return BehaveFile.from_parent(parent, fspath=path)

class BehaveFile(pytest.File):
    """A .feature file which yields all of its scenarios/outlines."""

    def collect(self):
        from behave.parser import parse_file
        feature = parse_file(self.fspath)
        for scenario in feature.walk_scenarios(with_outlines=True):
            yield BehaveFeature.from_parent(
                self,
                name=scenario.name,
                feature=feature,
                scenario=scenario,
            )


class BehaveFeature(pytest.Item):

    def __init__(self, name, parent, feature, scenario):
        super().__init__(name, parent)
        self._feature = feature
        self._scenario = scenario

    def runtest(self):
        """Wrapper implementation which calls behave as a subprocess."""
        import subprocess as sp
        from shlex import split

        feature_name = self._feature.filename
        cmd = split(f"""behave tests/bdd/ 
            --format json 
            --no-summary
            --include {feature_name}
            -n "{self._scenario.name}"
        """)

        try:
            proc = sp.run(cmd, stdout=sp.PIPE)
            if not proc.returncode:
                return
        except Exception as exc:
            raise BehaveException(self, f"exc={exc}, feature={feature_name}")

        stdout = proc.stdout.decode("utf8")
        raise BehaveException(self, stdout)

    def repr_failure(self, excinfo):
        """Called when self.runtest() raises an exception."""
        import json
        if isinstance(excinfo.value, BehaveException):
            feature = excinfo.value.args[0]._feature
            results = excinfo.value.args[1]
            data = json.loads(results)
            summary = ""
            for feature in data:
                if feature['status'] != "failed":
                    continue
                summary += f"\nFeature: {feature['name']}"
                for element in feature["elements"]:
                    if element['status'] != "failed":
                        continue
                    summary += f"\n  {element['type'].title()}: {element['name']}"
                    for step in element["steps"]:
                        try:
                            result = step['result']
                        except KeyError:
                            summary += f"\n    Step [NOT REACHED]: {step['name']}"
                            continue
                        status = result['status']
                        if status != "failed":
                            summary += f"\n    Step [OK]: {step['name']}"
                        else:
                            summary += f"\n    Step [ERR]: {step['name']}"
                            summary += "\n      " + "\n      ".join(result['error_message'])

            return summary

    def reportinfo(self):
        return self.fspath, 0, f"Feature: {self._feature.name}  - Scenario: {self._scenario.name}"


```


!!! info References

    https://stackoverflow.com/a/66284525/7814595
