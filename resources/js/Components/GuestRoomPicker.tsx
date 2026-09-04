import clsx from 'clsx';
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Users, Minus, Plus } from 'lucide-react';

interface Props {
    rooms: number;
    adults: number;
    children: number;
    extraBeds: number;
    setRooms: (val: number) => void;
    setAdults: (val: number) => void;
    setChildren: (val: number) => void;
    setExtraBeds: (val: number) => void;
}

export default function GuestRoomPicker({ 
    rooms, adults, children, extraBeds, 
    setRooms, setAdults, setChildren, setExtraBeds 
}: Props) {
    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button as="div" className="w-full focus:outline-none cursor-pointer">
                        <div className={clsx(
                            "flex flex-col relative w-full border rounded-xl px-4 py-2 transition-colors text-left bg-white",
                            open ? "border-primary ring-1 ring-primary" : "border-[#E2E8F0] hover:border-gray-400"
                        )}>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary">Rooms & Guests</span>
                            <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                                <Users size={16} className={clsx("shrink-0", open ? 'text-primary' : 'text-primary')} />
                                <div className="flex items-baseline gap-1.5 overflow-hidden">
                                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                                        {rooms} Rm, {adults} Adult{adults > 1 ? 's' : ''}
                                    </span>
                                    {(children > 0 || extraBeds > 0) && (
                                        <span className="text-[10px] text-quaternary font-medium truncate">
                                            • {[
                                                children > 0 ? `${children} Child${children > 1 ? 'ren' : ''}` : null,
                                                extraBeds > 0 ? `${extraBeds} Bed${extraBeds > 1 ? 's' : ''}` : null,
                                            ].filter(Boolean).join(', ')}
                                        </span>
                                    )}
                                </div>
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
                        <Popover.Panel className="absolute z-50 right-0 w-[300px] mt-2 bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <div className="font-bold text-sm text-primary">Rooms</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary disabled:opacity-30">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-4 text-center font-bold text-sm">{rooms}</span>
                                    <button onClick={() => setRooms(rooms + 1)} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <div className="font-bold text-sm text-primary">Adults</div>
                                    <div className="text-[10px] text-quaternary font-medium">Ages 13 or above</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary disabled:opacity-30">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-4 text-center font-bold text-sm">{adults}</span>
                                    <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <div className="font-bold text-sm text-primary">Children</div>
                                    <div className="text-[10px] text-quaternary font-medium">Ages 0 - 12</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary disabled:opacity-30">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-4 text-center font-bold text-sm">{children}</span>
                                    <button onClick={() => setChildren(children + 1)} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm text-primary">Extra Beds</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setExtraBeds(Math.max(0, extraBeds - 1))} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary disabled:opacity-30">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-4 text-center font-bold text-sm">{extraBeds}</span>
                                    <button onClick={() => setExtraBeds(extraBeds + 1)} className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-primary hover:border-primary">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex justify-end">
                                <button onClick={() => close()} className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg shadow-sm w-full">Apply</button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
