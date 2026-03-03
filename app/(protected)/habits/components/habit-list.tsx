"use client";

import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useHabitStore, Habit, Execution } from "../store";
import HabitItem from "./habit-item";
import AddHabit from "./add-habit";
import ArchivedHabits from "./archived-habits";

export default function HabitList({
  initialHabits,
  initialExecutions,
  initialArchivedHabits,
  today,
}: {
  initialHabits: Habit[];
  initialExecutions: Execution[];
  initialArchivedHabits: Habit[];
  today: string;
}) {
  const setInitialData = useHabitStore((state) => state.setInitialData);
  const isInitialized = useHabitStore((state) => state.isInitialized);
  const activeHabits = useHabitStore((state) => state.activeHabits);
  const executions = useHabitStore((state) => state.executions);

  const initializedRef = useRef(false);

  // Synchronously initialize the store first time
  if (!initializedRef.current) {
    useHabitStore.setState({
      activeHabits: initialHabits,
      archivedHabits: initialArchivedHabits,
      executions: initialExecutions,
      today,
      isInitialized: true,
    });
    initializedRef.current = true;
  }

  // Update anytime props actually change (Next.js server component refetching)
  useEffect(() => {
    setInitialData(initialHabits, initialArchivedHabits, initialExecutions, today);
  }, [initialHabits, initialArchivedHabits, initialExecutions, today, setInitialData]);

  if (!isInitialized) return null;

  const completedCount = activeHabits.filter((h) =>
    executions.find((e) => e.habitId === h.id && e.completed === true)
  ).length;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-1 mt-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Today, {format(new Date(), "MMM d")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {completedCount} of {activeHabits.length} habits completed
        </p>
      </div>

      <div className="space-y-2">
        {activeHabits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
        <AddHabit />
      </div>

      <ArchivedHabits />
    </div>
  );
}