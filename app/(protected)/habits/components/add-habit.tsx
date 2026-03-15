"use client";
import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addHabit as addHabitAction } from "../actions";
import { useHabitStore } from "./habit-store-provider";

export default function AddHabit() {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const addHabit = useHabitStore((state) => state.addHabit);
  const removeActiveHabit = useHabitStore((state) => state.removeActiveHabit);

  useEffect(() => {
    if (isAdding && inputRef.current) inputRef.current.focus();
  }, [isAdding]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) {
      setIsAdding(false);
      return;
    }
    const habitName = name.trim();
    setName("");
    setIsAdding(false);

    const tempId = crypto.randomUUID();
    addHabit({
      id: tempId,
      name: habitName,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "",
    });

    const res = await addHabitAction(habitName);
    if (!res.success) {
      toast.error(res.message || "Failed to add habit");
      removeActiveHabit(tempId);
    }
  };

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        onClick={() => setIsAdding(true)}
        className="w-full justify-start"
      >
        <Plus className="h-4 w-4" /> Add Habit
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 px-3 mt-2 border rounded-md">
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => {
          if (!name.trim()) setIsAdding(false);
          else handleSubmit();
        }}
        placeholder="Habit name..."
        className="flex-1 h-8 border-none shadow-none focus-visible:ring-0 px-0"
      />
    </form>
  );
}
