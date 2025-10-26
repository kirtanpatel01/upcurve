
import { useTodosByUser } from "../hooks/use-todos-by-user";
import { useUser } from "@/utils/supabase/use-user";
import { useToggleTodo } from "../hooks/use-toggle-todo";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import TodoForm from "./TodoForm";

export default function TodoList() {
  const { user, loading: userLoading } = useUser();
  const { data: todos, isLoading: todosLoading } = useTodosByUser(user?.id);
  const toggleTodo = useToggleTodo();

  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  if (todosLoading || userLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <span className="loading loading-sm loading-dots"></span>
        Fetching your todos...
      </div>
    );
  }
  const groupedTodos = {
    high: [] as Todo[],
    medium: [] as Todo[],
    low: [] as Todo[],
  };

  todos?.forEach((todo) => {
    if (todo.priority === "high") groupedTodos.high.push(todo);
    else if (todo.priority === "medium") groupedTodos.medium.push(todo);
    else groupedTodos.low.push(todo);
  });

  return (
    <div className="min-h-96 bg-base-200/15 flex flex-col gap-4 p-4 border border-base-200 rounded-lg shadow mt-6">
      {["high", "medium", "low"].map((priority) => {
        const todosByPriority =
          groupedTodos[priority as keyof typeof groupedTodos];
        if (todosByPriority.length === 0) return null;

        return (
          <div key={priority}>
            <span className="font-medium text-xs capitalize">
              {priority} priority
            </span>
            <ul className="space-y-1">
              {todosByPriority.map((todo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center bg-base-300/75 px-3 py-2 rounded-md"
                >
                  <label
                    htmlFor={todo.title}
                    className="flex items-center gap-2 hover:bg-base-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      id={todo.title}
                      checked={todo.is_completed}
                      onChange={(e) =>
                        toggleTodo.mutate({
                          id: todo.id,
                          completed: e.target.checked,
                        })
                      }
                    />
                    <span
                      className={`transition-all duration-200 ${
                        todo.is_completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                  </label>
                  <div className="flex items-center">
                    <span
                      className={`badge dark:badge-soft badge-sm capitalize ${
                        todo.priority === "high"
                          ? "badge-primary"
                          : todo.priority === "medium"
                          ? "badge-secondary"
                          : ""
                      }`}
                    >
                      {todo.priority}
                    </span>
                    <div className="dropdown">
                      <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer hover:bg-slate-600/10 p-1 rounded-full ml-1"
                      >
                        <EllipsisVertical size={16} />
                      </div>
                      <ul
                        tabIndex="-1"
                        className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
                      >
                        <li>
                          <button
                            onClick={() => {
                              setEditTodoId(todo?.id)
                              const el =
                                document.getElementById("add_todo_modal");
                              if (el instanceof HTMLDialogElement)
                                el.showModal();
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button className="text-error hover:text-white hover:bg-error">
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <TodoForm
        edit={!!editTodoId}
        id={editTodoId || undefined}
        onClose={() => setEditTodoId(null)}
      />
    </div>
  );
}
