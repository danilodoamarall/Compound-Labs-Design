---
name: vue-pinia-best-practices
description: "Pinia stores, state management patterns, store setup, and reactivity with stores."
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
---

<!--
  Origem:  https://github.com/vuejs-ai/skills/blob/main/skills/vue-pinia-best-practices/SKILL.md
  Autor:   vuejs-ai
  Licença: MIT
  Commit:  c9d355ff23f654309dd02006be671859df0a134c
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

Pinia best practices, common gotchas, and state management patterns.

### Store Setup
- Getting "getActivePinia was called" error at startup → See [pinia-no-active-pinia-error](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-pinia-best-practices/reference/pinia-no-active-pinia-error.md)
- Setup stores missing state in DevTools or SSR → See [pinia-setup-store-return-all-state](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-pinia-best-practices/reference/pinia-setup-store-return-all-state.md)

### Reactivity
- Store destructuring stops updating UI reactively → See [pinia-store-destructuring-breaks-reactivity](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-pinia-best-practices/reference/pinia-store-destructuring-breaks-reactivity.md)
- Store methods lose context in template calls → See [store-method-binding-parentheses](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-pinia-best-practices/reference/store-method-binding-parentheses.md)

### State Patterns
- Filters reset on refresh or can't be shared → See [state-url-for-ephemeral-filters](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-pinia-best-practices/reference/state-url-for-ephemeral-filters.md)
- Building production app without DevTools or conventions → See [state-use-pinia-for-large-apps](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-pinia-best-practices/reference/state-use-pinia-for-large-apps.md)
