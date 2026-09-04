---
name: linear-finish-install
version: 1.0.2
description: >-
  Finish Linear tracking pack install after skills are present: write always-on
  rules (Linear = default source of truth every session) and verify Linear MCP
  auth. Optionally offer Cursor Monitor Automation. Use when the user says
  "finish linear install", "finish linear-tracking install", "complete setup
  after skills add", or right after installing the pack.
---

<!--
  Origem:  https://github.com/tjcages/linear/blob/main/skills/linear-finish-install/SKILL.md
  Autor:   tjcages
  Licença: MIT
  Commit:  09f07637b5e7b122b312dba0480386974173922b
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Finish Linear tracking install

Chat: [RESPONSE.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-finish-install/RESPONSE.md). Auth: [AUTH.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-finish-install/AUTH.md). Snippet: [ALWAYS_ON.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-finish-install/ALWAYS_ON.md). Optional weekly health: [AUTOMATION.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-finish-install/AUTOMATION.md).

**Install is complete** when always-on is loaded and Linear MCP auth works. Same skills + same SoT assumption on every harness. Cursor Automation is optional.

Do these in order. Lead with the next action each turn.

## 1. Always-on (required)

**Cursor:** list user rules. If no rule titled `linear-tracking (always-on)`, add one with `cursor_dialog` (`item=rule`, `scope=user`, `action=add`, title + ALWAYS_ON.md body). If it exists, skip.

**Claude Code / Codex / file-based:** ensure `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, and/or `~/.agents/AGENTS.md` contain the ALWAYS_ON block between markers:

```
<!-- linear-tracking-always-on -->
…ALWAYS_ON.md body…
<!-- /linear-tracking-always-on -->
```

Idempotent: replace the block if markers exist; else append.

## 2. Linear MCP (required)

Call `list_teams` (or `get_user`).

- Fail → AUTH.md steps for this agent; stop after giving links.
- Pass → continue.

Useful links:

- Cursor MCP: [Cursor Settings → MCP](https://cursor.com/settings)
- Linear MCP docs: [Linear MCP](https://linear.app/docs/mcp)
- Claude connectors: [claude.ai settings](https://claude.ai/settings) or `/mcp` in Claude Code

## 3. Monitor Automation (optional — Cursor only)

If this is Cursor and the user wants a weekly digest: open Automations (`open_automation`) and point at [AUTOMATION.md](https://github.com/tjcages/linear/blob/09f07637b5e7b122b312dba0480386974173922b/skills/linear-finish-install/AUTOMATION.md). Default schedule Monday **7:00 AM local** (convert cron to UTC — see AUTOMATION.md).

Non-Cursor: skip. They can run `/linear-monitor` anytime.

Do **not** block “install complete” on Automation.

## 4. Report

Restate:

1. Always-on: done / already present / failed (where)
2. Linear auth: ok / needs OAuth
3. Install: **complete** if 1+2 ok — Automation offered / skipped / deferred

One next action only.
