import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { usePingStatus } from "./usePingStatus";

const MAC = "AA:BB:CC:DD:EE:FF";

describe("usePingStatus", () => {
  describe("setWaking", () => {
    it("sets device status to waking", () => {
      const { result } = renderHook(() => usePingStatus());
      act(() => result.current.setWaking(MAC));
      expect(result.current.statuses[MAC]).toBe("waking");
    });
  });

  describe("clearStatus", () => {
    it("removes status unconditionally", () => {
      const { result } = renderHook(() => usePingStatus());
      act(() => result.current.setWaking(MAC));
      act(() => result.current.clearStatus(MAC));
      expect(result.current.statuses[MAC]).toBeUndefined();
    });
  });

  describe("clearStatusIfWaking", () => {
    it("clears status when device is waking", () => {
      const { result } = renderHook(() => usePingStatus());
      act(() => result.current.setWaking(MAC));
      act(() => result.current.clearStatusIfWaking(MAC));
      expect(result.current.statuses[MAC]).toBeUndefined();
    });

    it("does NOT clear status when device is online — B1 regression guard", async () => {
      // Simulate: waking → ping succeeds → online, then 10s timer fires clearStatusIfWaking
      vi.mocked(invoke).mockResolvedValue(42); // ping_device returns RTT ms
      const { result } = renderHook(() => usePingStatus());

      act(() => result.current.setWaking(MAC));
      await act(() => result.current.pingDevice({ name: "Server", mac: MAC, ip: "192.168.1.1" }));

      expect(result.current.statuses[MAC]).toBe("online");

      // Timer fires — must NOT clear the now-online status
      act(() => result.current.clearStatusIfWaking(MAC));
      expect(result.current.statuses[MAC]).toBe("online");
    });

    it("does NOT clear status when device is absent/offline", () => {
      const { result } = renderHook(() => usePingStatus());
      act(() => result.current.clearStatusIfWaking(MAC));
      expect(result.current.statuses[MAC]).toBeUndefined();
    });

    it("is a no-op for an unknown MAC", () => {
      const { result } = renderHook(() => usePingStatus());
      expect(() =>
        act(() => result.current.clearStatusIfWaking("FF:FF:FF:FF:FF:FF"))
      ).not.toThrow();
    });

    it("does not affect a different device's waking status", () => {
      const OTHER = "11:22:33:44:55:66";
      const { result } = renderHook(() => usePingStatus());
      act(() => result.current.setWaking(MAC));
      act(() => result.current.clearStatusIfWaking(OTHER));
      expect(result.current.statuses[MAC]).toBe("waking");
    });
  });
});
