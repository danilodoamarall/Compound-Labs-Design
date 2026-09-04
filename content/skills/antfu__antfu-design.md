---
name: antfu-design
description: antfu-style design conventions, broadened. UnoCSS-first, class-based semantic tokens with dual light/dark for tooling and devtools UIs, plus design-read, anti-slop, and micro-interaction polish for landing pages and product surfaces. Use when building or refactoring any interface with UnoCSS.
metadata:
  author: Anthony Fu
  version: "2026.06.22"
---

<!--
  Origem:  https://github.com/antfu/skills/blob/main/skills/antfu-design/SKILL.md
  Autor:   antfu
  Licença: MIT
  Commit:  a74f281a27dadc02397bc1a174b0f2c97531b6ae
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

Use this when building interfaces with UnoCSS in any framework (React, Vue, Svelte, Solid, or plain HTML), from dense devtools panels to landing pages. Read core-design-read first to set the direction, then apply the token system plus the polish and anti-slop rules.

## Core Rules

- Use semantic shortcuts (`bg-base`, `border-base`, `color-active`, `btn-action`) instead of raw utility chains in markup.
- Design light and dark mode together. Core tokens must work in both themes.
- Name z-index layers (`z-top-nav`, `z-panel-content`, `z-drawer-content`). Do not use raw z values in templates.
- Generate class-based utilities only (`class="..."`). Avoid Attributify syntax in generated code.
- Keep icon/status class strings literal so UnoCSS can statically extract them (`// @unocss-include` when needed).
- Use `font-mono` + `tabular-nums` for technical values (paths, SHAs, counters, timestamps, percentages).
- For long paths and IDs, truncate visually but keep the full value in `title`.
- Read the brief and set the three dials before choosing a look (core-design-read).
- Borders for dense or structural surfaces, layered shadows for elevated ones (features-micro-interactions).
- Zero em-dash and en-dash characters in any user-facing text (best-practices-anti-slop).

## Starter shortcuts

A minimal semantic core. See core-starter-kit for the full `uno.config.ts` and base styles.

```ts
shortcuts: [
  {
    'color-base': 'color-neutral-800 dark:color-neutral-200',
    'bg-base': 'bg-white dark:bg-#111',
    'bg-secondary': 'bg-#eee dark:bg-#222',
    'border-base': 'border-#8882',

    'bg-active': 'bg-#8881',
    'color-active': 'color-primary-600 dark:color-primary-300',
    'border-active': 'border-primary-600/25 dark:border-primary-400/25',

    'btn-action': 'inline-flex items-center gap-2 rounded border border-base px2 py1 op75 hover:op100 hover:bg-active disabled:pointer-events-none disabled:op30!',
    'op-fade': 'op65 dark:op55',
    'op-mute': 'op30 dark:op25',

    'z-top-nav': 'z-60',
    'z-panel-content': 'z-70',
    'z-drawer-content': 'z-100',
  },
]
```

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Core Principles | Semantic tokens, dark mode parity, z-index naming, class-first output | [core-principles](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/core-principles.md) |
| Starter Kit | Copy-paste UnoCSS starter config and base light/dark styles | [core-starter-kit](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/core-starter-kit.md) |
| Tokens and Combos | Token families, reusable class combinations, mobile-safe shell tokens | [core-tokens-and-combinations](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/core-tokens-and-combinations.md) |
| Design Read and Dials | Read the brief, declare a design read, set variance/motion/density dials | [core-design-read](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/core-design-read.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Strict Rules and Pre-Flight | Do/don't checklist and the consolidated pre-flight | [best-practices-strict-rules](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/best-practices-strict-rules.md) |
| Class over Attributify | Why generated code uses class utilities, with conversions | [best-practices-class-utilities-over-attributify](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/best-practices-class-utilities-over-attributify.md) |
| Anti-Slop Hygiene | The dash ban and the AI-tell forbidden patterns | [best-practices-anti-slop](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/best-practices-anti-slop.md) |
| Bias Correction | Typography, color, layout, and materiality defaults to override | [best-practices-bias-correction](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/best-practices-bias-correction.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Data Presentation | Paths, icons, time, date, numbers, badges, buttons | [features-data-presentation](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/features-data-presentation.md) |
| Micro-Interactions | Radius, alignment, shadows, animation, numbers, outlines, hit areas | [features-micro-interactions](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/features-micro-interactions.md) |
| Floating Vue Overrides | Shared Floating Vue setup and popper styling | [features-floating-vue-overrides](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/features-floating-vue-overrides.md) |

## Advanced

| Topic | Description | Reference |
|-------|-------------|-----------|
| Pattern Vocabulary | Named UI patterns to recognize and reach for | [advanced-pattern-vocabulary](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/advanced-pattern-vocabulary.md) |
| Redesign Protocol | Detect mode, audit first, preserve IA and SEO | [advanced-redesign-protocol](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/antfu-design/references/advanced-redesign-protocol.md) |

<!--
Source references:
- https://github.com/antfu/node-modules-inspector
- https://github.com/vitejs/devtools/tree/main/packages/rolldown
- https://github.com/eslint/config-inspector
- https://github.com/antfu/vite-plugin-inspect
- https://github.com/antfu/agent-container
- https://github.com/Leonxlnx/taste-skill
- https://github.com/jakubkrehel/make-interfaces-feel-better
-->
