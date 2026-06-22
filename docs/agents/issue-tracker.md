# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Triggers that should create an issue

When work is deferred rather than done now, file it as a GitHub issue (don't leave it as an ephemeral chip or a loose TODO). Treat these as triggers:

- "do this as a future update" / "save for a future update"
- "add this to tech debt" / "that's tech debt"
- "consider this for a future enhancement" / "future enhancement"

For each, run `gh issue create --title "..." --body "..."` capturing the deferred work, with enough context to act on it cold. Label appropriately (e.g. `ready-for-agent` if fully specified, `needs-triage` otherwise — see `triage-labels.md`).
