import { useState, useCallback } from "react";
import { LogEntry } from "../types/ui";
import { nextLogId } from "../lib/ids";

/** Activity 画面で表示するアクティビティログのエントリを管理する。 */
export function useActivityLog() {
  const [log, setLog] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, level: LogEntry["level"]) => {
    const id = nextLogId();
    setLog((prev) => [{ id, ts: new Date(), message, level }, ...prev]);
  }, []);

  const clearLog = useCallback(() => setLog([]), []);

  return { log, addLog, clearLog };
}
