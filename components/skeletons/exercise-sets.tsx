import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

function ExerciseSets({ idx }: { idx: number }) {
  return (
    <div key={idx} className="flex items-center gap-4">
      <Label className="font-medium">Set {idx + 1}:</Label>
      <Input className="w-20" />
      <span> / </span>
      <span>
        {"-"}
      </span>
    </div>
  )
}

export default ExerciseSets