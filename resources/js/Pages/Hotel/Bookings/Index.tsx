import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelBookingForm from './Partials/HotelBookingForm';

export default function BookingsIndex() {
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
                    Hotel Bookings
                </span>
            </>
        }
        >
            <Head title="Hotel Bookings" />
            <HotelBookingForm/>
        </AuthenticatedLayout>
    );
}
