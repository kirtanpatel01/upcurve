"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import { useTodoStore } from "./todo-store-provider";

export default function TodoInsights() {
  const todos = useTodoStore((state) => state.todos) || [];

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
          <span className="font-medium">{completedToday.length}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Pending Todos:</span>
          <span className="font-medium">{pending.length}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Completion Rate:</span>
          <span className="font-medium flex items-center gap-1">{completionRate}%</span>
        </div>

        <div className="pt-3 border-t flex justify-between">
          <span className="text-muted-foreground">Best Day:</span>
          <span className="font-medium text-primary">
            {bestDay ? `${bestDay.date} (${bestDay.count})` : "No data"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
