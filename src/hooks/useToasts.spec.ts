import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToasts } from "./useToasts";

describe("useToasts", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("adds a toast with the given message and type", () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast("Saved", "success"));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Saved");
    expect(result.current.toasts[0].type).toBe("success");
  });

  it("marks toast as removing after 3s", () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast("Temp", "info"));
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].removing).toBe(true);
  });

  it("removes toast from state after 3.2s", () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast("Temp", "info"));
    act(() => vi.advanceTimersByTime(3200));
    expect(result.current.toasts).toHaveLength(0);
  });

  it("does not start removing before 3s", () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast("Hello", "error"));
    act(() => vi.advanceTimersByTime(2999));
    expect(result.current.toasts[0].removing).toBeFalsy();
  });

  it("dismisses only the specific toast, not others", () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast("First", "success"));
    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.addToast("Second", "info"));
    // First toast hits 3200ms total, Second toast is only 2200ms old
    act(() => vi.advanceTimersByTime(2200));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Second");
  });

  it("assigns unique IDs to each toast", () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      result.current.addToast("A", "success");
      result.current.addToast("B", "error");
    });
    const ids = result.current.toasts.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });
});
