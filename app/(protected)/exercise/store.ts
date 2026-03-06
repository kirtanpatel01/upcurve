import { createStore } from "zustand";
import { Exercise, ExerciseLog } from "./types";

export interface ExerciseState {
  exercises: Exercise[];
  logs: ExerciseLog[];
  selectedExercise: Exercise | null;
  isInitialized: boolean;
}

export interface ExerciseActions {
  setExercises: (exercises: Exercise[]) => void;
  updateExerciseInStore: (id: string, data: Partial<Exercise>) => void;
  addExerciseToStore: (exercise: Exercise) => void;
  removeExerciseFromStore: (id: string) => void;
  setSelectedExercise: (exercise: Exercise | null) => void;
  setLogs: (logs: ExerciseLog[]) => void;
  setIsInitialized: (val: boolean) => void;
}

export type ExerciseStore = ExerciseState & ExerciseActions;

export const createExerciseStore = (initialState: Partial<ExerciseState> = {}) => {
  return createStore<ExerciseStore>((set) => ({
    exercises: [],
    logs: [],
    selectedExercise: null,
    isInitialized: false,
    ...initialState,

    setExercises: (exercises) => set({ exercises }),
    updateExerciseInStore: (id, data) => set((state) => ({
      exercises: state.exercises.map(ex => ex.id === id ? { ...ex, ...data } : ex),
      selectedExercise: state.selectedExercise?.id === id 
        ? { ...state.selectedExercise, ...data } 
        : state.selectedExercise
    })),
    addExerciseToStore: (exercise) => set((state) => ({
      exercises: [exercise, ...state.exercises],
      selectedExercise: exercise
    })),
    removeExerciseFromStore: (id) => set((state) => {
      const remainingExercises = state.exercises.filter(ex => ex.id !== id);
      return {
        exercises: remainingExercises,
        selectedExercise: state.selectedExercise?.id === id 
          ? (remainingExercises.length > 0 ? remainingExercises[0] : null) 
          : state.selectedExercise
      };
    }),
    setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
    setLogs: (logs) => set({ logs }),
    setIsInitialized: (val) => set({ isInitialized: val }),
  }));
};
