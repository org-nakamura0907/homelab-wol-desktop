import { AppSettings, TauriSettings } from "../types/settings";

/** Rust 側の snake_case 設定をフロントエンドの camelCase に変換する。 */
export function fromTauri(s: TauriSettings): AppSettings {
  return {
    broadcastAddr: s.broadcast_addr,
    udpPort: s.udp_port,
    repeatCount: s.repeat_count,
    confirmOnWake: s.confirm_on_wake,
    notifyOnSuccess: s.notify_on_success,
    autoPing: s.auto_ping,
    logActivity: s.log_activity,
  };
}

/** フロントエンドの camelCase 設定を Rust 側の snake_case に変換する。 */
export function toTauri(s: AppSettings): TauriSettings {
  return {
    broadcast_addr: s.broadcastAddr,
    udp_port: s.udpPort,
    repeat_count: s.repeatCount,
    confirm_on_wake: s.confirmOnWake,
    notify_on_success: s.notifyOnSuccess,
    auto_ping: s.autoPing,
    log_activity: s.logActivity,
  };
}
