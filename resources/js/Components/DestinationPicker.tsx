import { useDebounce } from '@/Hooks/useDebounce';
import { travelApi } from '@/libs/http/travelApi';
import { DestinationProps, HotelProps } from '@/types';
import { Popover, Transition } from '@headlessui/react';
import { Building, Loader2, MapPin, Navigation } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

interface Props {
    destination: string;
    setDestination: (val: string) => void;
}

const topDestinations = [
    "Bali", "Jakarta", "Singapore", "Kuala Lumpur", "Tokyo"
];

export default function DestinationPicker({ destination, setDestination }: Props) {
    const [localSearch, setLocalSearch] = useState(destination);
    const debouncedSearch = useDebounce(localSearch, 500);
    const [hotels, setHotels] = useState<HotelProps[]>([]);
    const [destinations, setDestinations] = useState<DestinationProps[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setLocalSearch(destination);
    }, [destination]);

    useEffect(() => {
        if (!debouncedSearch || debouncedSearch.length < 3) {
            setHotels([]);
            setDestinations([]);
            return;
        }

        let isMounted = true;
        setIsSearching(true);

        Promise.all([
            travelApi.get(`/find-destination?search=${debouncedSearch}`),
            travelApi.get(`/find-hotel?search=${debouncedSearch}`)
        ]).then(([destRes, hotelRes]) => {
            if (isMounted) {
                setDestinations(destRes.data?.data || []);
                setHotels(hotelRes.data?.data || []);
            }
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            if (isMounted) setIsSearching(false);
        });

        return () => {
            isMounted = false;
        };
    }, [debouncedSearch]);

    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button as="div" className="w-full focus:outline-none cursor-pointer">
                        <div className={`flex flex-col relative w-full border rounded-xl px-4 py-2 transition-colors text-left bg-white ${
                            open ? "border-primary ring-1 ring-primary" : "border-[#E2E8F0] hover:border-gray-400"
                        }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary">Destination / Hotel</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <MapPin size={16} className={destination ? 'text-primary' : 'text-quaternary-bright'} />
                                <span className={`text-sm font-bold truncate ${destination ? "text-primary" : "text-quaternary font-normal"}`}>
                                    {destination || "Search city, region, or hotel name"}
                                </span>
                            </div>
                        </div>
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                            <div className="p-3 border-b border-[#F1F5F9]">
                                <input 
                                    type="text" 
                                    className="w-full bg-[#F8FAFC] border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm text-primary font-medium px-3 py-2"
                                    placeholder="Type to search..."
                                    value={localSearch}
                                    onChange={(e) => {
                                        setLocalSearch(e.target.value);
                                        setDestination(e.target.value);
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-80 overflow-y-auto p-2">
                                <button 
                                    onClick={() => { 
                                        setLocalSearch("Near Me"); 
                                        setDestination("Near Me"); 
                                        close(); 
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-left transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Navigation size={14} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-blue-700">Near Me</div>
                                        <div className="text-[10px] text-blue-500">Find hotels around your current location</div>
                                    </div>
                                </button>

                                {isSearching ? (
                                    <div className="p-8 flex flex-col items-center justify-center text-quaternary gap-2">
                                        <Loader2 size={24} className="animate-spin text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Searching...</span>
                                    </div>
                                ) : (
                                    <>
                                        {destinations.length > 0 && (
                                            <div className="px-3 py-2 mt-2">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-quaternary mb-1 border-b border-gray-100 pb-1">Destinations</div>
                                                {destinations.map(dest => (
                                                    <button 
                                                        key={dest.code}
                                                        onClick={() => { 
                                                            setLocalSearch(dest.name);
                                                            setDestination(dest.name); 
                                                            close(); 
                                                        }}
                                                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors group"
                                                    >
                                                        <MapPin size={16} className="text-quaternary group-hover:text-primary shrink-0" />
                                                        <div>
                                                            <div className="text-sm font-bold text-primary group-hover:text-primary-bright">{dest.name}</div>
                                                            <div className="text-[10px] text-quaternary font-medium uppercase tracking-wider">{dest.destinationCode} &bull; {dest.countryISO2}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {hotels.length > 0 && (
                                            <div className="px-3 py-2 mt-2">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-quaternary mb-1 border-b border-gray-100 pb-1">Hotels</div>
                                                {hotels.map(hotel => (
                                                    <button 
                                                        key={hotel.code}
                                                        onClick={() => { 
                                                            setLocalSearch(hotel.name);
                                                            setDestination(hotel.name); 
                                                            close(); 
                                                        }}
                                                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors group"
                                                    >
                                                        <Building size={16} className="text-quaternary group-hover:text-primary shrink-0" />
                                                        <div>
                                                            <div className="text-sm font-bold text-primary group-hover:text-primary-bright">{hotel.name}</div>
                                                            <div className="text-[10px] text-quaternary flex items-center gap-1 font-medium uppercase tracking-wider">
                                                                <span className="text-amber-500 font-bold">{hotel.rating} Stars</span> &bull; {hotel.hotelCode}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {!isSearching && debouncedSearch.length >= 3 && destinations.length === 0 && hotels.length === 0 && (
                                            <div className="p-8 text-center text-sm font-bold text-quaternary">
                                                No results found for "<span className="text-primary">{debouncedSearch}</span>"
                                            </div>
                                        )}

                                        {(!debouncedSearch || debouncedSearch.length < 3) && (
                                            <div className="px-3 py-2 mt-2">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-quaternary mb-1 border-b border-gray-100 pb-1">Top Destinations</div>
                                                {topDestinations.map(city => (
                                                    <button 
                                                        key={city}
                                                        onClick={() => { 
                                                            setLocalSearch(city);
                                                            setDestination(city); 
                                                            // close(); 
                                                        }}
                                                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors group"
                                                    >
                                                        <Building size={16} className="text-quaternary group-hover:text-primary" />
                                                        <span className="text-sm font-bold text-primary group-hover:text-primary-bright">{city}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
