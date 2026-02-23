import  HabitList from "./components/habit-list";
import HabitsBarChart from "./components/habits-bar-chart";
import HabitsInsights from "./components/habits-insights";
import Unauthenticated from "@/components/unauthenticated";

export default async function page() {
  // if (!user) return <Unauthenticated />

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      <HabitList initialHabits={[]} />
      <HabitsBarChart initialHabitHistory={[]} />
      <HabitsInsights habitHistory={[]} />
    </div>
  );
}
