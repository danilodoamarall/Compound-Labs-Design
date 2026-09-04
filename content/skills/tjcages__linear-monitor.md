<!--
  Origem:  https://github.com/tjcages/linear/blob/main/skills/linear-monitor/SKILL.md
  Autor:   tjcages
  Licença: MIT
  Commit:  09f07637b5e7b122b312dba0480386974173922b
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->---
name: linear-monitor
version: 1.0.2
description: >-
  Health-check Linear projects for slipping dates, stale In Progress, and
  orphan issues. Use when the user asks for a Linear health check, atRisk
  scan, monitoring, /linear-monitor, or when a Cursor Automation runs the
  Linear tracking health recipe. Default read + comment; no mass creates.
  NOT for bootstrap (linear-setup) or full rescue (linear-sync).
---

# Linear monitor

Chat rules: [RESPONSE.md](./RESPONSE.md). Auth: [AUTH.md](./AUTH.md). Cadence: [METHODOLOGY.md](./METHODOLOGY.md) §6, §9, §20. Automation recipe: [AUTOMATION.md](./AUTOMATION.md).

## Step 0 — auth

Probe Linear MCP. On failure → AUTH.md; **stop**.

## Scope

User-named team/project, or all accessible teams if unset. **Never** soft-nudge git repos from Automation runs.

## Checks (do now)

1. **Dates** — milestones/issues with targets approaching where work is not trending Done → candidates for `atRisk` (post only if health actually changes).
2. **Stale In Progress** — no comment >7 days → list with links.
3. **Orphans** — issues with no milestone → list.
4. **Anti-patterns glance** — milestone spam, status theater (§19); note only, don’t rewrite unasked.

## Writes

- **Default:** read + optional comment on existing issues with findings.
- **Status updates:** only on real health changes (§20).
- **Never:** mass-create issues; never reorganize structure (hand off to linear-sync).

## Output shape

1. Findings first (≤5 bullets; overflow → later).
2. What you changed (if anything), with links.
3. ONE next action for the human.
