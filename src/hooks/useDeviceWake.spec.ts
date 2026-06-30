import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useDeviceWake } from "./useDeviceWake";
import { DEFAULT_SETTINGS } from "../types/settings";
import { Device } from "../types/device";

const deviceWithIp: Device = { name: "PC", mac: "AA:BB:CC:DD:EE:FF", ip: "192.168.1.100" };
const deviceNoIp: Device = { name: "Printer", mac: "11:22:33:44:55:66" };

describe("useDeviceWake", () => {
  let pingDevice: Mock<(device: Device) => Promise<boolean>>;
  let setWaking: Mock<(mac: string) => void>;
  let clearStatus: Mock<(mac: string) => void>;
  let clearStatusIfWaking: Mock<(mac: string) => void>;
  let addToast: Mock<(message: string, type: "success" | "error" | "info") => void>;
  let addLog: Mock<(message: string, level: "info" | "success" | "error") => void>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    pingDevice = vi.fn().mockResolvedValue(false);
    setWaking = vi.fn();
    clearStatus = vi.fn();
    clearStatusIfWaking = vi.fn();
    addToast = vi.fn();
    addLog = vi.fn();
    vi.mocked(invoke).mockResolvedValue(undefined);
    vi.mocked(confirm).mockResolvedValue(true);
  });

  afterEach(() => vi.useRealTimers());

  function setup(settingsOverrides = {}) {
    return renderHook(() =>
      useDeviceWake({
        settings: { ...DEFAULT_SETTINGS, ...settingsOverrides },
        pingDevice,
        setWaking,
        clearStatus,
        clearStatusIfWaking,
        addToast,
        addLog,
      })
    );
  }

  describe("wakeDevice", () => {
    it("sets waking state and sends magic packet", async () => {
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(setWaking).toHaveBeenCalledWith(deviceWithIp.mac);
      expect(invoke).toHaveBeenCalledWith(
        "send_magic_packet",
        expect.objectContaining({ macAddress: deviceWithIp.mac })
      );
    });

    it("shows success toast and logs on send", async () => {
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(addToast).toHaveBeenCalledWith(expect.stringContaining(deviceWithIp.name), "success");
      expect(addLog).toHaveBeenCalledWith(expect.stringContaining(deviceWithIp.name), "success");
    });

    it("does not show toast or log when notifyOnSuccess/logActivity are false", async () => {
      const { result } = setup({ notifyOnSuccess: false, logActivity: false });
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(addToast).not.toHaveBeenCalled();
      expect(addLog).not.toHaveBeenCalled();
    });

    it("aborts without sending when confirm dialog is cancelled", async () => {
      vi.mocked(confirm).mockResolvedValue(false);
      const { result } = setup({ confirmOnWake: true });
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(invoke).not.toHaveBeenCalled();
      expect(setWaking).not.toHaveBeenCalled();
    });

    it("proceeds when confirm dialog is accepted", async () => {
      vi.mocked(confirm).mockResolvedValue(true);
      const { result } = setup({ confirmOnWake: true });
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(invoke).toHaveBeenCalled();
    });

    it("shows error toast and clears status when invoke fails", async () => {
      vi.mocked(invoke).mockRejectedValue(new Error("network error"));
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(addToast).toHaveBeenCalledWith(expect.stringContaining(deviceWithIp.name), "error");
      expect(clearStatus).toHaveBeenCalledWith(deviceWithIp.mac);
    });
  });

  describe("polling (device with IP)", () => {
    it("starts polling interval at 5s intervals", async () => {
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceWithIp));
      expect(pingDevice).not.toHaveBeenCalled();
      await act(() => vi.advanceTimersByTimeAsync(5000));
      expect(pingDevice).toHaveBeenCalledTimes(1);
      await act(() => vi.advanceTimersByTimeAsync(5000));
      expect(pingDevice).toHaveBeenCalledTimes(2);
    });

    it("stops polling when device comes online", async () => {
      pingDevice.mockResolvedValueOnce(false).mockResolvedValue(true);
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceWithIp));
      await act(() => vi.advanceTimersByTimeAsync(5000)); // attempt 1: false
      await act(() => vi.advanceTimersByTimeAsync(5000)); // attempt 2: true → stop
      await act(() => vi.advanceTimersByTimeAsync(5000)); // no further calls
      expect(pingDevice).toHaveBeenCalledTimes(2);
    });

    it("stops polling after 12 attempts regardless of result", async () => {
      pingDevice.mockResolvedValue(false);
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceWithIp));
      await act(() => vi.advanceTimersByTimeAsync(5000 * 12));
      expect(pingDevice).toHaveBeenCalledTimes(12);
      await act(() => vi.advanceTimersByTimeAsync(5000));
      expect(pingDevice).toHaveBeenCalledTimes(12);
    });
  });

  describe("fallback timeout (device without IP)", () => {
    it("calls clearStatusIfWaking after 10s", async () => {
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceNoIp));
      expect(clearStatusIfWaking).not.toHaveBeenCalled();
      await act(() => vi.advanceTimersByTimeAsync(10000));
      expect(clearStatusIfWaking).toHaveBeenCalledWith(deviceNoIp.mac);
    });

    it("does not start polling when device has no IP", async () => {
      const { result } = setup();
      await act(() => result.current.wakeDevice(deviceNoIp));
      await act(() => vi.advanceTimersByTimeAsync(5000));
      expect(pingDevice).not.toHaveBeenCalled();
    });
  });
});
