import React from 'react'
import Skeleton from './Skeleton'
import TableOnlySkeleton from './TableOnlySkeleton'

export default function ContentTableSkeleton() {
  return (
    <div className="relative flex flex-col w-full h-full bg-white shadow-md text-default-dark rounded-xl bg-clip-border">
      {/* Header */}
      <div className="relative mx-4 mt-4 bg-white rounded-none text-default-dark bg-clip-border">
        <div className="flex items-start gap-6 px-2 md:justify-between">
          {/* Left title */}
          <div className="space-y-2">
            <Skeleton className="w-20 h-6" /> {/* "List" */}
            <Skeleton className="h-4 w-47 md:w-64" /> {/* subtitle */}
          </div>

          {/* Right search */}
          <div className="hidden w-full max-w-xs md:block">
            <div className="relative">
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pt-4 pb-6">
        <TableOnlySkeleton />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <Skeleton className="w-20 rounded-lg h-9" /> {/* PREVIOUS */}

          <div className="items-center hidden gap-3 md:flex ">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-8 h-4 rounded" /> {/* ... */}
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-4 h-4 rounded" />
          </div>

          <Skeleton className="w-20 rounded-lg h-9" /> {/* NEXT */}
        </div>
      </div>
    </div>
  )
}
