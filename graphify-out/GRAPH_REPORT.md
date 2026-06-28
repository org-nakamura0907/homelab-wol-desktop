# Graph Report - .  (2026-06-28)

## Corpus Check
- 89 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 195 nodes · 282 edges · 43 communities (21 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `save_devices_to()` - 12 edges
2. `Graphify Skill` - 12 edges
3. `load_devices_from()` - 11 edges
4. `_()` - 10 edges
5. `update_device_in()` - 8 edges
6. `delete_device_from()` - 8 edges
7. `save_devices()` - 7 edges
8. `load_devices()` - 7 edges
9. `MacAddressError` - 7 edges
10. `WolError` - 7 edges

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
- **WoL App Core Data Concepts** — readme_device_interface, readme_device_storage, readme_magic_packet, readme_tauri_commands [INFERRED 0.85]
- **CI Quality Gate (all checks on PR to main)** — ci_format_check, ci_clippy, ci_rust_test, ci_frontend_test, ci_build_linux [EXTRACTED 1.00]

## Communities (43 total, 22 thin omitted)

### Community 0 - "Desktop Capability Schema"
Cohesion: 0.18
Nodes (29): AppHandle, Path, Result, create_magic_packet(), delete_device(), delete_device_from(), Device, load_devices() (+21 more)

### Community 1 - "macOS Capability Schema"
Cohesion: 0.09
Nodes (28): Project CLAUDE.md (graphify integration), AST Structural Extraction (Part A), BFS/DFS Graph Traversal, Cluster-Only Rerun, Graph Community Detection, Cross-Repo Graph Merge, Graphify Honesty Rules, Incremental Update (--update) (+20 more)

### Community 2 - "Rust Backend Core"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 3 - "Graphify Knowledge Graph"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 4 - "Frontend Dependencies"
Cohesion: 0.29
Nodes (7): Display, Formatter, From, Self, MacAddressError, NetworkError, WolError

### Community 5 - "Dev Toolchain"
Cohesion: 0.27
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 6 - "Desktop Schema Types"
Cohesion: 0.27
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 7 - "macOS Schema Types"
Cohesion: 0.24
Nodes (10): Tauri Build Helper Composite Action, CD Release macOS Job, CI Build + Package Linux Job, CI Clippy Job, CI Format Check Job, CI Frontend Test Job (with Codecov), CI Rust Test Job, Verify Skill (Local CI Checks) (+2 more)

### Community 8 - "Tauri App Config"
Cohesion: 0.39
Nodes (7): _(), c(), f(), m, n(), z(), r()

### Community 9 - "TypeScript Config"
Cohesion: 0.39
Nodes (8): Project CLAUDE.md (Codebase Guidance), index.html Entry Point, Device Interface, Device Persistent Storage (JSON), WoL Magic Packet (102 bytes), Project README, Tauri Commands API, Wake-on-LAN Desktop App

### Community 10 - "Desktop Remote Capability"
Cohesion: 0.70
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 11 - "macOS Remote Capability"
Cohesion: 0.70
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

## Knowledge Gaps
- **35 isolated node(s):** `Device`, `m`, `32x32 App Icon`, `Cluster-Only Rerun`, `Square89x89Logo - App Icon (89x89px)` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graphify Skill` connect `macOS Capability Schema` to `TypeScript Config`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `MacAddressError` connect `Frontend Dependencies` to `Desktop Capability Schema`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Project CLAUDE.md (Codebase Guidance)` connect `TypeScript Config` to `macOS Capability Schema`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Device`, `m`, `32x32 App Icon` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `macOS Capability Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.09259259259259259 - nodes in this community are weakly interconnected._