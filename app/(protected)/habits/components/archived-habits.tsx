"use client";

import { ArchiveRestore, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Habit } from "../store";
import { useHabitStore } from "./habit-store-provider";
import { toggleHabitArchive, deleteHabit } from "../actions";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ArchivedHabits() {
  const archivedHabits = useHabitStore((state) => state.archivedHabits);
  const toggleArchive = useHabitStore((state) => state.toggleArchive);
  const removeArchivedHabit = useHabitStore((state) => state.removeArchivedHabit);

  if (archivedHabits.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ArchiveRestore className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No archived habits</EmptyTitle>
          <EmptyDescription>
            Your archive is currently empty.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const handleRestore = async (habit: Habit) => {
    toggleArchive(habit);
    await toggleHabitArchive(habit.id, false);
  };

  const handleDelete = async (id: string) => {
    removeArchivedHabit(id);
    await deleteHabit(id);
  };

  return (
    <div className="space-y-2">
      {archivedHabits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center justify-between px-2 border border-border/50 rounded-md bg-muted/30"
        >
          <span className="text-sm text-muted-foreground line-through">
            {habit.name}
          </span>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRestore(habit)}
            >
              <ArchiveRestore className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(habit.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
