import React from "react";
import Skeleton from "./Skeleton";

interface TableOnlySkeletonProps {
    rowHeight?: string;
}

export default function TableOnlySkeleton({
    rowHeight = "67px",
}: TableOnlySkeletonProps) {
    return (
        <div className="overflow-hidden border border-gray-200 rounded-lg">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs text-gray-600 bg-gray-50">
                <div className="col-span-4">
                    <Skeleton className="w-24 h-4" />
                </div>

                <div className="hidden col-span-2 sm:block">
                    <Skeleton className="w-16 h-4" />
                </div>

                <div className="hidden col-span-3 md:block">
                    <Skeleton className="h-4 w-14" />
                </div>

                <div className="hidden col-span-2 xl:block">
                    <Skeleton className="w-16 h-4" />
                </div>

                <div className="col-span-1">
                    <Skeleton className="w-16 h-4" />
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-200">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                        key={idx}
                        style={{ height: rowHeight }}
                        className="grid grid-cols-12 gap-4 px-1 md:px-4"
                    >
                        {/* Transaction */}
                        <div className="flex items-center col-span-4 gap-3">
                            <Skeleton className="hidden w-10 h-10 rounded-full sm:block" />

                            <div className="space-y-2">
                                <Skeleton className="w-12 h-4 md:w-24" />
                                <Skeleton className="w-12 h-3" />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="items-center hidden col-span-2 sm:flex">
                            <Skeleton className="w-20 h-4" />
                        </div>

                        {/* Date */}
                        <div className="items-center hidden col-span-3 md:flex">
                            <Skeleton className="h-4 w-28" />
                        </div>

                        {/* Status */}
                        <div className="items-center hidden col-span-2 xl:flex">
                            <Skeleton className="h-6 rounded-full w-14" />
                        </div>

                        {/* Account */}
                        <div className="flex items-center justify-between col-span-1 gap-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-10 h-8 rounded-md" />

                                <div className="space-y-1">
                                    <Skeleton className="w-16 h-3" />
                                    <Skeleton className="w-12 h-3" />
                                </div>
                            </div>

                            <Skeleton className="w-5 h-5 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
