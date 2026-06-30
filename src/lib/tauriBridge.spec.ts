import { describe, it, expect } from "vitest";
import { fromTauri, toTauri } from "./tauriBridge";
import { TauriSettings } from "../types/settings";

const tauriSettings: TauriSettings = {
  broadcast_addr: "192.168.1.255",
  udp_port: 7,
  repeat_count: 3,
  confirm_on_wake: true,
  notify_on_success: false,
  auto_ping: true,
  log_activity: false,
};

describe("fromTauri", () => {
  it("converts all snake_case fields to camelCase", () => {
    const result = fromTauri(tauriSettings);
    expect(result.broadcastAddr).toBe("192.168.1.255");
    expect(result.udpPort).toBe(7);
    expect(result.repeatCount).toBe(3);
    expect(result.confirmOnWake).toBe(true);
    expect(result.notifyOnSuccess).toBe(false);
    expect(result.autoPing).toBe(true);
    expect(result.logActivity).toBe(false);
  });
});

describe("toTauri", () => {
  it("converts all camelCase fields to snake_case", () => {
    const result = toTauri(fromTauri(tauriSettings));
    expect(result).toEqual(tauriSettings);
  });
});

describe("roundtrip", () => {
  it("fromTauri → toTauri is lossless", () => {
    expect(toTauri(fromTauri(tauriSettings))).toEqual(tauriSettings);
  });
});
