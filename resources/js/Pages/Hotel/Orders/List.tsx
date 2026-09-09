import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelOrdersList from './Partials/HotelOrdersList';

export default function OrderList() {
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
                <span className="text-sm font-bold truncate text-primary">
                    Hotel Orders
                </span>
            </>
        }>
            <Head title="Hotel Orders" />
           <HotelOrdersList/>
        </AuthenticatedLayout>
    );
}
