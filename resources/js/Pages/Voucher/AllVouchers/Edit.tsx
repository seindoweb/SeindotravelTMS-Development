import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import EditVoucherForm from './Partials/EditVoucherForm';
import { VoucherItem } from './Partials/VoucherDetailModal';

interface Props {
    voucher: VoucherItem;
    product_attribute: 'flight' | 'hotel' | 'tour' | string;
    title: string;
}

export default function Edit({ voucher, product_attribute, title }: Props) {
    const productTitle =
        product_attribute === 'flight'
            ? 'Flight'
            : product_attribute === 'tour'
              ? 'Tour'
              : 'Hotel';

    const getIndexUrl = () => {
        const routeMap: Record<string, string> = {
            flight: route('voucher.indexFlight'),
            hotel: route('voucher.indexHotel'),
            tour: route('voucher.indexTour'),
        };
        return routeMap[product_attribute] || route('voucher.indexHotel');
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Vouchers
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <Link
                        href={getIndexUrl()}
                        className="text-sm font-bold text-primary truncate hover:underline"
                    >
                        {title}
                    </Link>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Edit #{voucher.id}
                    </span>
                </>
            }
        >
            <Head title={`Edit ${productTitle} Voucher #${voucher.id}`} />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <EditVoucherForm
                    voucher={voucher}
                    productAttribute={product_attribute}
                    productTitle={productTitle}
                />
            </div>
        </AuthenticatedLayout>
    );
}

