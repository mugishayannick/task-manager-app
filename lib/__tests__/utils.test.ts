import { cn, formatDate, getPriorityLabel, getStatusLabel } from "../utils";

describe("cn utility", () => {
  it("merges class names", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toBe("base extra");
  });

  it("resolves tailwind conflicts", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("formatDate", () => {
  it("returns formatted date for future dates", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);
    const result = formatDate(futureDate.toISOString());
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles string input", () => {
    const result = formatDate("2026-06-15");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles Date object input", () => {
    const result = formatDate(new Date("2026-06-15"));
    expect(typeof result).toBe("string");
  });
});

describe("getPriorityLabel", () => {
  it("returns correct label for low priority", () => {
    expect(getPriorityLabel("low")).toBe("Low Priority");
  });

  it("returns correct label for medium priority", () => {
    expect(getPriorityLabel("medium")).toBe("Medium Priority");
  });

  it("returns correct label for high priority", () => {
    expect(getPriorityLabel("high")).toBe("High Priority");
  });

  it("returns correct label for urgent priority", () => {
    expect(getPriorityLabel("urgent")).toBe("Urgent");
  });

  it("returns the input for unknown priority", () => {
    expect(getPriorityLabel("custom")).toBe("custom");
  });
});

describe("getStatusLabel", () => {
  it("returns correct label for todo", () => {
    expect(getStatusLabel("todo")).toBe("To-do");
  });

  it("returns correct label for in_progress", () => {
    expect(getStatusLabel("in_progress")).toBe("In Progress");
  });

  it("returns correct label for need_review", () => {
    expect(getStatusLabel("need_review")).toBe("Need Review");
  });

  it("returns correct label for done", () => {
    expect(getStatusLabel("done")).toBe("Done");
  });

  it("returns the input for unknown status", () => {
    expect(getStatusLabel("unknown")).toBe("unknown");
  });
});
