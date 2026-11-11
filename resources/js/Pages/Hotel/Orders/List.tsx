import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Paginate } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelOrdersList, { HotelOrderItem } from './Partials/HotelOrdersList';

interface OrderListProps {
    orders: Paginate<HotelOrderItem>;
    filters?: {
        search?: string;
    };
}

export default function OrderList({ orders, filters }: OrderListProps) {
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
            }
        >
            <Head title="Hotel Orders" />
            <HotelOrdersList orders={orders} filters={filters} />
        </AuthenticatedLayout>
    );
}
