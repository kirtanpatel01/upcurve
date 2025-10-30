"use client";

import { useTodosByUser } from "../hooks/use-todos-by-user";
import { useUser } from "@/utils/supabase/use-user";
import { useToggleTodo } from "../hooks/use-toggle-todo";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoActionDropDown } from "./TodoActionDropDown";

export default function TodoList() {
  const { user, loading: userLoading } = useUser();
  const { data: todos, isLoading: todosLoading } = useTodosByUser(user?.id);
  const toggleTodo = useToggleTodo();

  const isLoading = userLoading || todosLoading;

  if (isLoading) {
    return (
      <div className="w-full space-y-3 max-h-[calc(100vh-13rem)] overflow-y-auto scrollbar-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between inset-shadow-sm inset-shadow-accent/20 px-3 py-1.5 rounded-md bg-background"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4.5 w-4.5 rounded-sm" />
              <Skeleton className="h-4.5 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-32rem)] sm:max-h-[calc(100vh-9.8rem)] md:max-h-[calc(100vh-12.8rem)] overflow-y-auto scroll w-full space-y-3">
      {todos &&
        todos.map((todo) => (
          <div
            key={todo.id}
            className="w-full flex items-center justify-between inset-shadow-sm inset-shadow-accent/20 shadow-md shadow-primary/15 dark:shadow-background/25
            px-3.5 py-1.5 rounded-md bg-background relative"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.is_completed}
                onCheckedChange={(checked) =>
                  toggleTodo.mutate({
                    id: todo?.id,
                    completed: !!checked,
                  })
                }
              />
              <Label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  "cursor-pointer select-none capitalize",
                  todo.is_completed && "line-through text-gray-400"
                )}
              >
                {todo.title}
              </Label>
            </div>
            <TodoActionDropDown id={todo.id} />
          </div>
        ))}
    </div>
  );
}
