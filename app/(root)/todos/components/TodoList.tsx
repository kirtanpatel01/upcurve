"use client";

import { useSortedTodos } from "../hooks/use-sorted-todos";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoActionDropDown } from "./TodoActionDropDown";
import { toggleTodoCompletion } from "../utils/action";
import TodoForm from "./TodoForm";
import RemainingTime from "./RemainingTime";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "motion/react";
import { useUser } from "@/utils/supabase/use-user";
import { useTodosByUser } from "../hooks/use-todos-by-user";

export default function TodoList() {
  const { user, loading: userLoading } = useUser();
  const { data: todos, isLoading: todosLoading } = useTodosByUser(user?.id);
  const loading = userLoading || todosLoading;
  const [sortBy, setSortBy] = useState("newest");
  const activeTodos = todos?.filter((t) => !t.is_completed) ?? [];
  const sortedTodos = useSortedTodos(
    activeTodos ? [...activeTodos] : [],
    sortBy
  );
  const [animatingTodos, setAnimatingTodos] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="w-ull flex items-center justify-between">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="w-full space-y-3">
          {[...Array(5)].map((_, i) => (
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

  return (
    <div
      className="relative max-h-[calc(100vh-24rem)] sm:max-h-[calc(100vh-9.8rem)] md:max-h-[calc(100vh-9.6rem)] 
      overflow-y-auto scrollbar-none w-full"
    >
      <div className="sticky top-0 flex items-center justify-between gap-3 bg-accent py-3">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highest">Highest priority</SelectItem>
            <SelectItem value="lowest">Lowest priority</SelectItem>
            <SelectItem value="soonest">Shortest time remaining</SelectItem>
            <SelectItem value="latest">Longest time remaining</SelectItem>
          </SelectContent>
        </Select>
        <TodoForm />
      </div>

      <AnimatePresence mode="popLayout">
        {sortedTodos.length > 0 ? (
          sortedTodos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-between shadow-md shadow-primary/15 dark:shadow-background/25 px-3.5 py-1.5 rounded-md bg-background mb-3 overflow-hidden"
            >
              {/* 👇 conditional content */}
              {!todo.is_completed && !animatingTodos.has(todo.id.toString()) ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.is_completed}
                        onCheckedChange={async (checked) => {
                          if (checked) {
                            // start animation immediately
                            setAnimatingTodos((prev) =>
                              new Set(prev).add(todo.id.toString())
                            );

                            // trigger backend update in parallel
                            await toggleTodoCompletion(todo.id, true);

                            // after short delay, allow refetch to replace it
                            setTimeout(() => {
                              setAnimatingTodos((prev) => {
                                const next = new Set(prev);
                                next.delete(todo.id.toString());
                                return next;
                              });
                            }, 700); // matches your animation duration
                          } else {
                            await toggleTodoCompletion(todo.id, false);
                          }
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
                  {todo.desc && (
                    <TooltipContent>Desc: {todo.desc}</TooltipContent>
                  )}
                </Tooltip>
              ) : (
                // ✅ "Completed!" animation
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full text-center text-green-600 font-semibold"
                >
                  Completed!
                </motion.div>
              )}

              {/* Right side buttons visible only when not completed */}
              {!todo.is_completed && (
                <div className="flex items-center gap-1">
                  {todo.deadline && <RemainingTime deadline={todo.deadline} />}
                  <TodoActionDropDown id={todo.id} />
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full bg-background p-10 text-center space-y-4 rounded shadow-md shadow-primary/25 mb-2"
          >
            <h3 className="text-lg font-semibold underline underline-offset-2">
              No todos here!
            </h3>
            <p>Click on the New button and add a new todo to your list.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
