import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ListHotelOrders from './Partials/ListHotelOrders';
import { ChevronRight } from 'lucide-react';

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
           <ListHotelOrders/>
        </AuthenticatedLayout>
    );
}
