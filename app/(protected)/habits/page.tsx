import { createClient } from "@/utils/supabase/server";
import HabitList from "./components/habit-list";
import HabitsBarChart from "./components/habits-bar-chart";
import HabitsInsights from "./components/habits-insights";
import Unauthenticated from "@/components/unauthenticated";

export default async function page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <Unauthenticated />

  const { data: habits, error: habitError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (habitError) throw habitError;

  const { data: habitHistory, error: habitHistoryError } = await supabase
    .from("habit_history")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (habitHistoryError) throw habitHistoryError;

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      <HabitList initialHabits={habits} />
      <HabitsBarChart initialHabitHistory={habitHistory} />
      <HabitsInsights habitHistory={habitHistory} />
    </div>
  );
}
