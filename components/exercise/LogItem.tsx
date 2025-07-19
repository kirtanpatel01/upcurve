import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseLogsType } from '@/app/(root)/exercise/[id]/page'

type PerformanceLog = {
  set: number
  achieved: number
  target: number
  completionRate: number
}


export function LogItem({ log }: { log: ExerciseLogsType }) {
  const [expanded, setExpanded] = useState(false)
  const performance = JSON.parse(log.performance)

  return (
    <li key={log.$id} className="p-4 rounded-lg bg-card border space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-xs font-mono text-muted-foreground">
          Date: {new Date(log.$createdAt).toLocaleString()}
        </div>
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="text-xs text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
        >
          {expanded ? 'Hide' : 'Show'} Details
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <div className="text-sm font-medium">Duration: {log.duration} sec</div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-3"
          >
            <div className="font-semibold text-sm">Performance:</div>
            <div className="space-y-2">
              {performance.map((p: PerformanceLog, index: number) => (
                <div
                  key={index}
                  className="rounded-md border px-3 py-2 space-y-1"
                >
                  <div className="flex justify-between text-sm">
                    <span>Set {p.set}</span>
                    <span className="text-muted-foreground">
                      {p.achieved} / {p.target}
                    </span>
                    <span
                      className={`font-semibold ${
                        p.completionRate >= 80
                          ? 'text-green-600'
                          : p.completionRate >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {p.completionRate}%
                    </span>
                  </div>
                  <Progress value={p.completionRate} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
