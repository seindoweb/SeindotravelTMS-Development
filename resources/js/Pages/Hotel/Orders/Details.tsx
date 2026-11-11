import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelOrdersDetail, {
    HotelOrderDetailProps,
} from './Partials/HotelOrdersDetail';

export default function Details({
    orderProductAttribute,
    hotelPreview,
}: HotelOrderDetailProps) {
    const rawCode = orderProductAttribute?.code || 'Details';

    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold truncate text-primary">
                        Hotel
                    </span>
                    <ChevronRight
                        size={14}
                        className="hidden text-[#CBD5E1] sm:block"
                    />
                    <Link
                        href={route('hotel.orders.list')}
                        className="text-sm font-bold truncate text-primary hover:underline"
                    >
                        Hotel Orders
                    </Link>
                    <ChevronRight
                        size={14}
                        className="hidden text-[#CBD5E1] sm:block"
                    />
                    <span className="text-sm font-bold truncate text-primary font-mono">
                        {rawCode}
                    </span>
                </>
            }
        >
            <Head title={`Order ${rawCode} - Hotel Details`} />

            <HotelOrdersDetail
                orderProductAttribute={orderProductAttribute}
                hotelPreview={hotelPreview}
            />
        </AuthenticatedLayout>
    );
}