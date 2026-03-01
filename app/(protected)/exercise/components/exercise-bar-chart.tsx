"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Spinner } from "@/components/ui/spinner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { filterLogsByRange } from "../exercise-grouping";
import { Exercise, ExerciseLog } from "../types";

import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { useExerciseStore } from "../store";

type Range = "today" | "yesterday" | "lastWeek" | "lastMonth";

const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
};

// Group logs for a single exercise
function groupLogsByDaySingleExercise(logs: ExerciseLog[]) {
  const map = new Map<string, number>();

  logs.forEach((log) => {
    const dateKey = log.created_at.slice(0, 10);
    const volume = log.values.reduce((a, b) => a + b, 0);

    map.set(dateKey, (map.get(dateKey) || 0) + volume);
  });

  return Array.from(map, ([date, volume]) => ({ date, volume }));
}

export default function ExercisesBarChart({
  initialExercises,
  initialLogs,
}: {
  initialExercises: Exercise[];
  initialLogs: ExerciseLog[];
}) {
  const [range, setRange] = useState<Range>("lastWeek");
  const { selectedExercise } = useExerciseStore();


  const [logs, setLogs] = useState<ExerciseLog[]>(initialLogs);

  // Filter logs ONLY for selected exercise
  const exerciseLogs = useMemo(() => {
    if (!selectedExercise) return [];
    return logs.filter((l) => l.exercise_id === selectedExercise.id);
  }, [logs, selectedExercise]);

  // Final chart data
  const chartData = useMemo(() => {
    const filtered = filterLogsByRange(exerciseLogs, range);
    return groupLogsByDaySingleExercise(filtered);
  }, [exerciseLogs, range]);

  const rangeLabels = {
    today: "Today",
    yesterday: "Yesterday",
    lastWeek: "Last 7 Days",
    lastMonth: "Last 30 Days",
  };
  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload || payload.length === 0) return null;

    const item = payload[0];
    const rawValue = item.value as number;

    const type = selectedExercise?.type;
    const unit = type === "duration" ? "seconds" : "reps";

    function formatSeconds(sec: number) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    }

    // Clone item so ChartTooltipContent does NOT break
    const tooltipItem = {
      ...item, // keep dataKey, payload, fill, etc.
      name: `${selectedExercise?.name} (${unit})`,
      value: type === "duration" ? formatSeconds(rawValue) : rawValue,
    };

    return (
      <ChartTooltipContent
        active
        label={item.payload.date}
        payload={[tooltipItem]} // MUST include original payload structure
      />
    );
  };

  if (!selectedExercise) {
    return (
      <Card className="max-w-3xl w-full py-24 text-center">
        <p className="text-muted-foreground">
          Select an exercise to view analytics.
        </p>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl w-full">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>{selectedExercise.name} Activity</CardTitle>
          <CardDescription>{rangeLabels[range]} summary</CardDescription>
        </div>

        <Select value={range} onValueChange={(v: Range) => setRange(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="lastWeek">Last 7 Days</SelectItem>
            <SelectItem value="lastMonth">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {exerciseLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No logs found for this exercise.
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No activity in this period.
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickMargin={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="var(--color-volume)" radius={6} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
