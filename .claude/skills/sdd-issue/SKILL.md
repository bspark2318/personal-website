---
name: sdd-issue
description: Capture a feature idea or bug as a GitHub issue using the SDD issue template, so it can later be picked up with /sdd-specify #N. Use when the user says "/sdd-issue", "log this idea", "add to backlog", or mentions something worth building later mid-conversation.
---

# /sdd-issue

Capture an idea as a backlog issue — entry point to the SDD workflow.

## Steps

1. Read `templates/issue.md`.
2. Fill it from the conversation: problem, rough scope, out of scope. Don't interrogate — 1–2 questions max; guesses are fine, `/sdd-specify` firms things up.
3. Create: `gh issue create --title "<title>" --body-file <tmpfile> --label sdd` (drop the label if it doesn't exist).
4. Report the issue number: "pick it up later with `/sdd-specify #N`".

## Rules

- Fewest words. An issue is a seed, not a spec.
- No tech decisions, no task breakdown — later phases own those.
