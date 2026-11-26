import { HotelRoomDetail, PrebookRoomReq } from '@/types/index-hotel';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    BedDouble,
    Check,
    CheckCircle2,
    Cigarette,
    CigaretteOff,
    Coffee,
    Copy,
    Loader2,
    ShieldCheck,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import RoomDetailModal from './RoomDetailModal';
import { formatRupiah } from '@/helpers';

interface RoomCardProps {
    room: HotelRoomDetail;
    hotel: any;
    nights: number;
    searchParams?: {
        country?: string;
        destination?: string;
        hotel?: string;
        checkIn?: string;
        checkOut?: string;
        sessionId?: string;
    };
}

export default function RoomCard({
    room,
    hotel,
    nights,
    searchParams,
}: RoomCardProps) {
    const markup = room.sellingPrice - room.ntaPrice;
    const isRefundable = room.refundable;
    const [imgError, setImgError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [copiedPrice, setCopiedPrice] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const handleCopyPrice = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const priceText =
            `${(hotel.currency || 'IDR').trim()} ${formatRupiah(room.sellingPrice).trim()}`
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

    const handleBookRoom = async () => {
        setIsBooking(true);
        setBookingError(null);

        const urlParams =
            typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search)
                : null;
        const country =
            searchParams?.country ||
            hotel?.countryCode ||
            urlParams?.get('country') ||
            'ID';
        const destination =
            searchParams?.destination ||
            hotel?.destinationCode ||
            urlParams?.get('destination') ||
            '';
        const hotelCode =
            searchParams?.hotel ||
            hotel?.hotelCode ||
            urlParams?.get('hotel') ||
            '';
        const checkIn =
            searchParams?.checkIn || urlParams?.get('checkIn') || '';
        const checkOut =
            searchParams?.checkOut || urlParams?.get('checkOut') || '';
        const sessionId =
            searchParams?.sessionId || (hotel as any)?.sessionID || '';

        const roomCode = room.code || room.roomCode || '';
        const mealPlan = room.mealPlanCode || '';
        const cancellationPolicyType = room.cancellationPolicyType || 'Flexi';
        const packageRate = room.packageRate ?? false;

        const payload: PrebookRoomReq = {
            country,
            destination,
            hotel: hotelCode,
            checkIn,
            checkOut,
            sessionId,
            roomDetails: {
                code: roomCode,
                mealPlan,
                cancellationPolicyType,
                packageRate,
            },
        };

        try {
            const res = await hotelMicroserviceApi.post(
                '/prebook-room',
                payload,
            );

            if (res.data?.data) {
                sessionStorage.setItem(
                    'hotelPrebookData',
                    JSON.stringify({
                        ...res.data.data,
                        selectedRoom: room,
                        hotelInfo: hotel,
                    }),
                );
            }

            const queryParams = new URLSearchParams({
                cancellationPolicyType,
                checkIn,
                checkOut,
                code: roomCode,
                country,
                destination,
                hotel: hotelCode,
                mealPlan,
                packageRate: String(packageRate),
                sessionId,
            });

            router.visit(`/hotel/bookings/guest?${queryParams.toString()}`);
        } catch (err: unknown) {
            console.error('Prebook room error:', err);
            const errObj = err as {
                response?: {
                    data?: { meta?: { message?: string }; message?: string };
                };
                message?: string;
            };
            const msg =
                errObj.response?.data?.meta?.message ||
                errObj.response?.data?.message ||
                errObj.message ||
                'Pre-booking room failed. Please try another room or date.';
            setBookingError(msg);
            setIsBooking(false);
        }
    };

    const thumbnail = room.roomInformations?.thumbnail;
    const more = room.roomInformations?.moreInformations;

    return (
        <>
            <div className="bg-white rounded-2xl sm:flex-row hover:shadow-md hover:border-gray-300 flex flex-col overflow-hidden border border-[#E2E8F0] transition-all duration-200">
                {thumbnail && !imgError ? (
                    <div className="bg-gray-100 sm:w-44 h-44 sm:h-auto relative w-full shrink-0 overflow-hidden">
                        <img
                            src={thumbnail}
                            alt={room.name}
                            onError={() => setImgError(true)}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                        {(more?.photo?.image?.length ?? 0) > 0 && (
                            <span className="bottom-2 right-2 bg-black/50 text-white font-semibold px-2 py-0.5 absolute rounded-full text-[10px]">
                                +{more!.photo!.image.length} photos
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="sm:w-44 h-28 sm:h-auto bg-slate-50 sm:border-b-0 sm:border-r border-slate-100 flex w-full shrink-0 items-center justify-center border-b">
                        <BedDouble size={36} className="text-gray-300" />
                    </div>
                )}

                <div className="gap-4 p-4 sm:flex-row sm:p-5 flex flex-1 flex-col">
                    <div className="space-y-3 flex flex-1 flex-col justify-between">
                        <div>
                            <div className="gap-2 flex items-start">
                                <BedDouble
                                    size={17}
                                    className="text-primary mt-0.5 shrink-0"
                                />
                                <h3 className="text-base font-bold leading-snug text-primary">
                                    {room.name}
                                </h3>
                            </div>
                            {room.mealPlanName && (
                                <div className="gap-1 mt-1 flex items-center">
                                    <Coffee
                                        size={12}
                                        className="text-emerald-600"
                                    />
                                    <span className="text-xs font-medium text-emerald-700">
                                        {room.mealPlanName}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="gap-2 flex flex-wrap">
                            <span
                                className={`gap-1 font-semibold px-2.5 py-0.5 rounded-md inline-flex items-center border text-[11px] ${
                                    isRefundable
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                        : 'bg-red-50 text-red-600 border-red-200/60'
                                }`}
                            >
                                {isRefundable ? (
                                    <CheckCircle2 size={11} />
                                ) : (
                                    <XCircle size={11} />
                                )}
                                {isRefundable ? 'Refundable' : 'Non-Refundable'}
                            </span>

                            {(more?.maxOccupancy ?? room.maxOccupancy) > 0 && (
                                <span className="gap-1 font-medium bg-slate-50 text-quaternary border-slate-200/60 px-2.5 py-0.5 rounded-md inline-flex items-center border text-[11px]">
                                    <ShieldCheck
                                        size={11}
                                        className="text-primary"
                                    />
                                    Max{' '}
                                    {more?.maxOccupancy ?? room.maxOccupancy}{' '}
                                    guests
                                </span>
                            )}

                            {more?.roomSize && (
                                <span className="gap-1 font-medium bg-slate-50 text-quaternary border-slate-200/60 px-2.5 py-0.5 rounded-md inline-flex items-center border text-[11px]">
                                    {more.roomSize}
                                </span>
                            )}

                            {room.extraBedAllowed && (
                                <span className="gap-1 font-medium bg-slate-50 text-quaternary border-slate-200/60 px-2.5 py-0.5 rounded-md inline-flex items-center border text-[11px]">
                                    + Extra Bed
                                </span>
                            )}

                            {more && (
                                <span
                                    className={`gap-1 font-medium px-2.5 py-0.5 rounded-md inline-flex items-center border text-[11px] ${
                                        more.isSmokingAllowed
                                            ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                            : 'bg-slate-50 text-quaternary border-slate-200/60'
                                    }`}
                                >
                                    {more.isSmokingAllowed ? (
                                        <Cigarette size={11} />
                                    ) : (
                                        <CigaretteOff size={11} />
                                    )}
                                    {more.isSmokingAllowed
                                        ? 'Smoking'
                                        : 'Non-Smoking'}
                                </span>
                            )}
                        </div>

                        {room.message && room.message.trim() !== '' && (
                            <div className="gap-2 px-3 py-2 text-xs bg-amber-50/90 border-amber-200/80 rounded-xl text-amber-900 flex items-start border">
                                <AlertCircle
                                    size={14}
                                    className="text-amber-600 mt-0.5 shrink-0"
                                />
                                <div className="leading-snug">
                                    <span className="font-bold text-amber-900 mr-1.5">
                                        Notes:
                                    </span>
                                    <span className="text-amber-800 line-clamp-2">
                                        {room.message}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="gap-1.5 text-xs font-semibold text-primary hover:text-primary-bright inline-flex cursor-pointer items-center transition-colors hover:underline"
                        >
                            View Room Detail
                        </button>
                    </div>

                    <div className="gap-3 sm:min-w-[190px] flex flex-col items-end justify-between">
                        <div className="sm:w-auto w-full text-right">
                            <span className="font-medium text-slate-400 tracking-wider block text-[11px] uppercase">
                                Total Price ({nights} night
                                {nights > 1 ? 's' : ''})
                            </span>
                            <div className="gap-1.5 mt-0.5 flex items-baseline justify-end">
                                <span
                                    onClick={handleCopyPrice}
                                    title="Click to copy price"
                                    className="text-xl font-black sm:text-2xl text-primary hover:text-primary-bright cursor-pointer transition-colors select-all"
                                >
                                    {hotel.currency}
                                    {formatRupiah(room.sellingPrice)}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyPrice}
                                    title={
                                        copiedPrice
                                            ? 'Price copied successfully!'
                                            : 'Copy price'
                                    }
                                    className={`gap-1 px-1.5 py-0.5 text-xs font-semibold rounded-md inline-flex cursor-pointer items-center border transition-all ${
                                        copiedPrice
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 scale-105'
                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-primary'
                                    }`}
                                >
                                    {copiedPrice ? (
                                        <>
                                            <Check
                                                size={11}
                                                className="text-emerald-600 stroke-[2.5]"
                                            />
                                            <span className="text-[10px]">
                                                Copied!
                                            </span>
                                        </>
                                    ) : (
                                        <Copy
                                            size={11}
                                            className="text-slate-400 group-hover:text-primary"
                                        />
                                    )}
                                </button>
                            </div>

                            <div className="gap-1.5 bg-slate-50 border-slate-200/80 rounded-lg px-2.5 py-1 font-medium text-slate-600 mt-2 inline-flex items-center border text-[11px]">
                                <span>
                                    NTA:{' '}
                                    <strong className="font-bold text-slate-800">
                                        {hotel.currency}
                                        {formatRupiah(room.ntaPrice)}
                                    </strong>
                                </span>
                                {markup > 0 && (
                                    <>
                                        <span className="text-slate-300">
                                            •
                                        </span>
                                        <span className="text-emerald-700 font-semibold gap-0.5 flex items-center">
                                            <TrendingUp
                                                size={11}
                                                className="text-emerald-600"
                                            />
                                            +{hotel.currency}
                                            {formatRupiah(markup)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="sm:w-auto gap-1.5 flex w-full flex-col items-end">
                            {bookingError && (
                                <p className="text-red-600 font-medium leading-tight max-w-[220px] text-right text-[11px]">
                                    {bookingError}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleBookRoom}
                                disabled={isBooking}
                                className="bg-primary hover:bg-primary-bright text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow gap-2 sm:w-auto flex w-full cursor-pointer items-center justify-center transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75"
                            >
                                {isBooking ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        <span>Booking...</span>
                                    </>
                                ) : (
                                    <span>Book Room</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <RoomDetailModal
                    room={room}
                    hotel={hotel}
                    nights={nights}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
