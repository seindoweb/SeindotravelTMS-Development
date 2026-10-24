import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { HotelRoomDetail, TravellerProps, UserProps } from '@/types';
import { Head } from '@inertiajs/react';
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

interface GuestPageProps {
    country?: string;
    destination?: string;
    hotel?: string;
    checkIn?: string;
    checkOut?: string;
    code?: string;
    mealPlan?: string;
    cancellationPolicyType?: string;
    packageRate?: string;
    sessionId?: string;
}

interface PrebookRoomParam {
    roomNo: string;
    noOfAdults: string;
    noOfChild: string;
    child1Age?: string;
    child2Age?: string;
    extraBed?: boolean;
}

interface PrebookRoomData {
    params?: {
        country: string;
        destination: string;
        hotel: string;
        checkIn: string;
        checkOut: string;
        rooms: PrebookRoomParam[];
    };
    rooms?: {
        code: string;
        mealPlan: string;
        cancellationPolicyType: string;
        packageRate: boolean;
    };
    results?: {
        key: string;
        sessionID: string;
        name: string;
        hotelCode: string;
        code: string;
        rating: string;
        currency: string;
        thumbnail: string;
        thumbnailSource?: string;
        geoLocations?: { latitude: string; longitude: string };
        locations?: {
            addressMain: string;
            addressAlternative?: string;
            zipCode?: string;
            area?: string;
            landmark?: string;
            cityName?: string;
            cityCode?: string;
            countryName?: string;
            countryCode?: string;
        };
        roomDetails?: HotelRoomDetail[] | null;
        images?: Array<{ url: string; source?: string }>;
        facilities?: Array<{ name: string; type: string }>;
    };
    selectedRoom?: HotelRoomDetail;
    hotelInfo?: any;
}

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

const buildDefaultRoomsPax = (
    paramsRooms?: PrebookRoomParam[],
): RoomPaxGroup[] => {
    if (paramsRooms && paramsRooms.length > 0) {
        return paramsRooms.map((r, rIdx) => {
            const adults = parseInt(r.noOfAdults || '1', 10) || 1;
            const children = parseInt(r.noOfChild || '0', 10) || 0;
            const paxList: PaxItem[] = [];

            // Adults
            for (let i = 0; i < adults; i++) {
                paxList.push({
                    salutation: 'Mr.',
                    firstName: '',
                    lastName: '',
                    age: '',
                    type: 'adult',
                });
            }

            // Children
            for (let i = 0; i < children; i++) {
                const childAge = i === 0 ? r.child1Age || '' : r.child2Age || '';
                paxList.push({
                    salutation: 'Mr.',
                    firstName: '',
                    lastName: '',
                    age: childAge ? String(childAge) : '',
                    type: 'child',
                });
            }

            return {
                roomNo: r.roomNo || String(rIdx + 1),
                noOfAdults: adults,
                noOfChild: children,
                pax: paxList,
            };
        });
    }

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
        },
    ];
};

