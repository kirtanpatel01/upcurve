"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";
import EditHabitsSheet from "./edit-habits-sheet";
import { Habit } from "../utils/types";
import EmptyHabits from "./empty-habits";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleHabitCompletion } from "../utils/action";

/**
 * UI-only improvements:
 * - Displays total and completed count with progress bar
 * - Visual “Completed” tag for finished habits
 * - No functionality changes
 */

export default function HabitList({
  habits,
  loading,
}: {
  habits: Habit[];
  loading: boolean;
}) {
  // always compute from the latest prop to reflect real-time subscription changes
  const visible = (habits || []).filter((h) => h.in_list);
  const total = visible.length;
  const completed = visible.filter((h) => h.is_completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <Card className="max-w-sm">
        <CardHeader>
          <div className="flex items-start justify-between w-full gap-4">
            <div>
              <CardTitle>Habit List</CardTitle>
              <CardDescription>
                List of all the habits you&apos;ve decided to follow daily.
              </CardDescription>
            </div>

            {/* Progress summary */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Completed</div>
              <div className="mt-1 inline-flex items-baseline gap-2">
                <span className="text-sm font-semibold">{completed}</span>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">{total}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {pct}% completed
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-muted rounded-xl p-3"
                >
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          ) : visible.length <= 0 ? (
            <EmptyHabits list />
          ) : (
            <ul className="space-y-3">
              {visible.map((habit) => (
                <Label
                  htmlFor={`habit-${habit.id}`}
                  key={habit.id}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 
                  transition-all duration-200 cursor-pointer hover:bg-muted hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Checkbox
                      id={`habit-${habit.id}`}
                      defaultChecked={habit.is_completed}
                      onCheckedChange={async (checked) => {
                        await toggleHabitCompletion(habit.id, !!checked);
                      }}
                      className="h-5 w-5 rounded-md border-2 border-border/70 group-has-[[aria-checked=true]]:border-primary 
                      group-has-[[aria-checked=true]]:bg-primary data-[state=checked]:text-primary-foreground transition-colors"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium truncate ${
                            habit.is_completed
                              ? "text-foreground/30 "
                              : "text-muted-foreground"
                          }`}
                          title={habit.title}
                        >
                          {habit.title}
                        </span>

                        {habit.is_completed && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Label>
              ))}
            </ul>
          )}
        </CardContent>
        <Separator />
        <CardFooter>
          <EditHabitsSheet habits={habits || []} />
        </CardFooter>
      </Card>
    </div>
  );
}
