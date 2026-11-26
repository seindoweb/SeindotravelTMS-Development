import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Users, Trash2, X, Minus, Plus } from 'lucide-react';
import { RoomGuestProps } from '@/types/index-hotel';

interface Props {
    rooms: RoomGuestProps[];
    setRooms: (val: RoomGuestProps[]) => void;
}

export default function GuestRoomPicker({ rooms, setRooms }: Props) {
    const totalRooms = rooms.length;
    const totalAdults = rooms.reduce((acc, room) => acc + room.adults, 0);
    const totalChildren = rooms.reduce((acc, room) => acc + room.children, 0);
    const totalExtraBeds = rooms.filter((room) => room.extraBed).length;

    const updateRoom = (
        index: number,
        field: keyof RoomGuestProps,
        value: number | boolean,
    ) => {
        const newRooms = [...rooms];
        newRooms[index] = { ...newRooms[index], [field]: value };

        if (field === 'children') {
            const count = value as number;
            const currentAges = newRooms[index].childAges || [];
            if (count > currentAges.length) {
                const toAdd = count - currentAges.length;
                newRooms[index].childAges = [
                    ...currentAges,
                    ...Array(toAdd).fill(0),
                ];
            } else if (count < currentAges.length) {
                newRooms[index].childAges = currentAges.slice(0, count);
            }
        }

        setRooms(newRooms);
    };

    const updateChildAge = (
        roomIndex: number,
        childIndex: number,
        age: number,
    ) => {
        const newRooms = [...rooms];
        const newAges = [...(newRooms[roomIndex].childAges || [])];
        newAges[childIndex] = age;
        newRooms[roomIndex] = { ...newRooms[roomIndex], childAges: newAges };
        setRooms(newRooms);
    };

    const addRoom = () => {
        if (rooms.length < 8) {
            setRooms([
                ...rooms,
                { adults: 2, children: 0, childAges: [], extraBed: false },
            ]);
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
                                Room & Guest
                            </span>
                            <div className="gap-2 mt-0.5 flex items-center overflow-hidden">
                                <Users
                                    size={16}
                                    className={`shrink-0 ${open ? 'text-primary' : 'text-primary'}`}
                                />
                                <div className="gap-1.5 flex items-baseline overflow-hidden">
                                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                                        {totalRooms} Room
                                        {totalRooms > 1 ? 's' : ''},{' '}
                                        {totalAdults} Adult
                                        {totalAdults > 1 ? 's' : ''}
                                    </span>
                                    {(totalChildren > 0 ||
                                        totalExtraBeds > 0) && (
                                        <span className="text-quaternary font-medium truncate text-[10px]">
                                            •{' '}
                                            {[
                                                totalChildren > 0
                                                    ? `${totalChildren} Child${totalChildren > 1 ? 'ren' : ''}`
                                                    : null,
                                                totalExtraBeds > 0
                                                    ? `${totalExtraBeds} Bed${totalExtraBeds > 1 ? 's' : ''}`
                                                    : null,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
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
                        <Popover.Panel className="right-0 mt-2 bg-white rounded-xl shadow-xl absolute z-50 w-[360px] overflow-hidden border border-[#E2E8F0]">
                            <div className="p-4 bg-white flex items-center justify-between border-b border-[#E2E8F0]">
                                <h3 className="font-extrabold text-gray-900 text-[15px]">
                                    Total Rooms
                                </h3>
                                <button
                                    onClick={() => close()}
                                    className="p-1 font-bold text-primary hover:text-primary-bright"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="max-h-[350px] overflow-y-auto">
                                {rooms.map((room, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border-b border-[#E2E8F0] last:border-b-0"
                                    >
                                        <div className="mb-1 flex items-center justify-between">
                                            <div className="text-sm font-bold text-primary">
                                                Room {index + 1}
                                            </div>
                                            <div className="gap-4 flex items-center">
                                                <label className="gap-2 font-medium text-gray-600 flex cursor-pointer items-center text-[13px] select-none">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary transition-all"
                                                        checked={room.extraBed}
                                                        onChange={(e) =>
                                                            updateRoom(
                                                                index,
                                                                'extraBed',
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                    />
                                                    Extra Bed
                                                </label>
                                                {rooms.length > 1 && (
                                                    <button
                                                        onClick={() =>
                                                            removeRoom(index)
                                                        }
                                                        className="text-primary hover:text-red-700 transition-colors"
                                                        title="Remove Room"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            {/* Adults */}
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-700 text-[13px]">
                                                        Adult
                                                    </span>
                                                    <span className="text-gray-500 font-medium text-[10px]">
                                                        Ages 13 or above
                                                    </span>
                                                </div>
                                                <div className="gap-3 flex items-center">
                                                    <button
                                                        onClick={() =>
                                                            updateRoom(
                                                                index,
                                                                'adults',
                                                                Math.max(
                                                                    1,
                                                                    room.adults -
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        className="border-gray-300 w-7 h-7 text-primary hover:border-primary hover:bg-red-50 disabled:hover:border-gray-300 flex items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                                        disabled={
                                                            room.adults <= 1
                                                        }
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-4 text-sm font-bold text-gray-800 text-center">
                                                        {room.adults}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateRoom(
                                                                index,
                                                                'adults',
                                                                Math.min(
                                                                    6,
                                                                    room.adults +
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        className="border-gray-300 w-7 h-7 text-primary hover:border-primary hover:bg-red-50 disabled:hover:border-gray-300 flex items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                                        disabled={
                                                            room.adults >= 6
                                                        }
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-700 text-[13px]">
                                                        Children
                                                    </span>
                                                    <span className="text-gray-500 font-medium text-[10px]">
                                                        Ages 0 - 12
                                                    </span>
                                                </div>
                                                <div className="gap-3 flex items-center">
                                                    <button
                                                        onClick={() =>
                                                            updateRoom(
                                                                index,
                                                                'children',
                                                                Math.max(
                                                                    0,
                                                                    room.children -
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        className="border-gray-300 w-7 h-7 text-primary hover:border-primary hover:bg-red-50 disabled:hover:border-gray-300 flex items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                                        disabled={
                                                            room.children <= 0
                                                        }
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-4 text-sm font-bold text-gray-800 text-center">
                                                        {room.children}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateRoom(
                                                                index,
                                                                'children',
                                                                Math.min(
                                                                    4,
                                                                    room.children +
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        className="border-gray-300 w-7 h-7 text-primary hover:border-primary hover:bg-red-50 disabled:hover:border-gray-300 flex items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                                        disabled={
                                                            room.children >= 4
                                                        }
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Child Ages Dropdowns */}
                                            {room.children > 0 && (
                                                <div className="p-3 mt-3 border-gray-100 rounded-lg bg-gray-50 grid grid-cols-2 items-center justify-center border">
                                                    <div className="text-xs font-bold text-gray-700">
                                                        Age of children (0-17)
                                                    </div>
                                                    <div className="w-full">
                                                        {(
                                                            room.childAges || []
                                                        ).map(
                                                            (
                                                                age: number,
                                                                childIdx: number,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        childIdx
                                                                    }
                                                                    className="relative"
                                                                >
                                                                    <select
                                                                        className="rounded-md font-medium focus:ring-primary focus:border-primary py-1.5 px-3 bg-white hover:border-gray-300 w-full cursor-pointer appearance-none border border-[#E2E8F0] text-[13px] transition-colors"
                                                                        value={
                                                                            age
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateChildAge(
                                                                                index,
                                                                                childIdx,
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            )
                                                                        }
                                                                    >
                                                                        {Array.from(
                                                                            {
                                                                                length: 18,
                                                                            },
                                                                            (
                                                                                _,
                                                                                i,
                                                                            ) =>
                                                                                i,
                                                                        ).map(
                                                                            (
                                                                                num,
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        num
                                                                                    }
                                                                                    value={
                                                                                        num
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        num
                                                                                    }{' '}
                                                                                    year
                                                                                    {num !==
                                                                                    1
                                                                                        ? 's'
                                                                                        : ''}{' '}
                                                                                    old
                                                                                </option>
                                                                            ),
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            ),
                                                        )}
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
                                    className="py-2.5 bg-primary hover:bg-primary-bright text-white text-sm font-bold rounded-md w-full transition-all active:scale-[0.98]"
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
