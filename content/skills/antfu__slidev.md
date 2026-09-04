---
name: slidev
description: Create and present web-based slidedecks for developers using Slidev with Markdown, Vue components, code highlighting, animations, and interactive features. Use when building technical presentations, conference talks, code walkthroughs, teaching materials, or developer decks.
---

<!--
  Origem:  https://github.com/antfu/skills/blob/main/skills/slidev/SKILL.md
  Autor:   antfu
  Licença: MIT
  Commit:  a74f281a27dadc02397bc1a174b0f2c97531b6ae
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Slidev - Presentation Slides for Developers

Web-based slides maker built on Vite, Vue, and Markdown.

## When to Use

- Technical presentations or slidedecks with live code examples
- Syntax-highlighted code snippets with animations
- Interactive demos (Monaco editor, runnable code)
- Mathematical equations (LaTeX) or diagrams (Mermaid, PlantUML)
- Record presentations with presenter notes
- Export to PDF, PPTX, or host as SPA
- Code walkthroughs for developer talks or workshops

## Quick Start

```bash
pnpm create slidev    # Create project
pnpm run dev          # Start dev server (opens http://localhost:3030)
pnpm run build        # Build static SPA
pnpm run export       # Export to PDF (requires playwright-chromium)
```

**Verify**: After `pnpm run dev`, confirm slides load at `http://localhost:3030`. After `pnpm run export`, check the output PDF exists in the project root.

## Basic Syntax

```md
---
theme: default
title: My Presentation
---

# First Slide

Content here

---

# Second Slide

More content

<!--
Presenter notes go here
-->
```

- `---` separates slides
- First frontmatter = headmatter (deck config)
- HTML comments = presenter notes

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Markdown Syntax | Slide separators, frontmatter, notes, code blocks | [core-syntax](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-syntax.md) |
| Animations | v-click, v-clicks, motion, transitions | [core-animations](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-animations.md) |
| Headmatter | Deck-wide configuration options | [core-headmatter](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-headmatter.md) |
| Frontmatter | Per-slide configuration options | [core-frontmatter](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-frontmatter.md) |
| CLI Commands | Dev, build, export, theme commands | [core-cli](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-cli.md) |
| Components | Built-in Vue components | [core-components](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-components.md) |
| Layouts | Built-in slide layouts | [core-layouts](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-layouts.md) |
| Exporting | PDF, PPTX, PNG export options | [core-exporting](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-exporting.md) |
| Hosting | Build and deploy to various platforms | [core-hosting](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-hosting.md) |
| Global Context | $nav, $slidev, composables API | [core-global-context](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-global-context.md) |

## Feature Reference

### Code & Editor

| Feature | Usage | Reference |
|---------|-------|-----------|
| Line highlighting | `` ```ts {2,3} `` | [code-line-highlighting](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-line-highlighting.md) |
| Click-based highlighting | `` ```ts {1\|2-3\|all} `` | [code-line-highlighting](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-line-highlighting.md) |
| Line numbers | `lineNumbers: true` or `{lines:true}` | [code-line-numbers](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-line-numbers.md) |
| Scrollable code | `{maxHeight:'100px'}` | [code-max-height](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-max-height.md) |
| Code tabs | `::code-group` (requires `comark: true`) | [code-groups](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-groups.md) |
| Monaco editor | `` ```ts {monaco} `` | [editor-monaco](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/editor-monaco.md) |
| Run code | `` ```ts {monaco-run} `` | [editor-monaco-run](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/editor-monaco-run.md) |
| Edit files | `<<< ./file.ts {monaco-write}` | [editor-monaco-write](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/editor-monaco-write.md) |
| Code animations | `` ````md magic-move `` | [code-magic-move](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-magic-move.md) |
| TypeScript types | `` ```ts twoslash `` | [code-twoslash](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-twoslash.md) |
| Import code | `<<< @/snippets/file.js` | [code-import-snippet](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/code-import-snippet.md) |

### Diagrams & Math

| Feature | Usage | Reference |
|---------|-------|-----------|
| Mermaid diagrams | `` ```mermaid `` | [diagram-mermaid](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/diagram-mermaid.md) |
| PlantUML diagrams | `` ```plantuml `` | [diagram-plantuml](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/diagram-plantuml.md) |
| LaTeX math | `$inline$` or `$$block$$` | [diagram-latex](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/diagram-latex.md) |

### Layout & Styling

| Feature | Usage | Reference |
|---------|-------|-----------|
| Canvas size | `canvasWidth`, `aspectRatio` | [layout-canvas-size](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/layout-canvas-size.md) |
| Zoom slide | `zoom: 0.8` | [layout-zoom](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/layout-zoom.md) |
| Scale elements | `<Transform :scale="0.5">` | [layout-transform](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/layout-transform.md) |
| Layout slots | `::right::`, `::default::` | [layout-slots](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/layout-slots.md) |
| Scoped CSS | `<style>` in slide | [style-scoped](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/style-scoped.md) |
| Global layers | `global-top.vue`, `global-bottom.vue` | [layout-global-layers](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/layout-global-layers.md) |
| Draggable elements | `v-drag`, `<v-drag>` | [layout-draggable](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/layout-draggable.md) |
| Icons | `<mdi-icon-name />` | [style-icons](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/style-icons.md) |

### Animation & Interaction

| Feature | Usage | Reference |
|---------|-------|-----------|
| Click animations | `v-click`, `<v-clicks>` | [core-animations](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-animations.md) |
| Rough markers | `v-mark.underline`, `v-mark.circle` | [animation-rough-marker](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/animation-rough-marker.md) |
| Drawing mode | Press `C` or config `drawings:` | [animation-drawing](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/animation-drawing.md) |
| Direction styles | `forward:delay-300` | [style-direction](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/style-direction.md) |
| Note highlighting | `[click]` in notes | [animation-click-marker](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/animation-click-marker.md) |

### Syntax Extensions

| Feature | Usage | Reference |
|---------|-------|-----------|
| Comark syntax | `comark: true` + `{style="color:red"}` | [syntax-comark](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/syntax-comark.md) |
| Block frontmatter | `` ```yaml `` instead of `---` | [syntax-block-frontmatter](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/syntax-block-frontmatter.md) |
| Import slides | `src: ./other.md` | [syntax-importing-slides](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/syntax-importing-slides.md) |
| Merge frontmatter | Main entry wins | [syntax-frontmatter-merging](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/syntax-frontmatter-merging.md) |

