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

const ITEMS_PER_PAGE = 6

function LogsPagination({ exerciseLogs,
  fetching
 }: { 
  exerciseLogs: ExerciseLogsType[],
  fetching: boolean }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(exerciseLogs.length / ITEMS_PER_PAGE)

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const currentLogs = exerciseLogs.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  if(fetching) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-4">
      {/* Render current logs */}
      <ul className="space-y-4">
        {currentLogs.map(log => (
          <LogItem key={log.$id} log={log} />
        ))}
      </ul>

      {/* Pagination Controls */}
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

          {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

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
