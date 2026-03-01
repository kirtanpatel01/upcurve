"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import { useTodos } from "../utils/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function TodoInsights() {
  const { data, isLoading } = useTodos();
  const todos = data?.todo || [];

  const completed = todos.filter((t) => t.isCompleted);
  const pending = todos.filter((t) => !t.isCompleted);

  const today = new Date();
  const completedToday = completed.filter((t) =>
    t.completedAt ? isSameDay(new Date(t.completedAt), today) : false
  );

  const bestDay = useMemo(() => {
    const map = new Map<string, number>();

    completed.forEach((t) => {
      if (!t.completedAt) return;
      const day = t.completedAt.toISOString().slice(0, 10);
      map.set(day, (map.get(day) || 0) + 1);
    });

    const arr = Array.from(map, ([date, count]) => ({ date, count }));
    arr.sort((a, b) => b.count - a.count);

    return arr[0];
  }, [completed]);

  // Only count todos that are in the list
  const activeTodos = todos.filter((t) => !t.isCompleted);

  const priorityCounts = {
    low: activeTodos.filter((t) => t.priority === "low").length,
    medium: activeTodos.filter((t) => t.priority === "medium").length,
    high: activeTodos.filter((t) => t.priority === "high").length,
    urgent: activeTodos.filter((t) => t.priority === "urgent").length,
  };

  const completionRate =
    todos.length === 0
      ? 0
      : Math.round((completed.length / todos.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todo Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Completed Today:</span>
          <span className="font-medium">{isLoading ? <Skeleton className="w-4 h-4" /> : completedToday.length}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Pending Todos:</span>
          <span className="font-medium">{isLoading ? <Skeleton className="w-4 h-4" /> : pending.length}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Completion Rate:</span>
          <span className="font-medium flex items-center gap-1">{isLoading ? <Skeleton className="w-4 h-4" /> : completionRate}%</span>
        </div>

        <div className="pt-3 border-t flex justify-between">
          <span className="text-muted-foreground">Best Day:</span>
          <span className="font-medium text-primary">
            {isLoading ? <Skeleton className="w-32 h-4" /> : bestDay ? `${bestDay.date} (${bestDay.count})` : "No data"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
