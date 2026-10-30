<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# /father — private health dashboard
- Route `src/app/father/`, components `src/components/father/`, data + auth `src/lib/father/`.
- **Reference material lives outside this repo: `~/Dev/father/`** (shared with the Claude desktop app). `father_health_log.md` there is the source of truth; `src/lib/father/data.ts` is a hand-maintained mirror. Read that folder (and its `CLAUDE.md`) before changing anything medical.
- Gate: `FATHER_PASSCODE` env (digits-only compare, fail-closed). Not in nav, `noindex`. Keep it unlisted.
- After updating `data.ts`: `npm test`, commit, push → Vercel deploys.
