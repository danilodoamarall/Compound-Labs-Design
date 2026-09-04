---
name: vue-testing-best-practices
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
description: Use for Vue.js testing. Covers Vitest, Vue Test Utils, component testing, mocking, testing patterns, and Playwright for E2E testing.
---

<!--
  Origem:  https://github.com/vuejs-ai/skills/blob/main/skills/vue-testing-best-practices/SKILL.md
  Autor:   vuejs-ai
  Licença: MIT
  Commit:  c9d355ff23f654309dd02006be671859df0a134c
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

Vue.js testing best practices, patterns, and common gotchas.

### Testing
- Setting up test infrastructure for Vue 3 projects → See [testing-vitest-recommended-for-vue](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-vitest-recommended-for-vue.md)
- Tests keep breaking when refactoring component internals → See [testing-component-blackbox-approach](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-component-blackbox-approach.md)
- Tests fail intermittently with race conditions → See [testing-async-await-flushpromises](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-async-await-flushpromises.md)
- Composables using lifecycle hooks or inject fail to test → See [testing-composables-helper-wrapper](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-composables-helper-wrapper.md)
- Getting "injection Symbol(pinia) not found" errors in tests → See [testing-pinia-store-setup](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-pinia-store-setup.md)
- Components with async setup won't render in tests → See [testing-suspense-async-components](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-suspense-async-components.md)
- Snapshot tests keep passing despite broken functionality → See [testing-no-snapshot-only](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-no-snapshot-only.md)
- Choosing end-to-end testing framework for Vue apps → See [testing-e2e-playwright-recommended](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-e2e-playwright-recommended.md)
- Tests need to verify computed styles or real DOM events → See [testing-browser-vs-node-runners](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-browser-vs-node-runners.md)
- Testing components created with defineAsyncComponent fails → See [async-component-testing](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/async-component-testing.md)
- Teleported modal content can't be found in wrapper queries → See [teleport-testing-complexity](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/teleport-testing-complexity.md)

## Reference

- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
