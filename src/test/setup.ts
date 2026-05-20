import { vi } from "vitest";
import "@testing-library/jest-dom";

// Tauri API をモック化
vi.mock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-dialog", () => ({
    confirm: vi.fn(),
}));

// グローバルな alert をモック化
globalThis.alert = vi.fn();
// console.error をモック化してテスト時のエラーログを抑制
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(console as any).error = vi.fn();