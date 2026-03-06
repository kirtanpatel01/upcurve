"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateExercise, deleteExercise } from "../actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { secondsToHMS, hmsToSeconds } from "../utils";
import { Exercise } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useExerciseStore } from "./exercise-store-provider";

interface FormValues {
  name: string;
  type: "reps" | "duration";
  sets: number;
  goal: number;
  durationUnit: "sec" | "min" | "hr";
  // Temporary fields for h/m/s
  goalH?: number;
  goalM?: number;
  goalS?: number;
}

export default function EditExerciseDialog({ 
  exercise, 
  trigger 
}: { 
  exercise: Exercise;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const initialHMS = exercise.type === "duration" ? secondsToHMS(exercise.goal) : { h: 0, m: 0, s: 0 };

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { 
      name: exercise.name,
      type: exercise.type as "reps" | "duration", 
      sets: exercise.sets, 
      goal: exercise.goal, 
      durationUnit: (exercise.durationUnit as "sec" | "min" | "hr") || "sec",
      goalH: initialHMS.h,
      goalM: initialHMS.m,
      goalS: initialHMS.s
    }
  });

  const updateExerciseInStore = useExerciseStore((state) => state.updateExerciseInStore);
  const removeExerciseFromStore = useExerciseStore((state) => state.removeExerciseFromStore);

  const onSubmit = async (data: FormValues) => {
    let finalGoal = Number(data.goal);
    if (data.type === "duration") {
      finalGoal = hmsToSeconds(Number(data.goalH || 0), Number(data.goalM || 0), Number(data.goalS || 0));
    }

    // Optimistic Update
    const updatedData = {
      name: data.name,
      type: data.type,
      sets: Number(data.sets),
      goal: finalGoal,
      durationUnit: data.type === "duration" ? data.durationUnit : null
    };
    
    updateExerciseInStore(exercise.id, updatedData);
    setOpen(false); // Close immediately for smooth UX

    try {
      const res = await updateExercise(exercise.id, {
        name: updatedData.name,
        type: updatedData.type,
        sets: updatedData.sets,
        goal: updatedData.goal,
        durationUnit: updatedData.durationUnit as "sec" | "min" | "hr" | undefined
      });
      if (res.success) {
        toast.success("Exercise updated!");
      } else {
        toast.error("Failed to update exercise.");
      }
    } catch (err) {
      toast.error("Error updating exercise.");
    }
  };

  const handleDelete = async () => {
    // Optimistic Delete
    removeExerciseFromStore(exercise.id);
    setOpen(false);

    try {
      const res = await deleteExercise(exercise.id);
      if (res.success) {
        toast.success("Exercise deleted!");
      } else {
        toast.error("Failed to delete exercise.");
      }
    } catch (err) {
      toast.error("Error deleting exercise.");
    }
  };

  const exerciseType = watch("type");
  const durationUnit = watch("durationUnit");

  const showMigrationHelper = exerciseType === "duration" && 
    exercise.goal < 60 && // Likely old data if it's less than 60 (since old goals were usually small numbers of mins/hrs)
    (exercise.durationUnit === "min" || exercise.durationUnit === "hr");

  const handleMigrate = () => {
    if (exercise.durationUnit === "min") {
      setValue("goalM", exercise.goal);
      setValue("goalS", 0);
    } else if (exercise.durationUnit === "hr") {
      setValue("goalH", exercise.goal);
      setValue("goalM", 0);
      setValue("goalS", 0);
    }
    toast.success(`Adjusted goal to ${exercise.goal} ${exercise.durationUnit}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        
        {showMigrationHelper && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200 mb-2">
            <p className="font-semibold mb-1">Duration Format Update</p>
            <p className="mb-2 opacity-90">This exercise goal looks like it's from an older version. It's currently being read as {exercise.goal} seconds.</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs border-amber-300 dark:border-amber-800 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900"
              onClick={handleMigrate}
            >
              Fix to {exercise.goal} {exercise.durationUnit === "min" ? "minutes" : "hours"}
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name", { required: true })} placeholder="Bench Press, Running, etc." />
          </div>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={exerciseType} 
              onValueChange={(val: "reps" | "duration") => setValue("type", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reps">Reps</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sets</Label>
              <Input type="number" min="1" {...register("sets", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Goal per set</Label>
              {exerciseType === "reps" ? (
                <Input type="number" min="0" {...register("goal", { required: true })} />
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    {(durationUnit === "hr") && (
                      <div className="flex flex-col gap-1 flex-1">
                        <Input type="number" min="0" {...register("goalH")} placeholder="H" className="text-center" />
                        <span className="text-[10px] text-center text-muted-foreground uppercase">hrs</span>
                      </div>
                    )}
                    {(durationUnit === "hr" || durationUnit === "min") && (
                      <div className="flex flex-col gap-1 flex-1">
                        <Input type="number" min="0" max="59" {...register("goalM")} placeholder="M" className="text-center" />
                        <span className="text-[10px] text-center text-muted-foreground uppercase">min</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <Input type="number" min="0" max="59" {...register("goalS")} placeholder="S" className="text-center" />
                      <span className="text-[10px] text-center text-muted-foreground uppercase">sec</span>
                    </div>
                  </div>
                  <Select 
                    value={durationUnit} 
                    onValueChange={(val: "sec" | "min" | "hr") => setValue("durationUnit", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Primary unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sec">Seconds</SelectItem>
                      <SelectItem value="min">Minutes</SelectItem>
                      <SelectItem value="hr">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex flex-row justify-between sm:justify-between items-center pt-4">
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your exercise
                    and all associated logs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
