/** 一時的な通知。2.9秒で自動的に消える。 */
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

/** `logActivity` が有効なときに記録されるアクティビティログのエントリ。 */
export interface LogEntry {
  id: string;
  ts: Date;
  message: string;
  level: "info" | "success" | "error";
}

/** トップレベルのナビゲーション画面。 */
export type Screen = "devices" | "activity" | "settings";

/** デバイス一覧の表示モード。 */
export type ViewMode = "grid" | "list";
