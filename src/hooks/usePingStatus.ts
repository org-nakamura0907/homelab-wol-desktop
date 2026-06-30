import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Device, DeviceStatus } from "../types/device";

/** デバイス MAC をキーに、ping のステータス・往復時間・最終応答時刻を管理する。 */
export function usePingStatus() {
  const [statuses, setStatuses] = useState<Record<string, DeviceStatus>>({});
  const [pingMs, setPingMs] = useState<Record<string, number | null>>({});
  const [lastSeen, setLastSeen] = useState<Record<string, Date | null>>({});

  const pingDevice = useCallback(async (device: Device): Promise<boolean> => {
    if (!device.ip) {
      setStatuses((prev) => ({ ...prev, [device.mac]: "unknown" }));
      return false;
    }
    try {
      const ms = await invoke<number>("ping_device", { ip: device.ip });
      setStatuses((prev) => ({ ...prev, [device.mac]: "online" }));
      setPingMs((prev) => ({ ...prev, [device.mac]: ms }));
      setLastSeen((prev) => ({ ...prev, [device.mac]: new Date() }));
      return true;
    } catch {
      setStatuses((prev) => ({ ...prev, [device.mac]: "offline" }));
      return false;
    }
  }, []);

  function setWaking(mac: string) {
    setStatuses((prev) => ({ ...prev, [mac]: "waking" }));
  }

  function clearStatus(mac: string) {
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[mac];
      return next;
    });
  }

  /**
   * デバイスが "waking" 状態の場合のみクリアする。
   * setTimeout のクロージャから呼ばれることを想定しており、関数型 updater で常に
   * 最新の `statuses` を参照することで stale-closure を回避する。
   */
  function clearStatusIfWaking(mac: string) {
    setStatuses((prev) => {
      if (prev[mac] !== "waking") return prev;
      const next = { ...prev };
      delete next[mac];
      return next;
    });
  }

  return { statuses, pingMs, lastSeen, pingDevice, setWaking, clearStatus, clearStatusIfWaking };
}
