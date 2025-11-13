import { format, parseISO, eachDayOfInterval } from "date-fns";
import { HabitHistory } from "./types";

export function groupHabitsByDay(habitHistory: HabitHistory[]) {
  const counts: Record<string, number> = {};

  for (const habit of habitHistory) {
    if (!habit.created_at) continue;

    const date = parseISO(habit.created_at);
    const day = format(date, "yyyy-MM-dd");

    const value = Number(habit.completed_habits || 0);
    counts[day] = (counts[day] || 0) + value;
  }

  const allDates = Object.keys(counts).map((d) => parseISO(d));
  if (allDates.length === 0) return [];

  const start = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const end = new Date(Math.max(...allDates.map((d) => d.getTime())));

  const daysInRange = eachDayOfInterval({ start, end });

  return daysInRange.map((d) => {
    const dateStr = format(d, "yyyy-MM-dd");
    return { date: dateStr, count: counts[dateStr] || 0 };
  });
}
