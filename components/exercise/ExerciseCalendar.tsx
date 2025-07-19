'use client'

import { useCallback, useEffect, useState } from 'react'
import { Calendar } from '../ui/calendar'
import { ExerciseLogsType } from '@/app/(root)/exercise/[id]/page'
import axios from 'axios'
import { client } from '@/lib/appwrite'
import { dbId, exerciseLogCol } from '@/lib/config'
import { Skeleton } from '../ui/skeleton'

function ExerciseCalendar({
  exerciseLogs,
  fetching
}: {
  exerciseLogs: ExerciseLogsType[],
  fetching: boolean
}) {
  // const [date, setDate] = useState<Date | undefined>(undefined)
  const id = exerciseLogs[0]?.exercise
  const [isfetching, setFetching] = useState(true)
  const [streak, setStreak] = useState<null | { current: number, longest: number, lastLoggedAt: string }>(null)

  // Fetch exercise details
  const fetchExercise = useCallback(async () => {
    try {
      const res = await axios.get(`/api/exercise/${id}`)
      if (res.status === 200) {
        const ex = res.data.exercise
        if (ex.streak) {
          try {
            const parsed = JSON.parse(ex.streak)
            setStreak(parsed)
          } catch (e) {
            console.warn("Failed to parse streak:", e)
          }
        }
      }
    } catch (error) {
      console.log("Error while fetching exercise!", error)
    } finally {
      setFetching(false)
    }
  }, [id])


  useEffect(() => {
    if (id) fetchExercise()
  }, [id, fetchExercise])

  const loggedDates = exerciseLogs.map(log => new Date(log.$createdAt))

  // useEffect(() => {
  //   setDate(new Date())
  // }, [])

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${exerciseLogCol}.documents`,
      res => {
        if (typeof res.payload === 'object' && res.payload !== null && '$id' in res.payload) {
          const isCreate = res.events.some(e => e.includes('create'));
          if (isCreate) fetchExercise()
        }
      }
    )

    return () => unsubscribe();
  }, [fetchExercise])

  if (fetching || isfetching) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {/* 🔥 Streak Info */}
      <div className="p-4 rounded-lg bg-card border flex flex-col justify-between items-center text-sm font-mono text-muted-foreground">
        <div className='flex'>
          Current Streak:
          <span className="font-bold text-green-500">
            {fetching ? <Skeleton className='h-4 w-6' /> : streak?.current || 0}
          </span>
        </div>
        <div className='flex'>
          Longest Streak:
          <span className="font-bold text-yellow-500">
            {fetching ? <Skeleton className='h-4 w-6' /> : streak?.longest || 0}
          </span>
        </div>
      </div>

      {/* 📅 Calendar */}
      <Calendar
        mode="single"
        // selected={date}
        // onSelect={setDate}
        className="rounded-lg border"
        modifiers={{
          logged: loggedDates,
        }}
        modifiersClassNames={{
          logged: 'bg-green-500 text-white rounded-md',
        }}
      />
    </div>
  )
}

export default ExerciseCalendar
