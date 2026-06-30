# Graph Report - .  (2026-06-30)

## Corpus Check
- 37 files · ~48,771 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 566 nodes · 738 edges · 68 communities (40 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Screens|UI Components & Screens]]
- [[_COMMUNITY_Rust Backend & Data Models|Rust Backend & Data Models]]
- [[_COMMUNITY_macOS Tauri Schema|macOS Tauri Schema]]
- [[_COMMUNITY_Desktop Tauri Schema|Desktop Tauri Schema]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Desktop Capability Schema|Desktop Capability Schema]]
- [[_COMMUNITY_macOS Capability Schema|macOS Capability Schema]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Graphify Skill Core|Graphify Skill Core]]
- [[_COMMUNITY_Tauri App Configuration|Tauri App Configuration]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Rust Error Types|Rust Error Types]]
- [[_COMMUNITY_Developer Guides & API|Developer Guides & API]]
- [[_COMMUNITY_Build & Dev Scripts|Build & Dev Scripts]]
- [[_COMMUNITY_Graphify Export Pipeline|Graphify Export Pipeline]]
- [[_COMMUNITY_Graphify Query Engine|Graphify Query Engine]]
- [[_COMMUNITY_Code Formatting Config|Code Formatting Config]]
- [[_COMMUNITY_Claude Project Config|Claude Project Config]]
- [[_COMMUNITY_Wake-on-LAN Core|Wake-on-LAN Core]]
- [[_COMMUNITY_Vite Node TS Config|Vite Node TS Config]]
- [[_COMMUNITY_CICD Build Pipeline|CI/CD Build Pipeline]]
- [[_COMMUNITY_Graphify Extraction Pipeline|Graphify Extraction Pipeline]]
- [[_COMMUNITY_Graphify Update & Hooks|Graphify Update & Hooks]]
- [[_COMMUNITY_Tauri Capabilities|Tauri Capabilities]]
- [[_COMMUNITY_Graphify Cluster & Update|Graphify Cluster & Update]]
- [[_COMMUNITY_Graphify Add & Watch|Graphify Add & Watch]]
- [[_COMMUNITY_Graphify Query & Explain|Graphify Query & Explain]]
- [[_COMMUNITY_CI Quality Gates|CI Quality Gates]]
- [[_COMMUNITY_Graphify Transcription|Graphify Transcription]]
- [[_COMMUNITY_Graphify GitHub Integration|Graphify GitHub Integration]]
- [[_COMMUNITY_Frontend Test Coverage|Frontend Test Coverage]]
- [[_COMMUNITY_Security & Dependency Updates|Security & Dependency Updates]]
- [[_COMMUNITY_Refactoring Backlog|Refactoring Backlog]]
- [[_COMMUNITY_React Logo Asset|React Logo Asset]]
- [[_COMMUNITY_CSS Split Backlog|CSS Split Backlog]]
- [[_COMMUNITY_DevicesScreen Handler Backlog|DevicesScreen Handler Backlog]]
- [[_COMMUNITY_Dependabot GH Actions|Dependabot GH Actions]]
- [[_COMMUNITY_App Icon 128x128@2x|App Icon 128x128@2x]]
- [[_COMMUNITY_App Icon Visual Design|App Icon Visual Design]]
- [[_COMMUNITY_App Icon 128x128|App Icon 128x128]]
- [[_COMMUNITY_App Icon 32x32|App Icon 32x32]]
- [[_COMMUNITY_App Icon|App Icon]]
- [[_COMMUNITY_App Icon Style|App Icon Style]]
- [[_COMMUNITY_WoL App Icon Symbolism|WoL App Icon Symbolism]]
- [[_COMMUNITY_Square 142x142 Logo|Square 142x142 Logo]]
- [[_COMMUNITY_Square 142x142 Purpose|Square 142x142 Purpose]]
- [[_COMMUNITY_Square 142x142 Style|Square 142x142 Style]]
- [[_COMMUNITY_Square 284x284 Logo|Square 284x284 Logo]]
- [[_COMMUNITY_Square 30x30 Logo|Square 30x30 Logo]]
- [[_COMMUNITY_Square 310x310 Logo|Square 310x310 Logo]]
- [[_COMMUNITY_Square 44x44 Logo|Square 44x44 Logo]]
- [[_COMMUNITY_Square 71x71 Logo|Square 71x71 Logo]]
- [[_COMMUNITY_Square 89x89 Logo|Square 89x89 Logo]]
- [[_COMMUNITY_Store Logo|Store Logo]]
- [[_COMMUNITY_Tauri Logo Asset|Tauri Logo Asset]]
- [[_COMMUNITY_Vite Logo Asset|Vite Logo Asset]]
- [[_COMMUNITY_Vite Tool Concept|Vite Tool Concept]]

