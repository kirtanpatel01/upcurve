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

export default function HabitList({
  habits,
  loading,
}: {
  habits: Habit[];
  loading: boolean;
}) {
  return (
    <div>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Habit List</CardTitle>
          <CardDescription>
            List of all the habits you&apos;ve decided to follow daily.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          ) : habits && habits.length <= 0 ? (
            <EmptyHabits list />
          ) : (
            <ul className="space-y-3">
              {habits.filter((h) => h.in_list).map((habit) => (
                <Label
                  htmlFor={`habit-${habit.id}`}
                  key={habit.id}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 
                  transition-all duration-200 cursor-pointer hover:bg-muted hover:border-primary/40 hover:shadow-sm
                  has-[[aria-checked=true]]:border-primary/30 has-[[aria-checked=true]]:bg-primary/10 has-[[aria-checked=true]]:shadow-md"
                >
                  <Checkbox
                    id={`habit-${habit.id}`}
                    defaultChecked={habit.is_completed}
                    onCheckedChange={async (checked) => {
                      await toggleHabitCompletion(habit.id, !!checked)
                    }}
                    className="h-5 w-5 rounded-md border-2 border-border/70 group-has-[[aria-checked=true]]:border-primary 
                    group-has-[[aria-checked=true]]:bg-primary data-[state=checked]:text-primary-foreground transition-colors"
                  />
                  <span className="text-sm font-medium text-foreground/90 group-has-[[aria-checked=true]]:line-through">
                    {habit.title}
                  </span>
                </Label>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <EditHabitsSheet habits={habits}  />
        </CardFooter>
      </Card>
    </div>
  );
}
