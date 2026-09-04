---
name: company-logos
description: "Use Iconify Simple Icons logos (64x64) instead of text logos."
---

<!--
  Origem:  https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/company-logos/SKILL.md
  Autor:   MengTo
  Licença: MIT
  Commit:  321c769739b823de5eb94eb3a52aa1974fe783a2
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Company Logos Skill

## Use When
- A design needs recognizable brand marks without embedding custom SVG files or rendering company names as plain text.
- Logo rows, integrations grids, customer proof, partner lists, and tool badges need consistent icon treatment.

## Workflow
1. Use Iconify Simple Icons as the default source for brand logos.
2. Render each logo in a 64x64 visual box, then scale the inner SVG to the composition density.
3. Keep logos monochrome by default; use brand color only when the surrounding design needs recognition more than restraint.
4. Align logos to a shared baseline or center grid so rows feel intentional.
5. Add accessible labels when logos are interactive or communicate important proof.

## Guardrails
- Do not use typed company names as a replacement for logos unless no icon exists.
- Do not mix filled, outline, emoji, bitmap, and wordmark styles in one row.
- Do not hotlink random logo assets from search results.
