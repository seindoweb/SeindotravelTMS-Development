import { CalendarDays, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

export default function StatCard({
    title,
    value,
    change,
    positive,
    icon: Icon,
    loading,
}: {
    title: string;
    value: string;
    change: string;
    positive: boolean;
    icon: typeof CalendarDays;
    loading?: boolean;
}) {
    return (
        <div className="group rounded-2xl bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md border border-[#E2E8F0] transition-all duration-200">
            <div className="gap-3 flex items-start justify-between">
                <div className="h-11 w-11 rounded-xl bg-secondary-dark group-hover:bg-primary group-hover:text-white flex items-center justify-center text-[#334155] transition-colors">
                    <Icon size={21} />
                </div>

                {loading ? (
                    <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full" />
                ) : (
                    <span
                        className={[
                            'gap-1 px-2 py-1 font-bold flex items-center rounded-full text-[11px]',
                            positive
                                ? 'bg-secondary-dark text-[#334155]'
                                : 'bg-tertiary/10 text-tertiary',
                        ].join(' ')}
                    >
                        {positive ? (
                            <TrendingUp size={12} />
                        ) : (
                            <TrendingDown size={12} />
                        )}
                        {change}
                    </span>
                )}
            </div>

            <div className="mt-5">
                <p className="text-xs font-medium text-quaternary">{title}</p>

                {loading ? (
                    <div className="h-8 mt-2 bg-gray-200 rounded-md w-28 animate-pulse" />
                ) : (
                    <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}
