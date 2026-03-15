"use client";

import { format } from "date-fns";
import { PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { useHabitStore } from "./habit-store-provider";

export default function InsightsRadialChart() {
  const activeCount = useHabitStore((state) => state.activeHabits.length);
  const completedCount = useHabitStore((state) => state.activeHabits.filter((h) =>
    state.executions.find((e) => e.habitId === h.id && e.completed === true)
  ).length);

  const radialData = [
    { name: "Completed", value: completedCount, fill: "var(--color-completed)" },
  ];

  const radialConfig = {
    value: { label: "Completed" },
    completed: { label: "Completed", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const endAngle = activeCount > 0 ? (completedCount / activeCount) * 360 : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Today's Progress</CardTitle>
        <CardDescription>{format(new Date(), "MMMM do, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={radialConfig}
        >
          <RadialBarChart
            data={radialData}
            startAngle={90}
            endAngle={90 - endAngle}
            innerRadius={65}
            outerRadius={90}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[71, 59]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {completedCount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          / {activeCount} Habits
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="leading-none text-muted-foreground">
          {completedCount === activeCount && activeCount > 0
            ? "All habits completed! Great job!"
            : `${activeCount - completedCount} more to go for today.`}
        </div>
      </CardFooter>
    </Card>
  );
}
