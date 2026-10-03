import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasPrev?: boolean;
    hasNext?: boolean;
    className?: string;
    prevLabel?: string;
    nextLabel?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasPrev,
    hasNext,
    className = '',
    prevLabel = 'Sebelumnya',
    nextLabel = 'Selanjutnya',
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const canPrev = hasPrev !== undefined ? hasPrev : currentPage > 1;
    const canNext = hasNext !== undefined ? hasNext : currentPage < totalPages;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (p) => {
            return (
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 1
            );
        },
    );

    return (
        <div
            className={`bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between shadow-sm ${className}`}
        >
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canPrev}
                className="flex items-center gap-1 text-xs font-bold text-primary disabled:text-gray-300 disabled:cursor-not-allowed hover:text-primary-bright px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:pointer-events-none"
            >
                <ChevronLeft size={16} />
                <span>{prevLabel}</span>
            </button>

            <div className="flex items-center gap-1.5">
                {pageNumbers.map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                        <React.Fragment key={p}>
                            {showEllipsis && (
                                <span className="text-xs text-gray-400 px-1 select-none">
                                    ...
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    currentPage === p
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {p}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canNext}
                className="flex items-center gap-1 text-xs font-bold text-primary disabled:text-gray-300 disabled:cursor-not-allowed hover:text-primary-bright px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:pointer-events-none"
            >
                <span>{nextLabel}</span>
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
