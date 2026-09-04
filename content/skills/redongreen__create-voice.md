---
name: create-voice
description: Generate screen reader accessibility specifications for VoiceOver (iOS), TalkBack (Android), and ARIA (Web). Use when the user mentions "voice", "voiceover", "screen reader", "accessibility spec", "talkback", "aria", or wants to create accessibility documentation for a UI component.
---

<!--
  Origem:  https://github.com/redongreen/uSpec/blob/main/skills/create-voice/SKILL.md
  Autor:   redongreen
  Licença: MIT
  Commit:  1e25e9b8bc2e694689ba0489594f38807a341f14
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# Create Voice Reader Specification

Generate a screen reader specification directly in Figma — focus order, platform-specific property tables, and announcement patterns organized by component state.

**Execution contract (read first).**
- This file is instructions to RUN, not a document to edit. Invoking the skill = render the screen reader spec into Figma from the input `.md`.
- Never edit this `SKILL.md` or any other skill file in response, even if one is open or focused in the editor. Modify a skill only when the user explicitly asks to change the skill itself.
- The input component `.md` is a **READ-ONLY source of truth. Never edit, append to, or "add a section" to it.** The only artifact this skill produces is the Figma annotation. When the user asks to "create/add a section," "show," or "include" something, render it **in the Figma annotation**, never as an edit to the `.md`.
- Never call `AskQuestion`, request confirmation, or pause for input (including before Figma writes, the expected output). On ambiguity, pick the most defensible option and continue.
- Only two legal stops: (a) Step 0 fail-fast when no `.md` resolves; (b) one-line abort if the Figma MCP connection is dead.

## MCP Adapter

Read `uspecs.config.json` → `mcpProvider`. Follow the matching column for every MCP call in this skill.

| Operation | `figma-console` | `figma-mcp` |
|-----------|-----------------|-------------|
| Verify connection | `figma_get_status` | Skip — implicit. If first `use_figma` call fails, guide user to check MCP setup. |
| Navigate to file | `figma_navigate` with URL | Extract `fileKey` from URL (`figma.com/design/:fileKey/...`). No navigate needed. |
| Take screenshot | `figma_take_screenshot` | `get_screenshot` with `fileKey` + `nodeId` |
| Execute Plugin JS | `figma_execute` with `code` | `use_figma` with `fileKey`, `code`, `description`. **JS code is identical** — no wrapper changes. |
| Search components | `figma_search_components` | `search_design_system` with `query` + `fileKey` + `includeComponents: true` |
| Get file/component data | `figma_get_file_data` / `figma_get_component` | `get_metadata` or `get_design_context` with `fileKey` + `nodeId` |
| Get variables (file-wide) | `figma_get_variables` | `use_figma` script: `return await figma.variables.getLocalVariableCollectionsAsync();` |
| Get token values | `figma_get_token_values` | `use_figma` script reading variable values per mode/collection |
| Get styles | `figma_get_styles` | `search_design_system` with `includeStyles: true`, or `use_figma`: `return figma.getLocalPaintStyles();` |
| Get selection | `figma_get_selection` | `use_figma` script: `return figma.currentPage.selection.map(n => ({id: n.id, name: n.name, type: n.type}));` |

**`figma-mcp` requires `fileKey` on every call.** Extract it once from the user's Figma URL at the start of the workflow. For branch URLs (`figma.com/design/:fileKey/branch/:branchKey/:fileName`), use `:branchKey` as the fileKey.

**`figma-mcp` page context:** `use_figma` resets `figma.currentPage` to the first page on every call. When a script accesses a node from a previous step via `getNodeByIdAsync(ID)`, the page content may not be loaded — `findAll`, `findOne`, and `characters` will fail with `TypeError` until the page is activated. Insert this page-loading block immediately after `getNodeByIdAsync`:

```javascript
let _p = node; while (_p.parent && _p.parent.type !== 'DOCUMENT') _p = _p.parent;
if (_p.type === 'PAGE') await figma.setCurrentPageAsync(_p);
```

This walks up to the PAGE ancestor and loads its content. Console MCP does not need this — `figma_execute` inherits the Desktop page context.

## Inputs Expected

- **Component `.md` spec** (**required**, user-provided path) — the source-of-truth component spec produced by {{skill:create-component-md}}. **The user tells you where this `.md` lives** — use the exact path they provide; the `.md` may live anywhere. This skill **renders the Voice section from the `.md`**; it does NOT re-extract anything from Figma. `fileKey`, `nodeId`, and `compSetNodeId` come from the `.md`'s `render-meta` block.
- **Figma link** (optional) — placement hint only (where to drop the rendered frame on the canvas). Never the source of structural facts.

There is no screenshot-only path. Without the component `.md` there is nothing to render — see Step 0's fail-fast contract.

## Workflow

Copy this checklist and update as you progress:

```
Task Progress:
- [ ] Step 0: Require + parse the component `.md` (Voice body + render-meta + voice-render-meta carry). FAIL FAST if missing.
- [ ] Step 1: Read platform references (only as needed for slot-scenario reasoning — NOT for re-authoring announcements)
- [ ] Step 2: Verify MCP connection
- [ ] Step 3: Read template key from uspecs.config.json
- [ ] Step 4: Build render inputs from the parsed .md (guidelines, SECTIONS, focus order, FOCUS_STOPS, VARIANT_PROPS, BOOLEAN_DEFS, SLOT_INSERTIONS) — NO extraction
- [ ] Step 5: Re-derive per-entry variant props by matching state names to variantAxes (light reasoning)
- [ ] Step 6: (folded into Step 4 — the spec content is already authored in the .md)
- [ ] Step 7: Audit the assembled render inputs against the .md
- [ ] Step 8: Import and detach the Screen Reader template
- [ ] Step 9: Fill header fields (component name and guidelines)
- [ ] Step 10–11: Render state sections with artwork (one figma_execute per state/focus-order entry)
- [ ] Step 12: Visual validation (+ post-render check that every documented focus stop resolved a bbox)
```

### Step 0: Require and parse the component `.md` (fail fast)

**This skill is a consumer of the `.md` source of truth.** It does not re-extract from Figma and does not re-run the screen-reader reasoning layer — that work already happened in `extract-voice`/`create-component-md` and is baked into the `.md`'s Voice section. Your job is to render that section into a Figma frame.

1. **Resolve the `.md` path.** Use the exact path the user gave, else an attached or open `.md` in context. The `.md` may live anywhere; do NOT invent or guess a path. If neither resolves to an existing file, abort per item 2. Never pause to ask the user which file to use.
2. **Require the file.** If no file exists at the resolved `.md` path, **abort immediately** with this exact single-line diagnostic and stop — do NOT fall back to extraction:

   > This skill requires the component's Markdown `.md` spec (produced by create-component-md). Provide the path to it. (create-component-md needs a _base.json from the uSpec Extract plugin.)

3. **Parse the Voice section** (`## Voice / Screen reader`) from the `.md` body:
   - **Guidelines** — the blockquote immediately under the confidence header → `GUIDELINES`.
   - **Focus order** — the `### Focus order` table (columns `# | Part | Announcement | Role | Properties | Notes`). Each row → one focus-order table `{ focusOrderIndex: #, name: Part, announcement: Announcement, properties: [...] }`. Absent for single-stop components.
   - **Per-state platform tables** — each `### State: {name}` → a state entry; inside, the three `#### VoiceOver (iOS)` / `#### TalkBack (Android)` / `#### ARIA (Web)` sub-sections → `SECTIONS`; inside each, one table per `##### {focus-stop name}` (or a single unnamed table) with the `Announcement` row + property rows → `{ name, announcement, focusOrderIndex, properties: [{property, value, notes}] }`.
   - **Slot insertions** — the optional `### Slot insertions` prose block (`- In focus order preview: slot **{slotName}** populated with **{componentNodeId}**. Overrides: …`).
