export interface HabitFormValues {
  id?: number;
  title: string;
  in_list: boolean;
  is_completed?: boolean;
  completed_at?: string;
}

export interface Habit extends Omit<HabitFormValues, "id" | "is_completed"> {
  id: number;
  is_completed: boolean;
  completed_at: string;
}