"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HabitHistory } from "../utils/types";
import { format, isSameDay, subDays } from "date-fns";

export default function HabitsInsights({
  habitHistory,
}: {
  habitHistory: HabitHistory[];
}) {
  if (!habitHistory || habitHistory.length === 0) {
    return (
      <Card className="flex-1 min-w-[260px] h-fit p-4 text-center text-muted-foreground">
        No habit activity yet.
      </Card>
    );
  }

  const today = new Date();

  const todayCompleted = habitHistory
    .filter((h) => isSameDay(new Date(h.created_at), today))
    .reduce((sum, h) => sum + (h.completed_habits || 0), 0);

  const last7Days = habitHistory.filter(
    (h) =>
      new Date(h.created_at) >= subDays(today, 6) &&
      new Date(h.created_at) <= today
  );

  const weeklyTotal = last7Days.reduce(
    (sum, h) => sum + (h.completed_habits || 0),
    0
  );

  const weeklyAverage = (weeklyTotal / 7).toFixed(1);

  const bestDay = [...habitHistory]
    .map((h) => ({
      date: h.created_at.slice(0, 10),
      count: h.completed_habits || 0,
    }))
    .sort((a, b) => b.count - a.count)[0];

  // Compute streaks
  function calculateStreak(history: HabitHistory[]) {
    const dates = history
      .map((h) => h.created_at.slice(0, 10))
      .sort((a, b) => (a < b ? 1 : -1));

    let current = 0;
    let longest = 0;

    let lastDate = null;

    for (const d of dates) {
      if (!lastDate) {
        current = 1;
        longest = 1;
        lastDate = d;
        continue;
      }

      const prev = new Date(lastDate);
      const curr = new Date(d);

      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }

      longest = Math.max(longest, current);
      lastDate = d;
    }

    return { current, longest };
  }

  const streak = calculateStreak(habitHistory);

  return (
    <Card className="flex-1 min-w-[260px] h-fit">
      <CardHeader>
        <CardTitle>Habit Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Completed Today:</span>
          <span className="font-medium">{todayCompleted}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Last 7 Days Total:</span>
          <span className="font-medium">{weeklyTotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Daily Average:</span>
          <span className="font-medium">{weeklyAverage}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Best Day:</span>
          <span className="font-medium">
            {bestDay
              ? `${bestDay.date} (${bestDay.count})`
              : "No data"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Streak:</span>
          <span className="font-medium">{streak.current} days</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Longest Streak:</span>
          <span className="font-medium">{streak.longest} days</span>
        </div>
      </CardContent>
    </Card>
  );
}
