import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Todo } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { isPast, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Review({
  todos,
  loading = true,
}: {
  todos: Todo[];
  loading: boolean;
}) {
  const completed = todos.filter((todo) => todo.is_completed).length || 0;
  const overDueTodos = todos.filter((todo) => isPast(parseISO(todo?.deadline)) && !todo.is_completed) 
  const todayCompleted = todos.filter((todo) => todo.is_completed);
  console.log(todayCompleted)
  return (
    <div className="m-4 flex gap-2">
      <Card className="w-fit gap-4 py-4 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800
      shadow-md shadow-zinc-400/25 dark:shadow-zinc-900/25">
        <CardHeader className="flex items-center">
          <CardTitle>Review</CardTitle>
        </CardHeader>
        <Separator className="bg-zinc-200 dark:bg-zinc-800" />
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span>Completed:</span>
            {loading ? (
              <Skeleton className="w-5 h-5" />
            ) : (
              <span className="text-green-500">
                {completed}
              </span>
            )}
            <Select>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="In a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Yesterday</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span>Left:</span>
            {loading ? (
              <Skeleton className="w-5 h-5" />
            ) : (
              <span className="text-blue-500">
                {todos.length-completed}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Over due:</span>
            {loading ? (
              <Skeleton className="w-5 h-5" />
            ) : (
              <span className="text-red-500">
                {overDueTodos.length}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Review;
