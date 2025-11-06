import { format, parseISO, eachDayOfInterval } from "date-fns";
import { Todo } from "./types";

export function groupTodosByDay(todos: Todo[]) {
  const counts: Record<string, number> = {};

  for (const todo of todos) {
    if (!todo.completed_time) continue;
    const date = parseISO(todo.completed_time);
    const day = format(date, "yyyy-MM-dd");
    counts[day] = (counts[day] || 0) + 1;
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
