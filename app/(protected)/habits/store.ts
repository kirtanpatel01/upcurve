import { create } from "zustand";

export type Habit = {
  id: string;
  name: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type Execution = {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
};

interface HabitStore {
  activeHabits: Habit[];
  archivedHabits: Habit[];
  executions: Execution[];
  today: string;
  isInitialized: boolean;

  setInitialData: (
    habits: Habit[],
    archived: Habit[],
    execs: Execution[],
    today: string
  ) => void;

  addHabit: (habit: Habit) => void;
  removeActiveHabit: (id: string) => void;
  removeArchivedHabit: (id: string) => void;
  updateHabitName: (id: string, name: string) => void;
  toggleArchive: (habit: Habit) => void;
  toggleExecution: (habitId: string) => void;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  activeHabits: [],
  archivedHabits: [],
  executions: [],
  today: "",
  isInitialized: false,

  setInitialData: (habits, archived, execs, today) => 
    set({ activeHabits: habits, archivedHabits: archived, executions: execs, today, isInitialized: true }),

  addHabit: (habit) => 
    set((state) => ({ activeHabits: [habit, ...state.activeHabits] })),

  removeActiveHabit: (id) =>
    set((state) => ({ activeHabits: state.activeHabits.filter((h) => h.id !== id) })),

  removeArchivedHabit: (id) =>
    set((state) => ({ archivedHabits: state.archivedHabits.filter((h) => h.id !== id) })),

  updateHabitName: (id, name) =>
    set((state) => ({
      activeHabits: state.activeHabits.map((h) => (h.id === id ? { ...h, name } : h)),
    })),

  toggleArchive: (habit) => 
    set((state) => {
      const isArchiving = !habit.isArchived;
      if (isArchiving) {
        return {
          activeHabits: state.activeHabits.filter((h) => h.id !== habit.id),
          archivedHabits: [{ ...habit, isArchived: true }, ...state.archivedHabits],
        };
      } else {
        return {
          archivedHabits: state.archivedHabits.filter((h) => h.id !== habit.id),
          activeHabits: [{ ...habit, isArchived: false }, ...state.activeHabits],
        };
      }
    }),

  toggleExecution: (habitId) =>
    set((state) => {
      const existing = state.executions.find((e) => e.habitId === habitId);
      if (existing) {
        return {
          executions: state.executions.map((e) => 
            e.habitId === habitId ? { ...e, completed: !e.completed } : e
          )
        };
      }
      return {
        executions: [
          ...state.executions,
          { id: crypto.randomUUID(), habitId, date: state.today, completed: true }
        ]
      };
    }),
}));
