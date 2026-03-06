"use client";

import { useMemo } from "react";
import { useExerciseStore } from "./exercise-store-provider";
import { filterLogsByRange } from "../exercise-grouping";
import { Activity, Trophy, CalendarDays } from "lucide-react";
import { formatSeconds } from "../utils";

export default function ExerciseKPIs() {
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const logs = useExerciseStore((state) => state.logs);

  const selectedLogs = useMemo(() => {
    if (!selectedExercise) return [];
    return logs.filter(log => log.exerciseId === selectedExercise.id);
  }, [logs, selectedExercise]);

  if (!selectedExercise) return null;

  const type = selectedExercise.type;
  
  function formatValue(val: number, type: string, unit?: string | null) {
    if (type === "reps") return val;
    return formatSeconds(val);
  }

  const todayLogs = filterLogsByRange(selectedLogs, "today");
  const todayVolume = todayLogs.reduce((acc, log) => acc + log.values.reduce((a, b) => a + b, 0), 0);
  
  const totalVolume = selectedLogs.reduce((acc, log) => acc + log.values.reduce((a, b) => a + b, 0), 0);

  // Best day logic
  const daysMap = new Map<string, number>();
  selectedLogs.forEach(log => {
    const dateStr = new Date(log.createdAt).toISOString().slice(0, 10);
    const vol = log.values.reduce((a, b) => a + b, 0);
    daysMap.set(dateStr, (daysMap.get(dateStr) || 0) + vol);
  });
  
  let bestDayVol = 0;
  daysMap.forEach(vol => {
    if (vol > bestDayVol) bestDayVol = vol;
  });

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-muted/40 border p-2 rounded-lg flex flex-col gap-2 relative overflow-hidden justify-between">
        <Activity className="absolute -bottom-4 -right-4 w-20 h-20 opacity-5" />
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Today's Volume
        </span>
        <span className="text-lg md:text-xl font-bold tracking-tight">
          {formatValue(todayVolume, selectedExercise.type, selectedExercise.durationUnit)}
        </span>
      </div>
      
      <div className="bg-muted/40 border p-2 rounded-lg flex flex-col gap-2 relative overflow-hidden justify-between">
        <CalendarDays className="absolute -bottom-3 -right-3 w-20 h-20 opacity-5" />
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Total Volume
        </span>
        <span className="text-lg md:text-xl font-bold tracking-tight">
          {formatValue(totalVolume, selectedExercise.type, selectedExercise.durationUnit)}
        </span>
      </div>
      
      <div className="bg-muted/40 border p-2 rounded-lg flex flex-col gap-2 relative overflow-hidden justify-between">
        <Trophy className="absolute -bottom-3 -right-3 w-20 h-20 opacity-5" />
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Best Day
        </span>
        <span className="text-lg md:text-xl font-bold tracking-tight">
          {bestDayVol > 0 ? formatValue(bestDayVol, selectedExercise.type, selectedExercise.durationUnit) : "—"}
        </span>
      </div>
    </div>
  );
}
