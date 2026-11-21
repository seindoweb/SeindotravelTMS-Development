import { formatRupiah } from '@/helpers';
import { api } from '@/libs/http/api';
import { SupplierBalanceProps } from '@/types';
import { CheckCircle2, Clock3, MoreHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function SupplierBalanceCard() {
    const [page, setPage] = useState<SupplierBalanceProps[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPage = async () => {
        setLoading(true);
        try {
            const res = await api.get<SupplierBalanceProps[]>(
                route('dashboard.retrieveSupbal'),
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
                        Supplier Balance
                    </h2>

                    <p className="mt-1 text-xs text-quaternary">
                        Available funds and balance overview
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
                                    key={item.index}
                                    className="px-3 py-3 rounded-xl border-secondary-dark hover:bg-secondary flex items-center justify-between border transition"
                                >
                                    <div className="gap-3 flex items-center">
                                        <div className="rounded-lg h-9 w-9 bg-secondary-dark text-quaternary-dark flex items-center justify-center">
                                            <p>
                                                {item.supplier?.name_initials}
                                            </p>
                                        </div>

                                        <span className="text-sm font-medium text-[#334155]">
                                            {item.supplier?.name}
                                        </span>
                                    </div>

                                    <span className="text-sm font-bold text-[#0F172A]">
                                        {formatRupiah(item.current_balance)}
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
