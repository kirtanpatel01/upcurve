import { create } from "zustand";
import { Exercise } from "./types";

interface ExerciseStore {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
}

export const useExerciseStore = create<ExerciseStore>((set) => ({
  selectedExercise: null,
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
}));