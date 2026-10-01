import DateRangePicker from '@/Components/DateRangePicker';
import DestinationPicker from '@/Components/DestinationPicker';
import GuestRoomPicker from '@/Components/GuestRoomPicker';
import { RoomGuestProps, SearchSelectionProps } from '@/types';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
    initialSelection?: SearchSelectionProps | null;
    initialCheckIn?: Date | null;
    initialCheckOut?: Date | null;
    initialRooms?: RoomGuestProps[];
}

function encodeRooms(rooms: RoomGuestProps[]): string {
    return rooms
        .map((r, index) => {
            const roomNo = index + 1;
            const child1Age = r.childAges[0] ?? 0;
            const child2Age = r.childAges[1] ?? 0;
            return `${roomNo}-${r.adults}-${r.children}-${child1Age}-${child2Age}-${r.extraBed}`;
        })
        .join(',');
}

function formatDate(date: Date | null): string {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function HotelBookingForm({
    initialSelection = null,
    initialCheckIn = null,
    initialCheckOut = null,
    initialRooms,
}: Props) {
    const [selection, setSelection] = useState<SearchSelectionProps | null>(
        initialSelection,
    );
    const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
    const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
    const [rooms, setRooms] = useState<RoomGuestProps[]>(
        initialRooms ?? [
            { adults: 2, children: 0, childAges: [], extraBed: false },
        ],
    );
    const [error, setError] = useState<string | null>(null);

    const handleSearch = () => {
        setError(null);

        if (!selection) {
            setError('Please select a destination or hotel.');
            return;
        }
        if (!checkIn || !checkOut) {
            setError('Please select check-in and check-out dates.');
            return;
        }

        const roomStr = encodeRooms(rooms);
        const query = [
            `type=${selection.type}`,
            `country=${selection.country}`,
            `code=${selection.code}`,
            `checkIn=${formatDate(checkIn)}`,
            `checkOut=${formatDate(checkOut)}`,
            `room=${roomStr}`,
            `page=1`,
        ].join('&');

        sessionStorage.setItem('searchSelectionName', selection.name);
        window.location.href = `/hotel/bookings/search?${query}`;
    };

    return (
        <div className="mt-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E2E8F0]">
                <div className="gap-4 mb-6 sm:flex-row sm:items-center flex flex-col items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">
                            Search Hotels
                        </h1>
                        <p className="mt-1 text-sm text-quaternary">
                            Find and book accommodations for your clients.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border-red-100 border">
                        {error}
                    </div>
                )}

                <div className="gap-3 xl:flex-row flex w-full flex-col items-center">
                    <div className="xl:w-1/3 relative w-full">
                        <DestinationPicker
                            selection={selection}
                            onSelect={setSelection}
                        />
                    </div>

                    <div className="xl:w-1/3 relative w-full">
                        <DateRangePicker
                            checkIn={checkIn}
                            checkOut={checkOut}
                            setCheckIn={setCheckIn}
                            setCheckOut={setCheckOut}
                        />
                    </div>

                    <div className="xl:w-1/4 relative w-full">
                        <GuestRoomPicker rooms={rooms} setRooms={setRooms} />
                    </div>

                    <div className="xl:w-auto flex w-full items-stretch self-stretch">
                        <button
                            onClick={handleSearch}
                            className="gap-2 bg-primary hover:bg-primary-bright text-white px-8 rounded-xl font-bold shadow-sm hover:shadow-md flex w-full items-center justify-center transition-all active:scale-[0.98]"
                        >
                            <Search size={18} strokeWidth={2.5} />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelBookingForm;
