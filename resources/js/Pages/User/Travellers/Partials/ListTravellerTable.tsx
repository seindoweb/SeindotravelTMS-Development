import ConfirmModal from '@/Components/ConfirmModal';
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import TableActionMenu from '@/Components/TableActionMenu';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatDate } from '@/helpers';
import { api } from '@/libs/http/api';
import { Paginate, TravellerProps } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import TravellerDetailModal from './TravellerDetailModal';

export default function ListTravellerTable() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState<Paginate<TravellerProps> | null>(null);
    const [loading, setLoading] = useState(false);

    const [selectedTraveller, setSelectedTraveller] =
        useState<TravellerProps | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [itemToDelete, setItemToDelete] = useState<TravellerProps | null>(
        null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPage = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === 'string'
                    ? await api.get<Paginate<TravellerProps>>(urlOrPage, {
                          search: search,
                      })
                    : await api.get<Paginate<TravellerProps>>(
                          route('user.travellers.retrieveData'),
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

    const handleViewDetail = (traveller: TravellerProps) => {
        setSelectedTraveller(traveller);
        setIsDetailModalOpen(true);
    };

    const handleDeleteClick = (traveller: TravellerProps) => {
        setItemToDelete(traveller);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            const targetId = itemToDelete.index || itemToDelete.id;
            await api.del(route('user.travellers.destroy', targetId));
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            fetchPage(page?.current_page || 1);
        } catch (error) {
            console.error('Failed to delete traveller:', error);
            alert('Failed to delete traveller.');
        } finally {
            setIsDeleting(false);
        }
    };

    const items = page?.data ?? [];

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E2E8F0]">
            <TableHeader
                title="Active Travellers"
                subtitle="Manage registered travellers and profiles"
                searchValue={search}
                onSearchChange={setSearch}
                actions={[
                    {
                        label: 'New Traveller',
                        icon: <Plus size={16} strokeWidth={2.5} />,
                        onClick: () =>
                            router.visit(route('user.travellers.create')),
                    },
                ]}
            />
            <div className="min-h-[300px] overflow-x-auto">
                {loading ? (
                    <TableOnlySkeleton />
                ) : (
                    <table className="w-full min-w-[860px] text-left">
                        <thead className="bg-white">
                            <tr className="border-b border-[#E2E8F0]">
                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-[10px] whitespace-nowrap uppercase">
                                    Traveller
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-[10px] whitespace-nowrap uppercase">
                                    Date of Birth
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                    Nationality
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                    Joined
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-right text-[10px] whitespace-nowrap uppercase">
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
                                        className="hover:bg-gray-50/50 group border-b border-[#F1F5F9] transition-colors last:border-0"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="gap-3 flex items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-primary">
                                                        {val.title
                                                            ? `${val.title} `
                                                            : ''}
                                                        {val.first_name}{' '}
                                                        {val.last_name}
                                                    </span>
                                                    {val.user && (
                                                        <span className="text-[11px] text-gray-400">
                                                            Customer:{' '}
                                                            {val.user.full_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-medium text-quaternary-dark">
                                                {formatDate(val.date_of_birth)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="px-2 py-1 bg-gray-100 rounded-md items-right inline-flex">
                                                <span className="font-mono text-xs font-medium text-gray-600">
                                                    {val.nationality}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="text-xs font-bold text-primary">
                                                {val.created_at
                                                    ? formatDate(val.created_at)
                                                    : '—'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <TableActionMenu
                                                groups={[
                                                    [
                                                        {
                                                            label: 'View Profile',
                                                            icon: (
                                                                <Eye
                                                                    size={16}
                                                                />
                                                            ),
                                                            onClick: () =>
                                                                handleViewDetail(
                                                                    val,
                                                                ),
                                                        },
                                                        {
                                                            label: 'Edit Traveller',
                                                            icon: (
                                                                <Edit
                                                                    size={16}
                                                                />
                                                            ),
                                                            href: route(
                                                                'user.travellers.edit',
                                                                val.index ||
                                                                    val.id,
                                                            ),
                                                        },
                                                    ],
                                                    [
                                                        {
                                                            label: 'Delete Traveller',
                                                            icon: (
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            ),
                                                            onClick: () =>
                                                                handleDeleteClick(
                                                                    val,
                                                                ),
                                                            variant: 'danger',
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

            <TravellerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedTraveller(null);
                }}
                traveller={selectedTraveller}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Traveller"
                message={
                    <>
                        Are you sure you want to delete traveller{' '}
                        <strong>
                            {[
                                itemToDelete?.title,
                                itemToDelete?.first_name,
                                itemToDelete?.last_name,
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        </strong>
                        ? This action cannot be undone.
                    </>
                }
                confirmText="Delete Traveller"
                isProcessing={isDeleting}
            />
        </div>
    );
}
