"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";
import React, { useState } from "react";
import { Habit } from "../utils/types";

function EditHabitDialog({
  habit,
  onUpdate,
}: {
  habit: Habit;
  onUpdate: (id: number, title: string) => void;
}) {
  const [title, setTitle] = useState(habit.title);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="secondary">
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Change the title of your habit task...
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-dialog-form"
          onSubmit={(e) => {
            e.preventDefault();
            onUpdate(habit.id, title);
          }}
        >
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              placeholder="Enter title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setTitle(habit.title)}
          >
            Reset
          </Button>
          <DialogClose asChild>
            <Button type="submit" form="edit-dialog-form">
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditHabitDialog;
