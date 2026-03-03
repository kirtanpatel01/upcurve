"use client";
import React, { useState } from "react";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHabitStore, Habit } from "../store";
import { toggleHabitArchive, deleteHabit } from "../actions";

export default function ArchivedHabits() {
  const [show, setShow] = useState(false);
  const archivedHabits = useHabitStore((state) => state.archivedHabits);
  const toggleArchive = useHabitStore((state) => state.toggleArchive);
  const removeArchivedHabit = useHabitStore((state) => state.removeArchivedHabit);

  if (archivedHabits.length === 0) return null;

  const handleRestore = async (habit: Habit) => {
    toggleArchive(habit);
    await toggleHabitArchive(habit.id, false);
  };

  const handleDelete = async (id: string) => {
    removeArchivedHabit(id);
    await deleteHabit(id);
  };

  return (
    <div className="pt-6">
      <Button
        variant="link"
        size="sm"
        onClick={() => setShow(!show)}
        className="text-muted-foreground px-0 h-auto"
      >
        {show ? "Hide Archived" : `Show Archived (${archivedHabits.length})`}
      </Button>
      
      {show && (
        <div className="mt-4 space-y-2">
          {archivedHabits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
            >
              <span className="text-sm text-muted-foreground line-through">
                {habit.name}
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRestore(habit)}
                >
                  <ArchiveRestore className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(habit.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