4. **Parse the `render-meta` block** (the fenced JSON between `<!-- render-meta:start v=1 -->` and `<!-- render-meta:end -->`):
   - `COMP_SET_ID` = `component.compSetNodeId`.
   - `BOOLEAN_DEFS` = reshape `booleanDefs[]` → `{ [key]: default }`. Each `key` is the raw component-property key `setProperties` expects (it matches a `render-meta.propertyDefs` raw key); when in doubt, cross-check against `propertyDefs` and use the raw-key form.
   - `variantAxes` / `variantAxesDefaults` — for Step 5 state→variant mapping.
   - `slotContents[]` — for resolving slot insertion `componentId` targets.
   - `fileKey`, `nodeId` — for the Step 13 completion link and template placement.
5. **Parse the hidden `voice-render-meta` carry** (the `<!-- voice-render-meta v=1 … -->` HTML comment at the end of the Voice body). It is a single JSON object `{ "focusStops": [ { "name", "focusOrderIndex", "layerName", "slotIndex" }, … ] }`. Key it by `name`. This is the **only** source for each focus stop's live Figma `layerName` — `findStopNode` matches `node.name === stop.name`, so `FOCUS_STOPS[].name` MUST be the `layerName` from this carry, never the human-readable part name.

**FORBIDDEN — do NOT re-extract.** When the component `.md` is present (it always is past Step 0), you MUST NOT run the legacy extraction/tree-walk. Specifically:
- Do NOT run any `figma_execute` / `use_figma` script that walks the component tree to rebuild `elements`, `variantAxes`, `booleanDefs`, `slotDefs`, or `slotVisibility` (the old Step 4 `extractElement` / `extractChildren` / `resolvePreferredComponents` extraction script is **deleted** — it does not exist in this skill anymore).
- Do NOT re-derive announcements, merge analysis, focus-stop counts, or platform property rows — they are authored in the `.md` and copied verbatim.
- The ONLY Figma calls this skill makes are: the template import (Step 8), the header fill (Step 9), and the unified per-entry render (Steps 10–11), which reads each focus stop's live `bbox` by name-match on the rendered instance. No other live reads are permitted.

### Step 1: Read References (only as needed)

The announcements, merge analysis, and platform property rows are already authored in the `.md` — you do NOT re-derive them. Read the platform references **only** if you need to reason about a slot-scenario choice (e.g., which preferred fill realizes a documented focus stop) while building `SLOT_INSERTIONS`:
- [agent-screenreader-instruction.md]({{ref:screen-reader/agent-screenreader-instruction.md}}) — slot scenario + focus-stop conventions
- [voiceover.md]({{ref:screen-reader/voiceover.md}}), [talkback.md]({{ref:screen-reader/talkback.md}}), [aria.md]({{ref:screen-reader/aria.md}}) — platform patterns

Skip this step entirely when the `.md` has no slot insertions.

### Step 2: Verify MCP Connection

Read `mcpProvider` from `uspecs.config.json` and verify the connection (rendering requires a live Figma session):

**If `figma-console`:**
- `figma_get_status` — Confirm Desktop Bridge plugin is active
- If connection fails: *"Please open Figma Desktop and run the Desktop Bridge plugin. Then try again."*

**If `figma-mcp`:**
- Connection is verified implicitly on the first `use_figma` call. No explicit check needed.
- If the first call fails: *"Please verify your FIGMA_API_KEY is set correctly in your MCP configuration."*

### Step 3: Read Template Key

Read the file `uspecs.config.json` and extract:
- The `screenReader` value from the `templateKeys` object → save as `SCREEN_READER_TEMPLATE_KEY`
- The `fontFamily` value → save as `FONT_FAMILY` (default to `Inter` if not set)

If the template key is empty, tell the user:
> The screen reader template key is not configured. Run {{skill:firstrun}} with your Figma template library link first.

### Step 4: Build render inputs from the parsed `.md` (no extraction)

Everything the render scripts need is already in the `.md` you parsed in Step 0. Assemble the render inputs directly — there is **no extraction call** here (see the FORBIDDEN directive in Step 0).

Build these values:

- **`GUIDELINES`** — the Voice section's guidelines blockquote, verbatim.
- **`SECTIONS` (per entry)** — for each `### State: {name}`, the array of 3 platform sections, each `{ title, tables: [{ name, announcement, focusOrderIndex, properties: [{property, value, notes}] }] }`, copied verbatim from the parsed per-state platform tables. For the Focus Order entry, `SECTIONS = [{ title: "Focus order", tables: <focus-order tables> }]`.
- **`COMP_SET_ID`** — `render-meta.component.compSetNodeId`.
- **`BOOLEAN_DEFS`** — reshape `render-meta.booleanDefs[]` → `{ [key]: default }` (raw component-property keys; see Step 0.4).
- **`FOCUS_STOPS` (per entry)** — built from the `voice-render-meta` carry. For the Focus Order entry, all `focusStops[]`. For a per-state entry, the subset whose `name` appears as a `#####` table in that state (match by part name). Each stop is `{ index: focusOrderIndex, name: layerName, slotIndex }` — **`name` is the carry's `layerName`**, because `findStopNode` matches `node.name === stop.name`. Skip a stop entirely when its `layerName` is `null` (no backing node → no marker).
- **`SLOT_INSERTIONS` (per entry)** — from the parsed `### Slot insertions` prose: `{ slotName, componentNodeId, nestedOverrides?, textOverrides? }`. Resolve `componentNodeId` against `render-meta.slotContents[].preferredComponents[].componentId` when the prose carries a name instead of an id. Use `[]` when the default slot content already realizes the documented stops.

`VARIANT_PROPS` is derived in Step 5.

> The legacy "gather context + run the `extractElement`/`extractChildren` extraction script" flow has been **removed**. Do not reintroduce it. The `.md` + `render-meta` are the complete input.

### Step 5: Re-derive per-entry variant props (light reasoning)

`VARIANT_PROPS` is the only value not copied verbatim from the `.md` — it is cheaply re-derived (no Figma reads):

- **Per-state entry.** Match the `### State: {name}` title to `render-meta.variantAxes` (case-insensitive option match). When the state name matches an option on an axis, set that axis to the matching value and leave the other axes at `variantAxesDefaults`. When there is no match (behavioral state like "focused"), use `variantAxesDefaults` verbatim. This mirrors the old Step 5F mapping, but reads axes from `render-meta` instead of a live walk.
- **Focus Order entry.** Pick the variant that shows the most focus stops: choose the state whose per-state platform tables contain the most focus-stop tables, and map its name to `variantAxes` as above. The render script's boolean-enable + `SLOT_INSERTIONS` + richest-variant fallback remain the safety nets — `VARIANT_PROPS` is the primary lever. Never pass `{}` and rely solely on the fallback.

There is no Step 6 — the spec content (guidelines, announcements, property rows, focus order, slot scenarios) is already authored in the `.md` and assembled in Step 4. Do not re-run merge analysis or re-author announcements.