## God Nodes (most connected - your core abstractions)
1. `Device` - 18 edges
2. `compilerOptions` - 16 edges
3. `homelab-wol-desktop` - 14 edges
4. `save_devices_to()` - 13 edges
5. `scripts` - 12 edges
6. `What You Must Do When Invoked` - 12 edges
7. `load_devices_from()` - 12 edges
8. `DeviceStatus` - 12 edges
9. `AppSettings` - 11 edges
10. `/graphify` - 10 edges

## Surprising Connections (you probably didn't know these)
- `index.html Entry Point` --implements--> `Wake-on-LAN Desktop App`  [INFERRED]
  index.html → README.md
- `Test Coverage Gaps` --rationale_for--> `CI Frontend Test Job (pnpm test:coverage + Codecov)`  [INFERRED]
  .claude/refactoring-plan.md → .github/workflows/ci.yml
- `Refactoring Work Rules (format before commit)` --rationale_for--> `CI Format Check Job (cargo fmt + ESLint + Prettier + tsc)`  [INFERRED]
  .claude/refactoring-plan.md → .github/workflows/ci.yml
- `Project CLAUDE.md (Codebase Guidance)` --references--> `Tauri Commands`  [EXTRACTED]
  CLAUDE.md → README.md
- `Incremental Update (--update)` --references--> `AST Structural Extraction (Part A)`  [INFERRED]
  .claude/skills/graphify/references/update.md → .claude/skills/graphify/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI Full Quality Pipeline (format + clippy + rust-test + frontend-test + security)** — ci_yml_format_check, ci_yml_clippy, ci_yml_rust_test, ci_yml_frontend_test, ci_yml_security_audit [EXTRACTED 1.00]
- **Composite Action Build Sequence (frontend + rust check + tauri build + artifact)** — build_steps_action_frontend_build, build_steps_action_rust_check, build_steps_action_tauri_build, build_steps_action_artifact_upload [EXTRACTED 1.00]
- **Dependabot Weekly Dependency Updates (github-actions + npm + cargo)** — dependabot_yml_github_actions_updates, dependabot_yml_npm_updates, dependabot_yml_cargo_updates [EXTRACTED 1.00]

## Communities (68 total, 28 thin omitted)

### Community 0 - "UI Components & Screens"
Cohesion: 0.08
Nodes (40): ActivityScreen(), Props, Props, Sidebar(), DeviceCard(), Props, DeviceDrawer, Props (+32 more)

### Community 1 - "Rust Backend & Data Models"
Cohesion: 0.13
Nodes (38): AppHandle, AppSettings, Device, Option, Path, Result, delete_device(), load_devices() (+30 more)

### Community 2 - "macOS Tauri Schema"
Cohesion: 0.05
Nodes (41): description, properties, required, type, Capability, Identifier, default, description (+33 more)

### Community 3 - "Desktop Tauri Schema"
Cohesion: 0.05
Nodes (39): description, properties, required, type, Capability, default, description, type (+31 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, react, react-dom, @tauri-apps/api, @tauri-apps/plugin-dialog, @tauri-apps/plugin-opener, devDependencies, eslint (+25 more)

### Community 5 - "Desktop Capability Schema"
Cohesion: 0.06
Nodes (30): anyOf, anyOf, description, description, properties, required, type, definitions (+22 more)

### Community 6 - "macOS Capability Schema"
Cohesion: 0.07
Nodes (28): anyOf, anyOf, description, description, properties, required, type, definitions (+20 more)

### Community 7 - "Project Documentation"
Cohesion: 0.08
Nodes (24): Building, CI/CD Pipeline, Contributing, Data Storage, Development, Features, homelab-wol-desktop, IDE Setup (+16 more)

### Community 8 - "Graphify Skill Core"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "Tauri App Configuration"
Cohesion: 0.10
Nodes (19): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+11 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+10 more)

