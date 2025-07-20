'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { client } from '@/lib/appwrite'
import { dbId, exerciseLogCol } from '@/lib/config'
import { ExerciseCardType } from '@/components/exercise/ExCards'
import ExerciseCalendar from '@/components/exercise/ExerciseCalendar'
import { HistoryChart } from '@/components/exercise/HistoryChart'
import { LogAddForm } from '@/components/exercise/LogAddForm'
import LogsPagination from '@/components/exercise/LogsPagination'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Overview from '@/components/exercise/Overview'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface ExerciseLogsType {
  user: string;
  exercise: string;
  $id: string;
  duration: number;
  performance: string;
  overall: number;
  $createdAt: Date;
}

function MotivationCard({ exerciseName, onAdd }: { exerciseName?: string, onAdd: () => void }) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-center p-8 w-full">
      <h2 className="text-2xl font-semibold">Let’s Get Started! 💪</h2>
      <p className="text-muted-foreground max-w-md">
        Logging your workouts is the first step toward consistent progress. Add your first log for <span className="font-semibold">{exerciseName}</span> and begin your fitness journey today!
      </p>
      <Button onClick={onAdd} className="mt-4">Add First Log</Button>
    </div>
  )
}

function Page() {
  const params = useParams()
  const id = params?.id as string
  const [openFirstLogDialog, setOpenFirstLogDialog] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [logsFetching, setLogFetching] = useState(true)
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
          params: { exerciseId: id }
        })
        if (res.status === 200) {
          setExerciseLogs(res.data.exerciseHistory || [])
        }
      } catch (error) {
        console.log("Error while fetching exercise logs!", error)
      } finally {
        setLogFetching(false)
      }
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
        const payload = res.payload as ExerciseLogsType
        const isCreate = res.events.some(e => e.includes('create'))
        if (isCreate && payload && '$id' in payload) {
          setExerciseLogs(prev => [...prev, payload])
        }
      }
    )
    return () => unsubscribe()
  }, [])

  // Show motivational view + dialog
  if (!logsFetching && exerciseLogs.length === 0) {
    return (
      <>
        <MotivationCard
          exerciseName={exercise?.name}
          onAdd={() => setOpenFirstLogDialog(true)}
        />

        <Dialog open={openFirstLogDialog} onOpenChange={setOpenFirstLogDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add First Log</DialogTitle>
            </DialogHeader>
            {exercise && setReps && (
              <LogAddForm
                fetching={fetching}
                exercise={exercise}
                setReps={setReps}
                setSetReps={setSetReps}
                setOpenLogForm={() => setOpenFirstLogDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Normal full layout when logs exist
  return (
    <div className="min-h-[calc(100vh-3rem)] grid grid-cols-1 xl:grid-cols-3">
      <div className="grid grid-rows-[auto_auto_1fr] border-b xl:border-b-0 xl:border-r">
        <div className='h-fit m-4 sm:m-6 border rounded-lg bg-card flex flex-col gap-4 p-4 justify-between items-center'>
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
          <Button onClick={() => setOpenFirstLogDialog(true)} disabled={fetching}>
            Add
          </Button>
        </div>
        <Separator />
        <div className="overflow-y-auto">
          <HistoryChart logFetching={logsFetching} exerciseLogs={exerciseLogs} />
        </div>
      </div>
      <div className="p-4 sm:p-6 border-b xl:border-r">
        <LogsPagination logFetching={logsFetching} exerciseLogs={exerciseLogs} />
      </div>
      <div className='grid grid-rows-2'>
        <div className="p-4 sm:p-6 border-b flex justify-center items-center">
          <ExerciseCalendar logFetching={logsFetching} exerciseLogs={exerciseLogs} />
        </div>
        <div className="p-4 sm:p-6 flex justify-center items-center">
          <Overview logFetching={logsFetching} exerciseLogs={exerciseLogs} />
        </div>
      </div>

      <Dialog open={openFirstLogDialog} onOpenChange={setOpenFirstLogDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Log</DialogTitle>
          </DialogHeader>
          {exercise && setReps && (
            <LogAddForm
              fetching={fetching}
              exercise={exercise}
              setReps={setReps}
              setSetReps={setSetReps}
              setOpenLogForm={() => setOpenFirstLogDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page
