import { Badge } from '@/Components/Badge';
import ConfirmModal from '@/Components/ConfirmModal';
import MarkUpDetailModal from '@/Components/MarkUpDetailModal';
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import TableActionMenu from '@/Components/TableActionMenu';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatNumber } from '@/helpers';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { MarkupHotelProps, Paginate } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MarkUpHotelLists() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<Paginate<MarkupHotelProps> | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string | number | null>(
        null,
    );

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MarkupHotelProps | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPage = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === 'string'
                    ? await hotelMicroserviceApi.get(urlOrPage, {
                          params: { scope: 'htl', search: search },
                      })
                    : await hotelMicroserviceApi.get('/markup-rule/list', {
                          params: {
                              scope: 'htl',
                              page: urlOrPage,
                              search: search,
                          },
                      });

            const data = res.data.data;

            setPage({
                data: data.results,
                links: data.labels.map((l: any) => ({
                    url: l.label.includes('Previous')
                        ? data.has_prev
                            ? `/markup-rule/list?scope=htl&page=${data.page - 1}`
                            : null
                        : l.label.includes('Next')
                          ? data.has_next
                              ? `/markup-rule/list?scope=htl&page=${data.page + 1}`
                              : null
                          : `/markup-rule/list?scope=htl&page=${l.label}`,
                    label: l.label,
                    active: l.active,
                })),
                prev_page_url: data.has_prev
                    ? `/markup-rule/list?scope=htl&page=${data.page - 1}`
                    : null,
                next_page_url: data.has_next
                    ? `/markup-rule/list?scope=htl&page=${data.page + 1}`
                    : null,
            } as Paginate<MarkupHotelProps>);
        } catch (error) {
            console.error('Failed to fetch hotel markups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchPage(1);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [search]);

    const items = page?.data ?? [];

    const handleAction = (action: string, item: MarkupHotelProps) => {
        if (action === 'view') {
            setSelectedKey(item.key ?? null);
            setIsDetailModalOpen(true);
        } else if (action === 'delete') {
            setItemToDelete(item);
            setIsDeleteModalOpen(true);
        } else if (action === 'edit') {
            if (item.key == null) return;
            router.visit(route('hotel.markups.hotel.edit', item.key));
        } else {
            // console.log(action, item);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete?.key) return;
        setIsDeleting(true);
        try {
            await hotelMicroserviceApi.post('/markup-rule/destroy', {
                key: itemToDelete.key,
            });
            setIsDeleteModalOpen(false);
            setItemToDelete(null);

            fetchPage(1);
        } catch (error) {
            console.error('Failed to delete markup:', error);
            alert('Failed to delete markup rule.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E2E8F0]">
                <TableHeader
                    title="Hotel Markup Rules"
                    subtitle="Manage your markup pricing for hotels."
                    searchValue={search}
                    onSearchChange={setSearch}
                    actions={[
                        {
                            label: 'New Markup',
                            icon: <Plus size={16} strokeWidth={2.5} />,
                            onClick: () =>
                                router.visit(
                                    route('hotel.markups.hotel.create'),
                                ),
                        },
                    ]}
                    // dropdownLabel="Sort"
                    // dropdownActions={[
                    //     { label: "Newest First", onClick: () => console.log('Sort Newest') },
                    //     { label: "Oldest First", onClick: () => console.log('Sort Oldest') },
                    // ]}
                />

                <div className="overflow-x-auto">
                    {loading ? (
                        <TableOnlySkeleton />
                    ) : (
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-white border-b border-[#E2E8F0]">
                                    <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-[10px] whitespace-nowrap uppercase">
                                        Hotel Name & Scope
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                        Markup Type
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-right text-[10px] whitespace-nowrap uppercase">
                                        Value
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-xs divide-y divide-[#E2E8F0]">
                                {items.length > 0 ? (
                                    items.map((mu, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50/50 group transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">
                                                    {mu.name}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded font-bold tracking-wider inline-flex text-[11px] uppercase ${
                                                        mu.markupType ===
                                                        'fixed'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-purple-100 text-purple-700'
                                                    }`}
                                                >
                                                    {mu.markupType}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="font-bold text-primary">
                                                    {mu.markupType === 'fixed'
                                                        ? formatNumber(
                                                              mu.markupValue,
                                                          )
                                                        : `${mu.markupValue}%`}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    type={
                                                        mu.isActive
                                                            ? 'success'
                                                            : 'danger'
                                                    }
                                                >
                                                    {mu.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <TableActionMenu
                                                    groups={[
                                                        [
                                                            {
                                                                label: 'View Details',
                                                                icon: (
                                                                    <Eye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    handleAction(
                                                                        'view',
                                                                        mu,
                                                                    ),
                                                            },
                                                            {
                                                                label: 'Edit Markup',
                                                                icon: (
                                                                    <Edit
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    handleAction(
                                                                        'edit',
                                                                        mu,
                                                                    ),
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                label: 'Delete Markup',
                                                                icon: (
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                variant:
                                                                    'danger',
                                                                onClick: () =>
                                                                    handleAction(
                                                                        'delete',
                                                                        mu,
                                                                    ),
                                                            },
                                                        ],
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="text-gray-500 flex flex-col items-center justify-center">
                                                <div className="bg-gray-100 p-3 mb-3 rounded-full">
                                                    <Search
                                                        size={24}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    No Markups Found
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    We couldn't find any hotel
                                                    markups matching your
                                                    criteria.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
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

            <MarkUpDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                markupKey={selectedKey}
                title="Hotel Markup Details"
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Hotel Markup"
                message={
                    <>
                        Are you sure you want to delete markup{' '}
                        <strong>{itemToDelete?.name}</strong>? This action
                        cannot be undone.
                    </>
                }
                confirmText="Delete Markup"
                isProcessing={isDeleting}
            />
        </div>
    );
}
