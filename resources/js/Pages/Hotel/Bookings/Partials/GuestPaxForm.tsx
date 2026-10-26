import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectOption, { SelectOptionProps } from '@/Components/SelectOption';
import TextInput from '@/Components/TextInput';
import { TravellerProps } from '@/types';
import { Baby, Check, RefreshCw, User, X } from 'lucide-react';
import React from 'react';

export interface PaxItem {
    salutation: string;
    firstName: string;
    lastName: string;
    age: string;
    type: 'adult' | 'child';
    travellerId?: number | string;
    travellerName?: string;
}

export interface RoomPaxGroup {
    roomNo: string | number;
    noOfAdults: number;
    noOfChild: number;
    pax: PaxItem[];
    rateKey: string;
}

export const salutations: SelectOptionProps[] = [
    { id: 'Mr.', name: 'Mr.' },
    { id: 'Mrs.', name: 'Mrs.' },
    { id: 'Ms.', name: 'Ms.' },
];

export interface GuestPaxFormProps {
    roomsPax: RoomPaxGroup[];
    setRoomsPax: React.Dispatch<React.SetStateAction<RoomPaxGroup[]>>;
    formErrors: Record<string, string>;
    setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onOpenSelectTravellerModal: (roomIdx: number, paxIdx: number) => void;
    onClearPaxTraveller?: (roomIdx: number, paxIdx: number) => void;
}