### Step 7: Audit the assembled render inputs

Before rendering, verify the inputs you built from the `.md`:
- Every per-state entry has exactly 3 platform sections titled `"VoiceOver (iOS)"`, `"TalkBack (Android)"`, `"ARIA (Web)"`, copied verbatim from the `.md`.
- Every focus-stop table carries a `focusOrderIndex` and an `announcement` row, matching the `.md`.
- Every `FOCUS_STOPS[].name` equals a `layerName` from the `voice-render-meta` carry (never a human part name). Stops with `layerName: null` are excluded.
- `COMP_SET_ID`, `BOOLEAN_DEFS`, and any `SLOT_INSERTIONS` come from `render-meta` / parsed prose — not from any live read.
- You did NOT run an extraction/tree-walk (see Step 0 FORBIDDEN).

Fix any mismatch by re-parsing the `.md` — never by re-extracting from Figma.

### Step 8: Import and Detach Template

Run via `figma_execute` (replace `__SCREEN_READER_TEMPLATE_KEY__`, `__COMPONENT_NAME__`, and `__COMPONENT_NODE_ID__` with `COMP_SET_ID` = `render-meta.component.compSetNodeId`):

```javascript
const TEMPLATE_KEY = '__SCREEN_READER_TEMPLATE_KEY__';
const COMP_NODE_ID = '__COMPONENT_NODE_ID__';

const compNode = await figma.getNodeByIdAsync(COMP_NODE_ID);
let _p = compNode;
while (_p.parent && _p.parent.type !== 'DOCUMENT') _p = _p.parent;
if (_p.type === 'PAGE') await figma.setCurrentPageAsync(_p);

const templateComponent = await figma.importComponentByKeyAsync(TEMPLATE_KEY);
const instance = templateComponent.createInstance();
const frame = instance.detachInstance();

const GAP = 200;
frame.x = compNode.x + compNode.width + GAP;
frame.y = compNode.y;

frame.name = '__COMPONENT_NAME__ Screen reader';
figma.currentPage.selection = [frame];
figma.viewport.scrollAndZoomIntoView([frame]);
return { frameId: frame.id, pageId: _p.id, pageName: _p.name };
```

Save the returned `frameId` — you need it for all subsequent steps.

### Step 9: Fill Header Fields

Run via `figma_execute` (replace `__FRAME_ID__`, `__COMPONENT_NAME__`, and `__GUIDELINES__`):

```javascript
const frame = await figma.getNodeByIdAsync('__FRAME_ID__');
const textNodes = frame.findAll(n => n.type === 'TEXT');
const fontSet = new Set();
const fontsToLoad = [];
for (const tn of textNodes) {
  try {
    const fn = tn.fontName;
    if (fn && fn !== figma.mixed && fn.family) {
      const key = fn.family + '|' + fn.style;
      if (!fontSet.has(key)) { fontSet.add(key); fontsToLoad.push(fn); }
    }
  } catch {}
}
await Promise.all(fontsToLoad.map(f => figma.loadFontAsync(f).catch(() => {})));

// Set component name with "Screen reader" suffix
const compNameFrame = frame.findOne(n => n.name === '#compName');
if (compNameFrame) {
  const t = compNameFrame.findOne(n => n.type === 'TEXT');
  if (t) t.characters = '__COMPONENT_NAME__ Screen reader';
}

// Set guidelines via frame name lookup
const guidelinesFrame = frame.findOne(n => n.name === '{screen-reader-general-guidelines}');
if (guidelinesFrame) {
  const t = guidelinesFrame.findOne(n => n.type === 'TEXT');
  if (t) t.characters = '__GUIDELINES__';
}

return { success: true };
```

### Step 10–11: Render State Sections with Artwork

Steps 10 and 11 are combined into a single unified `figma_execute` script per state entry. Each script handles both the table rendering (platform sections, tables, property rows) and the focus order artwork (component instance, numbered markers, connecting lines) in one call.

The screen reader template has 4 levels of nesting: state → platform section → table → property row. To avoid timeouts, render **one `figma_execute` call per state entry**.

First, build the full list of entries to render:
1. **Focus order** (if present, `focusOrder.tables.length > 0`): rendered as the first `#state-template` clone with title "Focus order"
2. **Each state**: rendered as a `#state-template` clone with title "{ComponentName} {state}"

For each entry, run via `figma_execute`. Replace all `__PLACEHOLDER__` values. `RENDER_ARTWORK` is always `true` (this skill always has the `.md` + `render-meta`):

