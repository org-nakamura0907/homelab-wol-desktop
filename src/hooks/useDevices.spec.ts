import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { useDevices } from "./useDevices";
import { Device } from "../types/device";

const device1: Device = { name: "PC", mac: "AA:BB:CC:DD:EE:FF" };
const device2: Device = { name: "NAS", mac: "11:22:33:44:55:66" };

describe("useDevices", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("loadDevices", () => {
    it("fetches from Tauri and updates state", async () => {
      vi.mocked(invoke).mockResolvedValue([device1, device2]);
      const { result } = renderHook(() => useDevices());
      await act(() => result.current.loadDevices());
      expect(result.current.devices).toEqual([device1, device2]);
    });

    it("returns the loaded devices", async () => {
      vi.mocked(invoke).mockResolvedValue([device1]);
      const { result } = renderHook(() => useDevices());
      const returned = await act(() => result.current.loadDevices());
      expect(returned).toEqual([device1]);
    });
  });

  describe("addDevice", () => {
    it("appends device to state and calls save_devices", async () => {
      vi.mocked(invoke).mockResolvedValueOnce([device1]).mockResolvedValue(undefined);
      const { result } = renderHook(() => useDevices());
      await act(() => result.current.loadDevices());
      await act(() => result.current.addDevice(device2));
      expect(result.current.devices).toEqual([device1, device2]);
      expect(invoke).toHaveBeenCalledWith("save_devices", { devices: [device1, device2] });
    });
  });

  describe("updateDevice", () => {
    it("replaces device at the given index", async () => {
      vi.mocked(invoke).mockResolvedValueOnce([device1, device2]).mockResolvedValue(undefined);
      const { result } = renderHook(() => useDevices());
      await act(() => result.current.loadDevices());
      const updated: Device = { name: "Updated PC", mac: "AA:BB:CC:DD:EE:FF" };
      await act(() => result.current.updateDevice(0, updated));
      expect(result.current.devices[0]).toEqual(updated);
      expect(result.current.devices[1]).toEqual(device2);
    });
  });

  describe("deleteDevice", () => {
    it("removes device at the given index", async () => {
      vi.mocked(invoke).mockResolvedValueOnce([device1, device2]).mockResolvedValue(undefined);
      const { result } = renderHook(() => useDevices());
      await act(() => result.current.loadDevices());
      await act(() => result.current.deleteDevice(0));
      expect(result.current.devices).toEqual([device2]);
    });
  });

  describe("saveDevices", () => {
    it("replaces all devices and calls save_devices", async () => {
      vi.mocked(invoke).mockResolvedValue(undefined);
      const { result } = renderHook(() => useDevices());
      await act(() => result.current.saveDevices([device1, device2]));
      expect(result.current.devices).toEqual([device1, device2]);
      expect(invoke).toHaveBeenCalledWith("save_devices", { devices: [device1, device2] });
    });
  });
});
