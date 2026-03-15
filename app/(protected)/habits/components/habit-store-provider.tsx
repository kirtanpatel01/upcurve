"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { useStore } from "zustand";
import { createHabitStore, HabitStore, Habit, Execution } from "../store";

export const HabitStoreContext = createContext<ReturnType<typeof createHabitStore> | null>(null);

export default function HabitStoreProvider({
  initialHabits,
  initialArchivedHabits,
  initialExecutions,
  historicalStats,
  today,
  children,
}: {
  initialHabits: Habit[];
  initialArchivedHabits: Habit[];
  initialExecutions: Execution[];
  historicalStats: { date: string; count: number }[];
  today: string;
  children: React.ReactNode;
}) {
  const storeRef = useRef<ReturnType<typeof createHabitStore>>(null);

  if (!storeRef.current) {
    storeRef.current = createHabitStore({
      activeHabits: initialHabits,
      archivedHabits: initialArchivedHabits,
      executions: initialExecutions,
      historicalData: historicalStats,
      today,
      isInitialized: true,
    });
  }

  // Update anytime props actually change (Next.js server component refetching)
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().setInitialData(
        initialHabits,
        initialArchivedHabits,
        initialExecutions,
        historicalStats,
        today
      );
    }
  }, [initialHabits, initialArchivedHabits, initialExecutions, historicalStats, today]);

  return (
    <HabitStoreContext.Provider value={storeRef.current}>
      {children}
    </HabitStoreContext.Provider>
  );
}

export function useHabitStore<T>(selector: (state: HabitStore) => T): T {
  const storeContext = useContext(HabitStoreContext);
  if (!storeContext) {
    throw new Error("useHabitStore must be used within HabitStoreProvider");
  }
  return useStore(storeContext, selector);
}
