export interface TodoFormValues {
  title: string;
  desc: string;
  deadline: string;
  priority: string;
}

export interface Todo extends Omit<TodoFormValues, "id"> {
  id: number;
  is_completed?: boolean;
  completed_time?: string;
}