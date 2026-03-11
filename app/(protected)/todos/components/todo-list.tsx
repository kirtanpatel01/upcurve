"use client";

import TodoForm from "./todo-form";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoItem from "./todo-item";
import { useTodoStore } from "./todo-store-provider";
import ArchivedDialog from "./archived-dialog";

interface TodoListProps {
  view?: "active" | "archived";
}

export default function TodoList({ view = "active" }: TodoListProps) {
  const todos = useTodoStore((state) => state.todos);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTodos = useMemo(() => {
    return (todos || [])
      .filter((t) => !t.isArchived && !t.isCompleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [todos]);

  const completedTodos = useMemo(() => {
    return (todos || [])
      .filter((t) => !t.isArchived && t.isCompleted)
      .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime());
  }, [todos]);

  const archivedTodos = useMemo(() => {
    return (todos || [])
      .filter((t) => t.isArchived)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [todos]);

  if (view === "archived") {
    return (
      <div className="space-y-2">
        {archivedTodos.length > 0 ? (
          <ul className="space-y-2">
            {archivedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center text-muted-foreground opacity-40">
            No archived todos found.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-between gap-2">
        <TodoForm />
        <div className="hidden lg:block">
          <ArchivedDialog />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] pr-3 group/scroll">
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-2 opacity-40">
            <span className="text-4xl">✨</span>
            <p className="font-medium">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTodos.length > 0 && (
              <ul className="space-y-2">
                {activeTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ul>
            )}

            {completedTodos.length > 0 && (
              <div className="">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-2 text-sm text-muted-foreground/60 w-full hover:bg-muted/30 p-1.5 rounded-lg transition-colors cursor-pointer font-medium group"
                >
                  {showCompleted ? <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /> : <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                  Completed ({completedTodos.length})
                </button>
                {showCompleted && (
                  <ul className="space-y-2">
                    {completedTodos.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Desktop Archived Dialog Trigger at bottom of ScrollArea content */}

          </div>
        )}
      </ScrollArea>
    </div>
  );
}
