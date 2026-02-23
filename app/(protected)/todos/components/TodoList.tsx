"use client";

import { Skeleton } from "@/components/ui/skeleton";
import TodoForm from "./TodoForm";
import { type Todo } from "../utils/types";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import RemainingTime from "./RemainingTime";
import { TodoActionDropDown } from "./TodoActionDropDown";
import { toast } from "sonner";

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  async function toggleTodoCompletion(id: number, completed: boolean) {
    toast.success("Todo completed!");
  }

  const activeTodos = todos?.filter((t) => !t.is_completed) ?? [];

  return (
    <div
      className="relative max-h-[calc(100vh-24rem)] sm:max-h-[calc(100vh-9.8rem)] md:max-h-[calc(100vh-9.6rem)] 
      overflow-y-auto scrollbar-none w-full space-y-3"
    >
      <TodoForm />
      {activeTodos.length > 0 ? (
        activeTodos.map((todo) => (
          <div
            key={todo.id}
            className="w-full flex items-center justify-between shadow-md shadow-primary/15 dark:shadow-background/25 px-3.5 py-1.5 rounded-md bg-background mb-3 overflow-hidden"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.is_completed}
                    onCheckedChange={async () => {
                      await toggleTodoCompletion(todo.id, true);
                    }}
                  />
                  <Label
                    htmlFor={`todo-${todo.id}`}
                    className={cn(
                      "cursor-pointer select-none capitalize transition-all duration-200",
                      todo.is_completed && "line-through text-gray-400"
                    )}
                  >
                    {todo.title}
                  </Label>
                </div>
              </TooltipTrigger>
              {todo.desc && <TooltipContent>Desc: {todo.desc}</TooltipContent>}
            </Tooltip>

            {!todo.is_completed && (
              <div className="flex items-center gap-1">
                {todo.deadline && <RemainingTime deadline={todo.deadline} />}
                <TodoActionDropDown todo={todo} />
              </div>
            )}
          </div>
        ))
      ) : (
        <EmptyTodos />
      )}
    </div>
  );
}

export function TodosSkeleton() {
  return (
    <div className="w-full space-y-3">
      <div className="w-ull flex items-center justify-between">
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="w-full space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between inset-shadow-sm inset-shadow-accent/20 
            px-3 py-1.5 rounded-md bg-background"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4.5 w-4.5 rounded-sm" />
              <Skeleton className="h-4.5 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyTodos() {
  return (
    <div
      key="empty"
      className="w-full h-full bg-background p-10 text-center space-y-4 rounded shadow-md shadow-primary/25 mb-2"
    >
      <h3 className="text-lg font-semibold underline underline-offset-2">
        No todos here!
      </h3>
      <p>Click on the New button and add a new todo to your list.</p>
    </div>
  );
}
