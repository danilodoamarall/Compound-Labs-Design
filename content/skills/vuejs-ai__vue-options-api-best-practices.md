---
name: vue-options-api-best-practices
description: "Vue 3 Options API style (data(), methods, this context). Each reference shows Options API solution only."
version: 2.0.0
license: MIT
author: github.com/vuejs-ai
---

<!--
  Origem:  https://github.com/vuejs-ai/skills/blob/main/skills/vue-options-api-best-practices/SKILL.md
  Autor:   vuejs-ai
  Licença: MIT
  Commit:  c9d355ff23f654309dd02006be671859df0a134c
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

Vue.js Options API best practices, TypeScript integration, and common gotchas.

### TypeScript
- Need to enable TypeScript type inference for component properties → See [ts-options-api-use-definecomponent](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-options-api-use-definecomponent.md)
- Enabling type safety for Options API this context → See [ts-strict-mode-options-api](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-strict-mode-options-api.md)
- Using old TypeScript versions with prop validators → See [ts-options-api-arrow-functions-validators](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-options-api-arrow-functions-validators.md)
- Event handler parameters need proper type safety → See [ts-options-api-type-event-handlers](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-options-api-type-event-handlers.md)
- Need to type object or array props with interfaces → See [ts-options-api-proptype-complex-types](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-options-api-proptype-complex-types.md)
- Injected properties missing TypeScript types completely → See [ts-options-api-provide-inject-limitations](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-options-api-provide-inject-limitations.md)
- Complex computed properties lack clear type documentation → See [ts-options-api-computed-return-types](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/ts-options-api-computed-return-types.md)

### Methods & Lifecycle
- Methods aren't binding to component instance context → See [no-arrow-functions-in-methods](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/no-arrow-functions-in-methods.md)
- Lifecycle hooks losing access to component data → See [no-arrow-functions-in-lifecycle-hooks](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/no-arrow-functions-in-lifecycle-hooks.md)
- Debounced functions sharing state across component instances → See [stateful-methods-lifecycle](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-options-api-best-practices/reference/stateful-methods-lifecycle.md)
