# Playground

A personal playground site — a corner of the internet for experiments and
half-finished ideas. Anonymous, interactive, Apple-clean.

Built with **Next.js 16**, **TypeScript**, **Tailwind v4**, **Framer Motion**,
and **matter.js** (physics).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest unit tests
```

The **쇼룸** page needs a Postgres connection and a shared write-password.
Set these in `.env.local` (and in your host's env for deploys):

```bash
DATABASE_URL=postgres://…      # Neon
SHOWROOM_PASSWORD=…            # gates adding/deleting items
```

## Build

```bash
npm run build && npm start
```

## What's inside

- Parallax hero with a cursor-following glow
- Drag-and-fling **bouncy balls** toy (matter.js)
- 3D-tilt experiment tiles
- Light/dark theme toggle (light default, no flash)
- **쇼룸** — a shared furniture wishlist: paste a product link, it auto-scrapes
  the image/title/price and groups items by room (Neon Postgres-backed)
