import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import TableActionMenu from '@/Components/TableActionMenu';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatDate } from '@/helpers';
import { api } from '@/libs/http/api';
import { Paginate, UserProps } from '@/types';
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
        <div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <TableHeader 
                title="Active Customers"
                subtitle="Manage registered members and profiles"
                searchValue={search}
                onSearchChange={setSearch}
                dropdownLabel="Sort"
                dropdownActions={[
                    { label: "Name A-Z", icon: <ArrowDownAZ size={16} />, onClick: () => console.log('sort user A-Z') },
                    { label: "Name Z-A", icon: <ArrowUpZA size={16} />, onClick: () => console.log('sort user Z-A') },
                ]}
            />
            <div className="overflow-x-auto min-h-[300px]">
                {loading ? (
                    <TableOnlySkeleton />
                ) : (
                    <table className="w-full min-w-[860px] text-left">
                        <thead className="bg-white">
                            <tr className="border-b border-[#E2E8F0]">
                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-[10px] uppercase whitespace-nowrap">
                                    Customer
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-[10px] uppercase whitespace-nowrap">
                                    Phone
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-right text-[10px] uppercase whitespace-nowrap">
                                    Credit Balance
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] uppercase whitespace-nowrap">
                                    Upline
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] uppercase whitespace-nowrap">
                                    Verified
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] uppercase whitespace-nowrap">
                                    Joined
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-right text-[10px] uppercase whitespace-nowrap">
                                    Actions
                                </th>
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
                                        className="hover:bg-gray-50/50 transition-colors group border-b border-[#F1F5F9] last:border-0"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="gap-3 flex items-center">
                                                <img
                                                    src={val.profile_photo_path}
                                                    alt={val.full_name}
                                                    className="w-10 h-10 flex-shrink-0 rounded-full object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs text-primary">
                                                        {val.title ? `${val.title} ` : ''}
                                                        {val.full_name}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {val.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {val.phone_number ? (
                                                <span className="text-xs text-quaternary-dark font-medium">
                                                    {val.dial_code && (
                                                        <span className="text-quaternary mr-1">
                                                            {val.dial_code}
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

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md">
                                                <span className="font-mono text-gray-600 font-medium text-xs">
                                                    {val.user_credits?.balance ?? '—'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {val.upline ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    Yes
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                    No
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {val.active ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    Yes
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                    No
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="text-xs font-bold text-primary">
                                                {val.created_at ? formatDate(val.created_at) : '—'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <TableActionMenu
                                                groups={[
                                                    [
                                                        {
                                                            label: 'View Profile',
                                                            icon: <Eye size={16} />,
                                                            href: route('user.customers.show', {
                                                                tracking_code: val.tracking_code,
                                                            }),
                                                        },
                                                    ],
                                                ]}
                                            />
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
        </div>
    );
}
