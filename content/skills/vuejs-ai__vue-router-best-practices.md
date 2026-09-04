---
name: vue-router-best-practices
description: "Vue Router 4 patterns, navigation guards, route params, and route-component lifecycle interactions."
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
---

<!--
  Origem:  https://github.com/vuejs-ai/skills/blob/main/skills/vue-router-best-practices/SKILL.md
  Autor:   vuejs-ai
  Licença: MIT
  Commit:  c9d355ff23f654309dd02006be671859df0a134c
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

Vue Router best practices, common gotchas, and navigation patterns.

### Navigation Guards
- Navigating between same route with different params → See [router-beforeenter-no-param-trigger](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-beforeenter-no-param-trigger.md)
- Accessing component instance in beforeRouteEnter guard → See [router-beforerouteenter-no-this](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-beforerouteenter-no-this.md)
- Navigation guard making API calls without awaiting → See [router-guard-async-await-pattern](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-guard-async-await-pattern.md)
- Users trapped in infinite redirect loops → See [router-navigation-guard-infinite-loop](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-navigation-guard-infinite-loop.md)
- Navigation guard using deprecated next() function → See [router-navigation-guard-next-deprecated](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-navigation-guard-next-deprecated.md)

### Route Lifecycle
- Stale data when navigating between same route → See [router-param-change-no-lifecycle](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-param-change-no-lifecycle.md)
- Event listeners persisting after component unmounts → See [router-simple-routing-cleanup](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-simple-routing-cleanup.md)

### Setup
- Building production single-page application → See [router-use-vue-router-for-production](https://github.com/vuejs-ai/skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-router-best-practices/reference/router-use-vue-router-for-production.md)
