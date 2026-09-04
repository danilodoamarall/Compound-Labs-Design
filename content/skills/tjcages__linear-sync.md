---
name: linear-sync
version: 1.0.2
description: >-
  Sync, audit, or rescue an existing Linear project against repo reality. Use
  when the user asks to sync Linear, reconcile tracking, audit this project,
  fix a messy board, revive a parked project, or score readiness with the
  rubric. Runs discovery + confirmation before writes; never silent reorganize.
  NOT for first-time bootstrap (use linear-setup) or one-off CRUD.
---

<!--
  Origem:  https://github.com/tjcages/linear/blob/main/skills/linear-sync/SKILL.md
  Autor:   tjcages
  Licença: MIT
  Commit:  09f07637b5e7b122b312dba0480386974173922b
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Linear sync

Chat rules: [RESPONSE.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-sync/RESPONSE.md). Auth: [AUTH.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-sync/AUTH.md). Playbooks: [METHODOLOGY.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-sync/METHODOLOGY.md) §1a, §18, §21–§22, §26. Examples: [EXAMPLES.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-sync/EXAMPLES.md).

## Step 0 — auth

Probe Linear MCP. On failure → AUTH.md; **stop**.

## Operating order

1. **Identify project** — search by name; confirm with user if multiple.
2. **Enumerate** — open+closed issues, milestones, labels, documents, status updates (§1a).
3. **Score** — §18 rubric (0–2 × 10). Pass ≥16/20 with no load-bearing 0. Emit gap list.
4. **Confirm** — per-category yes/no before writes. Reorganize is higher-risk than extend.
5. **Fix in order** (§22a): orphans → milestones → milestones spam collapse → dependencies → install/update discipline protocol (§5).
6. **Half-tracked?** — scan `docs/` for unmirrored roadmaps (§22b); separate milestone sets.
7. **Backfill-late?** — §22c; corroborate doc claims (§4.8).
8. **One status update** recording the cleanup if health/structure changed (§20).
9. **Re-score** — show before/after totals. One next action.

## Hard rules

- Search before every create.
- Never delete/reorganize off-limits or other-owned issues without explicit consent.
- Ticket prose stays terse (§4). Chat follows RESPONSE.md.
