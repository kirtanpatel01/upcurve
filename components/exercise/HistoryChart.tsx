"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ExerciseLogsType } from "@/app/(root)/exercise/[id]/page"
import { useEffect, useState } from "react"

const chartConfig = {
  overall: {
    label: "Performance %: ",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ExerciseLogsChartDataType {
  overall: number;
  date: string
}

export function HistoryChart({ 
  exerciseLogs,
  fetching
 }: { 
  exerciseLogs: ExerciseLogsType[],
  fetching: boolean
 }) {
  const [chartData, setChartData] = useState<ExerciseLogsChartDataType[] | []>([])

  useEffect(() => {
    const grouped: Record<string, number[]> = {}

    for (const log of exerciseLogs) {
      const date = new Date(log.$createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      if (!grouped[date]) {
        grouped[date] = [log.overall];
      } else {
        grouped[date].push(log.overall);
      }
    }

    const chartData = Object.entries(grouped).map(([date, values]) => ({
      date,
      overall: Math.max(...values), // 👈 max overall
    }));

    setChartData(chartData);
  }, [exerciseLogs]);

  if(fetching) return <div>Loading...</div>

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Log Activity</CardTitle>
          <CardDescription>Shows only best performance of the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}

              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-overall)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-overall)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="overall"
                type="natural"
                fill="url(#fillOverall)"
                fillOpacity={0.4}
                stroke="var(--color-overall)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
