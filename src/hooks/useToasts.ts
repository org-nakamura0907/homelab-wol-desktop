import { useState, useCallback } from "react";
import { Toast } from "../types/ui";
import { nextToastId } from "../lib/ids";

/** 一時的なトースト通知を管理する。 */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = nextToastId();
    setToasts((prev) => [...prev, { id, message, type }]);
    // 2.9秒後に該当トーストのみを取り除く（他のトーストには影響しない）
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2900);
  }, []);

  return { toasts, addToast };
}
