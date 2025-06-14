import React from 'react'
import { Skeleton } from '../ui/skeleton'

function HabitNoxSkeleton() {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-6 w-6 rounded' />
        <Skeleton className='h-3 rounded-full w-48' />
      </div>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-6 w-6 rounded' />
        <Skeleton className='h-3 rounded-full w-32' />
      </div>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-6 w-6 rounded' />
        <Skeleton className='h-3 rounded-full w-28' />
      </div>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-6 w-6 rounded' />
        <Skeleton className='h-3 rounded-full w-52' />
      </div>
    </div>
  )
}

export default HabitNoxSkeleton