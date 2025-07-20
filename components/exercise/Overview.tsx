import { ExerciseLogsType } from '@/app/(root)/exercise/[id]/page'
import { Skeleton } from '../ui/skeleton'

function Overview({
  exerciseLogs,
  logFetching
}: {
  exerciseLogs: ExerciseLogsType[]
  logFetching: boolean
}) {
  if (logFetching) {
    return (
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          📈 Exercise Overview
        </h2>

        <div className="space-y-3 text-base text-muted-foreground font-mono">
          <div className="flex justify-between">
            <span>Total Sessions</span>
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex justify-between">
            <span>Total Time Spent</span>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <span>Last Logged</span>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (exerciseLogs.length === 0) {
    return (
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg space-y-4 text-center">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          📈 Exercise Overview
        </h2>
        <p className="text-muted-foreground">No logs!</p>
      </div>
    )
  }

  const totalDuration = exerciseLogs.reduce((acc, log) => acc + log.duration, 0)
  const lastLogged = new Date(
    [...exerciseLogs].sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())[0].$createdAt
  ).toLocaleDateString()

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
