import { CheckCircle2, Clock3, MoreHorizontal, X } from 'lucide-react';
import React from 'react'

export default function BookingStatusCard() {
     const data = [
        {
            label: 'Confirmed',
            value: 824,
            icon: CheckCircle2,
        },
        {
            label: 'Pending',
            value: 124,
            icon: Clock3,
        },
        {
            label: 'Completed',
            value: 245,
            icon: CheckCircle2,
        },
        {
            label: 'Cancelled',
            value: 55,
            icon: X,
        },
    ];
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                        Booking Status
                    </h2>

                    <p className="mt-1 text-xs text-quaternary">
                        Current booking distribution
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-lg p-1.5 text-quaternary-bright transition hover:bg-secondary-dark"
                >
                    <MoreHorizontal size={19} />
                </button>
            </div>

            <div className="space-y-3">
                {data.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl border border-secondary-dark px-3 py-3 transition hover:bg-secondary"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-dark text-quaternary-dark">
                                    <Icon size={17} />
                                </div>

                                <span className="text-sm font-medium text-[#334155]">
                                    {item.label}
                                </span>
                            </div>

                            <span className="text-sm font-bold text-[#0F172A]">
                                {item.value}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
  )
}
