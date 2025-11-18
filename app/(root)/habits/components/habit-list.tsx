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
import { Habit } from "../utils/types";
import EmptyHabits from "./empty-habits";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleHabitCompletion } from "../utils/action";
import { toast } from "sonner";

/**
 * Optimistic HabitList:
 * - instant local toggle (optimistic)
 * - background server call via toggleHabitCompletion
 * - revert + toast on failure
 * - prevents double toggles while request is running
 *
 * Improvement to avoid flicker:
 * - keep optimistic override until the incoming `habits` prop reflects
 *   the same completion state for that habit id.
 */

export default function HabitList({
  habits,
  loading,
}: {
  habits: Habit[];
  loading: boolean;
}) {
  // optimistic overrides: id -> optimistic boolean value
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});
  // in-flight toggles: id -> boolean
  const [inFlight, setInFlight] = useState<Record<number, boolean>>({});

  // visible items (same as before)
  const visible = (habits || []).filter((h) => h.in_list);
  const total = visible.length;
  const completed = visible.filter((h) => h.is_completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleOptimisticToggle = async (habit: Habit, checked: boolean) => {
    const id = habit.id;

    // If already in flight, ignore
    if (inFlight[id]) return;

    // apply optimistic override and mark in-flight
    setOverrides((s) => ({ ...s, [id]: checked }));
    setInFlight((s) => ({ ...s, [id]: true }));

    try {
      // If toggleHabitCompletion returns updated habit, you could use it here
      // to update local cache. For now we await it and rely on the incoming
      // `habits` prop to sync canonical state.
      await toggleHabitCompletion(id, checked);

      // SUCCESS: do NOT immediately remove the override.
      // Instead wait for the server-sourced `habits` to match the override
      // (see useEffect below). This prevents flicker caused by clearing
      // the override before `habits` has updated.
    } catch (err) {
      // revert optimistic on error
      setOverrides((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
      toast.error("Failed to update habit — check your connection.");
      console.error("toggleHabitCompletion error:", err);
    } finally {
      // clear in-flight flag (we don't need to keep user blocked)
      setInFlight((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
    }
  };

  /**
   * Effect: when canonical `habits` changes, remove overrides for any
   * habit ids where the canonical `is_completed` now equals the optimistic
   * override value. This ensures we keep showing the optimistic state
   * until the server-backed data matches it (avoids flicker).
   */
  useEffect(() => {
    if (!habits || Object.keys(overrides).length === 0) return;

    // Build a map from id -> is_completed for quick lookup
    const canonMap: Record<number, boolean> = {};
    for (const h of habits) {
      canonMap[h.id] = !!h.is_completed;
    }

    // Remove overrides that are now in sync with canonical state
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
            {visible.map((habit) => {
              // if we have an optimistic override for this id, prefer it
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
