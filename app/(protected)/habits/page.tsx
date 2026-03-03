import HabitList from "./components/habit-list";
import { getHabits, getHabitExecutions, getArchivedHabits } from "./actions";
import { format } from "date-fns";

export default async function HabitsPage() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [habitsRes, executionsRes, archivedRes] = await Promise.all([
    getHabits(),
    getHabitExecutions(today),
    getArchivedHabits(),
  ]);

  if (!habitsRes.success || !executionsRes.success || !archivedRes.success) {
    return <div>Error loading habits</div>;
  }

  return (
    <div className="p-3 flex flex-col mx-auto max-w-xl w-full gap-3">
      <HabitList
        initialHabits={habitsRes.habits || []}
        initialExecutions={executionsRes.executions || []}
        initialArchivedHabits={archivedRes.habits || []}
        today={today}
      />
    </div>
  );
}
