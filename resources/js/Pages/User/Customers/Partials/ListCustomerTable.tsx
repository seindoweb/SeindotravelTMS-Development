import React, { useEffect, useState } from 'react'
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { api } from '@/libs/http/api';
import { Paginate, UserProps } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowDownAZ, ArrowUpZA, PlusIcon } from 'lucide-react';

export default function ListCustomerTable() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState<Paginate<UserProps> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPage = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === "string"
                    ? await api.get<Paginate<UserProps>>(urlOrPage, {
                          search: search,
                      })
                    : await api.get<Paginate<UserProps>>(
                          route("user.customers.retrieveData"),
                          {
                              page: urlOrPage,
                              search: search,
                          },
                      );
            setPage(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const items = page?.data ?? [];
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 pt-4">

           <TableHeader
                title="Active Customers"
                subtitle="Manage registered members and profiles"
                searchValue={search}
                onSearchChange={setSearch}
                dropdownLabel="Sort"
                dropdownActions={[
                    {
                        label: "Name A-Z",
                        icon: <ArrowDownAZ className="w-4 h-4" />,
                        onClick: () => console.log("sort user A-Z"),
                    },
                    {
                        label: "Name Z-A",
                        icon: <ArrowUpZA className="w-4 h-4" />,
                        onClick: () => console.log("sort user Z-A"),
                    },
                ]}
            />

        </div>


        {/* Table */}

        <div className="overflow-x-auto">
        {loading ? (
                <TableOnlySkeleton />
            ) : (
            <table className="w-full min-w-[760px] text-left">

                <thead className="bg-secondary">

                    <tr className="border-b border-[#E2E8F0]">

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                            Booking ID
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                            Customer
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                            Service
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                            Date
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                            Amount
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                            Status
                        </th>

                    </tr>

                </thead>


                <tbody className="divide-y divide-[#F1F5F9]">

                    {/* Booking 1 */}
                    {items.length === 0 ? (
                        <tr>
                            <td
                                className="py-3 text-right"
                                colSpan={5}
                            >
                                <div className="flex justify-center">
                                    <p className="text-xs italic font-medium text-quaternary-bright">
                                        No data available
                                        <span className="hidden sm:inline">
                                            {" "}
                                            in table
                                        </span>
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : ( items.map((val, index) => (
                        <tr key={val.index} className="transition-colors hover:bg-secondary/50">

                            <td className="px-5 py-2.5 whitespace-nowrap">
                                <span className="text-xs font-bold text-primary">
                                    BK-00124
                                </span>
                            </td>

                            <td className="px-5 py-2.5 whitespace-nowrap">
                                <div>
                                    <p className="text-xs font-semibold text-primary">
                                        John Doe
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-quaternary">
                                        john@example.com
                                    </p>
                                </div>
                            </td>

                            <td className="px-5 py-2.5 whitespace-nowrap">
                                <span className="text-xs font-medium text-quaternary-dark">
                                    Flight
                                </span>
                            </td>

                            <td className="px-5 py-2.5 whitespace-nowrap">
                                <span className="text-xs text-quaternary-dark">
                                    28 Aug 2026
                                </span>
                            </td>

                            <td className="px-5 py-2.5 whitespace-nowrap">
                                <span className="text-xs font-bold text-primary">
                                    Rp 4.250.000
                                </span>
                            </td>

                            <td className="px-5 py-2.5 whitespace-nowrap">
                                <span className="inline-flex items-center rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold text-tertiary">
                                    Confirmed
                                </span>
                            </td>

                        </tr>
                        ))
                    )}
                </tbody>

            </table>
            )}
        </div>

        {page && (
            <TablePaginate
                page={page}
                loading={loading}
                onNavigate={(url) => fetchPage(url)}
            />
        )}
    </div>
  )
}
