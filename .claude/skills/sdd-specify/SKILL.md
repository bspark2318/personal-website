---
name: sdd-specify
description: Start a new feature spec. Use when the user says "/sdd-specify <idea>", "spec this out", or describes a feature they want to build. Creates specs/<feature-slug>/spec.md from the spec template, filled from conversation. First phase of the SDD workflow (sdd-specify → sdd-plan → sdd-tasks → sdd-implement).
---

# /sdd-specify

Turn a feature idea into an approved spec.

## Steps

1. Read `templates/spec.md` (repo root; fall back to this skill's repo if the project lacks one).
2. If given an issue ref (`/sdd-specify #12`): `gh issue view 12` → seed problem/scope from it; record `**Issue:** #12` in the spec header.
3. Derive a short kebab-case feature slug from the idea.
4. Interview the user — only about gaps: problem, users, acceptance criteria, non-goals. Skip what the conversation already answered. Max ~5 questions.
5. Write `specs/<slug>/spec.md` from the template. Mark unknowns `[NEEDS CLARIFICATION: …]` rather than inventing answers.
6. Show the user only the open questions + a 3-line summary. Iterate until no `[NEEDS CLARIFICATION]` remains.
7. On user approval, set `Status: approved` and suggest `/sdd-plan`.

## Rules

- **What & why only.** Refuse tech-stack decisions here — defer to `/sdd-plan`.
- Comply with `constitution.md` if present.
- Never start implementing.
