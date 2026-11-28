import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Paginate } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function OrderList() {
    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Flight
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Flight Bookings
                    </span>
                </>
            }
        >
            <Head title="Hotel Orders" />
            {/* <HotelOrdersList orders={orders} filters={filters} /> */}
        </AuthenticatedLayout>
    );
}
