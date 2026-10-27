import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import {
    GuestPageProps,
    HotelRoomDetail,
    PrebookRoomData,
    PrebookRoomParam,
    RoomOccupancy,
    TravellerProps,
    UserProps,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import GuestBookingSummary from './Partials/GuestBookingSummary';
import GuestCancellationPolicy from './Partials/GuestCancellationPolicy';
import GuestConfirmModal from './Partials/GuestConfirmModal';
import GuestCustomerCard from './Partials/GuestCustomerCard';
import GuestPaxForm, { PaxItem, RoomPaxGroup } from './Partials/GuestPaxForm';
import GuestSkeleton from './Partials/GuestSkeleton';
import GuestSpecialRequests from './Partials/GuestSpecialRequests';
import SelectCustomerModal from './Partials/SelectCustomerModal';
import SelectTravellerModal from './Partials/SelectTravellerModal';
export type { PaxItem, RoomPaxGroup };

const formatRupiah = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(num)
        .replace('Rp', '');
};

const countNights = (ci?: string, co?: string): number => {
    if (!ci || !co) return 1;
    const d1 = new Date(ci);
    const d2 = new Date(co);
    const diff = d2.getTime() - d1.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const normalizeSalutation = (title?: string): string => {
    if (!title) return 'Mr.';
    const clean = title.trim().replace(/\./g, '').toUpperCase();
    if (clean === 'MRS') return 'Mrs.';
    if (clean === 'MS' || clean === 'MISS') return 'Ms.';
    return 'Mr.';
};

const calculateAge = (dateOfBirth?: string): string => {
    if (!dateOfBirth) return '';
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 0 ? String(age) : '';
};

const getRateKeyForRoom = (
    selectedRoom?: HotelRoomDetail | null,
    roomNo?: string | number,
    roomIndex: number = 0,
    fallbackKey?: string,
): string => {
    if (!selectedRoom) return fallbackKey || '';

    const occupancies = selectedRoom.roomOccupancies;
    if (Array.isArray(occupancies) && occupancies.length > 0) {
        if (roomNo !== undefined && roomNo !== null) {
            const match = occupancies.find(
                (occ) => String(occ.roomNo) === String(roomNo),
            );
            if (match?.rateKey) return match.rateKey;
        }
        if (occupancies[roomIndex]?.rateKey) {
            return occupancies[roomIndex].rateKey;
        }
        if (occupancies[0]?.rateKey) {
            return occupancies[0].rateKey;
        }
    } else if (occupancies && typeof occupancies === 'object') {
        const singleOcc = occupancies as RoomOccupancy;
        if (singleOcc.rateKey) return singleOcc.rateKey;
    }

    return fallbackKey || selectedRoom.key || '';
};

const buildDefaultRoomsPax = (
    paramsRooms?: PrebookRoomParam[],
    roomOccupancies?: RoomOccupancy[] | RoomOccupancy,
): RoomPaxGroup[] => {
    const occList = Array.isArray(roomOccupancies)
        ? roomOccupancies
        : roomOccupancies
          ? [roomOccupancies]
          : [];

    if (paramsRooms && paramsRooms.length > 0) {
        return paramsRooms.map((r, rIdx) => {
            const adults = parseInt(r.noOfAdults || '1', 10) || 1;
            const children = parseInt(r.noOfChild || '0', 10) || 0;
            const currentRoomNo = r.roomNo || String(rIdx + 1);

            const matchedOcc =
                occList.find((occ) => String(occ.roomNo) === currentRoomNo) ||
                occList[rIdx] ||
                occList[0];

            const rateKey = matchedOcc?.rateKey || r.rateKey || '';

            const paxList: PaxItem[] = [];

            for (let i = 0; i < adults; i++) {
                paxList.push({
                    salutation: 'Mr.',
                    firstName: '',
                    lastName: '',
                    age: '',
                    type: 'adult',
                });
            }

            for (let i = 0; i < children; i++) {
                const childAge =
                    i === 0 ? r.child1Age || '' : r.child2Age || '';
                paxList.push({
                    salutation: 'Mr.',
                    firstName: '',
                    lastName: '',
                    age: childAge ? String(childAge) : '',
                    type: 'child',
                });
            }

            return {
                roomNo: currentRoomNo,
                noOfAdults: adults,
                noOfChild: children,
                pax: paxList,
                rateKey: rateKey,
            };
        });
    }

    const defaultRateKey = occList[0]?.rateKey || '';
    return [
        {
            roomNo: '1',
            noOfAdults: 1,
            noOfChild: 0,
            pax: [
                {
                    salutation: 'Mr.',
                    firstName: '',
                    lastName: '',
                    age: '',
                    type: 'adult',
                },
            ],
            rateKey: defaultRateKey,
        },
    ];
};

export default function Guest(props: GuestPageProps) {
    const [prebookData, setPrebookData] = useState<PrebookRoomData | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [copiedPrice, setCopiedPrice] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<UserProps | null>(
        null,
    );
    const [activePaxTarget, setActivePaxTarget] = useState<{
        roomIdx: number;
        paxIdx: number;
    } | null>(null);
    const [isCustomerModalOpen, setIsCustomerModalOpen] =
        useState<boolean>(false);
    const [isTravellerModalOpen, setIsTravellerModalOpen] =
        useState<boolean>(false);
    const [roomsPax, setRoomsPax] = useState<RoomPaxGroup[]>([
        {
            roomNo: '1',
            noOfAdults: 1,
            noOfChild: 0,
            pax: [
                {
                    salutation: 'Mr.',
                    firstName: '',
                    lastName: '',
                    age: '',
                    type: 'adult',
                },
            ],
            rateKey: '',
        },
    ]);

    const [specialRequests, setSpecialRequests] = useState<string[]>([]);
    const [customRequestNote, setCustomRequestNote] = useState<string>('');

    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [isSubmittingBooking, setIsSubmittingBooking] =
        useState<boolean>(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(
        () => {
            try {
                const stored = sessionStorage.getItem('hotelBookingResultData');
                return stored ? JSON.parse(stored) : null;
            } catch {
                return null;
            }
        },
    );

    useEffect(() => {
        try {
            const rawStored = sessionStorage.getItem('hotelPrebookData');
            if (rawStored) {
                const parsed = JSON.parse(rawStored) as PrebookRoomData;
                setPrebookData(parsed);

                const activeRoom =
                    parsed.selectedRoom ||
                    (parsed.results?.roomDetails &&
                    parsed.results.roomDetails.length > 0
                        ? parsed.results.roomDetails[0]
                        : null);

                if (parsed.params?.rooms && parsed.params.rooms.length > 0) {
                    setRoomsPax(
                        buildDefaultRoomsPax(
                            parsed.params.rooms,
                            activeRoom?.roomOccupancies,
                        ),
                    );
                }

                setLoading(false);
                return;
            }
        } catch (e) {
            console.error(
                'Failed to parse hotelPrebookData from sessionStorage:',
                e,
            );
        }

        if (props.sessionId && (props.code || props.hotel)) {
            setLoading(true);
            hotelMicroserviceApi
                .post('/prebook-room', {
                    country: props.country || 'ID',
                    destination: props.destination || '',
                    hotel: props.hotel || '',
                    checkIn: props.checkIn || '',
                    checkOut: props.checkOut || '',
                    sessionId: props.sessionId || '',
                    roomDetails: {
                        code: props.code || '',
                        mealPlan: props.mealPlan || '',
                        cancellationPolicyType:
                            props.cancellationPolicyType || 'Flexi',
                        packageRate: props.packageRate === 'true',
                    },
                })
                .then((res) => {
                    if (res.data?.data) {
                        const data = res.data.data as PrebookRoomData;
                        setPrebookData(data);
                        sessionStorage.setItem(
                            'hotelPrebookData',
                            JSON.stringify(data),
                        );
                        const activeRoom =
                            data.selectedRoom ||
                            (data.results?.roomDetails &&
                            data.results.roomDetails.length > 0
                                ? data.results.roomDetails[0]
                                : null);
                        if (
                            data.params?.rooms &&
                            data.params.rooms.length > 0
                        ) {
                            setRoomsPax(
                                buildDefaultRoomsPax(
                                    data.params.rooms,
                                    activeRoom?.roomOccupancies,
                                ),
                            );
                        }
                    }
                })
                .catch((err) => {
                    console.error('Fallback prebook error:', err);
                    setFetchError('Tidak dapat memuat detail pemesanan kamar.');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [props]);

    const results = prebookData?.results;
    const params = prebookData?.params;
    console.log('params', params);
    const selectedRoom =
        prebookData?.selectedRoom ||
        (results?.roomDetails && results.roomDetails.length > 0
            ? results.roomDetails[0]
            : null);
    console.log('selectedRoom', selectedRoom);

    const checkInDate = params?.checkIn || props.checkIn || '';
    const checkOutDate = params?.checkOut || props.checkOut || '';
    const nights = countNights(checkInDate, checkOutDate);
    const hotelName = results?.name || prebookData?.hotelInfo?.name || 'Hotel';
    const hotelRating = parseInt(
        results?.rating || prebookData?.hotelInfo?.rating || '0',
        10,
    );
    const currency = results?.currency || selectedRoom?.currency || 'IDR';

    const sellingPrice = selectedRoom?.sellingPrice || 0;
    const ntaPrice = selectedRoom?.ntaPrice || 0;
    const markup = selectedRoom ? sellingPrice - ntaPrice : 0;
    const roomName = selectedRoom?.name || 'Room';
    const mealPlanName =
        selectedRoom?.mealPlanName ||
        (props.mealPlan === 'BDBF'
            ? 'Breakfast'
            : props.mealPlan || 'Room Only');
    const isRefundable =
        selectedRoom?.refundable ?? props.cancellationPolicyType === 'Flexi';
    const hotelAddress =
        results?.locations?.addressMain ||
        results?.locations?.area ||
        results?.locations?.cityName ||
        'Indonesia';

    const handleCopyPrice = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const priceText =
            `${currency.trim()} ${formatRupiah(sellingPrice).trim()}`
                .replace(/\s+/g, ' ')
                .trim();
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(priceText);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = priceText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        setCopiedPrice(true);
        setTimeout(() => setCopiedPrice(false), 2000);
    };

    const toggleSpecialRequest = (req: string) => {
        setSpecialRequests((prev) =>
            prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
        );
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        roomsPax.forEach((roomGroup, roomIdx) => {
            roomGroup.pax.forEach((paxItem, paxIdx) => {
                const labelTarget = `Kamar ${roomGroup.roomNo} Pax ${paxIdx + 1}`;
                if (!paxItem.firstName.trim()) {
                    errors[`room_${roomIdx}_pax_${paxIdx}_firstName`] =
                        `${labelTarget}: Nama depan wajib diisi.`;
                }
                if (!paxItem.lastName.trim()) {
                    errors[`room_${roomIdx}_pax_${paxIdx}_lastName`] =
                        `${labelTarget}: Nama belakang wajib diisi.`;
                }
                if (paxItem.type === 'child' && !paxItem.age.trim()) {
                    errors[`room_${roomIdx}_pax_${paxIdx}_age`] =
                        `${labelTarget}: Umur anak wajib diisi.`;
                }
            });
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenSelectTravellerModal = (
        roomIdx: number,
        paxIdx: number,
    ) => {
        setActivePaxTarget({ roomIdx, paxIdx });
        setIsTravellerModalOpen(true);
    };

    const handleSelectTraveller = (traveller: TravellerProps) => {
        if (!activePaxTarget) return;
        const { roomIdx, paxIdx } = activePaxTarget;

        const salutation = normalizeSalutation(traveller.title);
        const age = calculateAge(traveller.date_of_birth);

        setRoomsPax((prev) => {
            const next = [...prev];
            const nextRoom = { ...next[roomIdx] };
            const nextPaxList = [...nextRoom.pax];
            nextPaxList[paxIdx] = {
                ...nextPaxList[paxIdx],
                salutation,
                firstName: traveller.first_name || '',
                lastName: traveller.last_name || '',
                age: age || nextPaxList[paxIdx].age || '',
                travellerId: traveller.id || traveller.index,
                travellerName:
                    `${traveller.first_name} ${traveller.last_name}`.trim(),
            };
            nextRoom.pax = nextPaxList;
            next[roomIdx] = nextRoom;
            return next;
        });

        const firstNameErrorKey = `room_${roomIdx}_pax_${paxIdx}_firstName`;
        const lastNameErrorKey = `room_${roomIdx}_pax_${paxIdx}_lastName`;
        const ageErrorKey = `room_${roomIdx}_pax_${paxIdx}_age`;

        setFormErrors((prev) => {
            const next = { ...prev };
            delete next[firstNameErrorKey];
            delete next[lastNameErrorKey];
            delete next[ageErrorKey];
            return next;
        });

        setIsTravellerModalOpen(false);
        setActivePaxTarget(null);
    };

    const handleClearPaxTraveller = (roomIdx: number, paxIdx: number) => {
        setRoomsPax((prev) => {
            const next = [...prev];
            const nextRoom = { ...next[roomIdx] };
            const nextPaxList = [...nextRoom.pax];
            nextPaxList[paxIdx] = {
                ...nextPaxList[paxIdx],
                salutation: 'Mr.',
                firstName: '',
                lastName: '',
                age: '',
                travellerId: undefined,
                travellerName: undefined,
            };
            nextRoom.pax = nextPaxList;
            next[roomIdx] = nextRoom;
            return next;
        });
    };

    const handleProceedToBooking = () => {
        if (!validateForm()) {
            window.scrollTo({ top: 150, behavior: 'smooth' });
            return;
        }

        setBookingError(null);

        const bookingPayload = {
            customer: selectedCustomer,
            prebookData,
            roomsPax,
            specialRequests,
            customRequestNote,
            createdAt: new Date().toISOString(),
        };

        sessionStorage.setItem(
            'hotelBookingGuestData',
            JSON.stringify(bookingPayload),
        );
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = async () => {
        setIsSubmittingBooking(true);
        setBookingError(null);

        try {
            const finalCountry = params?.country || props.country || 'ID';
            const finalDestination =
                params?.destination || props.destination || '';
            const finalHotel = params?.hotel || props.hotel || '';
            const finalSessionId =
                params?.sessionId ||
                results?.sessionID ||
                props.sessionId ||
                '';
            const finalCheckIn = checkInDate;
            const finalCheckOut = checkOutDate;

            const roomDetailsPayload = {
                code:
                    selectedRoom?.roomCode ||
                    selectedRoom?.code ||
                    prebookData?.rooms?.code ||
                    props.code ||
                    '',
                mealPlan:
                    selectedRoom?.mealPlanCode ||
                    prebookData?.rooms?.mealPlan ||
                    props.mealPlan ||
                    '',
                cancellationPolicyType:
                    selectedRoom?.cancellationPolicyType ||
                    prebookData?.rooms?.cancellationPolicyType ||
                    props.cancellationPolicyType ||
                    'Flexi',
                packageRate: Boolean(
                    selectedRoom?.packageRate ??
                    prebookData?.rooms?.packageRate ??
                    props.packageRate === 'true',
                ),
            };

            const roomsListPayload = roomsPax.map((r, rIdx) => {
                const currentRoomNo = String(r.roomNo || rIdx + 1);
                const paramRoom = params?.rooms?.[rIdx];
                const rateKey = getRateKeyForRoom(
                    selectedRoom,
                    currentRoomNo,
                    rIdx,
                    r.rateKey || paramRoom?.rateKey,
                );

                const paxPayload = r.pax.map((p) => {
                    const salutation = p.salutation
                        ? p.salutation.trim()
                        : 'Mr.';
                    const formattedSalutation = ` ${salutation}`;
                    return {
                        salutation: formattedSalutation,
                        firstName: p.firstName.trim(),
                        lastName: p.lastName.trim(),
                        age: p.age ? String(p.age).trim() : '',
                    };
                });

                const childPax = r.pax.filter((p) => p.type === 'child');
                const child1Age = childPax[0]?.age
                    ? String(childPax[0].age).trim()
                    : String(paramRoom?.child1Age || '0');
                const child2Age = childPax[1]?.age
                    ? String(childPax[1].age).trim()
                    : String(paramRoom?.child2Age || '0');

                return {
                    pax: paxPayload,
                    roomNo: String(r.roomNo || rIdx + 1),
                    noOfAdults: String(r.noOfAdults ?? 1),
                    noOfChild: String(r.noOfChild ?? 0),
                    child1Age: child1Age || '0',
                    child2Age: child2Age || '0',
                    extraBed: Boolean(paramRoom?.extraBed ?? false),
                    rateKey: rateKey,
                };
            });

            const payload = {
                country: finalCountry,
                destination: finalDestination,
                hotel: finalHotel,
                sessionId: finalSessionId,
                checkIn: finalCheckIn,
                checkOut: finalCheckOut,
                roomDetails: roomDetailsPayload,
                rooms: {
                    picGuestNationality:
                        (selectedCustomer as any)?.nationality || 'ID',
                    room: roomsListPayload,
                },
            };

            const res = await hotelMicroserviceApi.post(
                '/booking-room',
                payload,
            );

            setBookingSuccessData(res.data);
            sessionStorage.setItem(
                'hotelBookingResultData',
                JSON.stringify(res.data),
            );
            return router.visit(route('hotel.orders.preview', 12364));

            setShowConfirmModal(false);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            console.error('Booking Room Error:', err);
            const errMsg =
                err.response?.data?.meta?.message ||
                err.response?.data?.message ||
                err.message ||
                'Terjadi kesalahan saat memproses pemesanan kamar.';
            setBookingError(errMsg);
        } finally {
            setIsSubmittingBooking(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="gap-2 text-sm flex items-center">
                    <span className="font-bold text-primary">Hotel</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-primary">Search</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-primary sm:max-w-xs max-w-[200px] truncate">
                        {hotelName}
                    </span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-primary">
                        Guest Information
                    </span>
                </div>
            }
        >
            <Head title={`Data Tamu — ${hotelName}`} />

            <div className="max-w-7xl py-2 sm:py-4 mx-auto">
                <div className="sm:flex-row sm:items-center gap-3 mb-6 flex flex-col justify-between">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="gap-2 text-xs sm:text-sm font-semibold text-quaternary hover:text-primary inline-flex w-fit cursor-pointer items-center transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Room Selection</span>
                    </button>

                    <div className="gap-2 text-xs font-semibold flex items-center">
                        <span className="gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 border-emerald-200/60 inline-flex items-center rounded-full border">
                            <Check size={12} />
                            Room Selection
                        </span>
                        <span className="text-gray-300">›</span>
                        <span className="gap-1.5 text-primary bg-primary/10 px-3 py-1 border-primary/20 font-bold inline-flex items-center rounded-full border">
                            Guest Information
                        </span>
                        <span className="text-gray-300">›</span>
                        <span className="text-gray-400">
                            Confirmation & Booking
                        </span>
                    </div>
                </div>

                {bookingSuccessData && (
                    <div className="bg-emerald-50 border-emerald-300/90 rounded-2xl p-5 mb-6 shadow-sm animate-in fade-in slide-in-from-top-4 border duration-300">
                        <div className="gap-3.5 flex items-start">
                            <div className="space-y-2 flex-1">
                                <div className="gap-2 flex flex-wrap items-center justify-between">
                                    <div className="gap-2 flex items-center">
                                        <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                                            Booking Room Berhasil (HTTP 200 OK)
                                        </h4>
                                    </div>
                                </div>
                                <details className="mt-2 text-xs">
                                    <summary className="font-bold text-emerald-900 hover:text-emerald-700 py-1 cursor-pointer select-none">
                                        Lihat Detail Response API (JSON)
                                    </summary>
                                    <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono leading-relaxed max-h-60 border-slate-800 overflow-x-auto border text-[11px]">
                                        {JSON.stringify(
                                            bookingSuccessData,
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    </div>
                )}

                {fetchError && (
                    <div className="bg-amber-50 border-amber-200 rounded-2xl p-4 mb-6 gap-3 flex items-start border">
                        <AlertCircle
                            className="text-amber-600 mt-0.5 shrink-0"
                            size={18}
                        />
                        <div>
                            <p className="text-sm font-bold text-amber-900">
                                Note
                            </p>
                            <p className="text-xs text-amber-800 mt-0.5">
                                {fetchError}
                            </p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <GuestSkeleton />
                ) : (
                    <div className="lg:grid-cols-12 gap-6 grid grid-cols-1 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <GuestCustomerCard
                                customer={selectedCustomer}
                                onOpenSelectModal={() =>
                                    setIsCustomerModalOpen(true)
                                }
                                onClearCustomer={() =>
                                    setSelectedCustomer(null)
                                }
                            />

                            <GuestPaxForm
                                roomsPax={roomsPax}
                                setRoomsPax={setRoomsPax}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                onOpenSelectTravellerModal={
                                    handleOpenSelectTravellerModal
                                }
                                onClearPaxTraveller={handleClearPaxTraveller}
                            />

                            <GuestSpecialRequests
                                specialRequests={specialRequests}
                                onToggleRequest={toggleSpecialRequest}
                                customRequestNote={customRequestNote}
                                onChangeNote={setCustomRequestNote}
                            />

                            <GuestCancellationPolicy
                                selectedRoom={selectedRoom}
                                isRefundable={isRefundable}
                            />
                        </div>

                        <div className="lg:col-span-4">
                            <GuestBookingSummary
                                hotelName={hotelName}
                                hotelRating={hotelRating}
                                thumbnail={results?.thumbnail}
                                address={hotelAddress}
                                checkInDate={checkInDate}
                                checkOutDate={checkOutDate}
                                nights={nights}
                                roomName={roomName}
                                mealPlanName={mealPlanName}
                                isRefundable={isRefundable}
                                currency={currency}
                                sellingPrice={sellingPrice}
                                ntaPrice={ntaPrice}
                                markup={markup}
                                copiedPrice={copiedPrice}
                                onCopyPrice={handleCopyPrice}
                                onProceed={handleProceedToBooking}
                            />
                        </div>
                    </div>
                )}
            </div>

            <SelectCustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSelect={(cust) => setSelectedCustomer(cust)}
                selectedCustomerId={
                    selectedCustomer?.index || selectedCustomer?.key
                }
            />

            <SelectTravellerModal
                isOpen={isTravellerModalOpen}
                onClose={() => {
                    setIsTravellerModalOpen(false);
                    setActivePaxTarget(null);
                }}
                onSelect={handleSelectTraveller}
                selectedTravellerId={
                    activePaxTarget
                        ? roomsPax[activePaxTarget.roomIdx]?.pax[
                              activePaxTarget.paxIdx
                          ]?.travellerId
                        : undefined
                }
            />

            <GuestConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    if (!isSubmittingBooking) {
                        setShowConfirmModal(false);
                    }
                }}
                onConfirm={handleConfirmBooking}
                isSubmitting={isSubmittingBooking}
                errorMessage={bookingError}
                customer={selectedCustomer}
                roomsPax={roomsPax}
                hotelName={hotelName}
                roomName={roomName}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                nights={nights}
                currency={currency}
                sellingPrice={sellingPrice}
            />
        </AuthenticatedLayout>
    );
}
