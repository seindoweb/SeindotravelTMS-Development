import { Badge } from '@/Components/Badge';
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { api } from '@/libs/http/api';
import { Paginate, UserProps } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { useEffect, useState } from 'react';

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

            <div className="overflow-x-auto">
                {loading ? (
                    <TableOnlySkeleton />
                ) : (
                    <table className="w-full min-w-[860px] text-left">

                        <thead className="bg-secondary">
                            <tr className="border-b border-[#E2E8F0]">

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                    Customer
                                </th>

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                    Phone
                                </th>

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                    Tracking Code
                                </th>

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                    Type
                                </th>

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                    Joined
                                </th>

                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-quaternary">
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#F1F5F9]">
                            {items.length === 0 ? (
                                <tr>
                                    <td className="py-3 text-right" colSpan={7}>
                                        <div className="flex justify-center">
                                            <p className="text-xs italic font-medium text-quaternary-bright">
                                                No data available
                                                <span className="hidden sm:inline"> in table</span>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((val) => (
                                    <tr key={val.index} className="transition-colors hover:bg-secondary/50">
                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={val.profile_photo_path}
                                                    alt={val.full_name}
                                                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                                                />
                                                <div>
                                                    <p className="text-xs font-semibold text-primary">
                                                        {val.title ? `${val.title} ` : ''}{val.full_name}
                                                    </p>
                                                    <p className="mt-0.5 text-[10px] text-quaternary">
                                                        {val.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            {val.phone_number ? (
                                                <span className="text-xs text-quaternary-dark">
                                                    {val.dial_code && (
                                                        <span className="text-quaternary">{val.dial_code} </span>
                                                    )}
                                                    {val.phone_number}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] italic text-quaternary-bright">—</span>
                                            )}
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            <span className="font-mono text-[11px] text-quaternary-dark tracking-wider">
                                                {val.tracking_code ?? '—'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            {val.is_agent ? (
                                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold text-purple-700">
                                                    Agent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-bold text-quaternary">
                                                    Regular
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            {val.active ? (
                                               <Badge variant="green">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge>Inactive</Badge>
                                                    )}
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            <span className="text-xs text-quaternary-dark">
                                                {val.created_at
                                                    ? new Date(val.created_at).toLocaleDateString('en-GB', {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '—'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap text-right">
                                            <button
                                                type="button"
                                                onClick={() => router.visit(route('user.customers.show', { tracking_code: val.tracking_code }))}
                                                className="text-[10px] font-semibold text-primary hover:underline"
                                            >
                                                View
                                            </button>
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
