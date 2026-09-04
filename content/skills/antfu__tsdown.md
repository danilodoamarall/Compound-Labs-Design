---
name: tsdown
description: Bundle TypeScript and JavaScript libraries with blazing-fast speed powered by Rolldown. Use when building libraries, generating type declarations, bundling for multiple formats, or migrating from tsup.
---

<!--
  Origem:  https://github.com/antfu/skills/blob/main/skills/tsdown/SKILL.md
  Autor:   antfu
  Licença: MIT
  Commit:  a74f281a27dadc02397bc1a174b0f2c97531b6ae
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

# tsdown - The Elegant Library Bundler

Blazing-fast bundler for TypeScript/JavaScript libraries powered by Rolldown and Oxc.

## Runtime Requirement

`tsdown` requires **Node.js 22.18.0 or higher to run** (build-time only). However, the bundled output can target much lower Node.js versions via the [`target`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-target.md) option, so libraries built with tsdown are **not locked to Node.js 22+ at runtime**.

If your package needs to support Node.js 18 / 20:

- **Build with Node.js 22+ in CI** (e.g. set `target: 'node18'` or `target: 'node20'`).
- **Test the built output (or the packed tarball) on the lower Node.js versions** you intend to support — e.g. using a matrix job that runs the published package's tests on Node.js 18 / 20 / 22.

## When to Use

- Building TypeScript/JavaScript libraries for npm
- Generating TypeScript declaration files (.d.ts)
- Bundling for multiple formats (ESM, CJS, IIFE, UMD)
- Optimizing bundles with tree shaking and minification
- Migrating from tsup with minimal changes
- Building React, Vue, Solid, or Svelte component libraries

## Quick Start

```bash
# Install
pnpm add -D tsdown

# Basic usage
npx tsdown

# With config file
npx tsdown --config tsdown.config.ts

# Watch mode
npx tsdown --watch

# Migrate from tsup
npx tsdown-migrate
```

