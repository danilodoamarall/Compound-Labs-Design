---
name: pnpm
description: Node.js package manager with strict dependency resolution. Use when running pnpm specific commands, configuring workspaces via pnpm-workspace.yaml, or managing dependencies with catalogs, patches, overrides, config dependencies, or the global virtual store.
metadata:
  author: Anthony Fu
  version: "2026.6.22"
  source: Generated from https://github.com/pnpm/pnpm, scripts located at https://github.com/antfu/skills
---

<!--
  Origem:  https://github.com/antfu/skills/blob/main/skills/pnpm/SKILL.md
  Autor:   antfu
  Licença: MIT
  Commit:  a74f281a27dadc02397bc1a174b0f2c97531b6ae
  Copiado: 2026-09-04 por scripts/ingest-skills.mjs
-->

pnpm is a fast, disk space efficient package manager. It uses a content-addressable store to deduplicate packages across all projects on a machine, and enforces strict dependency resolution by default, preventing phantom dependencies.

**Configuration model (important):** pnpm settings now live in `pnpm-workspace.yaml` (and the global `config.yaml`) using **camelCase** keys. `.npmrc` is used **only** for authentication/registry credentials, and the `pnpm` field of `package.json` is no longer read. When working in a pnpm project, check `pnpm-workspace.yaml` for settings/workspace structure and `.npmrc` only for auth. Always use `--frozen-lockfile` (or `pnpm ci`) in CI.

> The skill is based on pnpm 10.x, generated at 2026-06-22. It also covers v11 behavior changes (config split, isolated global packages, `allowBuilds`, `pmOnFail`, global virtual store) where current docs describe them.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| CLI Commands | install/add/remove/update, run, dlx/pnx, workspace, runtime, publishing (version, view, sbom, stage) | [core-cli](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/core-cli.md) |
| Configuration | pnpm-workspace.yaml settings (camelCase), global config.yaml, packageConfigs, .npmrc auth | [core-config](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/core-config.md) |
| Workspaces | Monorepo support: filtering, workspace protocol, shared lockfile, packageConfigs | [core-workspaces](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/core-workspaces.md) |
| Store | Content-addressable store, virtual store, node linker modes, frozen/read-only store | [core-store](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/core-store.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Catalogs | Centralized dependency versions; catalogMode, catalog: in overrides | [features-catalogs](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-catalogs.md) |
| Overrides | Force versions (incl. transitive & peer deps); packageExtensions | [features-overrides](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-overrides.md) |
| Patches | Modify third-party packages; patchedDependencies in pnpm-workspace.yaml | [features-patches](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-patches.md) |
| Aliases | Install under custom names (npm:) and registry aliases (namedRegistries) | [features-aliases](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-aliases.md) |
| Hooks | .pnpmfile.mjs hooks (readPackage, updateConfig, beforePacking), finders, resolvers/fetchers | [features-hooks](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-hooks.md) |
| Peer Dependencies | Auto-install, strict mode, rules, dedupePeers, peers check | [features-peer-deps](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-peer-deps.md) |
| Config Dependencies | Share hooks/settings/catalogs/patches across repos via configDependencies | [features-config-dependencies](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-config-dependencies.md) |
| Global Virtual Store | Shared node_modules, git-worktree multi-agent setups, isolated global packages | [features-global-virtual-store](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-global-virtual-store.md) |
| Supply-Chain Security | Build approval (allowBuilds), minimumReleaseAge, trustPolicy, lockfile integrity | [features-supply-chain-security](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/features-supply-chain-security.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| CI/CD Setup | GitHub Actions, GitLab, Docker, pnpm ci, store caching, frozen lockfiles | [best-practices-ci](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/best-practices-ci.md) |
| Migration | npm/Yarn → pnpm, phantom deps, and pnpm v10 → v11 config migration | [best-practices-migration](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/best-practices-migration.md) |
| Performance | Install optimizations, allowBuilds, global virtual store, workspace parallelization | [best-practices-performance](https://github.com/antfu/skills/blob/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pnpm/references/best-practices-performance.md) |
