"use client";

import HabitList from "./components/habit-list";
import HabitsBarChart from "./components/habits-bar-chart";
import { useHabitsByUser } from "./hooks/use-habits-by-user";
import { useUser } from "@/utils/supabase/use-user";

function Page() {
  const { user, loading } = useUser();
  const { data: habits, isLoading } = useHabitsByUser(user?.id);

  console.log(habits)
  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      <HabitList habits={habits || []} loading={loading || isLoading} />
      <HabitsBarChart />
    </div>
  );
}

export default Page;
