import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { OrderProductAttributeProps, Paginate } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelOrdersList from './Partials/HotelOrdersList';

interface OrderListProps {
    orders: Paginate<OrderProductAttributeProps>;
    filters?: {
        search?: string;
    };
}

export default function OrderList({ orders, filters }: OrderListProps) {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Hotel
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
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
