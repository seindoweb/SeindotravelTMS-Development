import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import {
    HotelDetailInfo,
    HotelRoomDetail,
    PriceSearchHotelData,
    PriceSearchHotelReq,
    PriceSearchHotelResponse,
    PriceSearchRoomReq,
    RoomGuestProps,
    SearchSelectionProps,
} from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    BedDouble,
    ChevronRight
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import HotelBookingForm from './Partials/HotelBookingForm';
import HotelHeader from './Partials/HotelHeader';
import HotelSearchSkeleton from './Partials/HotelSearchSkeleton';
import RoomCard from './Partials/RoomCard';

interface SearchHtlProps {
    country: string;
    destination?: string;
    hotel?: string;
    checkIn: string;
    checkOut: string;
    room: string;
}

function decodeRooms(roomStr: string): RoomGuestProps[] {
    if (!roomStr) {
        return [{ adults: 2, children: 0, childAges: [], extraBed: false }];
    }
    return roomStr.split(',').map((part) => {
        const segments = part.split('-');
        const adults = parseInt(segments[1] ?? '2', 10) || 2;
        const children = parseInt(segments[2] ?? '0', 10) || 0;
        const child1Age = parseInt(segments[3] ?? '0', 10) || 0;
        const child2Age = parseInt(segments[4] ?? '0', 10) || 0;
        const extraBed = segments[5] === 'true';
        const childAges: number[] = [];
        if (children >= 1) childAges.push(child1Age);
        if (children >= 2) childAges.push(child2Age);
        return { adults, children, childAges, extraBed };
    });
}

function transformRoomsToApi(rooms: RoomGuestProps[]): PriceSearchRoomReq[] {
    return rooms.map((r, idx) => ({
        RoomNo: String(idx + 1),
        NoOfAdults: String(r.adults),
        NoOfChild: String(r.children),
        Child1Age: String(r.childAges[0] ?? 0),
        Child2Age: String(r.childAges[1] ?? 0),
        ExtraBed: r.extraBed,
    }));
}

function parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function countNights(checkIn: string, checkOut: string): number {
    const ci = parseDate(checkIn);
    const co = parseDate(checkOut);
    if (!ci || !co) return 1;
    const diff = co.getTime() - ci.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export default function SearchHtl({
    country,
    destination,
    hotel,
    checkIn,
    checkOut,
    room,
}: SearchHtlProps) {
    const hotelCode = hotel || '';
    const destinationCode = destination || '';
    const rooms = decodeRooms(room);
    const nights = countNights(checkIn, checkOut);

    const storedName = sessionStorage.getItem('searchSelectionName') || hotelCode;

    const initialSelection: SearchSelectionProps | null = hotelCode
        ? {
              type: 'htl',
              name: storedName,
              code: hotelCode,
              hotel: hotelCode,
              destination: destinationCode,
              country,
          }
        : null;

    const [searchData, setSearchData] = useState<PriceSearchHotelData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHotelPrices = useCallback(async () => {
        if (!hotelCode || !destinationCode || !checkIn || !checkOut) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const payload: PriceSearchHotelReq = {
            country: country || 'ID',
            destination: destinationCode,
            hotel: hotelCode,
            checkIn,
            checkOut,
            rooms: transformRoomsToApi(rooms),
        };

        try {
            const res = await hotelMicroserviceApi.post<PriceSearchHotelResponse>(
                '/price-discovery-by-hotel',
                payload,
            );

            console.log('response',res)

            if (res.data?.meta?.status === 'success' || res.data?.data) {
                setSearchData(res.data.data);
            } else {
                setError(res.data?.meta?.message || 'Gagal memuat data hotel.');
            }
        } catch (err: unknown) {
            const errObj = err as {
                response?: { data?: { meta?: { message?: string } } };
                message?: string;
            };
            const msg =
                errObj.response?.data?.meta?.message ||
                errObj.message ||
                'Terjadi kesalahan saat memuat data hotel.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [hotelCode, destinationCode, country, checkIn, checkOut, room]);

    useEffect(() => {
        fetchHotelPrices();
    }, [fetchHotelPrices]);

    const hotelDetail: HotelDetailInfo | null = searchData?.results ?? null;
    const roomDetails: HotelRoomDetail[] = searchData?.results.roomDetails ?? [];

    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">Hotel</span>
                    <ChevronRight size={14} className="sm:block hidden text-[#CBD5E1]" />
                    <span className="text-sm font-bold text-primary truncate">Search</span>
                    <ChevronRight size={14} className="sm:block hidden text-[#CBD5E1]" />
                    <span className="text-sm font-bold text-primary truncate">
                        {hotelDetail?.name || 'Hotel'}
                    </span>
                </>
            }
        >
            <Head title={`Hotel — ${hotelDetail?.name || 'Loading...'}`} />

            <HotelBookingForm
                initialSelection={initialSelection}
                initialCheckIn={parseDate(checkIn)}
                initialCheckOut={parseDate(checkOut)}
                initialRooms={rooms}
            />

            <div className="mt-6 space-y-4">
                {loading && <HotelSearchSkeleton />}

                {!loading && error && !hotelDetail && (
                    <div className="flex flex-col items-center justify-center bg-white border border-red-100 rounded-2xl py-16 px-6 text-center gap-3">
                        <AlertCircle size={40} className="text-red-400" />
                        <p className="font-semibold text-primary">Hotel is not available at the moment. Please try again on another date or choose another hotel.</p>
                    </div>
                )}

                {!loading && !error && hotelDetail && (
                    <>
                        <HotelHeader hotel={hotelDetail} nights={nights} />

                        {roomDetails.length > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <p className="text-sm font-semibold text-primary">
                                        {roomDetails.length} room type available
                                    </p>
                                </div>
                                {roomDetails.map((room) => (
                                    <RoomCard key={room.key} room={room} hotel={hotelDetail} nights={nights} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-2xl py-16 px-6 text-center gap-3">
                                <BedDouble size={40} className="text-gray-300" />
                                <p className="font-semibold text-primary">
                                    No room type available
                                </p>
                                <p className="text-sm text-quaternary">
                                    Try changing the date or number of guests.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
