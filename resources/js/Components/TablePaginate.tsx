import React from 'react';
import { Paginate } from '@/types';

function stripHtmlEntities(label: string) {
    if (label.includes('Sebelumnya') || label.includes('Previous')) {
        return '';
    }
    if (label.includes('Berikutnya') || label.includes('Next')) {
        return '';
    }
    // biar "&laquo; Previous" tampil bagus
    return label.replaceAll('&laquo;', '«').replaceAll('&raquo;', '»');
}

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

export default function TablePaginate<T>({
    page,
    loading = false,
    onNavigate,
}: {
    page: Paginate<T>;
    loading?: boolean;
    onNavigate: (url: string) => void;
}) {
    const numberLinks = page.links.filter((l) => {
        const txt = stripHtmlEntities(l.label).toLowerCase();
        return !txt.includes('previous') && !txt.includes('next');
    });
    return (
        <div className="p-4 border-blue-gray-50 flex items-center justify-between border-t">
            {/* Prev */}
            <button
                className="rounded-lg border-gray-900 py-2 px-4 font-sans text-xs font-bold text-primary focus:ring-gray-300 border text-center align-middle uppercase transition-all select-none hover:opacity-75 focus:ring active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                disabled={!page.prev_page_url}
                onClick={() =>
                    page.prev_page_url && onNavigate(page.prev_page_url)
                }
            >
                Prev
            </button>

            {/* Numbers */}
            {!loading ? (
                <div className="gap-2 lg:flex hidden items-center">
                    {numberLinks.map((l, idx) => {
                        const label = stripHtmlEntities(l.label);
                        const isDots = label === '...';
                        const isActive = l.active;

                        return (
                            <button
                                key={idx}
                                type="button"
                                disabled={!l.url || isDots}
                                onClick={() => l.url && onNavigate(l.url)}
                                className={cx(
                                    'h-8 w-8 rounded-lg font-sans text-xs font-medium text-primary relative max-h-[32px] max-w-[32px] text-center align-middle uppercase transition-all select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
                                    isActive
                                        ? 'border-primary-dark focus:ring-gray-300 border hover:opacity-75 focus:ring active:opacity-[0.85]'
                                        : 'hover:bg-gray-900/10 active:bg-gray-900/20',
                                )}
                            >
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="gap-2 lg:flex hidden items-center">
                    {/* first pages */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 bg-gray-200 rounded-lg"
                        />
                    ))}

                    {/* dots */}
                    <div className="w-6 h-4 bg-gray-200 rounded" />

                    {/* last pages */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 bg-gray-200 rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Next */}
            <button
                className="rounded-lg border-gray-900 py-2 px-4 font-sans text-xs font-bold text-primary focus:ring-gray-300 border text-center align-middle uppercase transition-all select-none hover:opacity-75 focus:ring active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                disabled={!page.next_page_url}
                onClick={() =>
                    page.next_page_url && onNavigate(page.next_page_url)
                }
            >
                Next
            </button>
        </div>
    );
}
