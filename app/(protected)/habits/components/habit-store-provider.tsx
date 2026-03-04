"use client";

import { useEffect, useRef } from "react";
import { useHabitStore, Habit, Execution } from "../store";

export default function HabitStoreProvider({
  initialHabits,
  initialArchivedHabits,
  initialExecutions,
  today,
  children,
}: {
  initialHabits: Habit[];
  initialArchivedHabits: Habit[];
  initialExecutions: Execution[];
  today: string;
  children: React.ReactNode;
}) {
  const initializedRef = useRef(false);

  // Synchronously initialize the store first time
  if (!initializedRef.current) {
    useHabitStore.setState({
      activeHabits: initialHabits,
      archivedHabits: initialArchivedHabits,
      executions: initialExecutions,
      today,
      isInitialized: true,
    });
    initializedRef.current = true;
  }

  const setInitialData = useHabitStore((state) => state.setInitialData);

  // Update anytime props actually change (Next.js server component refetching)
  useEffect(() => {
    setInitialData(initialHabits, initialArchivedHabits, initialExecutions, today);
  }, [initialHabits, initialArchivedHabits, initialExecutions, today, setInitialData]);

  return <>{children}</>;
}