```javascript
const FONT_FAMILY = '__FONT_FAMILY__';
const FRAME_ID = '__FRAME_ID__';
const ENTRY_TITLE = '__ENTRY_TITLE__';
const ENTRY_DESCRIPTION = '__ENTRY_DESCRIPTION__';
const HAS_DESCRIPTION = __HAS_DESCRIPTION__;
const SECTIONS = __SECTIONS_JSON__;
const RENDER_ARTWORK = __RENDER_ARTWORK__;
const COMP_SET_ID = '__COMP_SET_NODE_ID__';
const FOCUS_STOPS = __FOCUS_STOPS_JSON__;
const VARIANT_PROPS = __VARIANT_PROPS_JSON__;
const BOOLEAN_DEFS = __BOOLEAN_DEFS_JSON__;
const SLOT_INSERTIONS = __SLOT_INSERTIONS_JSON__;
const IS_FOCUS_ORDER_ENTRY = __IS_FOCUS_ORDER_ENTRY__;

async function loadFontWithFallback(family, preferredStyle, fallbackStyle) {
  fallbackStyle = fallbackStyle || 'Regular';
  const allFonts = await figma.listAvailableFontsAsync();
  const familyFonts = allFonts.filter(f => f.fontName.family === family);
  const match = familyFonts.find(f => f.fontName.style === preferredStyle);
  if (match) { await figma.loadFontAsync(match.fontName); return match.fontName; }
  const fallback = familyFonts.find(f => f.fontName.style === fallbackStyle);
  if (fallback) { await figma.loadFontAsync(fallback.fontName); return fallback.fontName; }
  if (familyFonts.length > 0) { await figma.loadFontAsync(familyFonts[0].fontName); return familyFonts[0].fontName; }
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  return { family: 'Inter', style: 'Regular' };
}

async function loadAllFonts(rootNode) {
  let textNodes = [];
  try {
    textNodes = rootNode.findAll(n => n.type === 'TEXT');
  } catch {
    const walk = node => {
      if (node.type === 'TEXT') textNodes.push(node);
      if ('children' in node && node.children) {
        for (const child of node.children) walk(child);
      }
    };
    walk(rootNode);
  }
  const fontSet = new Set();
  const fontsToLoad = [];
  for (const tn of textNodes) {
    try {
      const fn = tn.fontName;
      if (fn && fn !== figma.mixed && fn.family) {
        const key = fn.family + '|' + fn.style;
        if (!fontSet.has(key)) { fontSet.add(key); fontsToLoad.push(fn); }
      }
    } catch {}
  }
  await Promise.all(fontsToLoad.map(f => figma.loadFontAsync(f).catch(() => {})));
}

const frame = await figma.getNodeByIdAsync(FRAME_ID);
const stateTemplate = frame.findOne(n => n.name === '#state-template');

const stateClone = stateTemplate.clone();
stateTemplate.parent.appendChild(stateClone);
stateClone.name = ENTRY_TITLE;
stateClone.visible = true;

const textNodes = stateClone.findAll(n => n.type === 'TEXT');
const fontSet = new Set();
const fontsToLoad = [];
for (const tn of textNodes) {
  try {
    const fn = tn.fontName;
    if (fn && fn !== figma.mixed && fn.family) {
      const key = fn.family + '|' + fn.style;
      if (!fontSet.has(key)) { fontSet.add(key); fontsToLoad.push(fn); }
    }
  } catch {}
}
await Promise.all(fontsToLoad.map(f => figma.loadFontAsync(f).catch(() => {})));

const titleFrame = stateClone.findOne(n => n.name === '#state-title');
if (titleFrame) {
  const t = titleFrame.findOne(n => n.type === 'TEXT');
  if (t) t.characters = ENTRY_TITLE;
}

const descFrame = stateClone.findOne(n => n.name === '#optional-description');
if (descFrame) {
  if (!HAS_DESCRIPTION) {
    descFrame.visible = false;
  } else {
    const t = descFrame.findOne(n => n.type === 'TEXT');
    if (t) t.characters = ENTRY_DESCRIPTION;
  }
}

// --- Platform sections and tables ---
const sectionTemplate = stateClone.findOne(n => n.name === '#section');

for (let s = 0; s < SECTIONS.length; s++) {
  const sectionData = SECTIONS[s];
  const sectionClone = sectionTemplate.clone();
  sectionTemplate.parent.appendChild(sectionClone);
  sectionClone.name = sectionData.title;
  sectionClone.visible = true;

  const platformTitle = sectionClone.findOne(n => n.name === '#platform-title');
  if (platformTitle) {
    const t = platformTitle.findOne(n => n.type === 'TEXT');
    if (t) t.characters = sectionData.title;
  }

  const tableTemplate = sectionClone.findOne(n => n.name === '#state-table');

  for (let tb = 0; tb < sectionData.tables.length; tb++) {
    const tableData = sectionData.tables[tb];
    const tableClone = tableTemplate.clone();
    tableTemplate.parent.appendChild(tableClone);
    tableClone.name = tableData.name || 'Table';
    tableClone.visible = true;

    const headerRow = tableClone.findOne(n => n.name === '#header-row');

    const focusOrderCol = headerRow ? headerRow.findOne(n => n.name === '#focus-order') : null;
    if (focusOrderCol) {
      const t = focusOrderCol.findOne(n => n.type === 'TEXT');
      if (t) t.characters = String(tableData.focusOrderIndex);
    }

    const announcementCol = headerRow ? headerRow.findOne(n => n.name === '#announcement') : null;
    if (announcementCol) {
      const t = announcementCol.findOne(n => n.type === 'TEXT');
      if (t) t.characters = tableData.name + ' ' + tableData.announcement;
    }

    const rowTemplate = tableClone.findOne(n => n.name === '#prop-row-template');

    for (const prop of tableData.properties) {
      const row = rowTemplate.clone();
      tableClone.appendChild(row);
      row.name = 'Row ' + prop.property;

      const propName = row.findOne(n => n.name === '#prop-name');
      if (propName) {
        const t = propName.findOne(n => n.type === 'TEXT');
        if (t) t.characters = prop.property;
      }

      const propValue = row.findOne(n => n.name === '#prop-value');
      if (propValue) {
        const t = propValue.findOne(n => n.type === 'TEXT');
        if (t) t.characters = prop.value;
      }

      const propNotes = row.findOne(n => n.name === '#prop-notes');
      if (propNotes) {
        const t = propNotes.findOne(n => n.type === 'TEXT');
        if (t) t.characters = prop.notes;
      }
    }

    rowTemplate.remove();
  }

  tableTemplate.remove();
}

sectionTemplate.remove();

// --- Artwork preview ---
if (RENDER_ARTWORK) {
  const MARKER_COLOR = { r: 0.922, g: 0, b: 0.431 };
  const MARKER_SIZE = 33;
  const MARKER_OFFSET = 40;
  const LINE_WIDTH = 1;
  const PADDING = 80;
  const COLLISION_GAP = 8;

  const previewPlaceholder = stateClone.findOne(n => n.name === 'Preview placeholder');
  if (previewPlaceholder) {
    const compNode = await figma.getNodeByIdAsync(COMP_SET_ID);
    if (!compNode || (compNode.type !== 'COMPONENT' && compNode.type !== 'COMPONENT_SET')) {
      return { success: false, entry: ENTRY_TITLE, reason: 'Component node not found for artwork rendering' };
    }
    const defaultVariant = compNode.type === 'COMPONENT_SET'
      ? (compNode.defaultVariant || compNode.children[0])
      : compNode;
    const compInstance = defaultVariant.createInstance();
    await loadAllFonts(compInstance);
    if (Object.keys(VARIANT_PROPS).length > 0) {
      try { compInstance.setProperties(VARIANT_PROPS); } catch (e) {}
      await loadAllFonts(compInstance);
    }
    if (IS_FOCUS_ORDER_ENTRY && Object.keys(BOOLEAN_DEFS).length > 0) {
      const enableAll = {};
      for (const key of Object.keys(BOOLEAN_DEFS)) enableAll[key] = true;
      try { compInstance.setProperties(enableAll); } catch (e) {}
      await loadAllFonts(compInstance);
    }

    if (SLOT_INSERTIONS && SLOT_INSERTIONS.length > 0) {
      for (const insertion of SLOT_INSERTIONS) {
        const slotNode = compInstance.findOne(n => n.type === 'SLOT' && n.name === insertion.slotName);
        if (!slotNode) continue;
        try { if (typeof slotNode.resetSlot === 'function') slotNode.resetSlot(); } catch (e) {}
        if ('children' in slotNode && slotNode.children.length > 0) {
          for (const existingChild of [...slotNode.children]) {
            try { existingChild.remove(); } catch (e) {}
          }
        }
        const targetNode = await figma.getNodeByIdAsync(insertion.componentNodeId);
        if (!targetNode || (targetNode.type !== 'COMPONENT' && targetNode.type !== 'COMPONENT_SET')) continue;
        const targetComp = targetNode.type === 'COMPONENT_SET'
          ? (targetNode.defaultVariant || targetNode.children[0])
          : targetNode;
        if (!targetComp || targetComp.type !== 'COMPONENT') continue;
        const insertedChild = targetComp.createInstance();
        await loadAllFonts(insertedChild);
        if (insertion.nestedOverrides && Object.keys(insertion.nestedOverrides).length > 0) {
          try {
            insertedChild.setProperties(insertion.nestedOverrides);
            await loadAllFonts(insertedChild);
          } catch (e) {}
        }
        if (insertion.textOverrides && Object.keys(insertion.textOverrides).length > 0) {
          for (const [layerName, newText] of Object.entries(insertion.textOverrides)) {
            const tn = insertedChild.findOne(n => n.type === 'TEXT' && n.name === layerName);
            if (tn) tn.characters = newText;
          }
          await loadAllFonts(insertedChild);
        }
        try {
          slotNode.appendChild(insertedChild);
          await loadAllFonts(compInstance);
        } catch (e) {
          try { insertedChild.remove(); } catch (_) {}
        }
      }
    }

    let rootW = Math.round(compInstance.width);
    let rootH = Math.round(compInstance.height);
    const markerPadding = Math.ceil(Math.max(FOCUS_STOPS.length, 1) / 4) * (MARKER_SIZE + COLLISION_GAP);
    const sideRoom = MARKER_SIZE + MARKER_OFFSET + PADDING + markerPadding;
    const neededH = rootH + 2 * sideRoom;
    const ARTWORK_W = Math.round(previewPlaceholder.width);
    let ARTWORK_H = Math.max(Math.round(neededH), 200);

    const wrapper = figma.createFrame();
    wrapper.name = 'Artwork wrapper';
    wrapper.layoutMode = 'NONE';
    wrapper.resize(ARTWORK_W, ARTWORK_H);
    wrapper.clipsContent = true;
    wrapper.fills = [];
    previewPlaceholder.appendChild(wrapper);

    let compX = Math.round((ARTWORK_W - rootW) / 2);
    let compY = Math.round((ARTWORK_H - rootH) / 2);
    wrapper.appendChild(compInstance);
    compInstance.x = compX;
    compInstance.y = compY;

    function isEffectivelyVisible(node, root) {
      let cur = node;
      while (cur && cur !== root) {
        if (cur.visible === false) return false;
        cur = cur.parent;
      }
      return true;
    }

    function findStopNode(root, stop, visibleOnly) {
      const nameFilter = n => n.name === stop.name;
      if (stop.slotIndex !== undefined) {
        const all = root.findAll(nameFilter);
        if (visibleOnly) {
          const visible = all.filter(n => isEffectivelyVisible(n, root));
          return visible[stop.slotIndex] || visible[0] || null;
        }
        return all[stop.slotIndex] || all[0] || null;
      }
      if (visibleOnly) {
        const all = root.findAll(nameFilter);
        return all.find(n => isEffectivelyVisible(n, root)) || null;
      }
      return root.findOne(nameFilter);
    }

    if (FOCUS_STOPS.length >= 1) {
      const instAbsX = compInstance.absoluteTransform[0][2];
      const instAbsY = compInstance.absoluteTransform[1][2];
      for (const stop of FOCUS_STOPS) {
        const match = findStopNode(compInstance, stop, IS_FOCUS_ORDER_ENTRY);
        if (match) {
          const absX = match.absoluteTransform[0][2];
          const absY = match.absoluteTransform[1][2];
          stop.bbox = {
            x: Math.round(absX - instAbsX),
            y: Math.round(absY - instAbsY),
            w: Math.round(match.width),
            h: Math.round(match.height)
          };
        }
      }

      if (IS_FOCUS_ORDER_ENTRY) {
        const missingStops = FOCUS_STOPS.filter(s => !s.bbox || !s.bbox.w);
        if (missingStops.length > 0 && compNode.type === 'COMPONENT_SET') {
        let bestVariant = null;
        let bestResolved = 0;
        for (const v of compNode.children) {
          const testInst = v.createInstance();
          if (Object.keys(BOOLEAN_DEFS).length > 0) {
            const enableAll = {};
            for (const key of Object.keys(BOOLEAN_DEFS)) enableAll[key] = true;
            try { testInst.setProperties(enableAll); } catch (e) {}
          }
          if (SLOT_INSERTIONS && SLOT_INSERTIONS.length > 0) {
            for (const insertion of SLOT_INSERTIONS) {
              const slotNode = testInst.findOne(n => n.type === 'SLOT' && n.name === insertion.slotName);
              if (!slotNode) continue;
              try { if (typeof slotNode.resetSlot === 'function') slotNode.resetSlot(); } catch (e) {}
              if ('children' in slotNode && slotNode.children.length > 0) {
                for (const existingChild of [...slotNode.children]) {
                  try { existingChild.remove(); } catch (e) {}
                }
              }
              const targetNode = await figma.getNodeByIdAsync(insertion.componentNodeId);
              if (!targetNode || (targetNode.type !== 'COMPONENT' && targetNode.type !== 'COMPONENT_SET')) continue;
              const targetComp = targetNode.type === 'COMPONENT_SET'
                ? (targetNode.defaultVariant || targetNode.children[0])
                : targetNode;
              if (!targetComp || targetComp.type !== 'COMPONENT') continue;
              const insertedChild = targetComp.createInstance();
              if (insertion.nestedOverrides && Object.keys(insertion.nestedOverrides).length > 0) {
                try { insertedChild.setProperties(insertion.nestedOverrides); } catch (e) {}
              }
              try { slotNode.appendChild(insertedChild); } catch (e) { try { insertedChild.remove(); } catch (_) {} }
            }
          }
          let resolved = 0;
          for (const s of FOCUS_STOPS) {
            if (findStopNode(testInst, s, true)) resolved++;
          }
          testInst.remove();
          if (resolved > bestResolved) { bestResolved = resolved; bestVariant = v; }
        }
        const currentResolved = FOCUS_STOPS.length - missingStops.length;
        if (bestVariant && bestResolved > currentResolved) {
          compInstance.remove();
          const newInstance = bestVariant.createInstance();
          await loadAllFonts(newInstance);
          if (Object.keys(BOOLEAN_DEFS).length > 0) {
            const enableAll = {};
            for (const key of Object.keys(BOOLEAN_DEFS)) enableAll[key] = true;
            try { newInstance.setProperties(enableAll); } catch (e) {}
            await loadAllFonts(newInstance);
          }
          if (SLOT_INSERTIONS && SLOT_INSERTIONS.length > 0) {
            for (const insertion of SLOT_INSERTIONS) {
              const slotNode = newInstance.findOne(n => n.type === 'SLOT' && n.name === insertion.slotName);
              if (!slotNode) continue;
              try { if (typeof slotNode.resetSlot === 'function') slotNode.resetSlot(); } catch (e) {}
              if ('children' in slotNode && slotNode.children.length > 0) {
                for (const existingChild of [...slotNode.children]) {
                  try { existingChild.remove(); } catch (e) {}
                }
              }
              const targetNode = await figma.getNodeByIdAsync(insertion.componentNodeId);
              if (!targetNode || (targetNode.type !== 'COMPONENT' && targetNode.type !== 'COMPONENT_SET')) continue;
              const targetComp = targetNode.type === 'COMPONENT_SET'
                ? (targetNode.defaultVariant || targetNode.children[0])
                : targetNode;
              if (!targetComp || targetComp.type !== 'COMPONENT') continue;
              const insertedChild = targetComp.createInstance();
              await loadAllFonts(insertedChild);
              if (insertion.nestedOverrides && Object.keys(insertion.nestedOverrides).length > 0) {
                try {
                  insertedChild.setProperties(insertion.nestedOverrides);
                  await loadAllFonts(insertedChild);
                } catch (e) {}
              }
              if (insertion.textOverrides && Object.keys(insertion.textOverrides).length > 0) {
                for (const [layerName, newText] of Object.entries(insertion.textOverrides)) {
                  const tn = insertedChild.findOne(n => n.type === 'TEXT' && n.name === layerName);
                  if (tn) tn.characters = newText;
                }
                await loadAllFonts(insertedChild);
              }
              try {
                slotNode.appendChild(insertedChild);
                await loadAllFonts(newInstance);
              } catch (e) {
                try { insertedChild.remove(); } catch (_) {}
              }
            }
          }
          rootW = Math.round(newInstance.width);
          rootH = Math.round(newInstance.height);
          const newNeededH = rootH + 2 * sideRoom;
          ARTWORK_H = Math.max(Math.round(newNeededH), 200);
          wrapper.resize(ARTWORK_W, ARTWORK_H);
          wrapper.appendChild(newInstance);
          compX = Math.round((ARTWORK_W - rootW) / 2);
          compY = Math.round((ARTWORK_H - rootH) / 2);
          newInstance.x = compX;
          newInstance.y = compY;
          const newAbsX = newInstance.absoluteTransform[0][2];
          const newAbsY = newInstance.absoluteTransform[1][2];
          for (const stop of FOCUS_STOPS) {
            const match = findStopNode(newInstance, stop, true);
            if (match) {
              const absX = match.absoluteTransform[0][2];
              const absY = match.absoluteTransform[1][2];
              stop.bbox = {
                x: Math.round(absX - newAbsX),
                y: Math.round(absY - newAbsY),
                w: Math.round(match.width),
                h: Math.round(match.height)
              };
            }
          }
        }
        }
      }

      // --- Focus stop outlines ---
      for (const stop of FOCUS_STOPS) {
        if (!stop.bbox || !stop.bbox.w) continue;
        const outline = figma.createRectangle();
        wrapper.appendChild(outline);
        outline.name = 'Outline ' + (FOCUS_STOPS.indexOf(stop) + 1);
        outline.x = Math.round(compX + stop.bbox.x);
        outline.y = Math.round(compY + stop.bbox.y);
        outline.resize(Math.max(1, stop.bbox.w), Math.max(1, stop.bbox.h));
        outline.fills = [];
        outline.strokes = [{ type: 'SOLID', color: MARKER_COLOR }];
        outline.strokeWeight = 1;
        outline.dashPattern = [4, 4];
      }

      const markerExample = frame.findOne(n => n.name === '#marker-example');
      await loadFontWithFallback(FONT_FAMILY, 'Medium');

      // --- Nearest-edge marker placement with collision avoidance ---
      function scoreSides(stop, rW, rH) {
        return [
          { side: 'left', dist: stop.bbox.x },
          { side: 'top', dist: stop.bbox.y },
          { side: 'right', dist: rW - (stop.bbox.x + stop.bbox.w) },
          { side: 'bottom', dist: rH - (stop.bbox.y + stop.bbox.h) }
        ].sort((a, b) => a.dist - b.dist);
      }

    function markerPos(side, stop, cX, cY, rW, rH, offset) {
      const eCX = cX + stop.bbox.x + stop.bbox.w / 2;
      const eCY = cY + stop.bbox.y + stop.bbox.h / 2;
      const eL = cX + stop.bbox.x;
      const eR = cX + stop.bbox.x + stop.bbox.w;
      const eT = cY + stop.bbox.y;
      const eB = cY + stop.bbox.y + stop.bbox.h;
      const off = offset || 0;
      if (side === 'left') {
        return { dotX: cX - MARKER_OFFSET - MARKER_SIZE, dotY: eCY - MARKER_SIZE / 2 + off, anchorX: eL, anchorY: eCY, markerEdgeX: cX - MARKER_OFFSET, markerEdgeY: eCY + off };
      } else if (side === 'right') {
        return { dotX: cX + rW + MARKER_OFFSET, dotY: eCY - MARKER_SIZE / 2 + off, anchorX: eR, anchorY: eCY, markerEdgeX: cX + rW + MARKER_OFFSET, markerEdgeY: eCY + off };
      } else if (side === 'top') {
        return { dotX: eCX - MARKER_SIZE / 2 + off, dotY: cY - MARKER_OFFSET - MARKER_SIZE, anchorX: eCX, anchorY: eT, markerEdgeX: eCX + off, markerEdgeY: cY - MARKER_OFFSET };
      } else {
        return { dotX: eCX - MARKER_SIZE / 2 + off, dotY: eB + MARKER_OFFSET, anchorX: eCX, anchorY: eB, markerEdgeX: eCX + off, markerEdgeY: eB + MARKER_OFFSET };
      }
    }

    function overlapsPlaced(dX, dY, pl) {
      for (const p of pl) {
        if (Math.abs(dX - p.x) < MARKER_SIZE + COLLISION_GAP && Math.abs(dY - p.y) < MARKER_SIZE + COLLISION_GAP) return true;
      }
      return false;
    }

    function inBounds(dX, dY, aw, ah) {
      return dX >= -MARKER_SIZE && dY >= -MARKER_SIZE && dX <= aw && dY <= ah;
    }

    const placed = [];
    const validStops = FOCUS_STOPS.filter(s => s.bbox && s.bbox.w);
    const perimeterCount = validStops.length;

    function drawLine(wr, x1, y1, x2, y2, nm) {
      if (Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1) return;
      const seg = figma.createRectangle();
      wr.appendChild(seg);
      seg.name = nm;
      seg.fills = [{ type: 'SOLID', color: MARKER_COLOR }];
      if (Math.abs(x1 - x2) < 1) {
        seg.x = Math.round(x1 - LINE_WIDTH / 2);
        seg.y = Math.round(Math.min(y1, y2));
        seg.resize(LINE_WIDTH, Math.max(1, Math.abs(y2 - y1)));
      } else {
        seg.x = Math.round(Math.min(x1, x2));
        seg.y = Math.round(y1 - LINE_WIDTH / 2);
        seg.resize(Math.max(1, Math.abs(x2 - x1)), LINE_WIDTH);
      }
    }

    for (let i = 0; i < FOCUS_STOPS.length; i++) {
      const stop = FOCUS_STOPS[i];
      if (!stop.bbox || !stop.bbox.w) continue;
      const stopNum = i + 1;

      const dot = markerExample.clone();
      wrapper.appendChild(dot);
      dot.name = 'Marker ' + stopNum;
      const numText = dot.findOne(n => n.type === 'TEXT');
      if (numText) numText.characters = String(stopNum);

      const rankedSides = scoreSides(stop, rootW, rootH);
      let finalDotX, finalDotY, finalSide, finalOffset = 0;
      let foundSpot = false;

      for (let off = 0; off <= perimeterCount * (MARKER_SIZE + COLLISION_GAP); off += MARKER_SIZE + COLLISION_GAP) {
        for (const { side } of rankedSides) {
          if (off === 0) {
            const pos = markerPos(side, stop, compX, compY, rootW, rootH, 0);
            if (inBounds(pos.dotX, pos.dotY, ARTWORK_W, ARTWORK_H) && !overlapsPlaced(pos.dotX, pos.dotY, placed)) {
              finalDotX = pos.dotX; finalDotY = pos.dotY; finalSide = side; finalOffset = 0;
              foundSpot = true; break;
            }
          } else {
            for (const sign of [1, -1]) {
              const perpOff = off * sign;
              const pos = markerPos(side, stop, compX, compY, rootW, rootH, perpOff);
              if (!inBounds(pos.dotX, pos.dotY, ARTWORK_W, ARTWORK_H)) continue;
              if (!overlapsPlaced(pos.dotX, pos.dotY, placed)) {
                finalDotX = pos.dotX; finalDotY = pos.dotY; finalSide = side; finalOffset = perpOff;
                foundSpot = true; break;
              }
            }
            if (foundSpot) break;
          }
        }
        if (foundSpot) break;
      }

      if (!foundSpot) {
        const pos = markerPos(rankedSides[0].side, stop, compX, compY, rootW, rootH, 0);
        finalDotX = pos.dotX; finalDotY = pos.dotY; finalSide = rankedSides[0].side; finalOffset = 0;
      }

      placed.push({ x: finalDotX, y: finalDotY });
      dot.x = Math.round(finalDotX);
      dot.y = Math.round(finalDotY);

      const pos = markerPos(finalSide, stop, compX, compY, rootW, rootH, finalOffset);
      drawLine(wrapper, pos.markerEdgeX, pos.markerEdgeY, pos.anchorX, pos.anchorY, 'Line ' + stopNum);
    }
  }
}

return { success: true, entry: ENTRY_TITLE };
```

