import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-dialog", () => ({
  confirm: vi.fn().mockResolvedValue(true),
}));

globalThis.alert = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(console as any).error = vi.fn();
