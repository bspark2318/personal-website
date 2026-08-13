---
name: sdd-upstream
description: Propose a change to the SDD template kit from any project using it. Use when the user hits friction with an sdd-* template or skill mid-project and says "/sdd-upstream", "upstream this", "fix this in the framework", "tweak the sdd kit". Opens a PR on the kit repo (bspark2318/spec-driven-development).
---

# /sdd-upstream

Upstream a kit tweak from whatever project you're in → PR on the kit repo.

## Steps

1. Locate kit repo: `~/Dev/learning/spec-driven-development` if it exists, else `gh repo clone bspark2318/spec-driven-development <scratch-dir>`.
2. Pin down from conversation: **friction** (what happened) + **change** (which kit file, what edit). Unclear → max 2 questions.
3. In the kit repo: fresh branch off latest main (`git fetch && git checkout -b tweak/<slug> origin/main`), apply the edit, conventional commit, push.
4. `gh pr create` — body: **Problem** (the friction, 1–2 lines), **Change** (what/why), **Source** (project it came from).
5. Report PR URL.
6. Offer: apply the same tweak to the current project's local copy now (so it works before merge). After merge, `setup.sh` re-syncs.

## Rules

- One tweak per PR.
- Kit style: fewest words, bullets over prose.
- Never push to kit main directly — PR only; user reviews.
