import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Users, Trash2, X, Minus, Plus } from 'lucide-react';
import { RoomGuestProps } from '@/types';

interface Props {
    rooms: RoomGuestProps[];
    setRooms: (val: RoomGuestProps[]) => void;
}

export default function GuestRoomPicker({ rooms, setRooms }: Props) {
    const totalRooms = rooms.length;
    const totalAdults = rooms.reduce((acc, room) => acc + room.adults, 0);
    const totalChildren = rooms.reduce((acc, room) => acc + room.children, 0);
    const totalExtraBeds = rooms.filter(room => room.extraBed).length;

    const updateRoom = (index: number, field: keyof RoomGuestProps, value: number | boolean) => {
        const newRooms = [...rooms];
        newRooms[index] = { ...newRooms[index], [field]: value };
        
        if (field === 'children') {
            const count = value as number;
            const currentAges = newRooms[index].childAges || [];
            if (count > currentAges.length) {
                const toAdd = count - currentAges.length;
                newRooms[index].childAges = [...currentAges, ...Array(toAdd).fill(0)];
            } else if (count < currentAges.length) {
                newRooms[index].childAges = currentAges.slice(0, count);
            }
        }
        
        setRooms(newRooms);
    };

    const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
        const newRooms = [...rooms];
        const newAges = [...(newRooms[roomIndex].childAges || [])];
        newAges[childIndex] = age;
        newRooms[roomIndex] = { ...newRooms[roomIndex], childAges: newAges };
        setRooms(newRooms);
    };

    const addRoom = () => {
        if (rooms.length < 8) {
            setRooms([...rooms, { adults: 2, children: 0, childAges: [], extraBed: false }]);
        }
    };

    const removeRoom = (index: number) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter((_, i) => i !== index));
        }
    };

    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button as="div" className="w-full focus:outline-none cursor-pointer">
                        <div className={`flex flex-col relative w-full border rounded-xl px-4 py-2 transition-colors text-left bg-white ${
                            open ? "border-primary ring-1 ring-primary" : "border-[#E2E8F0] hover:border-gray-400"
                        }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary">Room & Guest</span>
                            <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                                <Users size={16} className={`shrink-0 ${open ? 'text-primary' : 'text-primary'}`} />
                                <div className="flex items-baseline gap-1.5 overflow-hidden">
                                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                                        {totalRooms} Room{totalRooms > 1 ? 's' : ''}, {totalAdults} Adult{totalAdults > 1 ? 's' : ''}
                                    </span>
                                    {(totalChildren > 0 || totalExtraBeds > 0) && (
                                        <span className="text-[10px] text-quaternary font-medium truncate">
                                            • {[
                                                totalChildren > 0 ? `${totalChildren} Child${totalChildren > 1 ? 'ren' : ''}` : null,
                                                totalExtraBeds > 0 ? `${totalExtraBeds} Bed${totalExtraBeds > 1 ? 's' : ''}` : null,
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
                        <Popover.Panel className="absolute z-50 right-0 w-[360px] mt-2 bg-white rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden">
                            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
                                <h3 className="font-extrabold text-[15px] text-gray-900">Total Rooms</h3>
                                <button onClick={() => close()} className="text-primary hover:text-primary-bright font-bold p-1">
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="max-h-[350px] overflow-y-auto">
                                {rooms.map((room, index) => (
                                    <div key={index} className="p-4 border-b border-[#E2E8F0] last:border-b-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="font-bold text-sm text-primary">Room {index + 1}</div>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 cursor-pointer select-none">
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300 transition-all"
                                                        checked={room.extraBed}
                                                        onChange={(e) => updateRoom(index, 'extraBed', e.target.checked)}
                                                    />
                                                    Extra Bed
                                                </label>
                                                {rooms.length > 1 && (
                                                    <button onClick={() => removeRoom(index)} className="text-primary hover:text-red-700 transition-colors" title="Remove Room">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3">
                                            {/* Adults */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-gray-700">Adult</span>
                                                    <span className="text-[10px] text-gray-500 font-medium">Ages 13 or above</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => updateRoom(index, 'adults', Math.max(1, room.adults - 1))}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-primary hover:border-primary hover:bg-red-50 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                                                        disabled={room.adults <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-4 text-center font-bold text-sm text-gray-800">{room.adults}</span>
                                                    <button 
                                                        onClick={() => updateRoom(index, 'adults', Math.min(6, room.adults + 1))}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-primary hover:border-primary hover:bg-red-50 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                                                        disabled={room.adults >= 6}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-gray-700">Children</span>
                                                    <span className="text-[10px] text-gray-500 font-medium">Ages 0 - 12</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => updateRoom(index, 'children', Math.max(0, room.children - 1))}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-primary hover:border-primary hover:bg-red-50 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                                                        disabled={room.children <= 0}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-4 text-center font-bold text-sm text-gray-800">{room.children}</span>
                                                    <button 
                                                        onClick={() => updateRoom(index, 'children', Math.min(4, room.children + 1))}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-primary hover:border-primary hover:bg-red-50 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                                                        disabled={room.children >= 4}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Child Ages Dropdowns */}
                                            {room.children > 0 && (
                                                <div className="grid grid-cols-2 items-center justify-center mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="text-xs font-bold text-gray-700">Age of children (0-17)</div>
                                                    <div className="w-full">
                                                        {(room.childAges || []).map((age, childIdx) => (
                                                            <div key={childIdx} className="relative">
                                                                <select 
                                                                    className="w-full border border-[#E2E8F0] rounded-md text-[13px] font-medium focus:ring-primary focus:border-primary py-1.5 px-3 bg-white hover:border-gray-300 transition-colors cursor-pointer appearance-none"
                                                                    value={age}
                                                                    onChange={(e) => updateChildAge(index, childIdx, parseInt(e.target.value))}
                                                                >
                                                                    {Array.from({length: 18}, (_, i) => i).map(num => (
                                                                        <option key={num} value={num}>{num} year{num !== 1 ? 's' : ''} old</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-4 bg-white border-t border-[#E2E8F0]">
                                <button 
                                    onClick={addRoom}
                                    className="w-full py-2.5 bg-primary hover:bg-primary-bright text-white text-sm font-bold rounded-md transition-all active:scale-[0.98]"
                                >
                                    + Add Room
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
