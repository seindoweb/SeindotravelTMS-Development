import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Paginate } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Compass, Hotel, Plane } from 'lucide-react';
import React from 'react';
import ListVoucherTable from './Partials/ListVoucherTable';
import { VoucherItem } from './Partials/VoucherDetailModal';
import { PRODUCT_ATTRIBUTE } from '@/constants/global';

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
            activeBg:
                'bg-sky-50 text-sky-800 border-sky-300 font-bold shadow-sm',
        },
        {
            key: 'hotel',
            label: 'Hotel Vouchers',
            icon: Hotel,
            href: route('voucher.indexHotel'),
            color: 'text-emerald-600',
            activeBg:
                'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-sm',
        },
        {
            key: 'tour',
            label: 'Tour Vouchers',
            icon: Compass,
            href: route('voucher.indexTour'),
            color: 'text-amber-600',
            activeBg:
                'bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-sm',
        },
    ];

    const productTitle = (() => {
        switch (product_attribute) {
            case PRODUCT_ATTRIBUTE.FLIGHT:
                return 'Flight';
            case PRODUCT_ATTRIBUTE.TOUR:
                return 'Tour';
            case PRODUCT_ATTRIBUTE.HOTEL:
                return 'Tour';
            default:
                return title;
        }
    })();

    return (
        <AuthenticatedLayout
            header={
                <div className="gap-2 flex items-center">
                    <span className="text-sm font-medium text-slate-500">
                        Vouchers
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">
                        {title}
                    </span>
                </div>
            }
        >
            <Head title={`Vouchers - ${title}`} />

            <div className="px-4 space-y-4 mx-auto">
                <div className="gap-2 p-1.5 bg-slate-100/80 rounded-2xl border-slate-200/80 flex w-fit max-w-full items-center overflow-x-auto border">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = product_attribute === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.href}
                                className={`gap-2 px-4 py-2 text-xs rounded-xl flex items-center border whitespace-nowrap transition-all ${
                                    isActive
                                        ? tab.activeBg
                                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 font-medium border-transparent bg-transparent'
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
