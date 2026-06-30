import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppSettings, TauriSettings, DEFAULT_SETTINGS } from "../types/settings";
import { fromTauri, toTauri } from "../lib/tauriBridge";

/** アプリ設定の状態管理と Tauri 経由のロード／保存を担当する。 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [settingsForm, setSettingsForm] = useState<AppSettings>(DEFAULT_SETTINGS);

  async function loadSettings(): Promise<AppSettings> {
    const raw = await invoke<TauriSettings>("load_settings");
    const parsed = fromTauri(raw);
    setSettings(parsed);
    setSettingsForm(parsed);
    return parsed;
  }

  async function saveSettings(): Promise<void> {
    await invoke("save_settings", { settings: toTauri(settingsForm) });
    setSettings(settingsForm);
  }

  return { settings, settingsForm, setSettingsForm, loadSettings, saveSettings };
}
