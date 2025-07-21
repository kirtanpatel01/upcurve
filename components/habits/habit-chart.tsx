'use client'

import { useCallback, useEffect, useState } from 'react'
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
import { NoData } from '../no-data'

function HabitChart() {
  const [habitHistory, setHabitHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth()

  const getHistory = useCallback(async () => {
    const id = user?.id
    try {
      const res = await axios.get(`/api/habits/history?userId=${id}`)
      if (res.status === 200) {
        setHabitHistory(res.data.chartData)
      }
    } catch (error) {
      console.log("Error while fetching history", error)
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
      setHabitHistory([])
    }
  }, [user, loading]);

  const chartConfig = {
    habits: {
      label: "Completed: ",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  console.log(habitHistory)

  if (habitHistory.length === 0) {
    return (
      <NoData
        title='No History Found'
        message='Please add some habits and wait for 24 hours!'
      />
    )
  }

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
                dataKey="habits"
                type="linear"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default HabitChart