export default function Guest(props: GuestPageProps) {
    const [prebookData, setPrebookData] = useState<PrebookRoomData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [copiedPrice, setCopiedPrice] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<UserProps | null>(null);
    const [activePaxTarget, setActivePaxTarget] = useState<{ roomIdx: number; paxIdx: number } | null>(null);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
    const [isTravellerModalOpen, setIsTravellerModalOpen] = useState<boolean>(false);
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
        },
    ]);

    const [specialRequests, setSpecialRequests] = useState<string[]>([]);
    const [customRequestNote, setCustomRequestNote] = useState<string>('');

    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // 1. Initial Data Loading: Ambil dari sessionStorage atau fallback fetch ulang
    useEffect(() => {
        try {
            const rawStored = sessionStorage.getItem('hotelPrebookData');
            if (rawStored) {
                const parsed = JSON.parse(rawStored) as PrebookRoomData;
                setPrebookData(parsed);

                // Inisialisasi rooms pax sesuai jumlah kamar dan tamu di params
                if (parsed.params?.rooms && parsed.params.rooms.length > 0) {
                    setRoomsPax(buildDefaultRoomsPax(parsed.params.rooms));
                }

                setLoading(false);
                return;
            }
        } catch (e) {
            console.error('Failed to parse hotelPrebookData from sessionStorage:', e);
        }

        // Fallback: Jika di-refresh atau direct URL, fetch ulang prebook
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
                        cancellationPolicyType: props.cancellationPolicyType || 'Flexi',
                        packageRate: props.packageRate === 'true',
                    },
                })
                .then((res) => {
                    if (res.data?.data) {
                        const data = res.data.data as PrebookRoomData;
                        setPrebookData(data);
                        sessionStorage.setItem('hotelPrebookData', JSON.stringify(data));
                        if (data.params?.rooms && data.params.rooms.length > 0) {
                            setRoomsPax(buildDefaultRoomsPax(data.params.rooms));
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
    const selectedRoom =
        prebookData?.selectedRoom ||
        (results?.roomDetails && results.roomDetails.length > 0 ? results.roomDetails[0] : null);

    const checkInDate = params?.checkIn || props.checkIn || '';
    const checkOutDate = params?.checkOut || props.checkOut || '';
    const nights = countNights(checkInDate, checkOutDate);
    const hotelName = results?.name || prebookData?.hotelInfo?.name || 'Hotel';
    const hotelRating = parseInt(results?.rating || prebookData?.hotelInfo?.rating || '0', 10);
    const currency = results?.currency || selectedRoom?.currency || 'IDR';

    const sellingPrice = selectedRoom?.sellingPrice || 0;
    const ntaPrice = selectedRoom?.ntaPrice || 0;
    const markup = selectedRoom ? sellingPrice - ntaPrice : 0;
    const roomName = selectedRoom?.name || 'Room';
    const mealPlanName =
        selectedRoom?.mealPlanName ||
        (props.mealPlan === 'BDBF' ? 'Breakfast' : props.mealPlan || 'Room Only');
    const isRefundable = selectedRoom?.refundable ?? props.cancellationPolicyType === 'Flexi';
    const hotelAddress =
        results?.locations?.addressMain ||
        results?.locations?.area ||
        results?.locations?.cityName ||
        'Indonesia';

    const handleCopyPrice = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const priceText = `${currency.trim()} ${formatRupiah(sellingPrice).trim()}`
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
                    errors[`room_${roomIdx}_pax_${paxIdx}_firstName`] = `${labelTarget}: Nama depan wajib diisi.`;
                }
                if (!paxItem.lastName.trim()) {
                    errors[`room_${roomIdx}_pax_${paxIdx}_lastName`] = `${labelTarget}: Nama belakang wajib diisi.`;
                }
                if (paxItem.type === 'child' && !paxItem.age.trim()) {
                    errors[`room_${roomIdx}_pax_${paxIdx}_age`] = `${labelTarget}: Umur anak wajib diisi.`;
                }
            });
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenSelectTravellerModal = (roomIdx: number, paxIdx: number) => {
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
                travellerName: `${traveller.first_name} ${traveller.last_name}`.trim(),
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

        const bookingPayload = {
            customer: selectedCustomer,
            prebookData,
            roomsPax,
            specialRequests,
            customRequestNote,
            createdAt: new Date().toISOString(),
        };

        sessionStorage.setItem('hotelBookingGuestData', JSON.stringify(bookingPayload));
        setShowConfirmModal(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-primary">Hotel</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-primary">Search</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-primary truncate max-w-[200px] sm:max-w-xs">
                        {hotelName}
                    </span>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-primary">Guest Information</span>
                </div>
            }
        >
            <Head title={`Data Tamu — ${hotelName}`} />

            <div className="max-w-7xl mx-auto py-2 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-quaternary hover:text-primary transition-colors cursor-pointer w-fit"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Room Selection</span>
                    </button>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <Check size={12} />
                            Room Selection
                        </span>
                        <span className="text-gray-300">›</span>
                        <span className="inline-flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 font-bold">
                            Guest Information
                        </span>
                        <span className="text-gray-300">›</span>
                        <span className="text-gray-400">Confirmation & Booking</span>
                    </div>
                </div>

                {fetchError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-bold text-amber-900">Note</p>
                            <p className="text-xs text-amber-800 mt-0.5">{fetchError}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <GuestSkeleton />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <GuestCustomerCard
                                customer={selectedCustomer}
                                onOpenSelectModal={() => setIsCustomerModalOpen(true)}
                                onClearCustomer={() => setSelectedCustomer(null)}
                            />

                            <GuestPaxForm
                                roomsPax={roomsPax}
                                setRoomsPax={setRoomsPax}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                onOpenSelectTravellerModal={handleOpenSelectTravellerModal}
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
                selectedCustomerId={selectedCustomer?.index || selectedCustomer?.key}
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
                        ? roomsPax[activePaxTarget.roomIdx]?.pax[activePaxTarget.paxIdx]?.travellerId
                        : undefined
                }
            />

            <GuestConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    setShowConfirmModal(false);
                    alert(
                        'Booking data has been successfully confirmed! Ready for the next booking session integration.',
                    );
                }}
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
