import { useDebounce } from '@/Hooks/useDebounce';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { DestinationProps, HotelProps } from '@/types';
import { Popover, Transition } from '@headlessui/react';
import { Building, Loader2, MapPin, Navigation } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

interface Props {
    destination: string;
    setDestination: (val: string) => void;
}

const topDestinations = [
    'Bali',
    'Jakarta',
    'Singapore',
    'Kuala Lumpur',
    'Tokyo',
];

export default function DestinationPicker({
    destination,
    setDestination,
}: Props) {
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
            hotelMicroserviceApi.get(
                `/find-destination?search=${debouncedSearch}`,
            ),
            hotelMicroserviceApi.get(`/find-hotel?search=${debouncedSearch}`),
        ])
            .then(([destRes, hotelRes]) => {
                if (isMounted) {
                    setDestinations(destRes.data?.data || []);
                    setHotels(hotelRes.data?.data || []);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
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
                    <Popover.Button
                        as="div"
                        className="w-full cursor-pointer focus:outline-none"
                    >
                        <div
                            className={`rounded-xl px-4 py-2 bg-white relative flex w-full flex-col border text-left transition-colors ${
                                open
                                    ? 'border-primary ring-primary ring-1'
                                    : 'hover:border-gray-400 border-[#E2E8F0]'
                            }`}
                        >
                            <span className="font-bold tracking-wider text-quaternary text-[10px] uppercase">
                                Destination / Hotel
                            </span>
                            <div className="gap-2 mt-0.5 flex items-center">
                                <MapPin
                                    size={16}
                                    className={
                                        destination
                                            ? 'text-primary'
                                            : 'text-quaternary-bright'
                                    }
                                />
                                <span
                                    className={`text-sm font-bold truncate ${destination ? 'text-primary' : 'text-quaternary font-normal'}`}
                                >
                                    {destination ||
                                        'Search city, region, or hotel name'}
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
                        <Popover.Panel className="mt-2 bg-white rounded-xl shadow-lg absolute z-50 w-full overflow-hidden border border-[#E2E8F0]">
                            <div className="p-3 border-b border-[#F1F5F9]">
                                <input
                                    type="text"
                                    className="focus:border-primary rounded-lg text-sm text-primary font-medium px-3 py-2 w-full border-transparent bg-[#F8FAFC] focus:ring-0"
                                    placeholder="Type to search..."
                                    value={localSearch}
                                    onChange={(e) => {
                                        setLocalSearch(e.target.value);
                                        setDestination(e.target.value);
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div className="p-2 max-h-80 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setLocalSearch('Near Me');
                                        setDestination('Near Me');
                                        close();
                                    }}
                                    className="gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 group flex w-full items-center text-left transition-colors"
                                >
                                    <div className="w-8 h-8 text-blue-600 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center rounded-full transition-colors">
                                        <Navigation size={14} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-blue-700">
                                            Near Me
                                        </div>
                                        <div className="text-blue-500 text-[10px]">
                                            Find hotels around your current
                                            location
                                        </div>
                                    </div>
                                </button>

                                {isSearching ? (
                                    <div className="gap-2 p-8 text-quaternary flex flex-col items-center justify-center">
                                        <Loader2
                                            size={24}
                                            className="animate-spin text-primary"
                                        />
                                        <span className="text-xs font-bold tracking-wider uppercase">
                                            Searching...
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        {hotels.length > 0 && (
                                            <div className="px-3 py-2 mt-2">
                                                <div className="font-bold tracking-wider text-quaternary mb-1 border-gray-100 pb-1 border-b text-[10px] uppercase">
                                                    Hotels
                                                </div>
                                                {hotels.map((hotel) => (
                                                    <button
                                                        key={hotel.code}
                                                        onClick={() => {
                                                            setLocalSearch(
                                                                hotel.name,
                                                            );
                                                            setDestination(
                                                                hotel.name,
                                                            );
                                                            close();
                                                        }}
                                                        className="gap-3 px-2 py-2.5 rounded-lg group flex w-full items-center text-left transition-colors hover:bg-[#F8FAFC]"
                                                    >
                                                        <Building
                                                            size={16}
                                                            className="text-quaternary group-hover:text-primary shrink-0"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-bold text-primary group-hover:text-primary-bright">
                                                                {hotel.name}
                                                            </div>
                                                            <div className="text-quaternary gap-1 font-medium tracking-wider flex items-center text-[10px] uppercase">
                                                                <span className="font-bold text-amber-500">
                                                                    {
                                                                        hotel.rating
                                                                    }{' '}
                                                                    Stars
                                                                </span>{' '}
                                                                &bull;{' '}
                                                                {
                                                                    hotel.hotelCode
                                                                }
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {destinations.length > 0 && (
                                            <div className="px-3 py-2 mt-2">
                                                <div className="font-bold tracking-wider text-quaternary mb-1 border-gray-100 pb-1 border-b text-[10px] uppercase">
                                                    Destinations
                                                </div>
                                                {destinations.map((dest) => (
                                                    <button
                                                        key={dest.code}
                                                        onClick={() => {
                                                            setLocalSearch(
                                                                dest.name,
                                                            );
                                                            setDestination(
                                                                dest.name,
                                                            );
                                                            close();
                                                        }}
                                                        className="gap-3 px-2 py-2.5 rounded-lg group flex w-full items-center text-left transition-colors hover:bg-[#F8FAFC]"
                                                    >
                                                        <MapPin
                                                            size={16}
                                                            className="text-quaternary group-hover:text-primary shrink-0"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-bold text-primary group-hover:text-primary-bright">
                                                                {dest.name}
                                                            </div>
                                                            <div className="text-quaternary font-medium tracking-wider text-[10px] uppercase">
                                                                {
                                                                    dest.destinationCode
                                                                }{' '}
                                                                &bull;{' '}
                                                                {
                                                                    dest.countryISO2
                                                                }
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {!isSearching &&
                                            debouncedSearch.length >= 3 &&
                                            destinations.length === 0 &&
                                            hotels.length === 0 && (
                                                <div className="p-8 text-sm font-bold text-quaternary text-center">
                                                    No results found for "
                                                    <span className="text-primary">
                                                        {debouncedSearch}
                                                    </span>
                                                    "
                                                </div>
                                            )}

                                        {(!debouncedSearch ||
                                            debouncedSearch.length < 3) && (
                                            <div className="px-3 py-2 mt-2">
                                                <div className="font-bold tracking-wider text-quaternary mb-1 border-gray-100 pb-1 border-b text-[10px] uppercase">
                                                    Top Destinations
                                                </div>
                                                {topDestinations.map((city) => (
                                                    <button
                                                        key={city}
                                                        onClick={() => {
                                                            setLocalSearch(
                                                                city,
                                                            );
                                                            setDestination(
                                                                city,
                                                            );
                                                            // close();
                                                        }}
                                                        className="gap-3 px-2 py-2.5 rounded-lg group flex w-full items-center text-left transition-colors hover:bg-[#F8FAFC]"
                                                    >
                                                        <Building
                                                            size={16}
                                                            className="text-quaternary group-hover:text-primary"
                                                        />
                                                        <span className="text-sm font-bold text-primary group-hover:text-primary-bright">
                                                            {city}
                                                        </span>
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