## Basic Configuration

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
```

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Getting Started | Installation, first bundle, CLI basics | [guide-getting-started](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/guide-getting-started.md) |
| Configuration File | Config file formats, multiple configs, workspace | [option-config-file](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-config-file.md) |
| CLI Reference | All CLI commands and options | [reference-cli](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/reference-cli.md) |
| Migrate from tsup | Migration guide and compatibility notes | [guide-migrate-from-tsup](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/guide-migrate-from-tsup.md) |
| Plugins | Rolldown, Rollup, Unplugin support | [advanced-plugins](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/advanced-plugins.md) |

> For comprehensive migration assistance with complete option mappings, install the dedicated [`tsdown-migrate`](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown-migrate/SKILL.md) skill: `npx skills add rolldown/tsdown --skill tsdown-migrate`
| Hooks | Lifecycle hooks for custom logic | [advanced-hooks](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/advanced-hooks.md) |
| Programmatic API | Build from Node.js scripts | [advanced-programmatic](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/advanced-programmatic.md) |
| Rolldown Options | Pass options directly to Rolldown | [advanced-rolldown-options](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/advanced-rolldown-options.md) |
| CI Environment | CI detection, `'ci-only'` / `'local-only'` values | [advanced-ci](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/advanced-ci.md) |

## Build Options

| Option | Usage | Reference |
|--------|-------|-----------|
| Entry points | `entry: ['src/*.ts', '!**/*.test.ts']` | [option-entry](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-entry.md) |
| Output formats | `format: ['esm', 'cjs', 'iife', 'umd']` | [option-output-format](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-output-format.md) |
| Output directory | `outDir: 'dist'`, `outExtensions` | [option-output-directory](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-output-directory.md) |
| Type declarations | `dts: true`, `dts: { sourcemap, compilerOptions, vue }` | [option-dts](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-dts.md) |
| Target environment | `target: 'es2020'`, `target: 'esnext'` | [option-target](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-target.md) |
| Platform | `platform: 'node'`, `platform: 'browser'` | [option-platform](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-platform.md) |
| Tree shaking | `treeshake: true`, custom options | [option-tree-shaking](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-tree-shaking.md) |
| Minification | `minify: true`, `minify: 'dce-only'` | [option-minification](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-minification.md) |
| Source maps | `sourcemap: true`, `'inline'`, `'hidden'` | [option-sourcemap](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-sourcemap.md) |
| Watch mode | `watch: true`, watch options | [option-watch-mode](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-watch-mode.md) |
| Cleaning | `clean: true`, clean patterns | [option-cleaning](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-cleaning.md) |
| Log level | `logLevel: 'silent'`, `failOnWarn: false` | [option-log-level](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-log-level.md) |

## Dependency Handling

| Feature | Usage | Reference |
|---------|-------|-----------|
| Never bundle | `deps: { neverBundle: ['react', /^@myorg\//] }` | [option-dependencies](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-dependencies.md) |
| Always bundle | `deps: { alwaysBundle: ['dep-to-bundle'] }` | [option-dependencies](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-dependencies.md) |
| Only bundle | `deps: { onlyBundle: ['cac', 'bumpp'] }` - Whitelist | [option-dependencies](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-dependencies.md) |
| Skip node_modules | `deps: { skipNodeModulesBundle: true }` | [option-dependencies](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-dependencies.md) |
| Auto external | Automatic dependency/peer/optional externalization | [option-dependencies](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-dependencies.md) |

## Output Enhancement

| Feature | Usage | Reference |
|---------|-------|-----------|
| Shims | `shims: true` - Add ESM/CJS compatibility | [option-shims](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-shims.md) |
| CJS default | `cjsDefault: true` (default) / `false` | [option-cjs-default](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-cjs-default.md) |
| Package exports | `exports: true` - Generate exports field | [option-package-exports](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-package-exports.md) |
| CSS handling | **[experimental]** `css: { ... }` — full pipeline with preprocessors, Lightning CSS, PostCSS, CSS modules, code splitting; requires `@tsdown/css` | [option-css](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-css.md) |
| CSS modules | `css: { modules: { localsConvention: 'camelCase' } }` — scoped class names for `.module.css` files | [option-css](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-css.md) |
| CSS inject | `css: { inject: true }` — preserve CSS imports in JS output | [option-css](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-css.md) |
| Unbundle mode | `unbundle: true` - Preserve directory structure | [option-unbundle](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-unbundle.md) |
| Root directory | `root: 'src'` - Control output directory mapping | [option-root](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-root.md) |
| Executable | **[experimental]** `exe: true` - Bundle as standalone executable, cross-platform via `@tsdown/exe` | [option-exe](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-exe.md) |
| Package validation | `publint: true`, `attw: true` - Validate package | [option-lint](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/option-lint.md) |

## Framework & Runtime Support

| Framework | Guide | Reference |
|-----------|-------|-----------|
| React | JSX transform, React Compiler | [recipe-react](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/recipe-react.md) |
| Vue | SFC support, JSX | [recipe-vue](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/recipe-vue.md) |
| Solid | SolidJS JSX transform | [recipe-solid](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/recipe-solid.md) |
| Svelte | Svelte component libraries (source distribution recommended) | [recipe-svelte](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/recipe-svelte.md) |
| WASM | WebAssembly modules via `rolldown-plugin-wasm` | [recipe-wasm](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/tsdown/references/recipe-wasm.md) |

## Common Patterns

### Basic Library Bundle

```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
```

### Multiple Entry Points

```ts
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    utils: 'src/utils.ts',
    cli: 'src/cli.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
})
```

### Browser Library (IIFE/UMD)

```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'],
  globalName: 'MyLib',
  platform: 'browser',
  minify: true,
})
```

### React Component Library

```ts
export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
  inputOptions: {
    jsx: { runtime: 'automatic' },
  },
})
```

### Preserve Directory Structure

```ts
export default defineConfig({
  entry: ['src/**/*.ts', '!**/*.test.ts'],
  unbundle: true, // Preserve file structure
  format: ['esm'],
  dts: true,
})
```

### CI-Aware Configuration

```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  failOnWarn: 'ci-only',  // opt-in: fail on warnings in CI
  publint: 'ci-only',
  attw: 'ci-only',
})
```

### WASM Support

```ts
import { wasm } from 'rolldown-plugin-wasm'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  plugins: [wasm()],
})
```

### Library with CSS and Sass

```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  target: 'chrome100',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/styles/variables" as *;`,
      },
    },
  },
})
```

### Standalone Executable

```ts
export default defineConfig({
  entry: ['src/cli.ts'],
  exe: true,
})
```

### Cross-Platform Executable (requires `@tsdown/exe`)

```ts
export default defineConfig({
  entry: ['src/cli.ts'],
  exe: {
    targets: [
      { platform: 'linux', arch: 'x64', nodeVersion: '25.7.0' },
      { platform: 'darwin', arch: 'arm64', nodeVersion: '25.7.0' },
      { platform: 'win', arch: 'x64', nodeVersion: '25.7.0' },
    ],
  },
})
```

### Advanced with Hooks

```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  hooks: {
    'build:before': async (context) => {
      console.log('Building...')
    },
    'build:done': async (context) => {
      console.log('Build complete!')
    },
  },
})
```

## Configuration Features

### Multiple Configs

Export an array for multiple build configurations:

```ts
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
  },
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    platform: 'node',
  },
])
```

### Conditional Config

Use functions for dynamic configuration:

```ts
export default defineConfig((options) => {
  const isDev = options.watch
  return {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    minify: !isDev,
    sourcemap: isDev,
  }
})
```

### Workspace/Monorepo

Use glob patterns to build multiple packages:

```ts
export default defineConfig({
  workspace: 'packages/*',
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
})
```

## CLI Quick Reference

```bash
# Basic commands
tsdown                          # Build once
tsdown --watch                  # Watch mode
tsdown --config custom.ts       # Custom config
npx tsdown-migrate              # Migrate from tsup

