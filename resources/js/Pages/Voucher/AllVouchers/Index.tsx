import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Paginate } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Compass, Hotel, Plane } from 'lucide-react';
import React from 'react';
import ListVoucherTable from './Partials/ListVoucherTable';
import { VoucherItem } from './Partials/VoucherDetailModal';

interface Props {
    product_attribute: 'flight' | 'hotel' | 'tour' | string;
    productAttributeModel?: {
        id: number;
        attribute: string;
        model: string;
        product: string;
    };
    title: string;
    vouchers: Paginate<VoucherItem>;
    filters?: {
        search?: string;
        status?: string;
    };
}

export default function Index({
    product_attribute,
    title,
    vouchers,
    filters,
}: Props) {
    const tabs = [
        {
            key: 'flight',
            label: 'Flight Vouchers',
            icon: Plane,
            href: route('voucher.indexFlight'),
            color: 'text-sky-600',
            activeBg: 'bg-sky-50 text-sky-800 border-sky-300 font-bold shadow-sm',
        },
        {
            key: 'hotel',
            label: 'Hotel Vouchers',
            icon: Hotel,
            href: route('voucher.indexHotel'),
            color: 'text-emerald-600',
            activeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-sm',
        },
        {
            key: 'tour',
            label: 'Tour Vouchers',
            icon: Compass,
            href: route('voucher.indexTour'),
            color: 'text-amber-600',
            activeBg: 'bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-sm',
        },
    ];

    const productTitle =
        product_attribute === 'flight'
            ? 'Flight'
            : product_attribute === 'tour'
              ? 'Tour'
              : 'Hotel';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">
                        Vouchers
                    </span>
                    <ChevronRight
                        size={14}
                        className="text-slate-400"
                    />
                    <span className="text-sm font-bold text-slate-800">
                        {title}
                    </span>
                </div>
            }
        >
            <Head title={`Vouchers - ${title}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit overflow-x-auto max-w-full">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = product_attribute === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl transition-all border whitespace-nowrap ${
                                    isActive
                                        ? tab.activeBg
                                        : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60 hover:text-slate-900 font-medium'
                                }`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${
                                        isActive ? tab.color : 'text-slate-400'
                                    }`}
                                />
                                <span>{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <ListVoucherTable
                    vouchers={vouchers}
                    product_attribute={product_attribute}
                    productTitle={productTitle}
                    filters={filters}
                />
            </div>
        </AuthenticatedLayout>
    );
}
