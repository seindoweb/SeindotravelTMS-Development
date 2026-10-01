import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { RoomGuestProps, SearchSelectionProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import HotelBookingForm from './Partials/HotelBookingForm';

interface SearchHtlProps {
    type: 'dst' | 'htl';
    country: string;
    code: string;
    checkIn: string;
    checkOut: string;
    room: string;
    page: number;
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
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

export default function SearchHtl({
    type,
    country,
    code,
    checkIn,
    checkOut,
    room,
    page,
}: SearchHtlProps) {
    const rooms = decodeRooms(room);

    const storedName = sessionStorage.getItem('searchSelectionName') || code;

    const initialSelection: SearchSelectionProps | null = code
        ? {
              type,
              name: storedName,
              code,
              country,
          }
        : null;
console.log(initialSelection)
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
