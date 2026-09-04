import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Building, MapPin, Navigation } from 'lucide-react';
import { Fragment } from 'react';

interface Props {
    destination: string;
    setDestination: (val: string) => void;
}

const topDestinations = [
    "Bali, Indonesia", "Jakarta, Indonesia", "Singapore", "Kuala Lumpur, Malaysia", "Tokyo, Japan"
];

export default function DestinationPicker({ destination, setDestination }: Props) {
    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button as="div" className="w-full focus:outline-none cursor-pointer">
                        <div className={clsx(
                            "flex flex-col relative w-full border rounded-xl px-4 py-2 transition-colors text-left bg-white",
                            open ? "border-primary ring-1 ring-primary" : "border-[#E2E8F0] hover:border-gray-400"
                        )}>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary">Destination / Hotel</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <MapPin size={16} className={destination ? 'text-primary' : 'text-quaternary-bright'} />
                                <span className={clsx("text-sm font-bold truncate", destination ? "text-primary" : "text-quaternary font-normal")}>
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
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto p-2">
                                <button 
                                    onClick={() => { setDestination("Near Me"); close(); }}
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

                                <div className="px-3 py-2 mt-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-quaternary mb-1">Top Destinations</div>
                                    {topDestinations.map(city => (
                                        <button 
                                            key={city}
                                            onClick={() => { setDestination(city); close(); }}
                                            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors"
                                        >
                                            <Building size={14} className="text-quaternary" />
                                            <span className="text-sm font-medium text-primary">{city}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
