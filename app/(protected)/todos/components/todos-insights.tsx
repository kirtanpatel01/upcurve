"use client";

import { Todo } from "../utils/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { useMemo } from "react";

export default function TodoInsights({ todos }: { todos: Todo[] }) {
  const completed = todos.filter((t) => t.is_completed);
  const pending = todos.filter((t) => !t.is_completed);

  const today = new Date();
  const completedToday = completed.filter((t) =>
    t.completed_time ? isSameDay(new Date(t.completed_time), today) : false
  );

  const bestDay = useMemo(() => {
    const map = new Map<string, number>();

    completed.forEach((t) => {
      if (!t.completed_time) return;
      const day = t.completed_time.slice(0, 10);
      map.set(day, (map.get(day) || 0) + 1);
    });

    const arr = Array.from(map, ([date, count]) => ({ date, count }));
    arr.sort((a, b) => b.count - a.count);

    return arr[0];
  }, [completed]);

  // Only count todos that are in the list
  const activeTodos = todos.filter((t) => !t.is_completed);

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
    <Card className="flex-1 min-w-[260px] h-fit">
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
          <span className="text-muted-foreground">Completed Todos:</span>
          <span className="font-medium">{completed.length}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Completion Rate:</span>
          <span className="font-medium">{completionRate}%</span>
        </div>

        <div className="pt-3 border-t text-sm">
          <div className="font-medium mb-2">Priority Overview:</div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Low:</span>
            <span>{priorityCounts.low}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Medium:</span>
            <span>{priorityCounts.medium}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">High:</span>
            <span>{priorityCounts.high}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Urgent:</span>
            <span>{priorityCounts.urgent}</span>
          </div>
        </div>

        <div className="pt-3 border-t flex justify-between">
          <span className="text-muted-foreground">Best Day:</span>
          <span className="font-medium">
            {bestDay ? `${bestDay.date} (${bestDay.count})` : "No data"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
