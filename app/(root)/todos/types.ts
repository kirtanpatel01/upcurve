export interface TodoFormValues {
  title: string;
  desc: string;
  deadline: string;
  priority: string;
  id?: number;
  is_completed?: boolean;
}

export interface Todo extends Omit<TodoFormValues, "id"> {
    id: number;
}