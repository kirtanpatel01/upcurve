interface TodoFormValues {
  title: string;
  desc: string;
  deadline: string;
  priority: string;
  id?: number;
  is_completed?: boolean;
}

interface Todo extends Omit<TodoFormValues, "id"> {
    id: number;
}