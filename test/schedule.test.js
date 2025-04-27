import { describe, it } from "node:test";
import SCHEDULE_JSON from "../schedule.json" with { type: "json" };
import { parseCron } from "@cheap-glitch/mi-cron";
import { notStrictEqual, ok } from "node:assert";

describe("Schedule", () => {
  const scheduleTexts = Object.entries(SCHEDULE_JSON).map(([name, config]) => [
    name,
    config.schedule,
  ]);

  scheduleTexts.forEach(([name, scheduleText]) => {
    describe(`"${name}" schedule`, () => {
      const parsedSchedule = parseCron(scheduleText);

      // https://github.com/renovatebot/renovate/blob/32.241.11/lib/workers/repository/update/branch/schedule.ts#L36-L48
      it(`should be a valid cron with no minute specificity`, () => {
        notStrictEqual(parsedSchedule, undefined, "Schedule cannot be parsed");
        ok(
          parsedSchedule.minutes === 60 || scheduleText.indexOf("*") === 0,
          "Cron should not specify a minute",
        );
      });
    });
  });
});
