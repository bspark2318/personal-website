---
name: sdd-implement
description: Execute the task list for a feature, one task at a time with verification. Use when the user says "/sdd-implement", "build it", or "start on the tasks" after tasks.md exists. Final phase of the SDD workflow (sdd-specify → sdd-plan → sdd-tasks → sdd-implement).
---

# /sdd-implement

Execute `tasks.md` task by task.

## Steps

1. Locate the feature's `tasks.md` (user-named, else most recent). Stop if missing → route to `/sdd-tasks`.
2. For each unchecked task, in order:
   a. Implement the change — only the files the task lists (justify deviations).
   b. Run the task's **Verify** check. Fix until it passes.
   c. Check the task off in `tasks.md`.
3. After all tasks: run the plan's full verification strategy, then confirm every acceptance criterion in `spec.md`.
4. Report: criteria met, deviations from plan, anything punted.
5. Spec header has `**Issue:** #N` → `gh issue close N --comment "shipped: <summary>"`.

## Rules

- Never check off an unverified task.
- Spec/sdd-plan turns out wrong mid-build → stop, update the doc, then continue. Docs stay truthful.
- Comply with `constitution.md` throughout.
- Commit per task or per logical group (ask user's preference once).
