import { parseISO, isValid } from "date-fns";
import { Todo } from "./types";

const priorityMap: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

export function sortTodos(todos: Todo[] | undefined, sortBy: string) {
  if (!todos) return [];

  const now = new Date();

  const getDeadlineHours = (deadline?: string | null) => {
    if (!deadline) return null;
    const parsed = parseISO(deadline);
    if (!isValid(parsed)) return null;
    return (parsed.getTime() - now.getTime()) / (1000 * 60 * 60);
  };

  const getPriorityValue = (priority?: string | null) =>
    priority ? priorityMap[priority.toLowerCase()] ?? 0 : 0;

  const sortByDeadlineSoonest = (a: Todo, b: Todo) => {
    const aDiff = getDeadlineHours(a.deadline);
    const bDiff = getDeadlineHours(b.deadline);
    if (aDiff === null && bDiff === null) return 0;
    if (aDiff === null) return 1;
    if (bDiff === null) return -1;
    return aDiff - bDiff;
  };

  const sortByDeadlineLatest = (a: Todo, b: Todo) => {
    const aDiff = getDeadlineHours(a.deadline);
    const bDiff = getDeadlineHours(b.deadline);
    if (aDiff === null && bDiff === null) return 0;
    if (aDiff === null) return 1;
    if (bDiff === null) return -1;
    return bDiff - aDiff;
  };

  return [...todos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return Number(b.id) - Number(a.id);
      case "oldest":
        return Number(a.id) - Number(b.id);
      case "highest": {
        const pa = getPriorityValue(a.priority);
        const pb = getPriorityValue(b.priority);
        if (pa === pb) return Number(b.id) - Number(a.id);
        return pb - pa;
      }
      case "lowest": {
        const pa = getPriorityValue(a.priority);
        const pb = getPriorityValue(b.priority);
        if (pa === pb) return Number(a.id) - Number(b.id);
        return pa - pb;
      }
      case "soonest": {
        const result = sortByDeadlineSoonest(a, b);
        return result !== 0 ? result : Number(b.id) - Number(a.id);
      }
      case "latest": {
        const result = sortByDeadlineLatest(a, b);
        return result !== 0 ? result : Number(a.id) - Number(b.id);
      }
      default:
        return 0;
    }
  });
}
