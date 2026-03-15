"use client";

import { format } from "date-fns";
import { useHabitStore } from "./habit-store-provider";
import HabitItem from "./habit-item";
import AddHabit from "./add-habit";

export default function HabitList() {
  const activeHabits = useHabitStore((state) => state.activeHabits);
  const executions = useHabitStore((state) => state.executions);

  const activeCount = activeHabits.length;
  const completedCount = activeHabits.filter((h) => 
    executions.find((e) => e.habitId === h.id && e.completed === true)
  ).length;

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
        {activeHabits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
        <AddHabit />
      </div>
    </div>
  );
}