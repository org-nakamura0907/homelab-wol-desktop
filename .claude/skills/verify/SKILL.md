---
name: verify
description: Run the full local CI check suite (lint, format, tests, Rust clippy/fmt) before committing. Use this to catch issues locally before pushing.
disable-model-invocation: true
---

Run each of the following checks in order. Stop and report failures immediately; do not continue to the next step if a step fails.

1. **ESLint** — `pnpm lint` (from repo root)
2. **Prettier check** — `pnpm format:check` (from repo root)
3. **Frontend tests** — `pnpm test -- --run` (from repo root)
4. **Rust format check** — `cargo fmt --check` (from `src-tauri/`)
5. **Rust clippy** — `cargo clippy -- -D warnings` (from `src-tauri/`)
6. **Rust tests** — `cargo test` (from `src-tauri/`)

After all steps pass, report a brief summary: which checks ran and that all passed.
If any step fails, show the relevant output and suggest a fix.
