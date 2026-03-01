import { format, parseISO, eachDayOfInterval, subDays } from "date-fns";
import { Todo } from "./types";

export function groupTodosByDay(
  todos: Todo[],
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

  // Build map of counts
  const counts: Record<string, number> = {};

  for (const todo of todos) {
    if (!todo.completedAt) continue;
    const date = parseISO(todo.completedAt.toISOString());
    const day = format(date, "yyyy-MM-dd");
    counts[day] = (counts[day] || 0) + 1;
  }

  const daysInRange = eachDayOfInterval({ start, end });

  return daysInRange.map((d) => {
    const dateStr = format(d, "yyyy-MM-dd");
    return {
      date: dateStr,
      count: counts[dateStr] || 0,
    };
  });
}
