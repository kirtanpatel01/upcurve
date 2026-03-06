"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FlowScoreProps {
  score: number; // 0 to 100
  stats: {
    todos: { completed: number; total: number };
    habits: { completed: number; total: number };
    exercises: { completed: number; total: number };
  };
}

export function FlowScore({ score, stats }: FlowScoreProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-3 bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90">
          {/* Background Ring */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted/20"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#flowGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold"
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-sm font-semibold text-muted-foreground">Flow</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <h3 className="font-bold text-foreground">Daily Efficiency</h3>
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all outline-none cursor-pointer">
              <Info size={12} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Daily Efficiency Score</DialogTitle>
              <DialogDescription>
                Calculation breakdown based on your activity today:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Habits (40%)</span>
                    <span className="text-xs text-muted-foreground">
                      {stats.habits.completed} of {stats.habits.total} rituals done
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {stats.habits.total > 0 ? Math.round((stats.habits.completed / stats.habits.total) * 40) : 40} pts
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Todos (30%)</span>
                    <span className="text-xs text-muted-foreground">
                      {stats.todos.completed} of {stats.todos.total} tasks completed
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {stats.todos.total > 0 ? Math.round((stats.todos.completed / stats.todos.total) * 30) : 30} pts
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Exercises (30%)</span>
                    <span className="text-xs text-muted-foreground">
                      {stats.exercises.completed} of {stats.exercises.total} workouts logged
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {stats.exercises.total > 0 ? Math.round((stats.exercises.completed / stats.exercises.total) * 30) : 30} pts
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground italic text-center">
                Score = (Habit% × 0.4) + (Todo% × 0.3) + (Exercise% × 0.3)
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-muted-foreground">Keep the streak alive.</p>

      {/* Subtle Shine Effect */}
      <div className="absolute -inset-x-full top-0 h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />
    </div>
  );
}