# Output options
tsdown --format esm,cjs        # Multiple formats
tsdown -d lib                  # Custom output directory (--out-dir)
tsdown --minify                # Enable minification
tsdown --dts                   # Generate declarations
tsdown --exe                   # Bundle as standalone executable
tsdown --unbundle              # Bundleless mode

# Entry options
tsdown src/index.ts            # Single entry
tsdown src/*.ts                # Glob patterns
tsdown src/a.ts src/b.ts       # Multiple entries

# Workspace / Monorepo
tsdown -W                      # Enable workspace mode
tsdown -W -F my-package        # Filter specific package
tsdown --filter /^pkg-/        # Filter by regex

# Development
tsdown --watch                 # Watch mode
tsdown --sourcemap             # Generate source maps
tsdown --clean                 # Clean output directory
tsdown --from-vite             # Reuse Vite config
tsdown --tsconfig tsconfig.build.json  # Custom tsconfig
```

## Best Practices

1. **Always generate type declarations** for TypeScript libraries:
   ```ts
   { dts: true }
   ```

2. **Externalize dependencies** to avoid bundling unnecessary code:
   ```ts
   { deps: { neverBundle: [/^react/, /^@myorg\//] } }
   ```

3. **Use tree shaking** for optimal bundle size:
   ```ts
   { treeshake: true }
   ```

4. **Enable minification** for production builds:
   ```ts
   { minify: true }
   ```

5. **Add shims** for better ESM/CJS compatibility:
   ```ts
   { shims: true }  // Adds __dirname, __filename, etc.
   ```

6. **Auto-generate package.json exports**:
   ```ts
   { exports: true }  // Creates proper exports field
   ```

7. **Use watch mode** during development:
   ```bash
   tsdown --watch
   ```

8. **Preserve structure** for utilities with many files:
   ```ts
   { unbundle: true }  // Keep directory structure
   ```

9. **Validate packages** in CI before publishing:
   ```ts
   { publint: 'ci-only', attw: 'ci-only' }
   ```

## Resources

- Documentation: https://tsdown.dev
- GitHub: https://github.com/rolldown/tsdown
- Rolldown: https://rolldown.rs
- Migration Guide: https://tsdown.dev/guide/migrate-from-tsup
