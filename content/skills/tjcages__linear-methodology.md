---
name: linear-methodology
description: >-
  Proven methodology for building and tracking features, projects, and issues
  in Linear. Use when the user wants to set up Linear tracking, sync or audit a
  board, run a Linear health check, finish install after skills add, or keep
  session discipline honest. Routes to linear-setup / linear-sync /
  linear-monitor / linear-finish-install as needed; linear-discipline is always-on.
---

<!--
  Origem:  https://github.com/tjcages/linear/blob/main/skills/linear-methodology/SKILL.md
  Autor:   tjcages
  Licença: MIT
  Commit:  09f07637b5e7b122b312dba0480386974173922b
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Linear Methodology

> Keep Linear useful by making it reflect the project, the repository, and the work actually happening.

## What it does

- Anchors tracking to the project's North Star and real roadmap.
- Sets up or repairs projects, milestones, issues, labels, and dependencies.
- Reconciles Linear with repository evidence instead of trusting stale tickets.
- Keeps active work current and closes the loop when work ships.

## How it works

1. Read [RESPONSE.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-methodology/RESPONSE.md) for concise, action-first chat.
2. Read [AUTH.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-methodology/AUTH.md), then verify Linear access before any call.
3. Route the request:
   - Set up, backfill, or start tracking → `linear-setup`
   - Sync, audit, or rescue a board → `linear-sync`
   - Check project health → `linear-monitor`
   - Finish installation → `linear-finish-install`
4. Apply `linear-discipline` throughout the session.
5. Use [METHODOLOGY.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-methodology/METHODOLOGY.md) when the routed skill needs deeper guidance.

Default ambiguous requests like “set up Linear tracking” to `linear-setup`.
