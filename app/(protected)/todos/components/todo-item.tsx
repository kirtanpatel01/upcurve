"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import RemainingTime from "./remaining-time";
import { TodoAction } from "./todo-action";
import { Badge } from "@/components/ui/badge";
import { Todo } from "../utils/types";

export default function TodoItem({
  todo,
  toggleTodoCompletion,
  togglingId,
  isToggling,
}: {
  todo: Todo;
  toggleTodoCompletion: (id: string) => void;
  togglingId: string | null;
  isToggling: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between"
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

      <div className="flex items-center gap-2">
        {!todo.isCompleted && (
          <div className="flex items-center gap-1">
            {todo.deadline && <RemainingTime deadline={todo.deadline} />}
          </div>
        )}
        <TodoAction todo={todo} />
      </div>
    </div>
  );
}