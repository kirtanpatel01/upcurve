"use client";

import { 
  format, 
  subDays, 
  eachDayOfInterval, 
  isSameDay, 
  startOfMonth, 
  eachMonthOfInterval 
} from "date-fns";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeatmapData {
  habits: { date: string; count: number }[];
  todos: { date: string; count: number }[];
  exercises: { date: string; count: number }[];
}

interface ConsistencyHeatmapProps {
  data: HeatmapData;
}

export function ConsistencyHeatmap({ data }: ConsistencyHeatmapProps) {
  const endDate = new Date();
  const startDate = subDays(endDate, 365); // Full Year
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getHeatColor = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    
    // Check all three sources
    const habitCount = data.habits.find(h => h.date === dateStr)?.count || 0;
    const todoCount = data.todos.find(t => t.date === dateStr)?.count || 0;
    const exerciseCount = data.exercises.find(e => e.date === dateStr)?.count || 0;
    
    const count = habitCount + todoCount + exerciseCount;
    
    if (count === 0) return "bg-muted/30";
    if (count < 3) return "bg-primary/30";
    if (count < 6) return "bg-primary/60";
    return "bg-primary";
  };

  // Group days into weeks for GitHub-style layout (Columns = Weeks)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || isSameDay(day, endDate)) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Calculate Month Labels positions
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  const monthLabels = months.map(month => {
    const firstDay = startOfMonth(month);
    const weekIndex = weeks.findIndex(week => week.some(day => isSameDay(day, firstDay)));
    if (weekIndex === -1) return null;
    return { label: format(month, "MMM"), weekIndex };
  }).filter(Boolean);

  return (
    <div className="p-3 bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-muted-foreground">Activity Rhythm</h3>
        <span className="text-xs text-muted-foreground">Last 12 Months</span>
      </div>
      
      {/* Scrollable Container */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="min-w-[700px] flex flex-col gap-2">
            
            {/* Month Labels */}
            <div className="relative h-4 text-[10px] text-muted-foreground font-medium mb-1">
              {monthLabels.map((m, idx) => (
                <div 
                  key={idx} 
                  className="absolute" 
                  style={{ left: `${(m?.weekIndex || 0) * 12.5}px` }}
                >
                  {m?.label}
                </div>
              ))}
            </div>

            {/* Grid: Days in Columns (Weeks) */}
            <div className="flex gap-1">
              {/* Day Labels (Vertical) */}
              <div className="flex flex-col gap-1 pr-2 pt-[1px] text-[9px] text-muted-foreground leading-[12px] h-[100px] justify-between">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              
              <div className="flex gap-1">
                <TooltipProvider delayDuration={0}>
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {/* Placeholder for empty days at start of year */}
                      {wIdx === 0 && week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-2.5 h-2.5" />
                      ))}
                      
                      {week.map((day, dIdx) => (
                        <Tooltip key={dIdx}>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "w-2.5 h-2.5 rounded-[1px] cursor-help transition-all hover:scale-125 hover:ring-1 hover:ring-primary/50",
                              getHeatColor(day)
                            )} />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <span className="font-bold">{format(day, "MMM d, yyyy")}</span>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground font-medium">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 bg-muted/30 rounded-[1px]" />
            <div className="w-2.5 h-2.5 bg-primary/30 rounded-[1px]" />
            <div className="w-2.5 h-2.5 bg-primary/60 rounded-[1px]" />
            <div className="w-2.5 h-2.5 bg-primary rounded-[1px]" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
