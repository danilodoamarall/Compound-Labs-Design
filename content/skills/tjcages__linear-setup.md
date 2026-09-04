---
name: linear-setup
version: 1.0.2
description: >-
  Bootstrap or extend Linear project tracking the right way — methodology, not
  API CRUD. Use when the user asks to set up Linear tracking, track this project
  in Linear, add this repo to Linear, backfill history, get ready to track, or
  consents after a soft-nudge from linear-discipline. Anchors to North Star,
  backfills Done with evidence, wires blockedBy, installs per-repo discipline.
  NOT for one-off issue create/comment — Linear MCP handles that.
---

<!--
  Origem:  https://github.com/tjcages/linear/blob/main/skills/linear-setup/SKILL.md
  Autor:   tjcages
  Licença: MIT
  Commit:  09f07637b5e7b122b312dba0480386974173922b
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Linear setup

Chat rules: [RESPONSE.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-setup/RESPONSE.md). Auth: [AUTH.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-setup/AUTH.md). Full method: [METHODOLOGY.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-setup/METHODOLOGY.md).

## Step 0 — auth

Probe Linear MCP. On failure → AUTH.md steps for this agent; **stop**. Never invent API calls.

## Operating order

Follow **in sequence**. Early gates exist because getting them wrong corrupts live workflows.

### 1. Already tracked? (§1a)

Search Linear by repo name **and** ask the user. Never assume blank slate.

- **Nothing** → fresh bootstrap; continue.
- **Exists** → STOP. Enumerate issues/milestones/labels/docs/status updates → summarize → per-category yes/no **before any write**. Extend conservatively. Scan repo for unmirrored roadmap docs (§4.7).

### 2. North Star (§1b)

README-as-vision is usually enough — say the call out loud. Question 5 (why track?) picks the shape — see METHODOLOGY goal→shape table.

### 3–4. Type + structure (§2–§3)

Suggested types: Product / Tool / Drop / Marketing. Milestones 1:1 with real phases. Separate engineering / launch / rollout tracks. Dates only with a real signal. Prefer §17 if shape is unclear.

### 5. Backfill (§4)

CHANGELOG > roadmap > git log. Feature-level default; per-release for launched packages. Done only with evidence. Doc “done” ≠ proof — corroborate (§4.8).

### Writing (tickets)

Titles ≤8 words. Descriptions ≤3 sentences or ≤5 bullets. Comments ≤3 lines. Screenshots over prose (§10).

### 6. Wire (§4, §10, §11)

Real `blockedBy`/`blocks`. Surface UI-only items early (§11). Add README as Linear project document.

### 7. Install discipline (§5)

Write the tracking protocol into always-loaded agent instructions (`CLAUDE.md` / `AGENTS.md` / `.cursor/rules/`) with real team/project/milestone names. Bootstrap is not done without this.

### 8. Honesty (§6, §9)

Status updates at milestone/health moments only. `atRisk` before dates slip.

### 9. Done check (§18, §26)

Rubric ≥16/20 with no load-bearing 0, or full §26 audit.

## After setup

Point user to always-on (if missing) via `finish linear-tracking install`. Optional Cursor weekly health: [AUTOMATION.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-setup/AUTOMATION.md). One next action.
