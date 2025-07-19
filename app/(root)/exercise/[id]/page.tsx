'use client'

import { ExerciseCardType } from '@/components/exercise/ExCards'
import dynamic from 'next/dynamic'

const ExerciseCalendar = dynamic(() => import('@/components/exercise/ExerciseCalendar'), {
  ssr: false,
})

import { HistoryChart } from '@/components/exercise/HistoryChart'
import { LogAddForm } from '@/components/exercise/LogAddForm'
import LogsPagination from '@/components/exercise/LogsPagination'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { client } from '@/lib/appwrite'
import { dbId, exerciseLogCol } from '@/lib/config'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Overview from '@/components/exercise/Overview'

export interface ExerciseLogsType {
  user: string;
  exercise: string;
  $id: string;
  duration: number;
  performance: string;
  overall: number;
  $createdAt: Date;
}

function Page() {
  const params = useParams()
  const id = params?.id as string
  const [openLogForm, setOpenLogForm] = useState(false)
  const [fetching, setFetching] = useState(true)
  // const [logsFetching, setLogFetching] = useState(true)
  const [exercise, setExercise] = useState<ExerciseCardType | null>(null)
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogsType[]>([])
  const [setReps, setSetReps] = useState<number[] | null>(null)

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await axios.get(`/api/exercise/${id}`)
        if (res.status === 200) {
          const ex = res.data.exercise
          setExercise(ex)
          setSetReps(Array(ex.sets).fill(0))
        }
      } catch (error) {
        console.log("Error while fetching exercise!", error)
      } finally {
        setFetching(false)
      }
    }

    const fetchExerciseLogs = async () => {
      try {
        const res = await axios.get(`/api/exercise/history`, {
          params: {
            exerciseId: id,
          }
        })
        if (res.status === 200) {
          setExerciseLogs(res.data.exerciseHistory || [])
        }
      } catch (error) {
        console.log("Error while fetching exercise!", error)
      }
      // } finally {
      //   setLogFetching(false)
      // }
    }

    if (id) {
      fetchExercise()
      fetchExerciseLogs()
    }
  }, [id])


  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${exerciseLogCol}.documents`,
      res => {
        const payload  = res.payload as ExerciseLogsType
        if (typeof res.payload === 'object' && res.payload !== null && '$id' in res.payload) {
          const isCreate = res.events.some(e => e.includes('create'));
          if(isCreate) {
            setExerciseLogs(prev => [...prev, payload])
          }
        }
      }
    )

    return () => unsubscribe();
  }, [])

  return (
    <div className="min-h-[calc(100vh-3rem)] grid grid-cols-1 xl:grid-cols-3">
      <div className="grid grid-rows-[auto_auto_1fr] border-b xl:border-b-0 xl:border-r">
        {openLogForm ? (
          exercise && setReps && (
            <LogAddForm
              fetching={fetching}
              exercise={exercise}
              setReps={setReps}
              setSetReps={setSetReps}
              setOpenLogForm={setOpenLogForm}
            />
          )
        ) : (
          <div className='h-fit m-6 border rounded-lg bg-card flex flex-col gap-4 p-4 justify-between items-center'>
            <div className='min-w-72 flex flex-wrap items-center justify-center gap-2 text-center'>
              <span>Want to add new log activity for</span>
              {fetching ? (
                <Skeleton className='w-20 h-7 rounded-full border borderslate-400/30' />
              ) : (
                <span className='px-2 py-1 rounded-xl bg-accent dark:bg-black border border-slate-400/30 text-sm font-semibold font-mono'>
                  {exercise?.name}
                </span>
              )}
              <span>?</span>
            </div>
            <Separator />
            <Button
              onClick={() => setOpenLogForm(true)}
              disabled={fetching}
              className=''
            >
              Add
            </Button>
          </div>
        )}
        <Separator />
        <div className="overflow-y-auto">
          {exerciseLogs.length > 0 && (
            <HistoryChart fetching={fetching} exerciseLogs={exerciseLogs} />
          )}
        </div>
      </div>
      <div className="p-6 border-b xl:border-r">
        <LogsPagination fetching={fetching} exerciseLogs={exerciseLogs} />
      </div>
      <div className='grid grid-rows-2'>
        <div className="p-6 border-b flex justify-center items-center">
          <ExerciseCalendar fetching={fetching} exerciseLogs={exerciseLogs} />
        </div>
        <div className="p-6 flex justify-center items-center">
          <Overview fetching={fetching} exerciseLogs={exerciseLogs} />
        </div>
      </div>
    </div>
  )
}

export default Page
