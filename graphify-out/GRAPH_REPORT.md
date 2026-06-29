# Graph Report - homelab-wol-desktop  (2026-06-30)

## Corpus Check
- 40 files · ~56,629 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 559 nodes · 692 edges · 54 communities (32 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e35ce6df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Desktop Capability Schema|Desktop Capability Schema]]
- [[_COMMUNITY_macOS Capability Schema|macOS Capability Schema]]
- [[_COMMUNITY_Rust Backend Core|Rust Backend Core]]
- [[_COMMUNITY_Graphify Knowledge Graph|Graphify Knowledge Graph]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Dev Toolchain|Dev Toolchain]]
- [[_COMMUNITY_Desktop Schema Types|Desktop Schema Types]]
- [[_COMMUNITY_macOS Schema Types|macOS Schema Types]]
- [[_COMMUNITY_Tauri App Config|Tauri App Config]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Desktop Remote Capability|Desktop Remote Capability]]
- [[_COMMUNITY_macOS Remote Capability|macOS Remote Capability]]
- [[_COMMUNITY_CICD Pipeline|CI/CD Pipeline]]
- [[_COMMUNITY_Node TypeScript Config|Node TypeScript Config]]
- [[_COMMUNITY_React App Components|React App Components]]
- [[_COMMUNITY_App Icon Design|App Icon Design]]
- [[_COMMUNITY_Windows Tile Icons|Windows Tile Icons]]
- [[_COMMUNITY_Retina App Icon|Retina App Icon]]
- [[_COMMUNITY_Vite Build Tool|Vite Build Tool]]
- [[_COMMUNITY_App Entry Points|App Entry Points]]
- [[_COMMUNITY_Tauri Build Script|Tauri Build Script]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_128px App Icon|128px App Icon]]
- [[_COMMUNITY_32px App Icon|32px App Icon]]
- [[_COMMUNITY_Win 150px Logo|Win 150px Logo]]
- [[_COMMUNITY_Win 284px Logo|Win 284px Logo]]
- [[_COMMUNITY_Win 30px Logo|Win 30px Logo]]
- [[_COMMUNITY_Win 310px Logo|Win 310px Logo]]
- [[_COMMUNITY_Win 44px Logo|Win 44px Logo]]
- [[_COMMUNITY_Win 71px Logo|Win 71px Logo]]
- [[_COMMUNITY_Win 89px Logo|Win 89px Logo]]
- [[_COMMUNITY_Windows Store Logo|Windows Store Logo]]
- [[_COMMUNITY_Tauri Logo Asset|Tauri Logo Asset]]
- [[_COMMUNITY_Vite Type Defs|Vite Type Defs]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `homelab-wol-desktop` - 14 edges
3. `save_devices_to()` - 13 edges
4. `scripts` - 12 edges
5. `load_devices_from()` - 12 edges
6. `What You Must Do When Invoked` - 12 edges
7. `Device` - 10 edges
8. `/graphify` - 10 edges
9. `Tauri Commands` - 10 edges
10. `definitions` - 9 edges

## Surprising Connections (you probably didn't know these)
- `index.html Entry Point` --implements--> `Wake-on-LAN Desktop App`  [INFERRED]
  index.html → README.md
- `Project CLAUDE.md (Codebase Guidance)` --references--> `Tauri Commands`  [EXTRACTED]
  CLAUDE.md → README.md
- `Project CLAUDE.md (Codebase Guidance)` --references--> `WoL Magic Packet (102 bytes)`  [EXTRACTED]
  CLAUDE.md → README.md
- `Project CLAUDE.md (Codebase Guidance)` --references--> `Wake-on-LAN Desktop App`  [EXTRACTED]
  CLAUDE.md → README.md
- `parse_mac_address()` --references--> `MacAddressError`  [EXTRACTED]
  src-tauri/src/lib.rs → src-tauri/src/errors.rs

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Full Extraction Pipeline (AST + Semantic + Merge)** — graphify_ast_extraction, graphify_semantic_extraction, graphify_community_detection [EXTRACTED 1.00]
- **WoL App Core Data Concepts** — readme_device_interface, readme_device_storage, readme_magic_packet, readme_tauri_commands [INFERRED 0.85]
- **CI Quality Gate (all checks on PR to main)** — ci_format_check, ci_clippy, ci_rust_test, ci_frontend_test, ci_build_linux [EXTRACTED 1.00]

## Communities (54 total, 22 thin omitted)

### Community 0 - "Desktop Capability Schema"
Cohesion: 0.12
Nodes (46): AppHandle, Default, Option, Path, Result, Self, AppSettings, create_magic_packet() (+38 more)

### Community 1 - "macOS Capability Schema"
Cohesion: 0.06
Nodes (35): graphify, AST Structural Extraction (Part A), BFS/DFS Graph Traversal, Cluster-Only Rerun, Graph Community Detection, Cross-Repo Graph Merge, Graphify Honesty Rules, Incremental Update (--update) (+27 more)

### Community 2 - "Rust Backend Core"
Cohesion: 0.07
Nodes (40): boot(), collectProps(), compileAttr(), compileTemplate(), createComponentFactory(), createExternalModules(), createHelmetManager(), createPseudoSheet() (+32 more)

### Community 3 - "Graphify Knowledge Graph"
Cohesion: 0.04
Nodes (49): description, properties, required, type, description, properties, required, type (+41 more)

### Community 4 - "Frontend Dependencies"
Cohesion: 0.33
Nodes (6): Display, Formatter, From, MacAddressError, NetworkError, WolError

### Community 5 - "Dev Toolchain"
Cohesion: 0.06
Nodes (35): anyOf, anyOf, description, description, required, type, description, properties (+27 more)

### Community 6 - "Desktop Schema Types"
Cohesion: 0.06
Nodes (33): dependencies, react, react-dom, @tauri-apps/api, @tauri-apps/plugin-dialog, @tauri-apps/plugin-opener, devDependencies, eslint (+25 more)

### Community 7 - "macOS Schema Types"
Cohesion: 0.24
Nodes (9): Tauri Build Helper Composite Action, CD Release macOS Job, CI Build + Package Linux Job, CI Clippy Job, CI Format Check Job, CI Frontend Test Job (with Codecov), CI Rust Test Job, CD Workflow (Manual Release) (+1 more)

### Community 8 - "Tauri App Config"
Cohesion: 0.06
Nodes (34): properties, default, description, type, type, $ref, type, default (+26 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.18
Nodes (15): Project CLAUDE.md (Codebase Guidance), index.html Entry Point, API Reference, `delete_device`, Device Interface, Device Persistent Storage (JSON), Error Handling, `load_devices` (+7 more)

### Community 10 - "Desktop Remote Capability"
Cohesion: 0.08
Nodes (24): Building, CI/CD Pipeline, Contributing, Data Storage, Development, Features, homelab-wol-desktop, IDE Setup (+16 more)

### Community 11 - "macOS Remote Capability"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 12 - "CI/CD Pipeline"
Cohesion: 0.11
Nodes (10): AppSettings, DEFAULT_SETTINGS, Device, DeviceStatus, LogEntry, Screen, DEFAULT_TAURI_SETTINGS, TauriSettings (+2 more)

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (20): anyOf, anyOf, description, definitions, Application, Number, PermissionEntry, Target (+12 more)

### Community 44 - "Community 44"
Cohesion: 0.10
Nodes (19): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+11 more)

### Community 45 - "Community 45"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+10 more)

### Community 46 - "Community 46"
Cohesion: 0.17
Nodes (12): scripts, build, dev, format, format:check, lint, lint:fix, preview (+4 more)

### Community 47 - "Community 47"
Cohesion: 0.18
Nodes (10): Graphify MCP Server, Wiki Export (--wiki), graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag) (+2 more)

