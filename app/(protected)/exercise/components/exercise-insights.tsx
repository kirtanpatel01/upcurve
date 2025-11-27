"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Exercise, ExerciseLog } from "../types";
import { useExerciseStore } from "../store";

export default function ExerciseInsights({
  initialLogs,
}: {
  initialLogs: ExerciseLog[];
}) {
  const { selectedExercise } = useExerciseStore();

  const logs = useMemo(() => {
    if (!selectedExercise) return [];
    return initialLogs.filter(
      (log) => log.exercise_id === selectedExercise.id
    );
  }, [initialLogs, selectedExercise]);

  if (!selectedExercise) {
    return (
      <Card className="max-w-72 w-full h-fit p-6 text-center text-muted-foreground">
        Select an exercise to see insights.
      </Card>
    );
  }

  const type = selectedExercise.type;

  const totalVolume = logs.reduce(
    (sum, log) => sum + log.values.reduce((a, b) => a + b, 0),
    0
  );

  const bestDay = logs
    .map((log) => ({
      date: log.created_at.slice(0, 10),
      volume: log.values.reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.volume - a.volume)[0];

  const today = new Date().toISOString().slice(0, 10);
  const todayVolume =
    logs
      .filter((log) => log.created_at.slice(0, 10) === today)
      .reduce((s, log) => s + log.values.reduce((a, b) => a + b, 0), 0) || 0;

  function formatSeconds(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  return (
    <Card className="max-w-72 w-full h-fit">
      <CardHeader>
        <CardTitle>{selectedExercise.name} Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Today's Volume:</span>
            <span className="font-medium">
              {type === "duration" ? formatSeconds(todayVolume) : todayVolume}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Volume:</span>
            <span className="font-medium">
              {type === "duration"
                ? formatSeconds(totalVolume)
                : totalVolume}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Best Day:</span>
            <span className="font-medium">
              {bestDay
                ? `${bestDay.date} (${type === "duration" ? formatSeconds(bestDay.volume) : bestDay.volume})`
                : "No data"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
