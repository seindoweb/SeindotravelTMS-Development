import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight
} from 'lucide-react';
import HotelOrdersDetail from './Partials/HotelOrdersDetail';

export default function Details() {
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
                <Link href={route('hotel.orders.list')} className="text-sm font-bold truncate text-primary">
                    Hotel Orders
                </Link>
                <ChevronRight
                    size={14}
                    className="hidden text-[#CBD5E1] sm:block"
                />
                <span className="text-sm font-bold truncate text-primary">
                    Details
                </span>
            </>
        }>
            <Head title="Order Details - Hotel Sales" />

            <HotelOrdersDetail/>
        </AuthenticatedLayout>
    );
}