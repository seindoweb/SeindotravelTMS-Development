import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectOption, { SelectOptionProps } from '@/Components/SelectOption';
import TextInput from '@/Components/TextInput';
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
                        className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 border border-[#E2E8F0]"
                    >
                        <div className="gap-2 pb-4 border-gray-100 sm:flex-row sm:items-center flex flex-col justify-between border-b">
                            <div className="gap-2.5 flex items-center">
                                <div>
                                    <h2 className="text-base font-bold text-primary">
                                        Room {roomGroup.roomNo}
                                    </h2>
                                    <p className="text-xs text-quaternary">
                                        {totalGuestsInRoom} Guests (
                                        {roomGroup.noOfAdults} Adults
                                        {roomGroup.noOfChild > 0
                                            ? `, ${roomGroup.noOfChild} Child`
                                            : ''}
                                        )
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 sm:self-auto self-start">
                                Room #{roomGroup.roomNo}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {roomGroup.pax.map((paxItem, paxIdx) => {
                                const isChild = paxItem.type === 'child';
                                const isFirstGuest =
                                    roomIdx === 0 && paxIdx === 0;
                                const firstNameErrorKey = `room_${roomIdx}_pax_${paxIdx}_firstName`;
                                const lastNameErrorKey = `room_${roomIdx}_pax_${paxIdx}_lastName`;
                                const ageErrorKey = `room_${roomIdx}_pax_${paxIdx}_age`;

                                return (
                                    <div
                                        key={paxIdx}
                                        className="p-4 bg-slate-50/70 border-slate-200/80 rounded-2xl sm:p-5 relative border"
                                    >
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="gap-2 flex items-center">
                                                <span
                                                    className={`w-5 h-5 text-white font-bold flex items-center justify-center rounded-full text-[10px] ${
                                                        isChild
                                                            ? 'bg-amber-500'
                                                            : 'bg-primary'
                                                    }`}
                                                >
                                                    {paxIdx + 1}
                                                </span>
                                                <h3 className="text-xs font-bold text-slate-800 tracking-wider gap-1.5 flex items-center uppercase">
                                                    {isFirstGuest
                                                        ? 'Main Guest (Pax 1)'
                                                        : `Pax ${paxIdx + 1}`}
                                                </h3>
                                                {isChild ? (
                                                    <span className="gap-1 font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-flex items-center text-[10px]">
                                                        <Baby size={11} />
                                                        Child
                                                    </span>
                                                ) : (
                                                    <span className="gap-1 font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md inline-flex items-center text-[10px]">
                                                        <User size={11} />
                                                        Adult
                                                    </span>
                                                )}
                                            </div>

                                            {paxItem.travellerId ? (
                                                <div className="gap-1.5 flex flex-wrap items-center">
                                                    <span className="font-medium text-emerald-700 bg-emerald-50 border-emerald-200/80 px-2 py-0.5 rounded-md gap-1 flex items-center border text-[11px]">
                                                        <Check size={11} />{' '}
                                                        {paxItem.travellerName ||
                                                            'Traveller Selected'}
                                                    </span>
                                                    <SecondaryButton
                                                        type="button"
                                                        onClick={() =>
                                                            onOpenSelectTravellerModal(
                                                                roomIdx,
                                                                paxIdx,
                                                            )
                                                        }
                                                        className="gap-1 font-semibold py-1 px-2.5 rounded-lg inline-flex cursor-pointer items-center justify-center text-[11px]"
                                                    >
                                                        <RefreshCw size={11} />
                                                        <span>Change</span>
                                                    </SecondaryButton>
                                                    {onClearPaxTraveller && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onClearPaxTraveller(
                                                                    roomIdx,
                                                                    paxIdx,
                                                                )
                                                            }
                                                            className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                                            title="Clear Traveller"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() =>
                                                        onOpenSelectTravellerModal(
                                                            roomIdx,
                                                            paxIdx,
                                                        )
                                                    }
                                                    className="gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl inline-flex w-fit cursor-pointer items-center justify-center"
                                                >
                                                    <User size={13} />
                                                    <span>
                                                        Select Traveller
                                                    </span>
                                                </SecondaryButton>
                                            )}
                                        </div>

                                        <div className="sm:grid-cols-12 gap-3.5 grid grid-cols-1">
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
                                                            (s) =>
                                                                s.id ===
                                                                paxItem.salutation,
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
                                                    message={
                                                        formErrors[
                                                            firstNameErrorKey
                                                        ]
                                                    }
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
                                                    message={
                                                        formErrors[
                                                            lastNameErrorKey
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <InputLabel
                                                    htmlFor={`pax_${roomIdx}_${paxIdx}_age`}
                                                    value={
                                                        isChild
                                                            ? 'Age *'
                                                            : 'Age'
                                                    }
                                                />
                                                <TextInput
                                                    id={`pax_${roomIdx}_${paxIdx}_age`}
                                                    type="number"
                                                    min="0"
                                                    max="120"
                                                    placeholder={
                                                        isChild
                                                            ? 'Required'
                                                            : 'Optional'
                                                    }
                                                    className={`mt-1 block w-full ${
                                                        isChild
                                                            ? 'border-amber-300 focus:border-amber-500'
                                                            : ''
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
                                                    message={
                                                        formErrors[ageErrorKey]
                                                    }
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
