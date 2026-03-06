"use client";

import { useRef, createContext, useContext } from "react";
import { useStore } from "zustand";
import { createExerciseStore, ExerciseStore } from "../store";
import { Exercise, ExerciseLog } from "../types";

export const ExerciseStoreContext = createContext<ReturnType<typeof createExerciseStore> | null>(null);

export default function ExerciseStoreProvider({
  initialExercises,
  initialLogs,
  children,
}: {
  initialExercises: Exercise[];
  initialLogs: ExerciseLog[];
  children: React.ReactNode;
}) {
  const storeRef = useRef<ReturnType<typeof createExerciseStore>>(null);
  
  if (!storeRef.current) {
    storeRef.current = createExerciseStore({
      exercises: initialExercises,
      logs: initialLogs,
      selectedExercise: initialExercises.length > 0 ? initialExercises[0] : null,
      isInitialized: true,
    });
  }

  return (
    <ExerciseStoreContext.Provider value={storeRef.current}>
      {children}
    </ExerciseStoreContext.Provider>
  );
}

export function useExerciseStore<T>(selector: (state: ExerciseStore) => T): T {
  const storeContext = useContext(ExerciseStoreContext);
  if (!storeContext) {
    throw new Error("useExerciseStore must be used within ExerciseStoreProvider");
  }
  return useStore(storeContext, selector);
}
