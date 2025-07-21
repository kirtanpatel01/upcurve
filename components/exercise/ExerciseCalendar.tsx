'use client'

import { useCallback, useEffect, useState } from 'react'
import { Calendar } from '../ui/calendar'
import { ExerciseLogsType } from '@/app/(root)/exercise/[id]/page'
import axios from 'axios'
import { client } from '@/lib/appwrite'
import { dbId, exerciseLogCol } from '@/lib/config'
import { Skeleton } from '../ui/skeleton'
import { NoData } from '../no-data'

function ExerciseCalendar({
  exerciseLogs,
  logFetching
}: {
  exerciseLogs: ExerciseLogsType[]
  logFetching: boolean
}) {
  const id = exerciseLogs[0]?.exercise
  const [isfetching, setIsFetching] = useState(true)
  const [streak, setStreak] = useState<null | {
    current: number
    longest: number
    lastLoggedAt: string
  }>(null)

  const fetchExercise = useCallback(async () => {
    if (!id) return
    try {
      const res = await axios.get(`/api/exercise/${id}`)
      if (res.status === 200) {
        const ex = res.data.exercise
        if (ex.streak) {
          try {
            const parsed = JSON.parse(ex.streak)
            setStreak(parsed)
          } catch (e) {
            console.warn('Failed to parse streak:', e)
          }
        }
      }
    } catch (error) {
      console.log('Error while fetching exercise!', error)
    } finally {
      setIsFetching(false)
    }
  }, [id])

  useEffect(() => {
    if (id) fetchExercise()
  }, [id, fetchExercise])

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${exerciseLogCol}.documents`,
      (res) => {
        const isCreate = res.events.some((e) => e.includes('create'))
        if (isCreate) fetchExercise()
      }
    )

    return () => unsubscribe()
  }, [fetchExercise])

  const loggedDates = exerciseLogs.map((log) => new Date(log.$createdAt))

  return (
    <div className="space-y-4">
      {/* 🔥 Streak Info */}
      <div className="p-4 rounded-lg bg-card border flex flex-col justify-between items-center text-sm font-mono text-muted-foreground">
        <div className="flex">
          Current Streak:
          <span className="font-bold text-green-500 ml-2">
            {isfetching && !streak === null ? (
              <Skeleton className="h-4 w-5" />
            ) : (
              streak?.current ?? '0'
            )}
          </span>
        </div>
        <div className="flex">
          Longest Streak:
          <span className="font-bold text-yellow-500 ml-2">
            {isfetching && !streak === null ? (
              <Skeleton className="h-4 w-5" />
            ) : (
              streak?.current ?? '0'
            )}
          </span>
        </div>
      </div>

      {/* 📅 Calendar */}
      {logFetching ? (
        <Skeleton className="w-68 h-[300px] rounded-lg border" />
      ) : exerciseLogs.length === 0 ? (
        <NoData
          title="No Logs Yet"
          message="Start logging to view your progress on the calendar 📅"
          className="h-[300px] w-68"
        />
      ) : (
        <Calendar
          mode="single"
          className="rounded-lg border"
          modifiers={{ logged: loggedDates }}
          modifiersClassNames={{
            logged: 'bg-green-500 text-white rounded-md',
          }}
        />
      )}
    </div>
  )
}

export default ExerciseCalendar
