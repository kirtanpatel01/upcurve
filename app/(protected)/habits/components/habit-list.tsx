"use client";

import { format } from "date-fns";
import { useHabitStore, Habit, Execution } from "../store";
import HabitItem from "./habit-item";
import AddHabit from "./add-habit";

export default function HabitList({
  initialHabits,
  initialExecutions,
}: {
  initialHabits: Habit[];
  initialExecutions: Execution[];
}) {
  // Store is now globally initialized by HabitStoreProvider, so we can unconditionally use state
  const isInitialized = useHabitStore((state) => state.isInitialized);
  const activeHabits = useHabitStore((state) => state.activeHabits);
  const executions = useHabitStore((state) => state.executions);

  // Use initial props during SSR and first hydration render, switch to store state afterwards
  const activeCount = isInitialized ? activeHabits.length : initialHabits.length;
  const completedCount = isInitialized 
    ? activeHabits.filter((h) => executions.find((e) => e.habitId === h.id && e.completed === true)).length
    : initialHabits.filter((h) => initialExecutions.find((e) => e.habitId === h.id && e.completed === true)).length;

  const displayHabits = isInitialized ? activeHabits : initialHabits;

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col space-y-1 bg-primary text-primary-foreground px-3 py-2 rounded-md">
        <h2 className="text-lg font-semibold">
          Today, {format(new Date(), "MMM d")}
        </h2>
        <p className="text-muted-foreground">
          {completedCount} of {activeCount} habits completed
        </p>
      </div>

      <div className="space-y-2">
        {displayHabits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
        <AddHabit />
      </div>
    </div>
  );
}