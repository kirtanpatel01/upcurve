import { parseISO, getHours } from "date-fns";
import { Todo } from "./types";

export function groupTodosByHour(todos: Todo[]) {
  const counts: Record<number, number> = {};

  for (const todo of todos) {
    if (!todo.completedAt) continue;
    const date = parseISO(todo.completedAt.toISOString());
    const hour = getHours(date);
    counts[hour] = (counts[hour] || 0) + 1;
  }

  return Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: counts[h] || 0,
  }));
}
