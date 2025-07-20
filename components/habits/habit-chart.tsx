'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart'

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis
} from 'recharts'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

function HabitChart() {
  const [habitHistory, setHabitHistory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()
  // const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const getHistory = useCallback(async () => {
    const id = user?.id
    try {
      const res = await axios.get(`/api/habits/history?userId=${id}`)
      setHabitHistory(res.data.chartData)
    } catch (error) {
      console.log("Error while fetching history", error)
      // toast.error("Error while fetching history!")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (loading) return

    if (user) {
      getHistory()
    } else {
      setIsLoading(false)
    }
  }, [user, loading, getHistory])

  useEffect(() => {
    if (!user && !loading) {
      setHabitHistory(null)
    }
  }, [user, loading]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card className='sm:max-w-lg w-full min-h-96'>
      <CardHeader>
        <CardTitle>Habit Completion History</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || loading ? (
          <div className='text-center mt-24'>Loading...</div>
        ) : (
          habitHistory ? (
            <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={habitHistory || []}
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
              // tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="count"
                type="linear"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
          ) : (
            <div className='mt-24 flex justify-center items-center'>
              No History found!
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}

export default HabitChart