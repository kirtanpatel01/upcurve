"use client";

import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InsightsAreaChart({
  historicalData,
}: {
  historicalData: { date: string; count: number }[];
}) {
  const [timeRange, setTimeRange] = useState("30d");
  
  const filteredData = useMemo(() => {
    const daysToSubtract = timeRange === "30d" ? 30 : 7;
    
    // We should ensure missing days are padded so the chart doesn't skip days where count is 0.
    const fullRange = Array.from({ length: daysToSubtract }).map((_, i) => {
      const d = subDays(new Date(), daysToSubtract - 1 - i);
      const dStr = format(d, "yyyy-MM-dd");
      const found = historicalData.find((hd) => hd.date === dStr);
      return {
        dateStr: dStr,
        displayDate: format(d, "MMM dd"),
        count: found ? found.count : 0,
      };
    });

    return fullRange;
  }, [historicalData, timeRange]);

  const areaConfig = {
    count: { label: "Completed", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Completion History</CardTitle>
          <CardDescription>
            Showing completed habits over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[110px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={areaConfig}>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="count"
              type="linear"
              fill="url(#fillCount)"
              fillOpacity={0.4}
              stroke="var(--color-count)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
