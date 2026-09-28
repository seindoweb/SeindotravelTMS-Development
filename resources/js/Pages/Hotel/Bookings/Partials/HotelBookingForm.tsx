import DateRangePicker from '@/Components/DateRangePicker';
import DestinationPicker from '@/Components/DestinationPicker';
import GuestRoomPicker from '@/Components/GuestRoomPicker';
import { RoomGuestProps } from '@/types';
import { Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

function HotelBookingForm() {
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [rooms, setRooms] = useState<RoomGuestProps[]>([
        { adults: 2, children: 0, childAges: [], extraBed: false },
    ]);
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
                <div className="gap-3 xl:flex-row flex w-full flex-col items-center">
                    <div className="xl:w-1/3 relative w-full">
                        <DestinationPicker
                            destination={destination}
                            setDestination={setDestination}
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
                        <button className="gap-2 bg-primary hover:bg-primary-bright text-white px-8 rounded-xl font-bold shadow-sm hover:shadow-md flex w-full items-center justify-center transition-all active:scale-[0.98]">
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
