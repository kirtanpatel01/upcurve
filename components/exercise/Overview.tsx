import { ExerciseLogsType } from '@/app/(root)/exercise/[id]/page'
import React from 'react'

function Overview({ 
  exerciseLogs,
  fetching
 }: { 
  exerciseLogs: ExerciseLogsType[],
  fetching: boolean
 }) {
  if (exerciseLogs.length === 0) return null

  const totalDuration = exerciseLogs.reduce((acc, log) => acc + log.duration, 0)
  const lastLogged = new Date(
    [...exerciseLogs].sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())[0].$createdAt
  ).toLocaleDateString()

  if(fetching) return <div>Loading...</div>

  return (
    <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        📈 Exercise Overview
      </h2>

      <div className="space-y-3 text-base text-muted-foreground font-mono">
        <div className="flex justify-between">
          <span>Total Sessions</span>
          <span className="text-foreground font-semibold">{exerciseLogs.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Time Spent</span>
          <span className="text-foreground font-semibold">{totalDuration} sec</span>
        </div>
        <div className="flex justify-between">
          <span>Last Logged</span>
          <span className="text-foreground font-semibold">{lastLogged}</span>
        </div>
      </div>
    </div>
  )
}

export default Overview
