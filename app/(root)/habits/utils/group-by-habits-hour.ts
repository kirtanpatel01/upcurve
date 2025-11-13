import { parseISO, getHours } from "date-fns";
import { HabitHistory } from "./types";

export function groupHabitsByHour(habits: HabitHistory[]) {
  const counts: Record<number, number> = {};

  for (const habit of habits) {
    if (!habit.created_at) continue;
    const date = parseISO(habit.created_at);
    const hour = getHours(date)
    const value = Number(habit.completed_habits || 0);
    counts[hour] = (counts[hour] || 0) + value;
  }

  return Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: counts[h] || 0,
  }));
}
