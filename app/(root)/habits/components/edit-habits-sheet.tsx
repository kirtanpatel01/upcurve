"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import EditHabitDialog from "./edit-habit-dialog";
import DeleteHabitAlertDialog from "./delete-habit-alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import AddHabitDialog from "./add-habit-dialog";
import EmptyHabits from "./empty-habits";
import { Habit } from "../utils/types";
import { deleteSelectedHabits, updateDraftHabits } from "../utils/action";
import { Spinner } from "@/components/ui/spinner";

function EditHabitsSheet({ habits }: { habits: Habit[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = selected.length === habits.length;
  const [draftHabits, setDraftHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteHabitIds, setDeleteHabitIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (habits && habits.length > 0) {
      setDraftHabits(habits);
    }
  }, [habits]);

  console.log("habits: ", habits);
  console.log("Draft: ", draftHabits);

  const toggleCheckbox = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(draftHabits.map((h) => h.id));
    } else {
      setSelected([]);
    }
  };

  const handleDeleteSelected = () => {
    selected.map((h) => handleDelete(h));
    setSelected([]);
  };

  const handleUpdate = (id: number, title: string) => {
    setDraftHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, title } : h))
    );
  };
  
  const handleDelete = (id: number) => {
    setDeleteHabitIds((prev) => [...prev, id]);
    setDraftHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDraftHabits(draftHabits);
      await deleteSelectedHabits(deleteHabitIds)
      toast.success("Changes saved successfully!");
      setOpen(false)
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setDraftHabits(habits);
    toast.info("Restored latest data from server.");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button">
          <Edit className="mr-2 h-4 w-4" />
          Update
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit your habit task list</SheetTitle>
          <SheetDescription>Add, Edit or Remove your tasks.</SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-2">
          {draftHabits.length > 0 && <AddHabitDialog />}
          {draftHabits && draftHabits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                      aria-label="Select all"
                    />
                  </TableHead>
                  {/* <TableHead className="text-center">Sr. No.</TableHead> */}
                  <TableHead>Title</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {draftHabits.map((habit) => (
                  <TableRow
                    key={habit.id}
                    className={
                      selected.includes(habit.id)
                        ? "bg-primary/5 transition-colors"
                        : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(habit.id)}
                        onCheckedChange={() => toggleCheckbox(habit.id)}
                      />
                    </TableCell>
                    {/* <TableCell className="text-center">{habit.id}</TableCell> */}
                    <TableCell
                      className="max-w-[150px] truncate whitespace-nowrap overflow-hidden"
                      title={habit.title}
                    >
                      {habit.title}
                    </TableCell>
                    <TableCell>
                      <EditHabitDialog habit={habit} onUpdate={handleUpdate} />
                    </TableCell>
                    <TableCell>
                      <DeleteHabitAlertDialog
                        habit={habit}
                        onDelete={handleDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyHabits />
          )}

          <AnimatePresence>
            {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="mt-4 flex justify-end"
              >
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selected.length})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Spinner /> : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default EditHabitsSheet;
