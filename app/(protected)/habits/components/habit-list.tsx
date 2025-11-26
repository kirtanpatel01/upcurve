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
import React, { useEffect, useState } from "react";
import EditHabitsSheet from "./edit-habits-sheet";
import { type Habit } from "../utils/types";
import EmptyHabits from "./empty-habits";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleHabitCompletion } from "../utils/action";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function HabitList({
  initialHabits,
}: {
  initialHabits: Habit[];
}) {
  const [habits, setHabits] = useState(initialHabits);
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});
  const [inFlight, setInFlight] = useState<Record<number, boolean>>({});
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("habits-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habits" },
        (payload) => {
          const eventType = payload.eventType;
          const data = payload.new as Habit;
          console.log(payload);
          switch (eventType) {
            case "INSERT":
              setHabits((prev) => [data as Habit, ...prev]);
              break;
            case "UPDATE":
              setHabits((prev) =>
                prev.map((h) => (h.id === data.id ? data : h))
              );
              break;
            case "DELETE":
              const old = payload.old as Habit;
              setHabits((prev) => prev.filter((h) => h.id !== old.id));
              break;
            default:
          }
        }
      ).subscribe();

      return () => {
        supabase.removeChannel(channel);
      }

  }, []);

  const visible = (habits || []).filter((h) => h.in_list);
  const total = visible.length;
  const completed = visible.filter((h) => h.is_completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleOptimisticToggle = async (habit: Habit, checked: boolean) => {
    const id = habit.id;

    if (inFlight[id]) return;

    setOverrides((s) => ({ ...s, [id]: checked }));
    setInFlight((s) => ({ ...s, [id]: true }));

    try {
      await toggleHabitCompletion(id, checked);
    } catch (err) {
      setOverrides((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
      toast.error("Failed to update habit — check your connection.");
      console.error("toggleHabitCompletion error:", err);
    } finally {
      setInFlight((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
    }
  };

  useEffect(() => {
    if (!habits || Object.keys(overrides).length === 0) return;

    const canonMap: Record<number, boolean> = {};
    for (const h of habits) {
      canonMap[h.id] = !!h.is_completed;
    }

    setOverrides((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const idStr of Object.keys(prev)) {
        const id = Number(idStr);
        if (id in canonMap) {
          if (canonMap[id] === prev[id]) {
            delete next[id];
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, [habits, overrides]);

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <div className="flex items-start justify-between w-full gap-4">
          <div>
            <CardTitle>Habit List</CardTitle>
            <CardDescription>
              List of all the habits you&apos;ve decided to follow daily.
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="mt-1 inline-flex items-baseline gap-2">
              <span className="text-sm font-semibold">{completed}</span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">{total}</span>
            </div>
          </div>
        </div>

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
        {!habits ? (
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
            {visible.map((habit) => {
              const hasOverride = Object.prototype.hasOwnProperty.call(
                overrides,
                habit.id
              );
              const checked = hasOverride
                ? overrides[habit.id]
                : habit.is_completed;
              const disabled = Boolean(inFlight[habit.id]);

              return (
                <Label
                  htmlFor={`habit-${habit.id}`}
                  key={habit.id}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 
                      transition-all duration-200 cursor-pointer hover:bg-muted hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Checkbox
                      id={`habit-${habit.id}`}
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(c) =>
                        handleOptimisticToggle(habit, !!c)
                      }
                      aria-checked={checked}
                      aria-label={`Toggle ${habit.title}`}
                      className="h-5 w-5 rounded-md border-2 border-border/70 group-has-[[aria-checked=true]]:border-primary 
                        group-has-[[aria-checked=true]]:bg-primary data-[state=checked]:text-primary-foreground transition-colors"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium truncate ${
                            checked
                              ? "text-foreground/30"
                              : "text-muted-foreground"
                          }`}
                          title={habit.title}
                        >
                          {habit.title}
                        </span>

                        {checked && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Label>
              );
            })}
          </ul>
        )}
      </CardContent>

      <CardFooter>
        <EditHabitsSheet habits={habits || []} />
      </CardFooter>
    </Card>
  );
}
