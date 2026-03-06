"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addExercise } from "../actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { secondsToHMS, hmsToSeconds } from "../utils";
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

export default function AddExerciseDialog() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { type: "reps", sets: 3, goal: 10, durationUnit: "sec", goalH: 0, goalM: 0, goalS: 0 }
  });

  const addExerciseToStore = useExerciseStore(state => state.addExerciseToStore);

  const onSubmit = async (data: FormValues) => {
    let finalGoal = Number(data.goal);
    if (data.type === "duration") {
      finalGoal = hmsToSeconds(Number(data.goalH || 0), Number(data.goalM || 0), Number(data.goalS || 0));
    }

    try {
      const res = await addExercise({
        name: data.name,
        type: data.type,
        sets: Number(data.sets),
        goal: finalGoal,
        durationUnit: data.type === "duration" ? data.durationUnit : undefined
      });
      if (res.success && res.data) {
        toast.success("Exercise created!");
        addExerciseToStore(res.data);
        setOpen(false);
        reset();
      } else {
        toast.error("Failed to create exercise.");
      }
    } catch (err) {
      toast.error("Error creating exercise.");
    }
  };

  const exerciseType = watch("type");
  const durationUnit = watch("durationUnit");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Exercise
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
