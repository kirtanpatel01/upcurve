import {
  parseISO,
  isToday,
  isYesterday,
  isWithinInterval,
  subDays,
} from "date-fns";
import { HabitHistory } from "./types";

export function filterHabitsByRange(
  habits: HabitHistory[],
  range: "today" | "yesterday" | "lastWeek" | "lastMonth"
) {
  const now = new Date();

  return habits.filter((habit) => {
    if (!habit.created_at) return false;
    const date = parseISO(habit.created_at);

    switch (range) {
      case "today":
        return isToday(date);
      case "yesterday":
        return isYesterday(date);
      case "lastWeek":
        return isWithinInterval(date, {
          start: subDays(now, 6),
          end: now,
        });
      case "lastMonth":
        return isWithinInterval(date, {
          start: subDays(now, 29),
          end: now,
        });
      default:
        return true;
    }
  });
}
