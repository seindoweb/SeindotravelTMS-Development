import { formatDate } from '@/helpers';
import { api } from '@/libs/http/api';
import { UserProps } from '@/types';
import { CheckCircle2, Clock3, MoreHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function LastRegisteredCustomerCard() {
    const [page, setPage] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPage = async () => {
        setLoading(true);
        try {
            const res = await api.get<UserProps[]>(
                route('dashboard.retrieveLarecu'),
            );
            setPage(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = page ?? [];

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E2E8F0]">
            <div className="mb-5 flex items-start justify-between">
                <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                        Last Registered Customer
                    </h2>

                    <p className="mt-1 text-xs text-quaternary">
                        Overview of newest registered users
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-lg p-1.5 text-quaternary-bright hover:bg-secondary-dark transition"
                >
                    <MoreHorizontal size={19} />
                </button>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((skeleton) => (
                            <div
                                key={skeleton}
                                className="px-3 py-3 rounded-xl border-secondary-dark animate-pulse flex items-center justify-between border"
                            >
                                <div className="gap-3 flex items-center">
                                    <div className="rounded-lg h-9 w-9 bg-secondary-dark" />
                                    <div className="space-y-2">
                                        <div className="w-24 h-3.5 rounded bg-secondary-dark" />
                                        <div className="w-16 h-2.5 rounded bg-secondary-dark" />
                                    </div>
                                </div>
                                <div className="w-12 h-4 rounded bg-secondary-dark" />
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-8 text-xs rounded-xl border-secondary-dark text-quaternary border border-dashed text-center">
                        No registered customers found.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => {
                            return (
                                <div
                                    key={item.key}
                                    className="px-3 py-3 rounded-xl border-secondary-dark hover:bg-secondary flex items-center justify-between border transition"
                                >
                                    <div className="gap-3 flex items-center">
                                        <div className="rounded-lg h-9 w-9 bg-secondary-dark text-quaternary-dark flex items-center justify-center">
                                            {/* {Icon && <Icon size={17} />} */}
                                            <img
                                                src={item.profile_photo_path}
                                                alt={item.full_name}
                                                className="w-10 h-10 flex-shrink-0 object-cover"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium truncate text-[#334155]">
                                                {item.full_name}
                                            </p>
                                            <p className="text-xs text-quaternary truncate">
                                                {item.email}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs semibold-bold text-quaternary">
                                        {item.created_at
                                            ? formatDate(item.created_at)
                                            : '—'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
