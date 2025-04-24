import { describe, it } from "node:test";
import SCHEDULE_JSON from "../schedule.json" with { type: "json" };
import later from "@breejs/later";
import { strictEqual, ok } from "node:assert";

describe("Schedule", () => {
  const scheduleTexts = Object.entries(SCHEDULE_JSON).map(([name, config]) => [
    name,
    config.schedule,
  ]);

  scheduleTexts.forEach(([name, scheduleText]) => {
    describe(`"${name}" schedule`, () => {
      const parsedSchedule = later.parse.text(scheduleText);

      // https://github.com/renovatebot/renovate/blob/32.241.11/lib/workers/repository/update/branch/schedule.ts#L55-L59
      it(`should be error-free when parsing it with later tool`, () => {
        const errorIndex = parsedSchedule.error;
        strictEqual(
          errorIndex,
          -1,
          `Error found when parsing schedule at position ${errorIndex}: '${aroundText(scheduleText, errorIndex)}'`,
        );
      });

      // https://docs.renovatebot.com/known-limitations/#the-mend-renovate-app-and-scheduled-jobs
      // Otherwise it won't almost ever run. Because Renovate Mend App checks from time to time if it needs to run.
      // If the schedule is for a specific second, in order for Renovate to run, it should check if it should run at
      // that specific second. So pragmatically very difficult. Using after/before (`t_a`/`t_b`) should be used instead.
      // https://github.com/renovatebot/renovate/blob/32.241.11/lib/workers/repository/update/branch/schedule.ts#L64-L68
      it("should not define a specific time", () => {
        parsedSchedule.schedules.forEach((schedule, index) => {
          ok(
            // https://breejs.github.io/later/time-periods.html#time
            !Object.keys(schedule).includes("t"),
            `Schedule ${index} has a specific time`,
          );
        });
      });
    });
  });

  describe("first weekend month day schedule", () => {
    const fifteenthOfFebruary2025 = Date.parse("2025-02-15T00:00:00.000Z");
    const MORNING_TIME = "09:00:00.000";
    const MIDNIGHT_TIME = "00:00:00.000";
    const nextRanges = later
      .schedule(
        later.parse.text(SCHEDULE_JSON["first-weekend-month-day"].schedule),
      )
      .nextRange(3, fifteenthOfFebruary2025);
    const [saturdayRange, sundayRange, nextRange] = nextRanges;

    it("should start on first saturday of the month's morning until midnight", () => {
      const [saturdayRangeStart, saturdayRangeEnd] = saturdayRange;
      strictEqual(
        saturdayRangeStart.toISOString(),
        `2025-03-01T${MORNING_TIME}Z`,
        "Start date is wrong",
      );
      strictEqual(
        saturdayRangeEnd.toISOString(),
        `2025-03-02T${MIDNIGHT_TIME}Z`,
        "End date is wrong",
      );
    });

    it("should continue on first sunday of the month's morning until midnight", () => {
      const [sundayRangeStart, sundayRangeEnd] = sundayRange;
      strictEqual(
        sundayRangeStart.toISOString(),
        `2025-03-02T${MORNING_TIME}Z`,
        "Start date is wrong",
      );
      strictEqual(
        sundayRangeEnd.toISOString(),
        `2025-03-03T${MIDNIGHT_TIME}Z`,
        "End date is wrong",
      );
    });

    it("should not repeat until next month's saturday", () => {
      const [nextRangeStart] = nextRange;
      strictEqual(
        nextRangeStart.toISOString(),
        `2025-04-05T${MORNING_TIME}Z`,
        "Next range start is wrong",
      );
    });
  });
});

const CHARS_AROUND = 5;
const aroundText = (text, position) => {
  const start = Math.max(0, position - CHARS_AROUND);
  const end = Math.min(text.length, position + CHARS_AROUND + 1);
  const before = text.slice(start, position);
  const char = text[position];
  const after = text.slice(position + 1, end);
  return `${before}[${char}]${after}`;
};
