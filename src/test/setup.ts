import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

globalThis.alert = vi.fn();
globalThis.confirm = vi.fn().mockReturnValue(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(console as any).error = vi.fn();
