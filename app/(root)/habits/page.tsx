import HabitList from "./components/habit-list";
import HabitsBarChart from "./components/habits-bar-chart";

export default function page() {
  return (
    <div className="p-4 flex gap-4">
      <HabitList />
      <HabitsBarChart />
    </div>
  );
}
