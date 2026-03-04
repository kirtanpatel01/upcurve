"use client";

import InsightsAreaChart from "./insights-area-chart";
import InsightsRadialChart from "./insights-radial-chart";
import { useHabitStore, Habit, Execution } from "../store";

export default function InsightsTab({
  historicalData,
  initialHabits,
  initialExecutions,
}: {
  historicalData: { date: string; count: number }[];
  initialHabits: Habit[];
  initialExecutions: Execution[];
}) {
  const isInitialized = useHabitStore((state) => state.isInitialized);
  const activeHabits = useHabitStore((state) => state.activeHabits);
  const executions = useHabitStore((state) => state.executions);

  const displayHabits = isInitialized ? activeHabits : initialHabits;
  const displayExecutions = isInitialized ? executions : initialExecutions;

  const activeCount = displayHabits.length;
  const completedCount = displayHabits.filter((h) =>
    displayExecutions.find((e) => e.habitId === h.id && e.completed === true)
  ).length;

  return (
    <div className="space-y-3">
      <InsightsRadialChart activeCount={activeCount} completedCount={completedCount} />
      <InsightsAreaChart historicalData={historicalData} />
    </div>
  );
}
