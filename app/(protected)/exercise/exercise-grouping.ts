import { Exercise, ExerciseLog } from "./types";
import { subDays, isSameDay, format } from "date-fns";

export type Range = "today" | "yesterday" | "lastWeek" | "lastMonth";

export function filterLogsByRange(logs: ExerciseLog[], range: Range) {
  const now = new Date();

  switch (range) {
    case "today":
      return logs.filter((l) => isSameDay(new Date(l.created_at), now));

    case "yesterday":
      return logs.filter((l) =>
        isSameDay(new Date(l.created_at), subDays(now, 1))
      );

    case "lastWeek":
      return logs.filter(
        (l) =>
          new Date(l.created_at) >= subDays(now, 6) &&
          new Date(l.created_at) <= now
      );

    case "lastMonth":
      return logs.filter(
        (l) =>
          new Date(l.created_at) >= subDays(now, 29) &&
          new Date(l.created_at) <= now
      );
  }
}

export function groupLogsByDay(
  logs: ExerciseLog[],
  exercises: Exercise[]
): {
  date: string;
  volume: number;
  exerciseName: string;
}[] {
  const map = new Map<string, number>();

  logs.forEach((log) => {
    const dateKey = format(new Date(log.created_at), "yyyy-MM-dd");

    const volume = log.values.reduce((a, b) => a + b, 0);

    map.set(dateKey, (map.get(dateKey) || 0) + volume);
  });

  return Array.from(map, ([date, volume]) => ({
    date,
    volume,
    exerciseName: "All Exercises",
  }));
}

export function groupLogsByDayPerExercise(
  logs: ExerciseLog[],
  exercises: Exercise[]
) {
  const map = new Map<string, number>();

  logs.forEach((log) => {
    const exercise = exercises.find((e) => e.id === log.exercise_id);
    if (!exercise) return;

    const dateKey = format(new Date(log.created_at), "yyyy-MM-dd");

    const volume = log.values.reduce((a, b) => a + b, 0);

    const combinedKey = `${exercise.name}-${dateKey}`;

    map.set(combinedKey, (map.get(combinedKey) || 0) + volume);
  });

  return Array.from(map, ([key, volume]) => {
    const [exerciseName, date] = key.split("-");
    return { date, volume, exerciseName };
  });
}
