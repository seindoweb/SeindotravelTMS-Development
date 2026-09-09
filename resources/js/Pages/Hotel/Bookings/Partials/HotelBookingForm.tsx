import DateRangePicker from '@/Components/DateRangePicker';
import DestinationPicker from '@/Components/DestinationPicker';
import GuestRoomPicker from '@/Components/GuestRoomPicker';
import { Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

function HotelBookingForm() {
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [extraBeds, setExtraBeds] = useState(0);
  return (
       <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Search Hotels</h1>
                        <p className="text-sm text-quaternary mt-1">Find and book accommodations for your clients.</p>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col xl:flex-row items-center gap-3 w-full">
                    <div className="w-full xl:w-1/3 relative">
                        <DestinationPicker 
                            destination={destination} 
                            setDestination={setDestination} 
                        />
                    </div>

                    <div className="w-full xl:w-1/3 relative">
                        <DateRangePicker 
                            checkIn={checkIn}
                            checkOut={checkOut}
                            setCheckIn={setCheckIn}
                            setCheckOut={setCheckOut}
                        />
                    </div>

                    <div className="w-full xl:w-1/4 relative">
                        <GuestRoomPicker 
                            rooms={rooms} setRooms={setRooms}
                            adults={adults} setAdults={setAdults}
                            children={children} setChildren={setChildren}
                            extraBeds={extraBeds} setExtraBeds={setExtraBeds}
                        />
                    </div>

                    <div className="w-full xl:w-auto self-stretch flex items-stretch">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-bright text-white px-8 rounded-xl font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                            <Search size={18} strokeWidth={2.5} />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
  )
}

export default HotelBookingForm