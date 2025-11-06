"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Todo } from "../utils/types";
import { groupTodosByDay } from "../utils/group-by-todos";
import { groupTodosByHour } from "../utils/group-by-todos-hour";
import { filterTodosByRange } from "../utils/filter-todos";

export const description = "Todos completion chart";

const chartConfig = {
  count: {
    label: "Completed Todos:",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TodosBarChart({
  todos,
  loading,
}: {
  todos: Todo[];
  loading: boolean;
}) {
  const [range, setRange] = useState<
    "today" | "yesterday" | "lastWeek" | "lastMonth"
  >("lastWeek");

  const rangeLabels: Record<typeof range, string> = {
    today: "Today",
    yesterday: "Yesterday",
    lastWeek: "Last 7 Days",
    lastMonth: "Last 30 Days",
  };

  const chartData = useMemo(() => {
    const filtered = filterTodosByRange(todos, range);
    if (range === "today" || range === "yesterday") {
      return groupTodosByHour(filtered);
    }
    return groupTodosByDay(filtered);
  }, [todos, range]);

  return (
    <Card className="max-w-xl w-full">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Todos Activity</CardTitle>
          <CardDescription>{rangeLabels[range]} summary</CardDescription>
        </div>

        <Select
          value={range}
          onValueChange={(
            v: "today" | "yesterday" | "lastWeek" | "lastMonth"
          ) => setRange(v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="lastWeek">Last 7 Days</SelectItem>
            <SelectItem value="lastMonth">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-24 sm:py-32">
            <Spinner />
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">
            No completed todos in this period.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={
                  range === "today" || range === "yesterday" ? "hour" : "date"
                }
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) =>
                  range === "today" || range === "yesterday"
                    ? `${v}:00`
                    : v.slice(5)
                }
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={6} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
