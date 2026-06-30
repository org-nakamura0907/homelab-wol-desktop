import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Device } from "../types/device";

/** デバイス一覧の状態管理と Tauri の CRUD コマンド呼び出しを担当する。 */
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);

  async function loadDevices(): Promise<Device[]> {
    const devs = await invoke<Device[]>("load_devices");
    setDevices(devs);
    return devs;
  }

  async function addDevice(device: Device): Promise<void> {
    const next = [...devices, device];
    await invoke("save_devices", { devices: next });
    setDevices(next);
  }

  async function updateDevice(index: number, device: Device): Promise<void> {
    await invoke("update_device", { index, device });
    const next = [...devices];
    next[index] = device;
    setDevices(next);
  }

  async function deleteDevice(index: number): Promise<void> {
    await invoke("delete_device", { index });
    setDevices((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveDevices(updated: Device[]): Promise<void> {
    await invoke("save_devices", { devices: updated });
    setDevices(updated);
  }

  return { devices, loadDevices, addDevice, updateDevice, deleteDevice, saveDevices };
}
