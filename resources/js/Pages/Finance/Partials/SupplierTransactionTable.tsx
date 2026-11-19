import TableOnlySkeleton from '@/Components/Skeleton/TableOnlySkeleton';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import TablePaginate from '@/Components/TablePaginate';
import { formatDate } from '@/helpers';
import { useDebounce } from '@/Hooks/useDebounce';
import { Paginate } from '@/types';
import { router } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Coins,
    CreditCard,
    Plus,
    RefreshCw
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SupplierTransactionItem {
    id: number;
    supplier_balance_id?: number | null;
    supplier_resource_code: string;
    transaction_type: string;
    reference_type: string;
    reference_id?: string | null;
    description?: string | null;
    amount: string | number;
    balance_before: string | number;
    balance_after: string | number;
    transaction_date: string;
    created_at: string;
    creator?: {
        id: number;
        full_name?: string;
        email?: string;
    };
}

export interface SupplierItem {
    id: number;
    code: string;
    name: string;
}

export interface SupplierBalanceItem {
    id?: number;
    supplier_id?: number;
    currency_code?: string;
    balance_type?: string;
    initial_balance: string | number;
    current_balance: string | number;
    credit_limit?: string | number;
    is_active?: boolean;
}

interface SupplierTransactionTableProps {
    supplier: SupplierItem | null;
    balance: SupplierBalanceItem | null;
    transactions: Paginate<SupplierTransactionItem>;
    createUrl: string;
    indexUrl: string;
    supplierTitle: string;
    categoryTitle: string;
    filters?: {
        search?: string;
        transaction_type?: string;
    };
}

const formatRupiah = (amount: number | string | undefined | null) => {
    const num =
        typeof amount === 'string'
            ? parseFloat(amount) || 0
            : Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(num)
        .replace('Rp', 'Rp ');
};

export default function SupplierTransactionTable({
    supplier,
    balance,
    transactions,
    createUrl,
    indexUrl,
    supplierTitle,
    categoryTitle,
    filters = {},
}: SupplierTransactionTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.transaction_type || '');
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 400);
    const isFirstRender = useRef(true);

    const fetchFiltered = (s: string, t: string, url?: string) => {
        setLoading(true);
        router.get(
            url || indexUrl,
            {
                search: s || undefined,
                transaction_type: t || undefined,
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
        fetchFiltered(debouncedSearch, typeFilter);
    }, [debouncedSearch]);

    const handleTypeChange = (type: string) => {
        setTypeFilter(type);
        fetchFiltered(search, type);
    };

    const handlePageNavigate = (url: string) => {
        fetchFiltered(search, typeFilter, url);
    };

    const items = transactions?.data ?? [];

    const getTransactionTypeBadge = (type: string) => {
        switch (type) {
            case 'topup':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ArrowUpRight size={13} />
                        Top Up
                    </span>
                );
            case 'initial':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Coins size={13} />
                        Initial Balance
                    </span>
                );
            case 'refund':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                        <RefreshCw size={12} />
                        Refund
                    </span>
                );
            case 'adjustment_in':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <ArrowUpRight size={13} />
                        Adjustment In
                    </span>
                );
            case 'usage':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <ArrowDownRight size={13} />
                        Usage (Booking)
                    </span>
                );
            case 'adjustment_out':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                        <ArrowDownRight size={13} />
                        Adjustment Out
                    </span>
                );
            case 'payment':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <CreditCard size={13} />
                        Payment
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {type}
                    </span>
                );
        }
    };

    const isPositiveDelta = (type: string) => {
        return ['topup', 'initial', 'refund', 'adjustment_in'].includes(type);
    };

    const getDropdownFilterLabel = () => {
        if (!typeFilter) return 'All Types';
        const map: Record<string, string> = {
            topup: 'Type: Top Up',
            initial: 'Type: Initial',
            usage: 'Type: Usage',
            refund: 'Type: Refund',
            adjustment_in: 'Type: Adjust In',
            adjustment_out: 'Type: Adjust Out',
            payment: 'Type: Payment',
        };
        return map[typeFilter] || `Type: ${typeFilter}`;
    };

    return (
        <div className="overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
            <TableHeader
                title={`${supplierTitle} Transactions`}
                subtitle={`Historical deposit transactions and adjustments for ${supplierTitle} (${categoryTitle}).`}
                    searchValue={search}
                    onSearchChange={setSearch}
                    dropdownLabel={getDropdownFilterLabel()}
                    dropdownActions={[
                        { label: 'All Types', onClick: () => handleTypeChange('') },
                        { label: 'Top Up', onClick: () => handleTypeChange('topup') },
                        { label: 'Initial Balance', onClick: () => handleTypeChange('initial') },
                        { label: 'Usage (Booking)', onClick: () => handleTypeChange('usage') },
                        { label: 'Refund', onClick: () => handleTypeChange('refund') },
                        { label: 'Adjustment In', onClick: () => handleTypeChange('adjustment_in') },
                        { label: 'Adjustment Out', onClick: () => handleTypeChange('adjustment_out') },
                        { label: 'Payment', onClick: () => handleTypeChange('payment') },
                    ]}
                    actions={[
                        {
                            label: 'New Transaction',
                            icon: <Plus size={16} />,
                            onClick: () => router.visit(createUrl),
                            variant: 'primary',
                        },
                    ]}
                />

                <div className="overflow-x-auto">
                    {loading ? (
                        <TableOnlySkeleton />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary">
                                        Date & ID
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary">
                                        Type
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary">
                                        Reference
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary text-right">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary text-right">
                                        Balance After
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary">
                                        Description
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-primary text-center">
                                        Recorded By
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                                {items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No balance transactions recorded yet for{' '}
                                            {supplierTitle}.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((row) => {
                                        const isPositive = isPositiveDelta(
                                            row.transaction_type,
                                        );

                                        return (
                                            <tr
                                                key={row.id}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-primary">
                                                            {row.transaction_date
                                                                ? formatDate(
                                                                      row.transaction_date,
                                                                  )
                                                                : formatDate(
                                                                      row.created_at,
                                                                  )}
                                                        </span>
                                                        <span className="text-[11px] text-quaternary font-mono">
                                                            Tx #{row.id}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getTransactionTypeBadge(
                                                        row.transaction_type,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-800 capitalize">
                                                            {row.reference_type?.replace(
                                                                /_/g,
                                                                ' ',
                                                            ) || '—'}
                                                        </span>
                                                        {row.reference_id && (
                                                            <span className="text-[11px] text-gray-400 font-mono">
                                                                Ref: {row.reference_id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span
                                                        className={`text-xs font-bold font-mono ${
                                                            isPositive
                                                                ? 'text-emerald-600'
                                                                : 'text-rose-600'
                                                        }`}
                                                    >
                                                        {isPositive ? '+' : '-'}
                                                        {formatRupiah(row.amount)}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="text-xs font-semibold text-gray-900 font-mono">
                                                        {formatRupiah(
                                                            row.balance_after,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-gray-600 line-clamp-2 max-w-xs">
                                                        {row.description || '—'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-xs font-medium text-quaternary-dark">
                                                        {row.creator?.full_name ||
                                                            'System'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {transactions && (
                    <TablePaginate
                        page={transactions}
                        loading={loading}
                        onNavigate={(url) => handlePageNavigate(url)}
                    />
                )}
            </div>
    );
}
