/** Rust 側から返却される設定の型（snake_case）。 */
export interface TauriSettings {
  broadcast_addr: string;
  udp_port: number;
  repeat_count: number;
  confirm_on_wake: boolean;
  notify_on_success: boolean;
  auto_ping: boolean;
  log_activity: boolean;
}

/** フロントエンド全体で使用するアプリ設定（camelCase）。 */
export interface AppSettings {
  broadcastAddr: string;
  udpPort: number;
  repeatCount: number;
  confirmOnWake: boolean;
  notifyOnSuccess: boolean;
  autoPing: boolean;
  logActivity: boolean;
}

/** 初回起動時、または `settings.json` が存在しない場合に使用するデフォルト値。 */
export const DEFAULT_SETTINGS: AppSettings = {
  broadcastAddr: "255.255.255.255",
  udpPort: 9,
  repeatCount: 1,
  confirmOnWake: false,
  notifyOnSuccess: true,
  autoPing: false,
  logActivity: true,
};
