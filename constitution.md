# Constitution — personal

## Purpose

Apple-style personal playground site.

## Core principles

1. **Simplicity first** — minimum code that solves it.
2. **Test what matters** — logic in `src/lib` gets Vitest coverage.
3. **Surgical changes** — touch only what the task needs.

## Tech constraints

- Language: TypeScript
- Framework: Next.js 16 (app router), React 19, Tailwind 4, Neon serverless Postgres, Vitest
- **Read `node_modules/next/dist/docs/` before writing Next code** — this Next version has breaking changes.
- Forbidden: new deps without 1-line justification; heavy UI component libraries.

## Design principles

- **Visual identity:** Apple-style — restrained, polished, motion via framer-motion.
- **Responsive:** mobile-first.
- **Every view:** loading, empty, error states.

## Quality gates

- `npm run test` and `npm run lint` pass.

## Conventions

- Conventional commits.

## Definition of done

- [ ] Verify check passes
- [ ] No unrelated files touched
- [ ] Conventional commit

## Governance

Amend anytime; say why in commit.
