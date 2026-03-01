"use client";

import TodoForm from "./TodoForm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import RemainingTime from "./RemainingTime";
import { TodoAction } from "./todo-action";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/ui/empty";
import { toggleTodoCompletionMutation, useTodos } from "../utils/hooks";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function TodoList() {
  const { data, isLoading, error } = useTodos();
  const visibleTodos = useMemo(() => {
    if (!data?.todo) return [];

    return data.todo
      .filter((t) => !t.isArchived)
      .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }, [data?.todo]);

  const { mutate: toggleTodoCompletion, variables: togglingId, isPending: isToggling } = toggleTodoCompletionMutation();

  console.log(togglingId)
  if (isLoading) {
    return (
      <div className="w-full max-w-lg">
        <div className="space-y-3">
          <TodoForm />
          {
            [1,2,3,4].map((todo) => (
              <div
                key={todo}
                className="w-full flex items-center justify-between border border-border/30 p-3 rounded-md"
              > 
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="bg-transparent">
                  <MoreVertical size={16} />
                </Skeleton>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-lg">
        <p className="text-red-400">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      {visibleTodos.length > 0 ? (
        <div className="space-y-3">
          <TodoForm />
          <AnimatePresence mode="popLayout">
            {visibleTodos.map((todo) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 25 },
                  opacity: { duration: 0.2 },
                  y: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
                key={todo.id}
                className={cn(
                  "w-full flex items-center justify-between border border-border/30 p-3 rounded-md transition-colors duration-200 bg-background"
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.isCompleted}
                        onCheckedChange={() => toggleTodoCompletion(todo.id)}
                        disabled={togglingId === todo.id && isToggling}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`todo-${todo.id}`}
                        className={cn(
                          "cursor-pointer select-none capitalize transition-all duration-200",
                          todo.isCompleted && "line-through text-gray-400"
                        )}
                      >
                        {todo.title}
                      </Label>
                      {todo.priority && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-1 capitalize border-transparent text-[10px] px-1.5 py-0",
                            todo.priority === "low" && "bg-muted text-muted-foreground",
                            todo.priority === "medium" && "bg-blue-500/10 text-blue-500",
                            todo.priority === "high" && "bg-orange-500/10 text-orange-500",
                            todo.priority === "urgent" && "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {todo.priority}
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  {todo.desc && <TooltipContent>Desc: {todo.desc}</TooltipContent>}
                </Tooltip>

                {!todo.isCompleted && (
                  <div className="flex items-center gap-1">
                    {todo.deadline && <RemainingTime deadline={todo.deadline} />}
                  </div>
                )}
                <TodoAction todo={todo} />
              </motion.div>
            ))}
          </AnimatePresence>
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
