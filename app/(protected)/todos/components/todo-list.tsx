"use client";

import TodoForm from "./todo-form";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/ui/empty";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoItem from "./todo-item";
import { useTodoStore } from "./todo-store-provider";

export default function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const [showCompleted, setShowCompleted] = useState(false);

  const visibleTodos = useMemo(() => {
    return (todos || [])
      .filter((t) => !t.isArchived)
      .sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [todos]);

  const incompletedTodos = useMemo(() => visibleTodos.filter(t => !t.isCompleted), [visibleTodos]);
  const completedTodos = useMemo(() => visibleTodos.filter(t => t.isCompleted), [visibleTodos]);

  return (
    <div className="w-full max-w-lg">
      {visibleTodos.length > 0 ? (
        <div className="space-y-3">
          <TodoForm />
          <ScrollArea className="h-[calc(100vh-11rem)] pr-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Incompleted Todos */}
            {incompletedTodos.length > 0 && (
              <ul className="space-y-3">
                {incompletedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                  />
                ))}
              </ul>
            )}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
               <div className="mt-6">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-2 text-sm text-muted-foreground w-full hover:bg-muted/50 rounded-md transition-colors cursor-pointer font-medium"
                >
                  {showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  Completed ({completedTodos.length})
                </button>
                {showCompleted && (
                  <ul className="space-y-3 mt-3">
                    {completedTodos.map((todo) => (
                      <TodoItem 
                        key={todo.id} 
                        todo={todo} 
                      />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No todos found</EmptyTitle>
            <EmptyDescription>Add todos to get started</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <TodoForm />
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