export default function GuestPaxForm({
    roomsPax,
    setRoomsPax,
    formErrors,
    setFormErrors,
    onOpenSelectTravellerModal,
    onClearPaxTraveller,
}: GuestPaxFormProps) {
    const handleUpdatePax = (
        roomIdx: number,
        paxIdx: number,
        field: keyof PaxItem,
        value: string,
    ) => {
        setRoomsPax((prev) => {
            const next = [...prev];
            const nextRoom = { ...next[roomIdx] };
            const nextPaxList = [...nextRoom.pax];
            nextPaxList[paxIdx] = {
                ...nextPaxList[paxIdx],
                [field]: value,
            };
            nextRoom.pax = nextPaxList;
            next[roomIdx] = nextRoom;
            return next;
        });

        const errorKey = `room_${roomIdx}_pax_${paxIdx}_${field}`;
        if (formErrors[errorKey]) {
            setFormErrors((prev) => ({
                ...prev,
                [errorKey]: '',
            }));
        }
    };

    return (
        <div className="space-y-6">
            {roomsPax.map((roomGroup, roomIdx) => {
                const totalGuestsInRoom = roomGroup.pax.length;
                return (
                    <div
                        key={roomGroup.roomNo || roomIdx}
                        className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-5"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <div>
                                    <h2 className="text-base font-bold text-primary">
                                        Room {roomGroup.roomNo}
                                    </h2>
                                    <p className="text-xs text-quaternary">
                                        {totalGuestsInRoom} Guests ({roomGroup.noOfAdults} Adults
                                        {roomGroup.noOfChild > 0 ? `, ${roomGroup.noOfChild} Child` : ''})
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 self-start sm:self-auto">
                                Room #{roomGroup.roomNo}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {roomGroup.pax.map((paxItem, paxIdx) => {
                                const isChild = paxItem.type === 'child';
                                const isFirstGuest = roomIdx === 0 && paxIdx === 0;
                                const firstNameErrorKey = `room_${roomIdx}_pax_${paxIdx}_firstName`;
                                const lastNameErrorKey = `room_${roomIdx}_pax_${paxIdx}_lastName`;
                                const ageErrorKey = `room_${roomIdx}_pax_${paxIdx}_age`;

                                return (
                                    <div
                                        key={paxIdx}
                                        className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 relative"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                                                        isChild ? 'bg-amber-500' : 'bg-primary'
                                                    }`}
                                                >
                                                    {paxIdx + 1}
                                                </span>
                                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                                    {isFirstGuest
                                                        ? 'Main Guest (Pax 1)'
                                                        : `Pax ${paxIdx + 1}`}
                                                </h3>
                                                {isChild ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                                        <Baby size={11} />
                                                        Child
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                                                        <User size={11} />
                                                        Adult
                                                    </span>
                                                )}
                                            </div>

                                            {paxItem.travellerId ? (
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        <Check size={11} /> {paxItem.travellerName || 'Traveller Selected'}
                                                    </span>
                                                    <SecondaryButton
                                                        type="button"
                                                        onClick={() => onOpenSelectTravellerModal(roomIdx, paxIdx)}
                                                        className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded-lg cursor-pointer"
                                                    >
                                                        <RefreshCw size={11} />
                                                        <span>Change</span>
                                                    </SecondaryButton>
                                                    {onClearPaxTraveller && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onClearPaxTraveller(roomIdx, paxIdx)}
                                                            className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                                            title="Clear Traveller"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => onOpenSelectTravellerModal(roomIdx, paxIdx)}
                                                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl cursor-pointer w-fit"
                                                >
                                                    <User size={13} />
                                                    <span>Select Traveller</span>
                                                </SecondaryButton>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                            <div className="sm:col-span-3">
                                                <InputLabel
                                                    htmlFor={`pax_${roomIdx}_${paxIdx}_salutation`}
                                                    value="Salutation"
                                                />
                                                <SelectOption
                                                    id={`pax_${roomIdx}_${paxIdx}_salutation`}
                                                    options={salutations}
                                                    className="mt-1 block w-full"
                                                    value={
                                                        salutations.find(
                                                            (s) => s.id === paxItem.salutation,
                                                        ) || salutations[0]
                                                    }
                                                    onChange={(opt) =>
                                                        handleUpdatePax(
                                                            roomIdx,
                                                            paxIdx,
                                                            'salutation',
                                                            opt.id,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="sm:col-span-4">
                                                <InputLabel
                                                    htmlFor={`pax_${roomIdx}_${paxIdx}_firstName`}
                                                    value="First Name *"
                                                />
                                                <TextInput
                                                    id={`pax_${roomIdx}_${paxIdx}_firstName`}
                                                    type="text"
                                                    placeholder="Contoh: Peter"
                                                    className="mt-1 block w-full"
                                                    value={paxItem.firstName}
                                                    onChange={(e) =>
                                                        handleUpdatePax(
                                                            roomIdx,
                                                            paxIdx,
                                                            'firstName',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={formErrors[firstNameErrorKey]}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="sm:col-span-3">
                                                <InputLabel
                                                    htmlFor={`pax_${roomIdx}_${paxIdx}_lastName`}
                                                    value="Last Name *"
                                                />
                                                <TextInput
                                                    id={`pax_${roomIdx}_${paxIdx}_lastName`}
                                                    type="text"
                                                    placeholder="Contoh: Smith"
                                                    className="mt-1 block w-full"
                                                    value={paxItem.lastName}
                                                    onChange={(e) =>
                                                        handleUpdatePax(
                                                            roomIdx,
                                                            paxIdx,
                                                            'lastName',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={formErrors[lastNameErrorKey]}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <InputLabel
                                                    htmlFor={`pax_${roomIdx}_${paxIdx}_age`}
                                                    value={isChild ? 'Age *' : 'Age'}
                                                />
                                                <TextInput
                                                    id={`pax_${roomIdx}_${paxIdx}_age`}
                                                    type="number"
                                                    min="0"
                                                    max="120"
                                                    placeholder={isChild ? 'Required' : 'Optional'}
                                                    className={`mt-1 block w-full ${
                                                        isChild ? 'border-amber-300 focus:border-amber-500' : ''
                                                    }`}
                                                    value={paxItem.age}
                                                    onChange={(e) =>
                                                        handleUpdatePax(
                                                            roomIdx,
                                                            paxIdx,
                                                            'age',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={formErrors[ageErrorKey]}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
