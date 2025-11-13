import { format, parseISO, eachDayOfInterval, subDays } from "date-fns";
import { HabitHistory } from "./types";

export function groupHabitsByDay(
  habitHistory: HabitHistory[],
  range: "today" | "yesterday" | "lastWeek" | "lastMonth"
) {
  const now = new Date();

  let start: Date;
  let end: Date = now;

  switch (range) {
    case "today":
      start = now;
      break;

    case "yesterday":
      start = subDays(now, 1);
      end = subDays(now, 1);
      break;

    case "lastWeek":
      start = subDays(now, 6);
      break;

    case "lastMonth":
      start = subDays(now, 29);
      break;

    default:
      start = now;
  }

  const counts: Record<string, number> = {};

  for (const habit of habitHistory) {
    if (!habit.created_at) continue;

    const date = parseISO(habit.created_at);
    const day = format(date, "yyyy-MM-dd");

    const value = Number(habit.completed_habits || 0);
    counts[day] = (counts[day] || 0) + value;
  }
  const daysInRange = eachDayOfInterval({ start, end });

  return daysInRange.map((d) => {
    const dateStr = format(d, "yyyy-MM-dd");
    return { date: dateStr, count: counts[dateStr] || 0 };
  });
}
