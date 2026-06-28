# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tauri 2 desktop app (React + TypeScript frontend, Rust backend) for Wake-on-LAN. Devices are persisted as JSON in platform-specific app data directories.

## Dev Workflow

```bash
pnpm tauri dev   # Start the full app (Vite + Tauri) in one command
```

## Build & Test

```bash
# Frontend
pnpm build            # tsc + vite build
pnpm test -- --run    # Single Vitest run (CI mode)
pnpm test:coverage    # Coverage with 80% line/function/statement threshold, 75% branch
pnpm lint             # ESLint on src/**/*.{ts,tsx}
pnpm format:check     # Prettier check (does not modify files)
pnpm format           # Prettier write

# Rust (run from src-tauri/)
cargo test
cargo clippy -- -D warnings   # CI uses -D warnings (deny all)
cargo fmt --check
cargo fmt
```

## Code Style

**Prettier** (non-default settings):
- Print width: 100
- Trailing comma: ES5
- End of line: LF
- Arrow parens: always

**TypeScript**: strict mode, no unused locals/parameters. Prefix unused vars with `_` to suppress lint.

**Rust**: `cargo fmt` enforced in CI; `cargo clippy -D warnings` — zero warnings allowed.

## Architecture Notes

- Frontend (`src/`) communicates with Rust via Tauri commands. Frontend uses camelCase (`macAddress`); Tauri auto-converts to snake_case (`mac_address`) on the Rust side.
- All Tauri command handlers live in `src-tauri/src/lib.rs`. Error types are in `src/errors.rs`.
- MAC address format must be `XX:XX:XX:XX:XX:XX` (uppercase hex, colon-separated).
- Magic packet: 102 bytes (6x `0xFF` header + 16 repeats of the 6-byte MAC).
- Frontend tests mock all Tauri APIs and `window.alert` — see `src/test/setup.ts`.

## CI Pipeline

On push/PR to `main`: format-check (cargo fmt, ESLint, Prettier), clippy, rust-test, frontend-test with Codecov coverage upload, and a Linux Tauri build.

Release builds (macOS) are triggered manually via `workflow_dispatch`.
