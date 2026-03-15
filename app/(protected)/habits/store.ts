import { createStore } from "zustand";

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

export interface HabitStoreState {
  activeHabits: Habit[];
  archivedHabits: Habit[];
  executions: Execution[];
  historicalData: { date: string; count: number }[];
  today: string;
  isInitialized: boolean;
}

export interface HabitStoreActions {
  setInitialData: (
    habits: Habit[],
    archived: Habit[],
    execs: Execution[],
    historical: { date: string; count: number }[],
    today: string
  ) => void;
  addHabit: (habit: Habit) => void;
  removeActiveHabit: (id: string) => void;
  removeArchivedHabit: (id: string) => void;
  updateHabitName: (id: string, name: string) => void;
  toggleArchive: (habit: Habit) => void;
  toggleExecution: (habitId: string) => void;
}

export type HabitStore = HabitStoreState & HabitStoreActions;

export const createHabitStore = (initialState: Partial<HabitStoreState> = {}) => {
  return createStore<HabitStore>((set) => ({
    activeHabits: [],
    archivedHabits: [],
    executions: [],
    historicalData: [],
    today: "",
    isInitialized: false,
    ...initialState,

    setInitialData: (habits, archived, execs, historical, today) => 
      set({ 
        activeHabits: habits, 
        archivedHabits: archived, 
        executions: execs, 
        historicalData: historical,
        today, 
        isInitialized: true 
      }),

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
};
