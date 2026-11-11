import TableActionMenu from '@/Components/TableActionMenu';
import { TableHeader } from '@/Components/TableHeading/TableHeader';
import { Paginate } from '@/types';
import { router } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    Filter,
    Inbox,
} from 'lucide-react';
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

export interface OrderProductAttributeItem {
    id: number;
    order_id: number;
    code: string;
    product_attribute_id: number;
    order_status: string;
    created_at: string;
    updated_at: string;
    hotel_booking?: any;
}

export interface HotelOrderItem {
    id: number;
    invoice_number: string;
    user_id: number;
    base_currency_code: string;
    subtotal_base_amount: string | number;
    total_base_amount: string | number;
    currency_code: string;
    total_amount: string | number;
    type_of_payment: string;
    payment_status: string;
    payment_url?: string | null;
    system: string;
    expired_at?: string | null;
    created_by?: number | null;
    updated_by?: number | null;
    created_at: string;
    updated_at: string;
    index?: string;
    key?: string;
    user?: OrderUser | null;
    creator?: OrderCreator | null;
    order_product_attributes?: OrderProductAttributeItem[];
}

export interface HotelOrdersListProps {
    orders?: Paginate<HotelOrderItem>;
    filters?: {
        search?: string;
    };
}

const StatusBadge = ({ status }: { status?: string }) => {
    const s = (status || '').toLowerCase();
    let label = 'Pending';
    let colorClass = 'bg-amber-50 text-amber-700';
    let dotClass = 'bg-amber-500';

    if (s === 'd' || s === 'issued' || s === 'done') {
        label = 'Issued';
        colorClass = 'bg-emerald-50 text-emerald-700';
        dotClass = 'bg-emerald-500';
    } else if (s === 'c' || s === 'confirmed') {
        label = 'Confirmed';
        colorClass = 'bg-blue-50 text-blue-700';
        dotClass = 'bg-blue-500';
    } else if (s === 'b' || s === 'booking' || s === 'pending') {
        label = 'Booking';
        colorClass = 'bg-amber-50 text-amber-700';
        dotClass = 'bg-amber-500';
    } else if (s === 'f' || s === 'failed' || s === 'cancelled') {
        label = 'Cancelled';
        colorClass = 'bg-red-50 text-red-700';
        dotClass = 'bg-red-500';
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}
        >
            <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></div>
            {label}
        </div>
    );
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

const formatPaymentMethod = (type?: string) => {
    switch (type) {
        case 'CH':
            return 'Cash';
        case 'TF':
            return 'Bank Transfer';
        case 'PG':
            return 'Online Pay';
        case 'UC':
            return 'User Credit';
        default:
            return type || 'Manual';
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return { date: '-', time: '-' };
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { date: '-', time: '-' };

    const day = String(d.getDate()).padStart(2, '0');
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
    ];
    const month = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return {
        date: `${day} ${month} '${year}`,
        time: `${hours}:${minutes}`,
    };
};

export default function HotelOrdersList({ orders, filters }: HotelOrdersListProps) {
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

    const orderList = orders?.data || [];
    const totalOrders = orders?.total ?? orderList.length;

    return (
        <div className="mt-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
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
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] bg-white">
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">
                                    Customer
                                </th>
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">
                                    Order Code
                                </th>
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">
                                    Status
                                </th>
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">
                                    Payment
                                </th>
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">
                                    Admin
                                </th>
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap">
                                    Order Date
                                </th>
                                <th className="py-4 px-6 text-[10px] font-bold text-quaternary uppercase tracking-wider whitespace-nowrap text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                            {orderList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 px-6 text-center text-quaternary"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
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
                                orderList.map((order) => {
                                    const productAttr =
                                        order.order_product_attributes?.[0];
                                    const rawCode =
                                        productAttr?.code ||
                                        order.invoice_number ||
                                        String(order.id);
                                    const urlCode = rawCode.replace(/\//g, '-');
                                    const { date, time } = formatDate(
                                        order.created_at,
                                    );
                                    const customerName =
                                        order.user?.full_name || 'No Customer';
                                    const customerEmail =
                                        order.user?.email || '-';
                                    const adminName =
                                        order.creator?.full_name || 'Customer';

                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs text-primary">
                                                        {customerName}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {customerEmail}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div
                                                    className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md"
                                                    title={rawCode}
                                                >
                                                    <span className="text-xs font-mono font-medium text-gray-700">
                                                        {rawCode}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <StatusBadge
                                                    status={
                                                        productAttr?.order_status
                                                    }
                                                />
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <PaymentStatusText
                                                        status={
                                                            order.payment_status
                                                        }
                                                    />
                                                    <span className="text-xs font-medium text-quaternary">
                                                        {formatPaymentMethod(
                                                            order.type_of_payment,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="text-xs font-medium text-primary">
                                                    {adminName}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex flex-col text-right sm:text-left">
                                                    <span className="text-xs font-bold text-primary">
                                                        {date}
                                                    </span>
                                                    <span className="text-xs text-quaternary">
                                                        {time}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-right">
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
                                                                    urlCode,
                                                                ),
                                                            },
                                                            {
                                                                label: 'Edit Order',
                                                                icon: (
                                                                    <Edit
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ),
                                                                onClick: () =>
                                                                    console.log(
                                                                        'Edit order',
                                                                        order.id,
                                                                    ),
                                                            },
                                                        ],
                                                        [
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
                                                                onClick: () =>
                                                                    console.log(
                                                                        'Download PDF',
                                                                        order.id,
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
                    <div className="px-6 py-4 border-t border-[#E2E8F0] bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-quaternary font-medium">
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
                        <div className="flex gap-1 flex-wrap">
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
                                            className="px-3 py-1 border border-gray-200 bg-white text-gray-300 rounded-lg text-sm font-medium cursor-not-allowed"
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
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                            link.active
                                                ? 'bg-primary text-white font-bold shadow-sm'
                                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
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
