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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";
import React, { useState } from "react";
import { Habit } from "../utils/types";
import { Checkbox } from "@/components/ui/checkbox";

function EditHabitDialog({
  habit,
  onUpdate,
}: {
  habit: Habit;
  onUpdate: (id: number, title: string, inList: boolean) => void;
}) {
  const [title, setTitle] = useState(habit.title);
  const [inList, setInList] = useState(habit.in_list);

  const reset = () => {
    setTitle(habit.title);
    setInList(habit.in_list);
  };

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
            onUpdate(habit.id, title, inList);
          }}
        >
          <FieldGroup>
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

            <Field orientation={"horizontal"}>
              <Checkbox
                id="in_list"
                name="in_list"
                checked={inList}
                onCheckedChange={(checked) => setInList(checked === true)}
              />
              <FieldContent>
                <FieldLabel htmlFor="in_list">Include in list ?</FieldLabel>
                <FieldDescription>
                  If you deselect this option the above task will not be
                  included in the list, meaning it won&apos;t appear in daily
                  tasks.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant={"secondary"} onClick={reset}>
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
