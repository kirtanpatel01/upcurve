'use client'

import { ExerciseCardType } from '@/components/exercise/ExCards'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'
import { Pause, Play, RotateCcw, X } from 'lucide-react'

export function LogAddForm({
  // id,
  fetching,
  exercise,
  setReps,
  setSetReps,
  setOpenLogForm
}: {
  // id: string
  fetching: boolean
  exercise: ExerciseCardType
  setReps: number[]
  setSetReps: React.Dispatch<React.SetStateAction<number[] | null>>;
  setOpenLogForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<number>(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  // const [isRunning, setIsRunning] = useState(false)
  const [saving, setSaving] = useState(false)
  type TimerState = 'initial' | 'running' | 'paused'
  const [timerState, setTimerState] = useState<TimerState>('initial')

  const handleTimerAction = () => {
    if (timerState === 'initial' || timerState === 'paused') {
      // Start or Resume
      const now = Date.now()
      const resumeBase = startTime ?? now
      setStartTime(resumeBase)

      const id = setInterval(() => {
        setElapsed(Math.floor((Date.now() - resumeBase) / 1000))
      }, 1000)

      setIntervalId(id)
      setTimerState('running')
    } else if (timerState === 'running') {
      // Pause
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      setTimerState('paused')
    }
  }

  const handleReset = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setElapsed(0)
    setStartTime(null)
    setTimerState('initial')
  }

  const handleUpdate = async () => {
    if (!exercise) return

    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
      // setIsRunning(false)
    }

    const performance = setReps
      ? setReps.map((achieved, idx) => {
        const target = exercise.type === "reps" ? exercise.reps : exercise.duration
        return {
          set: idx + 1,
          target,
          achieved,
          completionRate: target ? Math.round((achieved / target) * 100) : 0
        }
      })
      : []

    const overallCompletion = Math.round(
      performance.reduce((acc, p) => acc + p.completionRate, 0) / performance.length
    )

    const payload = {
      user: exercise.user,
      exercise: exercise.$id,
      duration: elapsed,
      overall: overallCompletion,
      performance: JSON.stringify(performance)
    }

    try {
      setSaving(true)
      const res = await axios.post('/api/exercise/history', payload)
      if (res.status === 200) {
        toast.success("Activity saved successfully.")
        setElapsed(0)
        setStartTime(null)
        setTimerState('initial')

        // ✅ Reset reps
        setSetReps(Array(exercise.sets).fill(0))

        // ✅ Close form (optional)
        setOpenLogForm(false)
      }
    } catch (error) {
      // console.log(error)
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Server responded with an error");
      } else {
        toast.error("Unexpected error occurred");
      }
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Error while saving record!")
      } else {
        toast.error("Error while saving record!")
      }
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (sec: number) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }
  const skeletonSetCount = exercise?.sets || 3 // or any placeholder count you want

  const repsToRender = fetching || !setReps
    ? Array(skeletonSetCount).fill('')
    : setReps

  // if (fetching) return <div>Loading...</div>

  return (
    <div className="min-w-56 p-6">
      <Card>
        <CardHeader className='flex justify-between items-center'>
          <CardTitle>
            {fetching ? <Skeleton className='w-32 h-4' /> : exercise?.name}
          </CardTitle>
          <Button
            onClick={() => setOpenLogForm(false)}
            variant={"secondary"}
            className='rounded-full border h-6 w-6 p-1 cursor-pointer hover:bg-black hover:text-white/80'>
            <X />
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className='flex flex-col items-center gap-4'>
          <span className='w-full max-w-96 p-2 border-1 border-sky-400 rounded-full bg-sky-500/10 text-center text-xl font-semibold'>
            {formatTime(elapsed)}
          </span>
          <div className='flex justify-evenly gap-4'>
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={handleTimerAction}
              className={`cursor-pointer`}
            >
              {{
                'initial': <Play />,
                'running': <Pause />,
                'paused': <Play />
              }[timerState]}
            </Button>

            <Button onClick={handleReset} variant='outline' size={"icon"} className='cursor-pointer'>
              <RotateCcw />
            </Button>
          </div>

          <Separator />
          <div
            className={`grid gap-4 ${repsToRender.length <= 3
              ? 'grid-cols-1 place-items-center'
              : 'grid-cols-2'
              }`}
          >
            {repsToRender.map((value, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Label className="font-medium">Set {idx + 1}:</Label>
                <Input
                  type="number"
                  value={value ?? ''}
                  onChange={(e) => {
                    if (!setReps) return
                    const updated = [...setReps]
                    updated[idx] = parseInt(e.target.value) || 0
                    setSetReps(updated)
                  }}
                  className={`w-20 ${fetching ? 'opacity-50' : ''}`}
                  disabled={fetching}
                  placeholder={fetching ? '-' : ''}
                />
                <span> / </span>
                <span>
                  {fetching ? (
                    <span className="flex items-center gap-2">
                      - <Skeleton className="w-10 h-4" />
                    </span>
                  ) : exercise?.type === 'reps'
                    ? exercise?.reps
                    : exercise?.duration}{" "}
                  {exercise?.type}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        <Separator />
        <CardFooter>
          <div className='w-full flex justify-center'>
            <Button
              disabled={saving}
              onClick={handleUpdate}
              className='cursor-pointer'
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
