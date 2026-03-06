"use client";

import { CheckCircle2, Circle, Flame, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BigThreeItem {
  type: "todo" | "habit" | "exercise";
  title: string;
  status: string;
  completed: boolean;
  priority?: "low" | "medium" | "high" | "urgent";
}

interface DailyBigThreeProps {
  items: BigThreeItem[];
}

export function DailyBigThree({ items }: DailyBigThreeProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className={cn(
            "flex-1 flex items-center gap-3 p-3 bg-card border border-border/50 rounded-xl transition-all",
            item.completed && "opacity-60 bg-muted/20"
          )}
        >
          <div className={cn(
            "flex-shrink-0 p-2 rounded-lg bg-muted/50",
            item.type === "todo" && item.completed && "text-primary",
            item.type === "habit" && item.completed && "text-orange-500",
            item.type === "exercise" && item.completed && "text-blue-500"
          )}>
            {item.type === "todo" && <CheckCircle2 size={18} />}
            {item.type === "habit" && <Flame size={18} />}
            {item.type === "exercise" && <Dumbbell size={18} />}
          </div>
          
          <div className="flex flex-col min-w-0">
            <h3 className={cn(
              "font-bold text-sm truncate",
              item.completed && "text-muted-foreground line-through decoration-1"
            )}>
              {item.title}
            </h3>
            <p className="text-[11px] text-muted-foreground truncate">
              {item.completed ? "Done" : item.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
