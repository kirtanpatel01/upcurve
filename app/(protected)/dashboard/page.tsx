import React from 'react'
import { getDashboardData } from './actions'
import { getUser } from '@/lib/auth'
import { SmartNudge } from './components/SmartNudge'
import { FlowScore } from './components/FlowScore'
import { DailyBigThree } from './components/DailyBigThree'
import { ConsistencyHeatmap } from './components/ConsistencyHeatmap'
import { redirect } from 'next/navigation'

export const dynamic = "force-dynamic";

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

  const { todos, habits, habitExecutions, exercises, exerciseLogs, heatmap } = res.data;

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

  // 2. Select Daily Big Three
  const nextTodo = todos.find(t => !t.isCompleted) || todos[0];
  const nextHabit = habits.find(h => !habitExecutions.some(e => e.habitId === h.id)) || habits[0];
  const nextExercise = exercises.find(ex => !exerciseLogs.some(l => l.exerciseId === ex.id)) || exercises[0];

  const bigThree = [
    {
      type: "todo" as const,
      title: nextTodo?.title || "No tasks yet",
      status: nextTodo?.priority || "Normal",
      completed: nextTodo ? nextTodo.isCompleted : true,
      priority: nextTodo?.priority
    },
    {
      type: "habit" as const,
      title: nextHabit?.name || "No habits set",
      status: "Daily Ritual",
      completed: nextHabit ? habitExecutions.some(e => e.habitId === nextHabit.id) : true
    },
    {
      type: "exercise" as const,
      title: nextExercise?.name || "No workout",
      status: "Move today",
      completed: nextExercise ? exerciseLogs.some(l => l.exerciseId === nextExercise.id) : true
    }
  ];

  return (
    <div className="p-3 max-w-7xl mx-auto space-y-3 h-[calc(100dvh-4rem)] overflow-y-auto scrollbar-hide">
      {/* Header & Nudge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-border/10 pb-3">
        <SmartNudge 
          userName={user.name.split(' ')[0]} 
          todoCount={todos.filter(t => !t.isCompleted).length}
          habitCount={habits.length - habitExecutions.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
        {/* Left: Score & Heatmap (Focus Stats) */}
        <div className="lg:col-span-4 space-y-3">
          <FlowScore score={flowScore} stats={dashboardStats} />
          <ConsistencyHeatmap data={heatmap} />
        </div>

        {/* Right: Big Three (Action) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-sm font-bold text-muted-foreground">Daily Big Three</h2>
            </div>
            <DailyBigThree items={bigThree} />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-muted/20 border border-border/50 flex flex-col justify-center gap-1">
              <span className="text-2xl font-bold">{todos.length}</span>
              <span className="text-sm font-semibold text-muted-foreground">Active Tasks</span>
            </div>
            <div className="p-3 rounded-2xl bg-muted/20 border border-border/50 flex flex-col justify-center gap-1">
              <span className="text-2xl font-bold">{habits.length}</span>
              <span className="text-sm font-semibold text-muted-foreground">Rituals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}