import { Badge } from '@/Components/Badge';
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatDate } from '@/helpers';
import { api } from '@/libs/http/api';
import { Paginate, UserProps } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowDownAZ, ArrowUpZA, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ListCustomerTable() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState<Paginate<UserProps> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPage = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === 'string'
                    ? await api.get<Paginate<UserProps>>(urlOrPage, {
                          search: search,
                      })
                    : await api.get<Paginate<UserProps>>(
                          route('user.customers.retrieveData'),
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
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-[#E2E8F0]">
            <div className="px-5 pt-4 flex items-center justify-between border-b border-[#F1F5F9]">
                <TableHeader
                    title="Active Customers"
                    subtitle="Manage registered members and profiles"
                    searchValue={search}
                    onSearchChange={setSearch}
                    dropdownLabel="Sort"
                    dropdownActions={[
                        {
                            label: 'Name A-Z',
                            icon: <ArrowDownAZ className="w-4 h-4" />,
                            onClick: () => console.log('sort user A-Z'),
                        },
                        {
                            label: 'Name Z-A',
                            icon: <ArrowUpZA className="w-4 h-4" />,
                            onClick: () => console.log('sort user Z-A'),
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
                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-[10px] uppercase">
                                    Customer
                                </th>

                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-[10px] uppercase">
                                    Phone
                                </th>

                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-right text-[10px] uppercase">
                                    Credit Balance
                                </th>

                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-center text-[10px] uppercase">
                                    Upline
                                </th>

                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-center text-[10px] uppercase">
                                    Verified
                                </th>

                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-center text-[10px] uppercase">
                                    Joined
                                </th>

                                <th className="px-5 py-3 font-bold tracking-wider text-quaternary text-[10px] uppercase"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#F1F5F9]">
                            {items.length === 0 ? (
                                <tr>
                                    <td className="py-3 text-right" colSpan={7}>
                                        <div className="flex justify-center">
                                            <p className="text-xs font-medium text-quaternary-bright italic">
                                                No data available
                                                <span className="sm:inline hidden">
                                                    {' '}
                                                    in table
                                                </span>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((val) => (
                                    <tr
                                        key={val.index}
                                        className="hover:bg-secondary/50 transition-colors"
                                    >
                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            <div className="gap-3 flex items-center">
                                                <img
                                                    src={val.profile_photo_path}
                                                    alt={val.full_name}
                                                    className="w-8 h-8 flex-shrink-0 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-xs font-medium text-primary">
                                                        {val.title
                                                            ? `${val.title} `
                                                            : ''}
                                                        {val.full_name}
                                                    </p>
                                                    <p className="mt-0.5 text-quaternary text-[10px]">
                                                        {val.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-2.5 whitespace-nowrap">
                                            {val.phone_number ? (
                                                <span className="text-xs text-quaternary-dark">
                                                    {val.dial_code && (
                                                        <span className="text-quaternary">
                                                            {val.dial_code}{' '}
                                                        </span>
                                                    )}
                                                    {val.phone_number}
                                                </span>
                                            ) : (
                                                <span className="text-quaternary-bright text-[10px] italic">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-2.5 text-right whitespace-nowrap">
                                            <span className="font-mono text-quaternary-dark tracking-wider text-[11px]">
                                                {val.user_credits?.balance ??
                                                    '—'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-2.5 text-center whitespace-nowrap">
                                            {val.upline ? (
                                                <span className="bg-tertiary-bright px-2.5 py-1 font-bold text-tertiary-dark inline-flex items-center rounded-full text-[10px]">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="bg-quaternary-bright px-2.5 py-1 font-bold text-quaternary-dark inline-flex items-center rounded-full text-[10px]">
                                                    No
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-2.5 text-center whitespace-nowrap">
                                            {val.active ? (
                                                <Badge variant="green">
                                                    Yes
                                                </Badge>
                                            ) : (
                                                <Badge>No</Badge>
                                            )}
                                        </td>

                                        <td className="px-5 py-2.5 text-center whitespace-nowrap">
                                            <span className="text-xs text-quaternary-dark">
                                                {val.created_at
                                                    ? formatDate(val.created_at)
                                                    : '—'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-2.5 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            'user.customers.show',
                                                            {
                                                                tracking_code:
                                                                    val.tracking_code,
                                                            },
                                                        ),
                                                    )
                                                }
                                                className="gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-quaternary-dark hover:bg-secondary inline-flex items-center border border-[#E2E8F0] text-[11px] transition hover:border-[#334155]"
                                            >
                                                <Eye size={14} />
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
    );
}
