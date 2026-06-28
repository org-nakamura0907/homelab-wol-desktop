# Graph Report - src-tauri  (2026-06-28)

## Corpus Check
- 6 files · ~3,532 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 73 nodes · 136 edges · 14 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0b77c86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `save_devices_to()` - 12 edges
2. `load_devices_from()` - 11 edges
3. `update_device_in()` - 8 edges
4. `delete_device_from()` - 8 edges
5. `MacAddressError` - 7 edges
6. `WolError` - 7 edges
7. `save_devices()` - 7 edges
8. `load_devices()` - 7 edges
9. `Device` - 6 edges
10. `parse_mac_address()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `parse_mac_address()` --references--> `MacAddressError`  [EXTRACTED]
  src/lib.rs → src/errors.rs

## Import Cycles
- None detected.

## Communities (14 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (8): Formatter, Result, create_magic_packet(), parse_mac_address(), send_magic_packet(), test_create_magic_packet_structure(), test_parse_mac_address_errors(), test_parse_mac_address_valid()

### Community 1 - "Community 1"
Cohesion: 0.46
Nodes (6): Display, From, Self, MacAddressError, NetworkError, WolError

### Community 2 - "Community 2"
Cohesion: 0.48
Nodes (5): Path, delete_device_from(), test_delete_device(), test_delete_device_no_file(), test_delete_device_out_of_range()

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (6): identifier, plugins, dialog, productName, $schema, version

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 5 - "Community 5"
Cohesion: 0.70
Nodes (5): Device, save_devices(), save_devices_to(), test_save_creates_directory(), String

### Community 6 - "Community 6"
Cohesion: 0.50
Nodes (5): load_devices(), load_devices_from(), test_load_devices_empty_when_no_file(), test_save_and_load_devices(), Vec

### Community 7 - "Community 7"
Cohesion: 0.40
Nodes (5): build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist

### Community 8 - "Community 8"
Cohesion: 0.50
Nodes (4): test_update_device(), test_update_device_no_file(), test_update_device_out_of_range(), update_device_in()

### Community 9 - "Community 9"
Cohesion: 0.50
Nodes (4): app, security, windows, csp

### Community 10 - "Community 10"
Cohesion: 0.50
Nodes (4): bundle, active, icon, targets

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (3): AppHandle, delete_device(), update_device()

## Knowledge Gaps
- **19 isolated node(s):** `$schema`, `identifier`, `description`, `windows`, `permissions` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MacAddressError` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `build` connect `Community 7` to `Community 3`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `WolError` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `identifier`, `description` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._