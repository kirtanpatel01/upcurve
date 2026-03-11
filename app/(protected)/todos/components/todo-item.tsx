"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Todo } from "../utils/types";
import { useTodoStore } from "./todo-store-provider";
import { toggleTodoCompletion, editTodo, deleteTodo, toggleTodoArchive } from "../utils/action";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { Archive, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TodoItem({
  todo,
}: {
  todo: Todo;
}) {
  const updateTodoInStore = useTodoStore((state) => state.updateTodoInStore);
  const removeTodoFromStore = useTodoStore((state) => state.removeTodoFromStore);
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggleCompletion = async () => {
    const nextState = !todo.isCompleted;
    updateTodoInStore(todo.id, { isCompleted: nextState, completedAt: nextState ? new Date() : null });

    try {
      const res = await toggleTodoCompletion(todo.id, nextState);
      if (!res.success) {
        updateTodoInStore(todo.id, { isCompleted: !nextState, completedAt: !nextState ? new Date() : null });
        toast.error("Failed to update todo");
      }
    } catch (err) {
      updateTodoInStore(todo.id, { isCompleted: !nextState, completedAt: !nextState ? new Date() : null });
      toast.error("An error occurred");
    }
  };

  const handleTitleSubmit = async () => {
    if (title === todo.title) {
      setIsEditing(false);
      return;
    }

    if (title.trim() === "") {
      setTitle(todo.title);
      setIsEditing(false);
      return;
    }

    const previousTitle = todo.title;
    updateTodoInStore(todo.id, { title });
    setIsEditing(false);

    try {
      const res = await editTodo({ title }, todo.id);
      if (!res.success) {
        updateTodoInStore(todo.id, { title: previousTitle });
        setTitle(previousTitle);
        toast.error("Failed to update title");
      }
    } catch (err) {
      updateTodoInStore(todo.id, { title: previousTitle });
      setTitle(previousTitle);
      toast.error("An error occurred");
    }
  };

  const handleArchive = async () => {
    const nextArchived = !todo.isArchived;
    // For simplicity, we remove it from the current view regardless of which tab we are on,
    // assuming the parent filter will handle it. But to be safe, we just update store.
    updateTodoInStore(todo.id, { isArchived: nextArchived });
    
    try {
      const res = await toggleTodoArchive(todo.id, nextArchived);
      if (!res.success) {
        updateTodoInStore(todo.id, { isArchived: !nextArchived });
        toast.error("Failed to update archive status");
      }
    } catch (err) {
      updateTodoInStore(todo.id, { isArchived: !nextArchived });
      toast.error("An error occurred");
    }
  };

  const handleDelete = async () => {
    removeTodoFromStore(todo.id);
    try {
      const res = await deleteTodo(todo.id);
      if (!res.success) {
        // Rollback is harder with removeTodoFromStore unless we keep the todo object
        toast.error("Failed to delete todo. Refresh to see it again.");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="group flex items-center gap-3 hover:bg-muted/30 rounded-lg transition-all">
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={handleToggleCompletion}
        disabled={todo.isCompleted}
        className="w-5 h-5 rounded-full border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300"
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSubmit();
              if (e.key === "Escape") {
                setTitle(todo.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-transparent border-none p-0 focus:ring-0 text-[15px] font-medium"
          />
        ) : (
          <span
            onClick={() => !todo.isCompleted && setIsEditing(true)}
            className={cn(
              "block text-[15px] font-medium transition-all duration-300",
              todo.isCompleted 
                ? "text-muted-foreground line-through opacity-60 cursor-default" 
                : "text-foreground cursor-text"
            )}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={handleArchive}
          title={todo.isArchived ? "Unarchive" : "Archive"}
        >
          {todo.isArchived ? <Undo2 size={16} /> : <Archive size={16} />}
        </Button>
        {(!todo.isCompleted || todo.isArchived) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
