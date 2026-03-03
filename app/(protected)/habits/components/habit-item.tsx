"use client";
import React, { useState, useRef, useEffect } from "react";
import { Edit2, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHabitStore, Habit } from "../store";
import { editHabit, deleteHabit, toggleHabitArchive, toggleHabitExecution } from "../actions";

export default function HabitItem({ habit }: { habit: Habit }) {
  const executions = useHabitStore((state) => state.executions);
  const today = useHabitStore((state) => state.today);
  const updateHabitName = useHabitStore((state) => state.updateHabitName);
  const toggleArchive = useHabitStore((state) => state.toggleArchive);
  const removeActiveHabit = useHabitStore((state) => state.removeActiveHabit);
  const toggleExecution = useHabitStore((state) => state.toggleExecution);
  
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCompleted = executions.find((e) => e.habitId === habit.id)?.completed === true;

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleToggleExecution = async (checked: boolean | string) => {
    const newStatus = checked === true;
    toggleExecution(habit.id); // optimistic UI
    const res = await toggleHabitExecution(habit.id, today, newStatus);
    if (!res.success) toast.error("Failed to update execution");
  };

  const handleSaveEdit = async () => {
    const name = editName.trim();
    setEditing(false);
    if (!name || name === habit.name) {
      setEditName(habit.name);
      return;
    }
    updateHabitName(habit.id, name); // optimistic UI
    await editHabit(habit.id, name);
  };

  const handleToggleArchive = async () => {
    toggleArchive(habit); // optimistic UI
    await toggleHabitArchive(habit.id, !habit.isArchived);
  };

  const handleDelete = async () => {
    removeActiveHabit(habit.id); // optimistic UI
    await deleteHabit(habit.id);
  };

  return (
    <div className="group flex flex-row items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        {editing ? (
          <div className="flex-1 mr-2">
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              className="h-8 text-sm"
            />
          </div>
        ) : (
          <>
            <Checkbox id={habit.id} checked={isCompleted} onCheckedChange={handleToggleExecution} />
            <label
              htmlFor={habit.id}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                isCompleted ? "text-muted-foreground line-through" : ""
              }`}
            >
              {habit.name}
            </label>
          </>
        )}
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!editing && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleToggleArchive}>
          <Archive className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
