---
name: sdd-plan
description: Create a technical plan from an approved spec. Use when the user says "/sdd-plan" or "plan this feature" after a spec exists. Creates specs/<feature-slug>/plan.md from the plan template. Second phase of the SDD workflow (sdd-specify → sdd-plan → sdd-tasks → sdd-implement).
---

# /sdd-plan

Turn an approved spec into a technical plan.

## Steps

1. Locate the target spec: the one the user names, else the most recent `specs/*/spec.md`.
2. Gate: spec must be `Status: approved` with zero `[NEEDS CLARIFICATION]`. If not, stop and route back to `/sdd-specify`.
3. Read `constitution.md` and `templates/plan.md`.
4. Explore the existing codebase for conventions, reusable code, and integration points before proposing anything.
5. Draft `specs/<slug>/plan.md`: approach, alternatives (1 line each), stack, file structure, risks, verification strategy.
6. Present a terse summary + tradeoffs. Iterate on feedback.
7. On approval, suggest `/sdd-tasks`.

## Rules

- Every new dependency needs one line of justification.
- Prefer the simplest approach that satisfies acceptance criteria; say when a simpler option exists.
- No code yet.
