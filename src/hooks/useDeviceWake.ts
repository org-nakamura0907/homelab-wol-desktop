import { useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { Device } from "../types/device";
import { AppSettings } from "../types/settings";

interface Deps {
  settings: AppSettings;
  pingDevice: (device: Device) => Promise<boolean>;
  setWaking: (mac: string) => void;
  clearStatus: (mac: string) => void;
  clearStatusIfWaking: (mac: string) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
  addLog: (message: string, level: "info" | "success" | "error") => void;
}

/**
 * WoL マジックパケット送信と、送信後のポーリング／タイムアウトのライフサイクルを管理する。
 * `pollTimerRef` をフック内に閉じ込めることで、DevicesScreen はレンダリングに集中できる。
 */
export function useDeviceWake({
  settings,
  pingDevice,
  setWaking,
  clearStatus,
  clearStatusIfWaking,
  addToast,
  addLog,
}: Deps) {
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  async function wakeDevice(device: Device): Promise<void> {
    if (settings.confirmOnWake && !(await confirm(`Send WoL packet to ${device.name}?`))) return;

    setWaking(device.mac);

    try {
      await invoke("send_magic_packet", {
        macAddress: device.mac,
        broadcastAddr: settings.broadcastAddr,
        udpPort: settings.udpPort,
        repeatCount: settings.repeatCount,
      });
      if (settings.notifyOnSuccess) addToast(`WoL packet sent to ${device.name}`, "success");
      if (settings.logActivity)
        addLog(`WoL packet sent to ${device.name} (${device.mac})`, "success");

      if (device.ip) {
        // IP がある場合: 5秒間隔で最大12回(=60秒)pingし、起動を検知次第ポーリング停止
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        let attempts = 0;
        pollTimerRef.current = setInterval(async () => {
          attempts++;
          const online = await pingDevice(device);
          if (online || attempts >= 12) {
            clearInterval(pollTimerRef.current!);
            pollTimerRef.current = null;
          }
        }, 5000);
      } else {
        // IP がない場合: ping で確認できないため、10秒後にフォールバックで waking 状態を解除
        setTimeout(() => {
          clearStatusIfWaking(device.mac);
        }, 10000);
      }
    } catch (e) {
      addToast(`Failed to wake ${device.name}: ${e}`, "error");
      if (settings.logActivity) addLog(`Failed to wake ${device.name}: ${e}`, "error");
      clearStatus(device.mac);
    }
  }

  return { wakeDevice };
}
