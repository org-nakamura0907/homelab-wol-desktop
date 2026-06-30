import { useState, useCallback } from "react";
import { Toast } from "../types/ui";
import { nextToastId } from "../lib/ids";

const TOAST_VISIBLE_MS = 3000;
const TOAST_EXIT_MS = 200;

/** 一時的なトースト通知を管理する。 */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = nextToastId();
    setToasts((prev) => [...prev, { id, message, type }]);
    // TOAST_VISIBLE_MS 後: removing フラグを立てて退場アニメーション開始
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
      // TOAST_EXIT_MS 後: DOM から削除（他のトーストには影響しない）
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_EXIT_MS);
    }, TOAST_VISIBLE_MS);
  }, []);

  return { toasts, addToast };
}
