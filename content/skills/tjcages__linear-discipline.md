---
name: linear-discipline
version: 1.0.2
description: >-
  Always-on Linear session discipline and one-time soft nudge for untracked
  repos. Use whenever non-trivial work is happening in a repo that already has
  a Linear tracking protocol in CLAUDE.md, AGENTS.md, or .cursor/rules; or when
  opening/working in a repo with no protocol and no .linear-tracking-skip file
  (ask once to run linear-setup). Enforces search-before-create, lifecycle, and
  close-the-loop. NOT for full bootstrap, sync, or monitor runs.
---

<!--
  Origem:  https://github.com/tjcages/linear/blob/main/skills/linear-discipline/SKILL.md
  Autor:   tjcages
  Licença: MIT
  Commit:  09f07637b5e7b122b312dba0480386974173922b
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Linear discipline (always-on)

Chat rules: [RESPONSE.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-discipline/RESPONSE.md). Auth before Linear calls: [AUTH.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-discipline/AUTH.md).

## Detect tracking

**Tracked** if the repo has a “Linear tracking” (or equivalent) section in `CLAUDE.md`, `AGENTS.md`, or `.cursor/rules/*` that names team + project.

**Skipped** if `.linear-tracking-skip` exists at repo root.

## If tracked

Follow the protocol written in-repo:

1. Search before create.
2. Non-trivial work → file/update an issue in the named project + milestone.
3. `Backlog` → `In Progress` at start → `Done` only when shipped.
4. Close the loop before session end (state and/or comment).
5. Prefer Linear’s generated branch names.

Before any Linear tool call: Step 0 auth.

## If untracked and not skipped (soft nudge — 1B)

Ask **once**, one line, no preamble:

> This repo isn’t tracked in Linear. Set it up now? (~10–20 min)

- **Yes** → hand off to `linear-setup` (do not bootstrap inline without that skill’s gates).
- **No** → create `.linear-tracking-skip` at repo root; stay quiet next time.
- Never auto-create Linear projects or issues from a nudge alone.
- Never nudge from Automation / `linear-monitor` runs.

## If skipped

Stay quiet about setup. Still use Linear MCP for explicit user requests.

## Out of scope

Full bootstrap → `linear-setup`. Rescue/audit → `linear-sync`. Health digest → `linear-monitor`.
