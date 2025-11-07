import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Ban } from "lucide-react";
import React from "react";
import AddHabitDialog from "./add-habit-dialog";

function EmptyHabits({ list }: { list?: boolean }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ban className="h-8 w-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No habits yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any habits yet. Start building good ones today!
        </EmptyDescription>
      </EmptyHeader>
      {!list && (
        <EmptyContent>
          <AddHabitDialog />
        </EmptyContent>
      )}
    </Empty>
  );
}

export default EmptyHabits;
