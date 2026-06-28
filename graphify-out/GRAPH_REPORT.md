# Graph Report - .  (2026-06-28)

## Corpus Check
- Corpus is ~42,001 words - fits in a single context window. You may not need a graph.

## Summary
- 360 nodes · 387 edges · 42 communities (28 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 1,524 input · 580 output

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
- [[_COMMUNITY_Code Formatting|Code Formatting]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Node TypeScript Config|Node TypeScript Config]]
- [[_COMMUNITY_App Capabilities|App Capabilities]]
- [[_COMMUNITY_React App Components|React App Components]]
- [[_COMMUNITY_App Icon Design|App Icon Design]]
- [[_COMMUNITY_Windows Tile Icons|Windows Tile Icons]]
- [[_COMMUNITY_Retina App Icon|Retina App Icon]]
- [[_COMMUNITY_Vite Build Tool|Vite Build Tool]]
- [[_COMMUNITY_React Logo Asset|React Logo Asset]]
- [[_COMMUNITY_128px App Icon|128px App Icon]]
- [[_COMMUNITY_32px App Icon|32px App Icon]]
- [[_COMMUNITY_Win 284px Logo|Win 284px Logo]]
- [[_COMMUNITY_Win 30px Logo|Win 30px Logo]]
- [[_COMMUNITY_Win 310px Logo|Win 310px Logo]]
- [[_COMMUNITY_Win 44px Logo|Win 44px Logo]]
- [[_COMMUNITY_Win 71px Logo|Win 71px Logo]]
- [[_COMMUNITY_Win 89px Logo|Win 89px Logo]]
- [[_COMMUNITY_Windows Store Logo|Windows Store Logo]]
- [[_COMMUNITY_Tauri Logo Asset|Tauri Logo Asset]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 12 edges
3. `Graphify Skill` - 12 edges
4. `definitions` - 9 edges
5. `definitions` - 9 edges
6. `MacAddressError` - 7 edges
7. `WolError` - 7 edges
8. `save_devices()` - 6 edges
9. `load_devices()` - 6 edges
10. `parse_mac_address()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Verify Skill (Local CI Checks)` --semantically_similar_to--> `CI Format Check Job`  [INFERRED] [semantically similar]
  .claude/skills/verify/SKILL.md → .github/workflows/ci.yml
- `Project CLAUDE.md (Codebase Guidance)` --references--> `Graphify Skill`  [EXTRACTED]
  CLAUDE.md → .claude/skills/graphify/SKILL.md
- `index.html Entry Point` --implements--> `Wake-on-LAN Desktop App`  [INFERRED]
  index.html → README.md
- `Project CLAUDE.md (Codebase Guidance)` --references--> `WoL Magic Packet (102 bytes)`  [EXTRACTED]
  CLAUDE.md → README.md
- `Project CLAUDE.md (Codebase Guidance)` --references--> `Tauri Commands API`  [EXTRACTED]
  CLAUDE.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Full Extraction Pipeline (AST + Semantic + Merge)** — graphify_ast_extraction, graphify_semantic_extraction, graphify_community_detection [EXTRACTED 1.00]
- **CI Quality Gate (all checks on PR to main)** — ci_format_check, ci_clippy, ci_rust_test, ci_frontend_test, ci_build_linux [EXTRACTED 1.00]
- **WoL App Core Data Concepts** — readme_device_interface, readme_device_storage, readme_magic_packet, readme_tauri_commands [INFERRED 0.85]

## Communities (42 total, 14 thin omitted)

### Community 0 - "Desktop Capability Schema"
Cohesion: 0.07
Nodes (31): description, properties, required, type, Capability, Identifier, default, description (+23 more)

### Community 1 - "macOS Capability Schema"
Cohesion: 0.07
Nodes (31): description, properties, required, type, Capability, Identifier, default, description (+23 more)

### Community 2 - "Rust Backend Core"
Cohesion: 0.15
Nodes (22): AppHandle, Display, Formatter, From, Result, Self, MacAddressError, NetworkError (+14 more)

### Community 3 - "Graphify Knowledge Graph"
Cohesion: 0.09
Nodes (28): Project CLAUDE.md (graphify integration), AST Structural Extraction (Part A), BFS/DFS Graph Traversal, Cluster-Only Rerun, Graph Community Detection, Cross-Repo Graph Merge, Graphify Honesty Rules, Incremental Update (--update) (+20 more)

### Community 4 - "Frontend Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, react, react-dom, @tauri-apps/api, @tauri-apps/plugin-dialog, @tauri-apps/plugin-opener, name, private (+14 more)

### Community 5 - "Dev Toolchain"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, globals, jsdom, prettier (+15 more)

### Community 6 - "Desktop Schema Types"
Cohesion: 0.10
Nodes (20): anyOf, anyOf, description, definitions, Application, Number, PermissionEntry, Target (+12 more)

### Community 7 - "macOS Schema Types"
Cohesion: 0.10
Nodes (20): anyOf, anyOf, description, definitions, Application, Number, PermissionEntry, Target (+12 more)

### Community 8 - "Tauri App Config"
Cohesion: 0.10
Nodes (19): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+11 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+10 more)

### Community 10 - "Desktop Remote Capability"
Cohesion: 0.11
Nodes (18): description, properties, required, type, CapabilityRemote, type, urls, webviews (+10 more)

### Community 11 - "macOS Remote Capability"
Cohesion: 0.11
Nodes (18): description, properties, required, type, CapabilityRemote, type, urls, webviews (+10 more)

### Community 12 - "CI/CD Pipeline"
Cohesion: 0.24
Nodes (10): Tauri Build Helper Composite Action, CD Release macOS Job, CI Build + Package Linux Job, CI Clippy Job, CI Format Check Job, CI Frontend Test Job (with Codecov), CI Rust Test Job, Verify Skill (Local CI Checks) (+2 more)

### Community 13 - "Code Formatting"
Cohesion: 0.22
Nodes (8): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 14 - "Project Documentation"
Cohesion: 0.39
Nodes (8): Project CLAUDE.md (Codebase Guidance), index.html Entry Point, Device Interface, Device Persistent Storage (JSON), WoL Magic Packet (102 bytes), Project README, Tauri Commands API, Wake-on-LAN Desktop App

### Community 15 - "Node TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, include

### Community 16 - "App Capabilities"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 18 - "App Icon Design"
Cohesion: 0.67
Nodes (3): App Icon (icon.png), Visual Style: Flat Modern Two-Color Logo, Wake-on-LAN Connectivity Symbolism

### Community 19 - "Windows Tile Icons"
Cohesion: 0.67
Nodes (3): Square142x142Logo.png - App Icon (142x142), Windows UWP/Store tile icon at 142x142 pixels for Tauri desktop app, Circular interlocking arcs icon with cyan and gold/yellow color scheme

## Knowledge Gaps
- **200 isolated node(s):** `semi`, `singleQuote`, `tabWidth`, `trailingComma`, `printWidth` (+195 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `properties` connect `Desktop Capability Schema` to `Desktop Remote Capability`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `properties` connect `macOS Capability Schema` to `macOS Remote Capability`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `definitions` connect `Desktop Schema Types` to `Desktop Capability Schema`, `Desktop Remote Capability`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `tabWidth` to the rest of the system?**
  _202 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Desktop Capability Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `macOS Capability Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Graphify Knowledge Graph` be split into smaller, more focused modules?**
  _Cohesion score 0.09259259259259259 - nodes in this community are weakly interconnected._