### Presenter & Recording

| Feature | Usage | Reference |
|---------|-------|-----------|
| Recording | Press `G` for camera | [presenter-recording](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/presenter-recording.md) |
| Timer | `duration: 30min`, `timer: countdown` | [presenter-timer](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/presenter-timer.md) |
| Remote control | `slidev --remote` | [presenter-remote](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/presenter-remote.md) |
| Ruby text | `notesAutoRuby:` | [presenter-notes-ruby](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/presenter-notes-ruby.md) |

### Export & Build

| Feature | Usage | Reference |
|---------|-------|-----------|
| Export options | `slidev export` | [core-exporting](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-exporting.md) |
| Build & deploy | `slidev build` | [core-hosting](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-hosting.md) |
| Build with PDF | `download: true` | [build-pdf](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/build-pdf.md) |
| Cache images | Automatic for remote URLs | [build-remote-assets](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/build-remote-assets.md) |
| OG image | `seoMeta.ogImage` or `og-image.png` | [build-og-image](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/build-og-image.md) |
| SEO tags | `seoMeta:` | [build-seo-meta](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/build-seo-meta.md) |

**Export prerequisite**: `pnpm add -D playwright-chromium` is required for PDF/PPTX/PNG export. If export fails with a browser error, install this dependency first.

### Editor & Tools

| Feature | Usage | Reference |
|---------|-------|-----------|
| Side editor | Click edit icon | [editor-side](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/editor-side.md) |
| VS Code extension | Install `antfu.slidev` | [editor-vscode](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/editor-vscode.md) |
| Prettier | `prettier-plugin-slidev` | [editor-prettier](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/editor-prettier.md) |
| Eject theme | `slidev theme eject` | [tool-eject-theme](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/tool-eject-theme.md) |

### Lifecycle & API

| Feature | Usage | Reference |
|---------|-------|-----------|
| Slide hooks | `onSlideEnter()`, `onSlideLeave()` | [api-slide-hooks](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/api-slide-hooks.md) |
| Navigation API | `$nav`, `useNav()` | [core-global-context](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/slidev/references/core-global-context.md) |

## Common Layouts

| Layout | Purpose |
|--------|---------|
| `cover` | Title/cover slide |
| `center` | Centered content |
| `default` | Standard slide |
| `two-cols` | Two columns (use `::right::`) |
| `two-cols-header` | Header + two columns |
| `image` / `image-left` / `image-right` | Image layouts |
| `iframe` / `iframe-left` / `iframe-right` | Embed URLs |
| `quote` | Quotation |
| `section` | Section divider |
| `fact` / `statement` | Data/statement display |
| `intro` / `end` | Intro/end slides |

## Resources

- Documentation: https://sli.dev
- Theme Gallery: https://sli.dev/resources/theme-gallery
- Showcases: https://sli.dev/resources/showcases
