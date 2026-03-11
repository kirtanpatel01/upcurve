import { getDashboardData } from './actions'
import { getUser } from '@/lib/auth'
import { SmartNudge } from './components/SmartNudge'
import { FlowScore, FlowScoreDetails } from './components/FlowScore'
import { redirect } from 'next/navigation'

export default async function page() {
  const user = await getUser();
  if (!user) redirect("/login");

  const res = await getDashboardData();
  if (!res.success || !res.data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground italic">Failed to load command center. Please refresh.</p>
      </div>
    );
  }

  const { todos, habits, habitExecutions, exercises, exerciseLogs } = res.data;

  // 1. Calculate Flow Score
  const todoStats = {
    completed: todos.filter(t => t.isCompleted).length,
    total: todos.length
  };
  const habitStats = {
    completed: habitExecutions.length,
    total: habits.length
  };
  const exerciseStats = {
    completed: exerciseLogs.length,
    total: exercises.length
  };

  const todoComp = todoStats.total > 0 ? (todoStats.completed / todoStats.total) : 1;
  const habitComp = habitStats.total > 0 ? (habitStats.completed / habitStats.total) : 1;
  const exerciseComp = exerciseStats.total > 0 ? (exerciseStats.completed / exerciseStats.total) : 1;
  const flowScore = ((todoComp * 0.3) + (habitComp * 0.4) + (exerciseComp * 0.3)) * 100;

  const dashboardStats = {
    todos: todoStats,
    habits: habitStats,
    exercises: exerciseStats
  };

  return (
    <div className="p-3 max-w-7xl space-y-3">
      <SmartNudge
        userName={user.name.split(' ')[0]}
        todoCount={todos.filter(t => !t.isCompleted).length}
        habitCount={habits.length - habitExecutions.length}
      />
      <FlowScore score={flowScore} />
      <FlowScoreDetails stats={dashboardStats} />
    </div>
  )
}
