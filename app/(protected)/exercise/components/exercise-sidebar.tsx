"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useExerciseStore } from "./exercise-store-provider";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

import EditExerciseDialog from "./edit-exercise-dialog";
import { formatSeconds } from "../utils";

export default function ExerciseSidebar() {
  const exercises = useExerciseStore((state) => state.exercises);
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const setSelectedExercise = useExerciseStore((state) => state.setSelectedExercise);

  function formatGoal(val: number, type: string, unit?: string | null) {
    if (type === "reps") return `${val} reps`;
    return formatSeconds(val);
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-muted-foreground text-sm p-4">
        No exercises found. Add one to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex flex-row md:flex-col gap-2 pt-2">
        {exercises.map((ex) => {
          const isSelected = selectedExercise?.id === ex.id;
          return (
            <div key={ex.id} className="relative group">
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "justify-start flex-shrink-0 md:w-full h-auto p-2 px-3 transition-all whitespace-nowrap text-left",
                  isSelected
                    ? "shadow-sm border-primary/50"
                    : "hover:bg-muted bg-background"
                )}
                onClick={() => setSelectedExercise(ex)}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-sm">{ex.name}</span>
                  <span className="text-[10px] opacity-70 font-normal">
                    {ex.sets} sets • {formatGoal(ex.goal, ex.type, ex.durationUnit)}
                  </span>
                </div>
              </Button>
              
              {/* Mobile: Small Pencil Icon slightly out of top right corner */}
              <div className="md:hidden absolute -top-1 -right-1 z-10">
                <EditExerciseDialog 
                  exercise={ex} 
                  trigger={
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full h-6 w-6"
                    >
                      <Pencil className="h-1 w-1 text-muted-foreground" />
                    </Button>
                  } 
                />
              </div>

              {/* Desktop: Hover-visible Pencil Icon */}
              <div className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditExerciseDialog 
                  exercise={ex} 
                  trigger={
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  } 
                />
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
