---
title: Auto explanatory aliases in bash
---

!!! note "TL;DR"

    * instead of `alias [name]='[command]'`, run `alias [name]='type [name] | tr ";" "\n" | tail -n1 | rev | cut -c 2- | rev;[command]'
    * this will print the alias before executing it
    * Useful when pair-programming, need to remember the details, or just
      showing a workflow to somebody else and avoid askin "whats that command
      for?"


## Example

```console
$ alias gcane='type gcane | tr ";" "\n" | tail -n1 | rev | cut -c 2- | rev;git commit --amend --no-edit'
```

```console
$ gcane
git commit --amend --no-edit
[master 709f6a6] this was a commit title
 Date: Wed Jul 27 14:02:59 2022 -0400
 4 files changed, 308 insertions(+), 306 deletions(-)
 [...]
```
