# Must read articles

Read these before everything else, and keep them in mid when developing / contributing:

* [Bikeshed, or "the sleep(1) saga"](http://bikeshed.com/)

* [PEP 8](https://www.python.org/dev/peps/pep-0008/#a-foolish-consistency-is-the-hobgoblin-of-little-minds)

* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

* [semver](https://semver.org/)

Don't worry too much about the specifics, but grasp the general idea behind them.


## Principles


### On linters

* Use the lint checkers as suggestions, not rules. Dont go on a lint frenzy just to have 0 lint warnings. For example, check the following snippet:

  ```python
  def complex_function(value, previous, next, state, slope, alpha, n_calls):
      ...
  ```

  A linter like [pylint](https://www.pylint.org/) will raise a [R0913](https://pycodequ.al/docs/pylint-messages/r0913-too-many-arguments.html), suggesting you have too many arguments. To overcome this, you could just put everything inside a dictionary, or pass `*args, **kwargs` to silence the warning. That's not why we use linters. Instead, ask yourself what should be done with the code, and if it makes sense to even change it. Maybe the current implementation is the only (or the best) way to implement it.


  The reference mentions the following: 

  > When a function or method takes a lot of arguments, it is hard to understand and remember what their purpose is. If the arguments are closely related, maybe there is a new class that groups them waiting to be implemented.

  Just don't run into conclusions yet. Think also on the rest of the code. Keep in mind any implications, breaking changes this would incur, etc.