### Community 11 - "Rust Error Types"
Cohesion: 0.19
Nodes (9): Default, Display, Formatter, From, Self, MacAddressError, NetworkError, WolError (+1 more)

### Community 12 - "Developer Guides & API"
Cohesion: 0.18
Nodes (15): Project CLAUDE.md (Codebase Guidance), index.html Entry Point, API Reference, `delete_device`, Device Interface, Device Persistent Storage (JSON), Error Handling, `load_devices` (+7 more)

### Community 13 - "Build & Dev Scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, format, format:check, lint, lint:fix, preview (+4 more)

### Community 14 - "Graphify Export Pipeline"
Cohesion: 0.18
Nodes (10): Graphify MCP Server, Wiki Export (--wiki), graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag) (+2 more)

### Community 15 - "Graphify Query Engine"
Cohesion: 0.24
Nodes (7): graphify, BFS/DFS Graph Traversal, Cross-Repo Graph Merge, Graphify Query Flow, Save Query Result (Self-Improving Loop), Query Vocab Expansion (Constrained), GitHub Clone and Cross-Repo Merge Reference

### Community 16 - "Code Formatting Config"
Cohesion: 0.22
Nodes (8): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 17 - "Claude Project Config"
Cohesion: 0.25
Nodes (7): Architecture Notes, Build & Test, CI Pipeline, Code Style, Dev Workflow, graphify, Project Overview

### Community 18 - "Wake-on-LAN Core"
Cohesion: 0.46
Nodes (7): MacAddressError, create_magic_packet(), parse_mac_address(), send_magic_packet(), test_create_magic_packet_structure(), test_parse_mac_address_errors(), test_parse_mac_address_valid()

### Community 19 - "Vite Node TS Config"
Cohesion: 0.25
Nodes (7): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, include

### Community 20 - "CI/CD Build Pipeline"
Cohesion: 0.33
Nodes (7): Artifact Upload Step, Tauri Build Helper Composite Action, Frontend Build Step (pnpm build), Backend Rust Check Step (cargo check), Tauri Build Step (pnpm tauri build), CD Release macOS Job, CI Build Linux Job

### Community 21 - "Graphify Extraction Pipeline"
Cohesion: 0.33
Nodes (6): AST Structural Extraction (Part A), Graph Community Detection, Graphify Honesty Rules, Graphify Full Pipeline, Semantic Extraction via Subagents (Part B), graphify reference: extraction subagent prompt

### Community 22 - "Graphify Update & Hooks"
Cohesion: 0.29
Nodes (6): Incremental Update (--update), Post-Commit Auto-Rebuild Hook, Watch Mode (--watch), For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 23 - "Tauri Capabilities"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 24 - "Graphify Cluster & Update"
Cohesion: 0.40
Nodes (4): Cluster-Only Rerun, For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 25 - "Graphify Add & Watch"
Cohesion: 0.40
Nodes (4): URL Ingest (graphify add), For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 26 - "Graphify Query & Explain"
Cohesion: 0.40
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 27 - "CI Quality Gates"
Cohesion: 0.50
Nodes (4): CI Clippy Job (cargo clippy -D warnings), CI Format Check Job (cargo fmt + ESLint + Prettier + tsc), CI Rust Test Job (cargo test), Refactoring Work Rules (format before commit)

### Community 28 - "Graphify Transcription"
Cohesion: 0.50
Nodes (3): Whisper Video/Audio Transcription, graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected)

## Knowledge Gaps
- **286 isolated node(s):** `semi`, `singleQuote`, `tabWidth`, `trailingComma`, `printWidth` (+281 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project CLAUDE.md (Codebase Guidance)` connect `Developer Guides & API` to `Graphify Query Engine`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `homelab-wol-desktop` connect `Project Documentation` to `Developer Guides & API`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `tabWidth` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.07832167832167833 - nodes in this community are weakly interconnected._
- **Should `Rust Backend & Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.13002114164904863 - nodes in this community are weakly interconnected._
- **Should `macOS Tauri Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.05121951219512195 - nodes in this community are weakly interconnected._
- **Should `Desktop Tauri Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._