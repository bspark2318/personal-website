---
name: sdd-tasks
description: Break an approved plan into ordered, verifiable tasks. Use when the user says "/sdd-tasks" or "break this down" after a plan exists. Creates specs/<feature-slug>/tasks.md from the tasks template. Third phase of the SDD workflow (sdd-specify → sdd-plan → sdd-tasks → sdd-implement).
---

# /sdd-tasks

Turn a plan into an ordered, verifiable task list.

## Steps

1. Locate the feature's `plan.md` (user-named, else most recent). Stop if missing → route to `/sdd-plan`.
2. Read `templates/tasks.md`.
3. Derive tasks: each ≤~1 hour, one logical change, ordered by dependency. Mark independent tasks `[P]`.
4. Every task gets **Files** (paths touched) and **Verify** (a concrete check: command, test, or observable behavior).
5. Write `specs/<slug>/tasks.md`. Show the list; iterate.
6. On approval, suggest `/sdd-implement`.

## Rules

- A task without a verify step is not a task — rewrite it.
- Cover every acceptance criterion in spec.md; note which task proves which criterion.
- Setup/scaffolding tasks first, then tests where TDD fits, then features.
