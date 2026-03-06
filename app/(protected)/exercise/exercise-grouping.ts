import { ExerciseLog } from "./types";
import { subDays, subMonths, startOfDay } from "date-fns";

export type TimeRange = "today" | "yesterday" | "lastWeek" | "lastMonth";

export function filterLogsByRange(logs: ExerciseLog[], range: TimeRange) {
  const now = new Date();
  const start = startOfDay(now).getTime();

  return logs.filter((log) => {
    const logTime = new Date(log.createdAt).getTime();

    switch (range) {
      case "today":
        return logTime >= start;
      case "yesterday": {
        const yesterday = subDays(now, 1);
        const yStart = startOfDay(yesterday).getTime();
        return logTime >= yStart && logTime < start;
      }
      case "lastWeek":
        return logTime >= startOfDay(subDays(now, 7)).getTime();
      case "lastMonth":
        return logTime >= startOfDay(subMonths(now, 1)).getTime();
      default:
        return true;
    }
  });
}
