"use client";

import { useExerciseStore } from "./exercise-store-provider";
import ExerciseLogCounter from "./exercise-log-counter";
import ExerciseProgressChart from "./exercise-progress-chart";
import ExerciseKPIs from "./exercise-kpis";

import EditExerciseDialog from "./edit-exercise-dialog";

export default function ExerciseDashboard({ 
  view = "all" 
}: { 
  view?: "all" | "activity" | "insights";
}) {
  const exercises = useExerciseStore((state) => state.exercises);
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground p-8 text-center border-dashed border-2 rounded-xl">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to your tracking hub</h2>
          <p>Create your first exercise from the sidebar to start tracking your progress.</p>
        </div>
      </div>
    );
  }

  if (!selectedExercise) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground p-8 text-center">
        Select an exercise from the list above to view details.
      </div>
    );
  }

  const showHeader = view === "all";
  const showActivity = view === "all" || view === "activity";
  const showInsights = view === "all" || view === "insights";

  return (
    <div className="flex flex-col gap-3 pb-6 md:pb-0">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">{selectedExercise.name}</h2>
            <p className="text-muted-foreground">
              Track your {selectedExercise.type === "reps" ? "rep counts" : "durations"} and view history.
            </p>
          </div>
          <div className="hidden md:block">
            <EditExerciseDialog exercise={selectedExercise} />
          </div>
        </div>
      )}

      {showInsights && <ExerciseKPIs />}
      
      <div className="grid gap-3 lg:grid-cols-2 lg:items-start min-w-0">
        {showActivity && (
          <div className="min-w-0">
            <ExerciseLogCounter key={selectedExercise.id} />
          </div>
        ) }
        {showInsights && (
          <div className="min-w-0">
            <ExerciseProgressChart />
          </div>
        )}
      </div>
    </div>
  );
}
