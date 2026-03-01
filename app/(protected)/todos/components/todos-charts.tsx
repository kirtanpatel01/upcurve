"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTodos } from "../utils/hooks"
import { useMemo, useState } from "react"
import { format, subDays } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

const chartConfig = {
  views: {
    label: "Tasks",
  },
  created: {
    label: "Created",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function TodosChart() {
  const { data, isLoading } = useTodos();
  const todos = data?.todo || [];
  const [timeRange, setTimeRange] = useState("7");
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("created");

  // Dynamically change tick interval based on timescale to keep x-axis clean
  const tickInterval = useMemo(() => {
    if (timeRange === "7") return 0; // Show all 7 days for maximum clarity
    if (timeRange === "14") return 1; // Gap of 3 for 2 weeks
    if (timeRange === "30") return 3; // Gap of a week for 30 days
    return 0;
  }, [timeRange]);

  const chartData = useMemo(() => {
    const days = parseInt(timeRange);
    const lastDays = Array.from({ length: days }).map((_, i) => {
      return format(subDays(new Date(), days - 1 - i), "MMM d");
    });

    const initialGrouped = lastDays.reduce((acc, dateStr) => {
      acc[dateStr] = { completed: 0, created: 0 };
      return acc;
    }, {} as Record<string, { completed: number; created: number }>);

    const grouped = todos.reduce((acc, todo) => {
      const dateStr = format(new Date(todo.createdAt), "MMM d");

      if (acc[dateStr] !== undefined) {
        acc[dateStr].created += 1;
        if (todo.isCompleted) {
          acc[dateStr].completed += 1;
        }
      }

      return acc;
    }, initialGrouped);

    return lastDays.map((dateStr) => ({
      month: dateStr,
      completed: grouped[dateStr].completed,
      created: grouped[dateStr].created,
    }));
  }, [todos, timeRange]);

  const total = useMemo(
    () => ({
      created: chartData.reduce((acc, curr) => acc + curr.created, 0),
      completed: chartData.reduce((acc, curr) => acc + curr.completed, 0),
    }),
    [chartData]
  );

  return (
    <Card className="py-3 sm:py-4 xl:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 xl:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <CardTitle>Todo Trends</CardTitle>
              <CardDescription>
                Interactive activity history
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] h-8 text-xs cursor-pointer">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex border-t xl:border-t-0">
          {["created", "completed"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 px-3 sm:px-6 py-3 sm:py-4 text-left even:border-l xl:border-l xl:px-8 xl:py-6 cursor-pointer data-[active=true]:text-primary"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold xl:text-3xl">
                  {isLoading ? <Skeleton className="w-8 h-8" /> : total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 xl:p-6">
        <ChartContainer config={chartConfig}>
          {isLoading ? <div><Spinner className="flex items-center gap-1" />Loading data</div> : (
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={tickInterval}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey="views"
                  />
                }
              />
              <Line
                dataKey={activeChart}
                type="step"
                stroke={`var(--color-${activeChart})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
