---
title: Deleting several github actions workflow runs at once
---

When adapting or updating github actions workflows, something is bound to break. Because
of this, you'll end up with a bunch of runs which couldd contain sensitive / grabage
information.

Thanks to [this guy here](https://stackoverflow.com/a/64473987/7814595), here's the
solution:

1. Download and install the github cli app - `gh`
1. Add permissions: `gh auth login`
1. Run the following snippet:

    <div id="termynal1" data-termynal >
        <span data-ty="input">owner=GITHUB_REPO_OWNER repo=GITHUB_REPO_NAME gh api \
        repos/$owner/$repo/actions/runs \
        | jq -r '.workflow_runs[] | select(.head_branch != "master") | "\(.id)"' \
        | xargs -n1 -I % gh api repos/$owner/$repo/actions/runs/% -X DELETE</span>
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

1. You might need to run it several times, as it can delete a bunch before exiting
