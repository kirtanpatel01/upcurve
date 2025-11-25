import { createClient } from "@/utils/supabase/server";
import HabitList from "./components/habit-list";
import HabitsBarChart from "./components/habits-bar-chart";

export default async function page() {
  const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if(!user) {
      return <div>You&apos;re not authenticated!</div>
    }
  
  return (
    <div className="p-4 flex flex-col xl:flex-row xl:gap-4">
      <HabitList userId={user?.id} />
      <HabitsBarChart userId={user?.id} />
    </div>
  );
}
