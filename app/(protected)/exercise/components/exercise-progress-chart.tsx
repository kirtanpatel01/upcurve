"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TimeRange } from "../exercise-grouping";
import { useExerciseStore } from "./exercise-store-provider";
import { formatSeconds } from "../utils";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ExerciseProgressChart() {
  const [range, setRange] = useState<TimeRange>("lastWeek");
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const logs = useExerciseStore((state) => state.logs);

  const chartData = useMemo(() => {
    if (!selectedExercise) return [];
    
    const exerciseLogs = logs.filter(l => l.exerciseId === selectedExercise.id);
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (range) {
      case "yesterday":
        startDate = startOfDay(subDays(now, 1));
        endDate = startOfDay(now);
        break;
      case "lastWeek":
        startDate = subDays(now, 6);
        break;
      case "lastMonth":
        startDate = subDays(now, 29);
        break;
      default:
        startDate = subDays(now, 6);
    }

    const daysInterval = eachDayOfInterval({ start: startOfDay(startDate), end: startOfDay(endDate) });
    const logMap = new Map<string, number>();
    
    exerciseLogs.forEach((log) => {
      const dateKey = format(new Date(log.createdAt), "MM-dd");
      const volume = log.values.reduce((a, b) => a + b, 0);
      logMap.set(dateKey, (logMap.get(dateKey) || 0) + volume);
    });

    return daysInterval.map(day => {
      const dateKey = format(day, "MM-dd");
      return {
        date: dateKey,
        volume: logMap.get(dateKey) || 0
      };
    });
  }, [logs, selectedExercise, range]);

  if (!selectedExercise) return null;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="space-y-1">
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            {range === "yesterday" ? "Yesterday's data" : `Last ${range === "lastWeek" ? "7" : "30"} days`}
          </CardDescription>
        </div>
        <Select value={range} onValueChange={(v: TimeRange) => setRange(v)}>
          <SelectTrigger className="w-[130px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="lastWeek">Last 7 Days</SelectItem>
            <SelectItem value="lastMonth">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-xl">
            No activity in this period.
          </div>
        ) : (
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="min-w-[450px] w-full">
            <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip 
                  cursor={false} 
                  content={
                    <ChartTooltipContent 
                      hideLabel
                      formatter={(value) => selectedExercise.type === "duration" ? formatSeconds(Number(value)) : value} 
                    />
                  } 
                />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={8} />
              </BarChart>
            </ChartContainer>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
