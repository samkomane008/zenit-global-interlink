# Git identity for coding agents

Before Codex, ChatGPT cloud or another agent makes a Git commit **on behalf of the authenticated repository owner**:

```bash
git config --local user.name "Samuel Komane"
git config --local user.email "159257666+samkomane008@users.noreply.github.com"
git var GIT_AUTHOR_IDENT
git var GIT_COMMITTER_IDENT
```

The GitHub ID-based noreply address associates eligible commits with
[the owner's profile](https://github.com/samkomane008). Do not add AI-assistant
`Co-authored-by` trailers unless expressly requested. Preserve actual authorship
for Dependabot and third-party contributors. Git settings do not override GitHub
App actors or GitHub-generated merge committers, and do not guarantee a profile
contribution until GitHub's usual criteria are met.

Use reviewed PRs and passing CI. Do not rewrite historical commits just to
change attribution or bypass production controls.
