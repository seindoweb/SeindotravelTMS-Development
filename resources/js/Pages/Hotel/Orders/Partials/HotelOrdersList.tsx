import OrderStatusBadge from '@/Components/OrderStatusBadge';
import TableActionMenu from '@/Components/TableActionMenu';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import { formatDate, formatTime } from '@/helpers';
import { OrderProductAttributeProps, Paginate } from '@/types';
import { router } from '@inertiajs/react';
import { Download, Edit, Eye, Filter, Inbox, Printer } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface OrderUser {
    id: number;
    full_name: string;
    email: string;
}

export interface OrderCreator {
    id: number;
    full_name: string;
}

export interface HotelOrdersListProps {
    orders?: Paginate<OrderProductAttributeProps>;
    filters?: {
        search?: string;
    };
}

const StatusBadge = ({ status }: { status?: string }) => {
    return <OrderStatusBadge status={status} withDot={true} size="md" />;
};

const PaymentStatusText = ({ status }: { status?: string }) => {
    const s = (status || '').toLowerCase();
    let label = status || 'Unpaid';
    let colorClass = 'text-amber-500';

    if (s === 'paid') {
        label = 'Paid';
        colorClass = 'text-emerald-600';
    } else if (s === 'expired') {
        label = 'Expired';
        colorClass = 'text-red-500';
    } else if (s === 'failed') {
        label = 'Failed';
        colorClass = 'text-red-500';
    } else if (s === 'unpaid') {
        label = 'Unpaid';
        colorClass = 'text-amber-500';
    } else if (s === 'partially') {
        label = 'Partially';
        colorClass = 'text-purple-600';
    }

    return (
        <span className={`font-bold text-xs capitalize ${colorClass}`}>
            {label}
        </span>
    );
};

export default function HotelOrdersList({
    orders,
    filters,
}: HotelOrdersListProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                route('hotel.orders.list'),
                { search: searchQuery || undefined },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const orderAttList = orders?.data || [];
    const totalOrders = orders?.total ?? orderAttList.length;

    return (
        <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E2E8F0]">
                <TableHeader
                    title="Hotel Orders List"
                    subtitle={
                        <>
                            Total:{' '}
                            <span className="font-bold text-primary">
                                {totalOrders}
                            </span>{' '}
                            orders found
                        </>
                    }
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    actions={[
                        {
                            label: 'Filter',
                            icon: <Filter size={14} />,
                            variant: 'secondary',
                        },
                    ]}
                />

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-white border-b border-[#E2E8F0]">
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-[10px] whitespace-nowrap uppercase">
                                    Customer
                                </th>
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-[10px] whitespace-nowrap uppercase">
                                    Order Code
                                </th>
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-[10px] whitespace-nowrap uppercase">
                                    Status
                                </th>
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-[10px] whitespace-nowrap uppercase">
                                    Payment
                                </th>
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-[10px] whitespace-nowrap uppercase">
                                    Admin
                                </th>
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-[10px] whitespace-nowrap uppercase">
                                    Order Date
                                </th>
                                <th className="py-4 px-6 font-bold text-quaternary tracking-wider text-right text-[10px] whitespace-nowrap uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                            {orderAttList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-quaternary text-center"
                                    >
                                        <div className="gap-2 flex flex-col items-center justify-center">
                                            <Inbox
                                                size={36}
                                                className="text-gray-300"
                                            />
                                            <p className="text-sm font-semibold text-gray-500">
                                                Belum ada data pesanan hotel.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orderAttList.map((orderAtt) => {
                                    return (
                                        <tr
                                            key={orderAtt.index}
                                            className="hover:bg-gray-50/50 group transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-primary">
                                                        {orderAtt?.order?.user
                                                            .full_name ?? 'n/a'}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {orderAtt?.order?.user
                                                            .email ?? 'n/a'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div
                                                    className="px-2 py-1 bg-gray-100 rounded-md inline-flex items-center"
                                                    title={orderAtt.code}
                                                >
                                                    <span className="font-mono text-xs font-medium text-gray-700">
                                                        {orderAtt.code}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={
                                                        orderAtt?.order_status
                                                    }
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="gap-0.5 flex flex-col">
                                                    <PaymentStatusText
                                                        status={
                                                            orderAtt?.order
                                                                ?.payment_status ??
                                                            'n/a'
                                                        }
                                                    />
                                                    <span className="text-xs font-medium text-quaternary">
                                                        {orderAtt?.order
                                                            ?.type_of_payment_desc ??
                                                            'n/a'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-primary">
                                                    {orderAtt?.creator
                                                        ?.full_name ?? 'n/a'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="sm:text-left flex flex-col text-right">
                                                    <span className="text-xs font-bold text-primary">
                                                        {formatDate(
                                                            orderAtt.created_at,
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {formatTime(
                                                            orderAtt.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <TableActionMenu
                                                    menuWidth="w-48"
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
                                                                href: route(
                                                                    'hotel.orders.orderDetails',
                                                                    orderAtt.code_for_url,
                                                                ),
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                label: 'Preview Voucher',
                                                                icon: (
                                                                    <Printer
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                target: '_blank',
                                                                href: route(
                                                                    'hotel.orders.orderPreviewPdf',
                                                                    orderAtt.code_for_url,
                                                                ),
                                                            },
                                                            {
                                                                label: 'Download PDF',
                                                                icon: (
                                                                    <Download
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                variant: 'info',
                                                                target: '_blank',
                                                                href: route(
                                                                    'hotel.orders.orderDownloadPdf',
                                                                    orderAtt.code_for_url,
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
                </div>

                {orders && orders.links && orders.links.length > 3 && (
                    <div className="px-6 py-4 bg-gray-50/50 sm:flex-row gap-4 flex flex-col items-center justify-between border-t border-[#E2E8F0]">
                        <span className="text-sm font-medium text-quaternary">
                            Showing{' '}
                            <span className="font-bold text-primary">
                                {orders.from ?? 0}
                            </span>{' '}
                            to{' '}
                            <span className="font-bold text-primary">
                                {orders.to ?? 0}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-primary">
                                {orders.total ?? 0}
                            </span>{' '}
                            entries
                        </span>
                        <div className="gap-1 flex flex-wrap">
                            {orders.links.map((link, idx) => {
                                const isPrev =
                                    link.label.includes('Previous') ||
                                    link.label.includes('&laquo;');
                                const isNext =
                                    link.label.includes('Next') ||
                                    link.label.includes('&raquo;');
                                const label = isPrev
                                    ? 'Prev'
                                    : isNext
                                      ? 'Next'
                                      : link.label;

                                if (!link.url) {
                                    return (
                                        <button
                                            key={idx}
                                            disabled
                                            className="px-3 py-1 text-sm font-medium text-gray-300 bg-white border-gray-200 rounded-lg cursor-not-allowed border"
                                        >
                                            {label}
                                        </button>
                                    );
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() =>
                                            router.visit(link.url!, {
                                                preserveScroll: true,
                                                preserveState: true,
                                            })
                                        }
                                        className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                                            link.active
                                                ? 'bg-primary text-white font-bold shadow-sm'
                                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 border'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
