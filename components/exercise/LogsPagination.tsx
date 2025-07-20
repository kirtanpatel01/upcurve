'use client'

import React, { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ExerciseLogsType } from '@/app/(root)/exercise/[id]/page'
import { LogItem } from './LogItem'
import { Skeleton } from '../ui/skeleton'
import { NoData } from '../no-data'

const ITEMS_PER_PAGE = 6

function LogsPagination({
  exerciseLogs,
  logFetching
}: {
  exerciseLogs: ExerciseLogsType[],
  logFetching: boolean
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(exerciseLogs.length / ITEMS_PER_PAGE)

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const currentLogs = exerciseLogs.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  // 🔄 Skeleton UI while loading
  if (logFetching) {
    return (
      <div className="flex flex-col gap-4">
        <ul className="space-y-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <li key={idx} className="p-4 border rounded-lg bg-card space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </li>
          ))}
        </ul>

        <Pagination>
          <PaginationContent>
            {Array.from({ length: 5 }).map((_, i) => (
              <PaginationItem key={i}>
                <Skeleton className="h-8 w-8 rounded" />
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    )
  }

  // 🚫 No logs
  if (!logFetching && exerciseLogs.length === 0) {
    return (
      <NoData
        title="No Logs Found"
        message="Once you start logging your exercises, they will appear here 💪"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ✅ Render logs */}
      <ul className="space-y-4">
        {currentLogs.map(log => (
          <LogItem key={log.$id} log={log} />
        ))}
      </ul>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handleClick(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={i + 1 === currentPage}
                onClick={() => handleClick(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handleClick(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default LogsPagination
