"use client";

import { useExerciseStore } from "./exercise-store-provider";
import { useState } from "react";
import { addExerciseLog } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { secondsToHMS, hmsToSeconds, formatSeconds } from "../utils";

export default function ExerciseLogCounter() {
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const [values, setValues] = useState<number[]>(() => 
    selectedExercise ? Array(selectedExercise.sets).fill(0) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formatGoal(val: number, type: string, unit?: string | null) {
    if (type === "reps") return `${val} reps`;
    return formatSeconds(val);
  }

  if (!selectedExercise) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await addExerciseLog({
        exercise_id: selectedExercise.id,
        values,
      });
      if (res.success) {
        toast.success("Log saved!");
        setValues(Array(selectedExercise.sets).fill(0));
      } else {
        toast.error("Failed to save log.");
      }
    } catch (e) {
      toast.error("Error saving log.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDurationValue = (index: number, field: 'h' | 'm' | 's', val: number) => {
    const newValues = [...values];
    const current = secondsToHMS(newValues[index] || 0);
    const updated = { ...current, [field]: val };
    newValues[index] = hmsToSeconds(updated.h, updated.m, updated.s);
    setValues(newValues);
  };

  return (
    <div className="flex flex-col gap-3 bg-card rounded-xl p-3 border shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-semibold text-lg">Log Session</h3>
        <Badge variant="secondary" className="px-2 py-1 text-xs">
          Goal: {formatGoal(selectedExercise.goal, selectedExercise.type, selectedExercise.durationUnit)}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {values.map((v, i) => {
          const hms = selectedExercise.type === "duration" ? secondsToHMS(v) : null;
          
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="w-12 text-sm font-medium text-muted-foreground whitespace-nowrap">Set {i + 1}</span>
                <div className="flex-1 flex gap-2 items-center">
                  {selectedExercise.type === "reps" ? (
                    <Input
                      type="number"
                      min="0"
                      value={v || ""}
                      onChange={(e) => {
                        const newValues = [...values];
                        newValues[i] = Number(e.target.value);
                        setValues(newValues);
                      }}
                      placeholder="Reps"
                    />
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      {(selectedExercise.durationUnit === "hr") && (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            type="number"
                            min="0"
                            className="text-center h-9"
                            value={hms?.h || ""}
                            onChange={(e) => updateDurationValue(i, 'h', Number(e.target.value))}
                            placeholder="H"
                          />
                          <span className="text-[10px] text-muted-foreground">h</span>
                        </div>
                      )}
                      {(selectedExercise.durationUnit === "hr" || selectedExercise.durationUnit === "min") && (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            className="text-center h-9"
                            value={hms?.m || ""}
                            onChange={(e) => updateDurationValue(i, 'm', Number(e.target.value))}
                            placeholder="M"
                          />
                          <span className="text-[10px] text-muted-foreground">m</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          className="text-center h-9"
                          value={hms?.s || ""}
                          onChange={(e) => updateDurationValue(i, 's', Number(e.target.value))}
                          placeholder="S"
                        />
                        <span className="text-[10px] text-muted-foreground">s</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button 
        onClick={handleSave} 
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Log"}
      </Button>
    </div>
  );
}
