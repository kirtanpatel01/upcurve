'use client'

import { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

type NoDataProps = {
  title?: string
  message?: string
  icon?: ReactNode
  className?: string
}

export function NoData({
  title = 'No Data Found',
  message = 'There is no information available yet.',
  icon = <AlertTriangle className="w-6 h-6 text-yellow-500" />,
  className = ''
}: NoDataProps) {
  return (
    <div
      className={`w-fit flex flex-col items-center justify-center text-center p-6 text-muted-foreground border border-dashed rounded-xl ${className}`}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm mt-1">{message}</p>
    </div>
  )
}