After all entries are rendered, hide the `#marker-example` and the original `#state-template`:

```javascript
const frame = await figma.getNodeByIdAsync('__FRAME_ID__');
const markerExample = frame.findOne(n => n.name === '#marker-example');
if (markerExample) markerExample.visible = false;
const stateTemplate = frame.findOne(n => n.name === '#state-template');
if (stateTemplate) stateTemplate.visible = false;
return { success: true };
```

**Building the entries:**

Every table in every section must have a `focusOrderIndex` — the reading order position (1, 2, 3…). Tables within each platform section are listed in focus traversal order, so the index matches the table's position in that section. For single-stop components, all tables have `focusOrderIndex: 1`.

For the focus order (if present in the `.md`):
- `ENTRY_TITLE` = `"Focus order"`
- `ENTRY_DESCRIPTION` = the parsed focus-order description (or empty)
- `SECTIONS` = `[{ title: "Focus order", tables: <focus-order tables parsed from the .md> }]`
- `FOCUS_STOPS` = all focus stops from the `voice-render-meta` carry (`name` = each stop's `layerName`)
- `VARIANT_PROPS` = the variant that naturally shows the most focus stops, re-derived in Step 5 (the focus-stop-richest state mapped to `render-meta.variantAxes`). Do NOT pass `{}` and rely solely on the fallback. The boolean-enable step, slot insertion step, and richest-variant fallback in the rendering script are safety nets, not the primary mechanism. If the documented focus stop only exists when a slot is populated with a different component, pair `VARIANT_PROPS` with the parsed `SLOT_INSERTIONS` for that scenario. If no single variant + slot configuration shows all stops, use the state with the most stops; the `.md` already notes any unreachable stops.
For each state:
- `ENTRY_TITLE` = `"__COMPONENT_NAME__ __STATE__"` (e.g., "Button enabled")
- `ENTRY_DESCRIPTION` = the parsed state description (or empty)
- `SECTIONS` = the state's 3 platform sections parsed from the `.md`
- `FOCUS_STOPS` = the focus stops present in this state — the subset of the `voice-render-meta` carry whose `name` appears as a `#####` table in the state (`name` = `layerName`). For states where the component is entirely removed from the focus order (e.g., Disabled, documented in the `.md` with zero focus-stop tables), set `FOCUS_STOPS = []` — the artwork still renders the preview without markers, outlines, or connecting lines.
- `VARIANT_PROPS` = the per-state mapping from Step 5 (state name → `render-meta.variantAxes`, else `variantAxesDefaults`). Per-state previews do **not** auto-enable every boolean the way the Focus Order entry does, so include the state's visibility-driving properties here when they matter to the preview.
- `SLOT_INSERTIONS` = the parsed `### Slot insertions` entries that apply to this entry. Use `[]` when the default slot content already matches the documented focus stops.
**Artwork parameters:**
- `FONT_FAMILY` = the `fontFamily` value from `uspecs.config.json` (default: `Inter`)
- `RENDER_ARTWORK` = always `true` — this skill always has the `.md` + `render-meta` (there is no screenshot-only path).
- `COMP_SET_ID` = `render-meta.component.compSetNodeId`
- `FOCUS_STOPS` = array of `{ index, name, slotIndex? }` built from the `voice-render-meta` carry, where **`name` is the carry's `layerName`** — `findStopNode` resolves by `node.name === stop.name`, so a human part name will fail silently. `slotIndex` comes from the carry (present for composable-slot siblings). The render script reads each stop's live `bbox` itself; you do not supply bbox. Exclude stops whose `layerName` is `null`.
- `VARIANT_PROPS` = variant axis values for this entry, from Step 5 (focus-order: richest state; per-state: the state mapping).
- `BOOLEAN_DEFS` = `render-meta.booleanDefs[]` reshaped to `{ [key]: default }` (raw component-property keys).
- `SLOT_INSERTIONS` = array of `{ slotName, componentNodeId, nestedOverrides?, textOverrides? }` parsed from the `### Slot insertions` block (resolve `componentNodeId` via `render-meta.slotContents` when needed). All overrides must be applied before `appendChild` into the slot. Set to `[]` when no slot population is needed.
- `IS_FOCUS_ORDER_ENTRY` = `true` for the Focus Order entry, `false` for per-state entries

### Step 12: Visual Validation

1. `figma_take_screenshot` with the `frameId` — Capture the completed spec
2. Verify:
   - Focus order section appears (if applicable) with correct table entries
   - Each state has 3 platform sections (VoiceOver, TalkBack, ARIA)
   - Tables within each section have correct part names and announcements
   - Property rows are filled with correct values
   - Guidelines text is set (no placeholder text remaining)
   - Component name includes "Screen reader" suffix
   - Component instance is present and centered in each `Preview placeholder`
   - Focus order markers match the focus stops (numbered correctly, positioned near their elements)
   - Any slot-hosted focus stop listed in the tables is actually present in the rendered preview; if it depends on preferred content, the slot has been populated accordingly
   - Connecting lines link markers to their target elements
   - Dashed outlines surround each focus stop in the artwork
   - Artwork preview text is updated through the same `textOverrides` and `slotInsertions` choices used to build the documented scenario (no stray "Label" placeholders)
3. **Focus-stop resolution check (required).** Every documented focus stop (each `FOCUS_STOPS[]` entry with a non-null `layerName`) MUST have resolved a live `bbox` during render — i.e., `findStopNode` found a node named `layerName` and a marker + dashed outline were drawn for it. If any documented stop did not resolve (missing marker/outline), the `layerName` carry is wrong or the chosen `VARIANT_PROPS`/`SLOT_INSERTIONS` did not surface it. Fix by adjusting `VARIANT_PROPS`/`SLOT_INSERTIONS` (or, if the `.md`'s `layerName` is itself wrong, flag it — re-run `create-component-md`); do NOT silently ship a spec with an unmarked focus stop.
4. If issues are found, fix via `figma_execute` and re-capture (up to 3 iterations)

### Step 13: Completion Link

Print a clickable Figma URL to the completed spec in chat. Construct the URL from the `fileKey` (`render-meta.fileKey`) and the `frameId` (returned by Step 8), replacing `:` with `-` in the node ID:

```
Screen reader spec complete: https://www.figma.com/design/{fileKey}/?node-id={frameId}
```

## Notes

- The screen reader template key is stored in `uspecs.config.json` under `templateKeys.screenReader` and is configured via {{skill:firstrun}}.
- **This skill consumes the component `.md`** (the source of truth produced by {{skill:create-component-md}}) and renders its Voice section into Figma. It does NOT extract from Figma — see the Step 0 FORBIDDEN directive. The `compSetNodeId`, variant axes, boolean defs, slot contents, and per-focus-stop layer names all come from the `.md`'s `render-meta` + `voice-render-meta` carry.
- The target node referenced by `render-meta.component.compSetNodeId` can be either a `COMPONENT_SET` (multi-variant) or a standalone `COMPONENT` (single variant); the render script handles both via `defaultVariant || children[0]`.
- Four-level cloning: state → platform section → table → property row. Each level is cloned from its respective template (`#state-template` → `#section` → `#state-table` → `#prop-row-template`), filled, and the original template removed.
- The guidelines frame is found by name (`{screen-reader-general-guidelines}`), not by content search. This is handled in Step 9.
- Focus order is rendered as the first `#state-template` clone with title "Focus order". It contains a single section with the focus order tables. Regular states follow after.
- Each state entry is rendered in a single unified `figma_execute` call (Step 10–11) that handles both table rendering and artwork rendering. This avoids the previous pattern of requiring the agent to manually splice separate artwork code into each state call.
- **Markers per state, not global**: Unlike anatomy which has one artwork, voice renders markers inside each state's `Preview placeholder`. This is correct because focus order can change between states (e.g., error state might add/remove elements). Markers are rendered for every state that has at least one focus stop, even single-stop components — the number shows reading order position. For states where the component is removed from the focus order (e.g., Disabled), pass `FOCUS_STOPS = []` so only the component preview is rendered without markers, outlines, or connecting lines.
- The `RENDER_ARTWORK` flag is always `true` for this skill (there is no screenshot-only path). `COMP_SET_ID` and `FOCUS_STOPS` always come from the `.md` + `render-meta` / `voice-render-meta` carry.
- **Focus stop layer names come from the producer.** `extract-voice` retains each focus stop's Figma `treeFlat` layer name and `create-component-md` projects it into the Voice body's hidden `voice-render-meta` carry. `FOCUS_STOPS[].name` MUST be that `layerName` so `findStopNode` (which matches `node.name === stop.name`) resolves exactly. This replaces the old in-skill extraction that read live `elements[].name`.
- Preview-content changes should use the same mechanisms the render script understands: direct text updates on the main instance where needed, plus `slotInsertions` for slot-hosted content. Do not model preview content with a separate `artworkLabels` field.
- **Dynamic preview sizing**: The `Preview placeholder` keeps its template auto-layout. An inner wrapper frame (`layoutMode = 'NONE'`, `clipsContent = true`, transparent fills) is created and appended as an auto-layout child. The wrapper **width** is read from `previewPlaceholder.width` so it matches the template's layout width — this prevents the wrapper from blowing out the spec frame horizontally. The wrapper **height** is computed dynamically from the component height plus marker room (`rootH + 2 * sideRoom`), with a 200px floor to prevent collapse on tiny components. The component instance, outlines, markers, and lines are all placed inside the wrapper using absolute coordinates, while the template auto-layout controls the wrapper's position within the overall spec. This eliminates the stale `ROOT_SIZE` centering problem — `compX`/`compY` are calculated from live rendered dimensions. The sizing formula uses uniform `markerPadding` on all four sides based on `Math.ceil(stopCount / 4) * (MARKER_SIZE + COLLISION_GAP)`.
- **Marker positioning** uses the **nearest-edge + collision avoidance** algorithm (same as anatomy). For each focus stop, score all four sides by distance from the element's edge to the component boundary, then pick the shortest. Before placing, check overlap with all already-placed markers (8px minimum gap). If overlap, apply perpendicular offset; if offset exceeds bounds, try next-best side. Connectors are always straight lines from the marker to the element's nearest edge.
- After all state entries are rendered, both `#marker-example` and `#state-template` are hidden in a single cleanup call.
- The table header row uses `#focus-order` (280px) and `#announcement` (1120px) columns inside `#header-row`. The `#focus-order` column shows the reading order number (`focusOrderIndex`), and `#announcement` shows the part name + full announcement combined (e.g., "Button \"Submit, button\"").
- The instruction file (`{{ref:screen-reader/agent-screenreader-instruction.md}}`) and platform reference files are now consulted **only** for slot-scenario reasoning. Merge analysis, focus-stop counting, and announcement authoring already happened in `extract-voice` and are baked into the `.md` — this skill does not redo them.
- **Font loading for component instances**: The Step 10–11 rendering script uses `loadAllFonts(rootNode)` to load all fonts from a component instance's text nodes. This is called after `createInstance()` and after each `setProperties()` call (which may reveal hidden text nodes with different fonts). The `loadAllFonts` pattern reads `tn.fontName` from each text node (guarding against `figma.mixed`) rather than guessing font style names — per the Figma MCP server guide, font style names are file-dependent and must be discovered, not hardcoded.
- Variant properties are applied via `setProperties()` after instance creation; the `try/catch` handles behavioral states (e.g., "focused") that don't map to a Figma variant.
- Bounding boxes are captured from the live instance (no `detachInstance()` is ever called in artwork rendering — instances stay live throughout). For the Focus Order entry, `findStopNode` uses ancestor-aware visibility matching (`visibleOnly: true`) that walks the parent chain to confirm the node and all its ancestors are visible — this ensures the richest-variant fallback triggers when boolean-enable alone cannot surface all focus stops.
- For the Focus Order entry, focus stop visibility is maximized in four steps: (1) the agent sets `VARIANT_PROPS` to a variant where all focus stops are naturally visible (re-derived in Step 5 from `render-meta.variantAxes`); (2) all boolean properties from `BOOLEAN_DEFS` (= `render-meta.booleanDefs[]`) are force-enabled via `setProperties`; (3) any required `SLOT_INSERTIONS` are applied so slot-hosted interactive content actually exists in the preview; (4) `findStopNode` uses ancestor-aware visibility (`isEffectivelyVisible` walks the parent chain), so elements hidden by a parent container correctly report as unresolved — if unresolved stops remain, the richest-variant fallback iterates all variants, reapplies slot insertions, selects the best, resizes the wrapper, and re-centers. Per-state entries use `visibleOnly: false` and skip the fallback entirely.
- **Focus stop outlines**: Pink dashed rectangles (`dashPattern = [4, 4]`, `strokeWeight = 1`, `MARKER_COLOR`) are drawn around each focus stop's bounding box in the artwork. These use the same values as the anatomy skill for cross-skill visual consistency.
- **SLOT and composable slot handling**: Focus stops inside SLOTs are resolved at render time by name-match on the live instance. The `voice-render-meta` carry supplies each stop's `layerName` (and `slotIndex` for composable-slot siblings — multiple identically-named INSTANCE children). `findStopNode` uses `slotIndex` for index-based matching, falling back to name-based `findOne` for uniquely-named elements. During artwork rendering, `SLOT_INSERTIONS` (parsed from the `.md`'s `### Slot insertions` block, resolved against `render-meta.slotContents`) populate the chosen preferred content before bbox capture, and all nested/text overrides are applied before `appendChild` to avoid compound-ID mutation issues. Bbox capture from `findStopNode` always runs on the live instance, ensuring SLOT nodes and their children are intact.
- **Behavioral states**: States driven by user-described configurations (single-select vs. multi-select, collapsed vs. expanded) that don't correspond to Figma variant axes are documented in the `.md` as separate `### State:` entries; their `variantProps` resolve to `render-meta.variantAxesDefaults`. Component-level disabled renders with `FOCUS_STOPS = []`; sub-component disabled is shown as an archetype within a behavioral state.
