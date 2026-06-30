import { describe, it, expect } from "vitest";
import { fmtLastSeen } from "./format";

describe("fmtLastSeen", () => {
  it("formats date as 'Mon D, HH:MM'", () => {
    const date = new Date(2024, 0, 5, 9, 3); // Jan 5, 09:03
    const result = fmtLastSeen(date);
    expect(result).toMatch(/^Jan 5, 09:03$/);
  });

  it("uses en-US short month names for all 12 months", () => {
    const expected = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    expected.forEach((name, month) => {
      const date = new Date(2024, month, 1, 12, 0);
      expect(fmtLastSeen(date)).toContain(name);
    });
  });

  it("does not zero-pad the day", () => {
    const date = new Date(2024, 2, 3, 8, 0); // Mar 3
    expect(fmtLastSeen(date)).toContain("Mar 3,");
  });

  it("includes time in HH:MM format", () => {
    const date = new Date(2024, 5, 15, 0, 0); // 00:00
    expect(fmtLastSeen(date)).toContain("00:00");
  });
});
