import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { RoomGuestProps, SearchSelectionProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelBookingForm from './Partials/HotelBookingForm';

interface SearchHtlProps {
    country: string;
    destination?: string;
    hotel?: string;
    checkIn: string;
    checkOut: string;
    room: string;
}

function decodeRooms(roomStr: string): RoomGuestProps[] {
    if (!roomStr) {
        return [{ adults: 2, children: 0, childAges: [], extraBed: false }];
    }
    return roomStr.split(',').map((part) => {
        const segments = part.split('-');
        const adults = parseInt(segments[1] ?? '2', 10) || 2;
        const children = parseInt(segments[2] ?? '0', 10) || 0;
        const child1Age = parseInt(segments[3] ?? '0', 10) || 0;
        const child2Age = parseInt(segments[4] ?? '0', 10) || 0;
        const extraBed = segments[5] === 'true';
        const childAges: number[] = [];
        if (children >= 1) childAges.push(child1Age);
        if (children >= 2) childAges.push(child2Age);
        return { adults, children, childAges, extraBed };
    });
}

function parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

export default function SearchHtl({
    country,
    destination,
    hotel,
    checkIn,
    checkOut,
    room,
}: SearchHtlProps) {
    const hotelCode = hotel || '';
    const destinationCode = destination || '';
    const rooms = decodeRooms(room);

    const storedName = sessionStorage.getItem('searchSelectionName') || hotelCode;

    const initialSelection: SearchSelectionProps | null = hotelCode
        ? {
              type: 'htl',
              name: storedName,
              code: hotelCode,
              hotel: hotelCode,
              destination: destinationCode,
              country,
          }
        : null;

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
                        Search
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Hotel
                    </span>
                </>
            }
        >
            <Head title="Hotel Search — Hotel" />
            <HotelBookingForm
                initialSelection={initialSelection}
                initialCheckIn={parseDate(checkIn)}
                initialCheckOut={parseDate(checkOut)}
                initialRooms={rooms}
            />
        </AuthenticatedLayout>
    );
}
