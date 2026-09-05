import { Badge } from '@/Components/Badge';
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatDate } from '@/helpers';
import { api } from '@/libs/http/api';
import { Paginate, UserProps } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowDownAZ, ArrowUpZA, Eye, MoreVertical, Edit, Search } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Active Customers</h1>
                    <p className="text-sm text-quaternary mt-1">Manage registered members and profiles</p>
                </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input 
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary transition-colors bg-white"
                            placeholder="Search Name, Email, Phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-2 mt-2 md:mt-0">
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <ArrowDownAZ size={14} />
                                Sort
                            </Menu.Button>
                            
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="p-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => console.log('sort user A-Z')}
                                                    className={clsx(
                                                        active ? 'bg-gray-50 text-primary' : 'text-gray-700',
                                                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                                                    )}
                                                >
                                                    <ArrowDownAZ size={16} className="text-gray-400 group-hover:text-primary" />
                                                    Name A-Z
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => console.log('sort user Z-A')}
                                                    className={clsx(
                                                        active ? 'bg-gray-50 text-primary' : 'text-gray-700',
                                                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                                                    )}
                                                >
                                                    <ArrowUpZA size={16} className="text-gray-400 group-hover:text-primary" />
                                                    Name Z-A
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>

            <div className="overflow-x-auto">
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
                                                    <span className="font-bold text-sm text-primary">
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
                                            <span className="text-sm font-bold text-primary">
                                                {val.created_at ? formatDate(val.created_at) : '—'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 text-quaternary transition-colors">
                                                    <MoreVertical size={16} />
                                                </Menu.Button>
                                                
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                        <div className="p-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
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
                                                                        className={clsx(
                                                                            active ? 'bg-gray-50 text-primary' : 'text-gray-700',
                                                                            'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                                                                        )}
                                                                    >
                                                                        <Eye size={16} className="text-gray-400 group-hover:text-primary" />
                                                                        View Profile
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
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
