import ConfirmModal from '@/Components/ConfirmModal';
import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import TableActionMenu from '@/Components/TableActionMenu';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatDate, formatRupiah } from '@/helpers';
import { useDebounce } from '@/Hooks/useDebounce';
import { Paginate } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Eye, Globe, Plus, Power, Ticket, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import VoucherDetailModal, { VoucherItem } from './VoucherDetailModal';
import VoucherTranslationModal from './VoucherTranslationModal';

interface ListVoucherTableProps {
    vouchers: Paginate<VoucherItem>;
    product_attribute: string;
    productTitle: string;
    filters?: {
        search?: string;
        status?: string;
    };
}

export default function ListVoucherTable({
    vouchers,
    product_attribute,
    productTitle,
    filters = {},
}: ListVoucherTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [loading, setLoading] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(
        null,
    );
    const [translationVoucher, setTranslationVoucher] =
        useState<VoucherItem | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const [voucherToDelete, setVoucherToDelete] = useState<VoucherItem | null>(
        null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const debouncedSearch = useDebounce(search, 400);
    const isFirstRender = useRef(true);

    const getBaseUrl = () => {
        const routeMap: Record<string, string> = {
            flight: route('voucher.indexFlight'),
            hotel: route('voucher.indexHotel'),
            tour: route('voucher.indexTour'),
        };
        return routeMap[product_attribute] || route('voucher.indexHotel');
    };

    const getCreateUrl = () => {
        const createRouteMap: Record<string, string> = {
            flight: route('voucher.createFlight'),
            hotel: route('voucher.createHotel'),
            tour: route('voucher.createTour'),
        };
        return (
            createRouteMap[product_attribute] || route('voucher.createHotel')
        );
    };

    const fetchFiltered = (s: string, st: string, url?: string) => {
        setLoading(true);
        router.get(
            url || getBaseUrl(),
            {
                search: s || undefined,
                status: st || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        fetchFiltered(debouncedSearch, statusFilter);
    }, [debouncedSearch]);

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        fetchFiltered(search, status);
    };

    const handlePageNavigate = (url: string) => {
        fetchFiltered(search, statusFilter, url);
    };

    const handleToggleStatus = (voucher: VoucherItem) => {
        const hasTranslation = (voucher.voucher_translations?.length ?? 0) > 0;
        if (voucher.status !== 'active' && !hasTranslation) {
            setTranslationVoucher(voucher);
            return;
        }

        setTogglingId(voucher.id);
        router.patch(
            route('voucher.toggleStatus', voucher.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    const handleDeleteClick = (voucher: VoucherItem) => {
        setVoucherToDelete(voucher);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!voucherToDelete) return;
        setIsDeleting(true);
        router.delete(route('voucher.destroy', voucherToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setVoucherToDelete(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const items = vouchers?.data ?? [];

    const getStatusDropdownLabel = () => {
        if (!statusFilter) return 'Status';
        switch (statusFilter) {
            case 'active':
                return 'Status: Active';
            case 'draft':
                return 'Status: Draft';
            case 'expired':
                return 'Status: Expired';
            case 'exhausted':
                return 'Status: Exhausted';
            default:
                return `Status: ${statusFilter}`;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E2E8F0]">
            <TableHeader
                title={`${productTitle} Vouchers`}
                subtitle={`Manage and monitor promotional vouchers for ${productTitle}`}
                searchValue={search}
                onSearchChange={setSearch}
                dropdownLabel={getStatusDropdownLabel()}
                dropdownActions={[
                    {
                        label: 'All Status',
                        onClick: () => handleStatusChange(''),
                    },
                    {
                        label: 'Active Only',
                        onClick: () => handleStatusChange('active'),
                    },
                    {
                        label: 'Draft Only',
                        onClick: () => handleStatusChange('draft'),
                    },
                    {
                        label: 'Expired Only',
                        onClick: () => handleStatusChange('expired'),
                    },
                    {
                        label: 'Exhausted Only',
                        onClick: () => handleStatusChange('exhausted'),
                    },
                ]}
                actions={[
                    {
                        label: 'New Voucher',
                        icon: <Plus size={16} />,
                        onClick: () => router.visit(getCreateUrl()),
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
                                    Voucher
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-[10px] whitespace-nowrap uppercase">
                                    Type & Distribution
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-right text-[10px] whitespace-nowrap uppercase">
                                    Discount
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                    Platform
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                    Quota (Used / Limit)
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                    Status
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-center text-[10px] whitespace-nowrap uppercase">
                                    Period
                                </th>

                                <th className="px-6 py-4 font-bold tracking-wider text-quaternary text-right text-[10px] whitespace-nowrap uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#F1F5F9]">
                            {items.length === 0 ? (
                                <tr>
                                    <td className="py-3 text-right" colSpan={8}>
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
                                items.map((voucher) => {
                                    const isPercentage =
                                        voucher.discount_type === 'percentage';
                                    const hasId =
                                        voucher.voucher_translations?.some(
                                            (t) =>
                                                t.locale === 'id' &&
                                                (t.description?.trim()
                                                    ?.length ?? 0) > 0,
                                        );
                                    const hasEn =
                                        voucher.voucher_translations?.some(
                                            (t) =>
                                                t.locale === 'en' &&
                                                (t.description?.trim()
                                                    ?.length ?? 0) > 0,
                                        );
                                    const hasAnyTranslation =
                                        (voucher.voucher_translations?.length ??
                                            0) > 0;

                                    return (
                                        <tr
                                            key={voucher.id}
                                            className="hover:bg-gray-50/50 group border-b border-[#F1F5F9] transition-colors last:border-0"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="gap-3 flex items-center">
                                                    {voucher.image_path ? (
                                                        <img
                                                            src={
                                                                voucher?.image_url ??
                                                                undefined
                                                            }
                                                            alt={`Voucher ${voucher.id}`}
                                                            className="w-10 h-10 rounded-lg flex-shrink-0 border border-[#E2E8F0] object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg text-quaternary flex flex-shrink-0 items-center justify-center">
                                                            <Ticket size={18} />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-primary">
                                                            Voucher #
                                                            {voucher.id}
                                                        </span>
                                                        <span className="font-mono text-xs text-quaternary">
                                                            {voucher.index ??
                                                                '—'}
                                                        </span>
                                                        <div className="gap-1 mt-1 flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setTranslationVoucher(
                                                                        voucher,
                                                                    )
                                                                }
                                                                title={
                                                                    hasId
                                                                        ? 'Indonesian translation configured (Click to manage)'
                                                                        : 'Indonesian translation missing (Click to add)'
                                                                }
                                                                className={`px-1.5 py-0.5 rounded font-semibold inline-flex items-center text-[10px] transition-colors ${
                                                                    hasId
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 border'
                                                                        : 'bg-slate-50 text-slate-400 border-slate-300 hover:border-slate-400 hover:text-slate-600 border border-dashed'
                                                                }`}
                                                            >
                                                                ID{' '}
                                                                {hasId
                                                                    ? '✓'
                                                                    : ''}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setTranslationVoucher(
                                                                        voucher,
                                                                    )
                                                                }
                                                                title={
                                                                    hasEn
                                                                        ? 'English translation configured (Click to manage)'
                                                                        : 'English translation missing (Click to add)'
                                                                }
                                                                className={`px-1.5 py-0.5 rounded font-semibold inline-flex items-center text-[10px] transition-colors ${
                                                                    hasEn
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 border'
                                                                        : 'bg-slate-50 text-slate-400 border-slate-300 hover:border-slate-400 hover:text-slate-600 border border-dashed'
                                                                }`}
                                                            >
                                                                EN{' '}
                                                                {hasEn
                                                                    ? '✓'
                                                                    : ''}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-primary capitalize">
                                                        {voucher.voucher_type}
                                                    </span>
                                                    <span className="text-xs text-quaternary capitalize">
                                                        {
                                                            voucher.distribution_type
                                                        }
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="inline-flex flex-col items-end">
                                                    <span className="font-mono text-xs font-bold text-primary">
                                                        {isPercentage
                                                            ? `${Number(voucher.discount_value)}%`
                                                            : formatRupiah(
                                                                  voucher.discount_value,
                                                              )}
                                                    </span>
                                                    {isPercentage &&
                                                        voucher.max_discount && (
                                                            <span className="text-quaternary text-[10px]">
                                                                Max:{' '}
                                                                {formatRupiah(
                                                                    voucher.max_discount,
                                                                )}
                                                            </span>
                                                        )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className="text-xs font-medium text-quaternary-dark">
                                                    {voucher.platform === 1
                                                        ? 'Web'
                                                        : voucher.platform === 2
                                                          ? 'Mobile'
                                                          : 'All'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <div className="px-2 py-1 bg-gray-100 rounded-md inline-flex items-center">
                                                    <span className="font-mono text-xs font-medium text-gray-600">
                                                        {voucher.used_count} /{' '}
                                                        {voucher.usage_limit ??
                                                            '∞'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {voucher.status === 'active' ? (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            togglingId ===
                                                            voucher.id
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                voucher,
                                                            )
                                                        }
                                                        title="Click to set as Draft"
                                                        className="gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 inline-flex items-center rounded-full transition-colors"
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                        Active
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            togglingId ===
                                                            voucher.id
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                voucher,
                                                            )
                                                        }
                                                        title={
                                                            hasAnyTranslation
                                                                ? 'Click to activate'
                                                                : 'Click to add translation and activate'
                                                        }
                                                        className={`gap-1.5 px-2.5 py-1 text-xs font-bold inline-flex items-center rounded-full capitalize transition-colors ${
                                                            hasAnyTranslation
                                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 border'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                hasAnyTranslation
                                                                    ? 'bg-gray-400'
                                                                    : 'bg-amber-500'
                                                            }`}
                                                        ></div>
                                                        {voucher.status}
                                                    </button>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className="text-xs font-medium text-quaternary-dark">
                                                    {voucher.start_at
                                                        ? formatDate(
                                                              voucher.start_at,
                                                          )
                                                        : '—'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <TableActionMenu
                                                    groups={[
                                                        [
                                                            {
                                                                label: 'View Detail',
                                                                icon: (
                                                                    <Eye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    setSelectedVoucher(
                                                                        voucher,
                                                                    ),
                                                            },
                                                            {
                                                                label: 'Translations',
                                                                icon: (
                                                                    <Globe
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    setTranslationVoucher(
                                                                        voucher,
                                                                    ),
                                                            },
                                                            {
                                                                label: 'Edit Voucher',
                                                                icon: (
                                                                    <Edit
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    router.visit(
                                                                        route(
                                                                            'voucher.edit',
                                                                            voucher.id,
                                                                        ),
                                                                    ),
                                                            },
                                                            {
                                                                label:
                                                                    voucher.status ===
                                                                    'active'
                                                                        ? 'Set as Draft'
                                                                        : 'Activate',
                                                                icon: (
                                                                    <Power
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    handleToggleStatus(
                                                                        voucher,
                                                                    ),
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                label: 'Delete Voucher',
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
                                                                    handleDeleteClick(
                                                                        voucher,
                                                                    ),
                                                            },
                                                        ],
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {vouchers && (
                <TablePaginate
                    page={vouchers}
                    loading={loading}
                    onNavigate={(url) => handlePageNavigate(url)}
                />
            )}

            <VoucherDetailModal
                isOpen={Boolean(selectedVoucher)}
                onClose={() => setSelectedVoucher(null)}
                voucher={selectedVoucher}
                onOpenTranslation={(v) => setTranslationVoucher(v)}
            />

            <VoucherTranslationModal
                isOpen={Boolean(translationVoucher)}
                onClose={() => setTranslationVoucher(null)}
                voucher={
                    translationVoucher
                        ? vouchers.data.find(
                              (v) => v.id === translationVoucher.id,
                          ) || translationVoucher
                        : null
                }
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setVoucherToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Voucher"
                message={
                    <>
                        Are you sure you want to delete voucher{' '}
                        <strong>
                            #{voucherToDelete?.id}
                            {voucherToDelete?.index
                                ? ` (${voucherToDelete.index})`
                                : ''}
                        </strong>
                        ? This action cannot be undone.
                    </>
                }
                confirmText="Delete Voucher"
                cancelText="Cancel"
                isProcessing={isDeleting}
            />
        </div>
    );
}
