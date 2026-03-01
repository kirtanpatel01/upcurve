import {
  parseISO,
  isToday,
  isYesterday,
  isWithinInterval,
  subDays,
} from "date-fns";
import { Todo } from "./types";

export function filterTodosByRange(todos: Todo[], range: "today" | "yesterday" | "lastWeek" | "lastMonth") {
  const now = new Date();

  return todos.filter((todo) => {
    if (!todo.completedAt) return false;
    const date = parseISO(todo.completedAt.toISOString());

    switch (range) {
      case "today":
        return isToday(date);
      case "yesterday":
        return isYesterday(date);
      case "lastWeek":
        return isWithinInterval(date, {
          start: subDays(now, 6), // last 7 days including today
          end: now,
        });
      case "lastMonth":
        return isWithinInterval(date, {
          start: subDays(now, 29), // last 30 days
          end: now,
        });
      default:
        return true;
    }
  });
}