### Community 48 - "Community 48"
Cohesion: 0.22
Nodes (7): Architecture Notes, Build & Test, CI Pipeline, Code Style, Dev Workflow, graphify, Project Overview

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (8): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (7): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, include

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 52 - "Community 52"
Cohesion: 0.40
Nodes (4): About the design files, Bundle contents, CODING AGENTS: READ THIS FIRST, What you should do — IMPORTANT

## Knowledge Gaps
- **291 isolated node(s):** `semi`, `singleQuote`, `tabWidth`, `trailingComma`, `printWidth` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project CLAUDE.md (Codebase Guidance)` connect `TypeScript Config` to `macOS Capability Schema`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `homelab-wol-desktop` connect `Desktop Remote Capability` to `TypeScript Config`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `tabWidth` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Desktop Capability Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.11529411764705882 - nodes in this community are weakly interconnected._
- **Should `macOS Capability Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.05537098560354374 - nodes in this community are weakly interconnected._
- **Should `Rust Backend Core` be split into smaller, more focused modules?**
  _Cohesion score 0.06918238993710692 - nodes in this community are weakly interconnected._
- **Should `Graphify Knowledge Graph` be split into smaller, more focused modules?**
  _Cohesion score 0.04251700680272109 - nodes in this community are weakly interconnected._