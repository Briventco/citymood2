import { describe, expect, it } from "vitest";
import { formatArticleDate, formatLatestTime, formatMastheadDate, readingMinutes } from "./format";

describe("Lagos dates", () => {
  it("formats the masthead date in Lagos time", () => {
    // 23:30 UTC on Sunday 11 Oct is 00:30 on Monday 12 Oct in Lagos (UTC+1).
    expect(formatMastheadDate(new Date("2026-10-11T23:30:00Z"))).toBe("Monday, 12 October 2026");
  });

  it("formats bylines as 12 Oct 2026, with Sep not Sept", () => {
    expect(formatArticleDate("2026-10-12T08:00:00Z")).toBe("12 Oct 2026");
    expect(formatArticleDate("2026-09-03T08:00:00Z")).toBe("3 Sep 2026");
  });

  it("shows a time today, Yesterday, then a date in the Latest rail", () => {
    const now = new Date("2026-10-12T12:00:00Z"); // 13:00 Lagos
    expect(formatLatestTime("2026-10-12T09:42:00Z", now)).toBe("10:42");
    expect(formatLatestTime("2026-10-11T20:00:00Z", now)).toBe("Yesterday");
    expect(formatLatestTime("2026-10-09T20:00:00Z", now)).toBe("9 Oct 2026");
  });
});

describe("readingMinutes", () => {
  it("uses the stored value, else counts words", () => {
    expect(readingMinutes({ readingMinutes: 6, body: "" })).toBe(6);
    expect(readingMinutes({ body: "word ".repeat(660) })).toBe(3);
    expect(readingMinutes({ body: "short" })).toBe(1);
  });
});
