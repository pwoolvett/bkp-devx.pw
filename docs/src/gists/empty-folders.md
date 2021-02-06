---
title: Commiting Empty Folders
---

!!! note "TL;DR"
    Just add this to `folder-to-keep-empty/.gitignore`:

    ```gitignore
    # .gitignore

    # Ignore everything in this directory
    *
    # Except this file
    !.gitignore
    ```


# Motivation

This is a `.gitignore` which allows a folder to be committed, but ignoring all of its contents.

Say you have a repo or application which requires a folder to be present, and you would like to store files inside it, without accidentally committing them. For example a `logs` or a `data` folder.

Of course you could just check/create the folder on every run, but I'd like to avoid it if possible. Besides, it's nice to have a fixed tree right from the beginning (Specially during the scaffolding stages). Another advantage is you can eventually "un-ignore" a specific file inside the folder and keep it under version control.

In the folder you'd like to remain empty, you must add a .gitignore file with a glob (*) and an exclude (!) for the file itself:


<div id="termynal" data-termynal >
        <span data-ty="input">mkdir -p logs</span>
        <span data-ty="input">curl -L git.io/commit-empty-folders > logs/.gitignore</span>
</div>

The resulting file:

```gitignore
*
!.gitignore
!keep_file_in_vcs.ini
```

!!! note "References"

    https://stackoverflow.com/questions/115983/how-can-i-add-an-empty-directory-to-a-git-repository
