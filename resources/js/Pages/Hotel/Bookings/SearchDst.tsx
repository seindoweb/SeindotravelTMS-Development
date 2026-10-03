import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import {
    HotelSearchResultItem,
    PriceSearchDestinationData,
    PriceSearchDestinationReq,
    PriceSearchDestinationResponse,
    PriceSearchFilterReq,
    PriceSearchRoomReq,
    RoomGuestProps,
    SearchSelectionProps,
} from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Building,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import HotelBookingForm from './Partials/HotelBookingForm';
import HotelCard from './Partials/HotelCard';
import HotelSearchFilterSidebar from './Partials/HotelSearchFilterSidebar';
import HotelSearchSkeleton from './Partials/HotelSearchSkeleton';

interface SearchDstProps {
    type: string;
    country: string;
    destination?: string;
    checkIn: string;
    checkOut: string;
    room: string;
    page: number;
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

export default function SearchDst({
    type,
    country,
    destination,
    checkIn,
    checkOut,
    room,
    page: initialPage = 1,
}: SearchDstProps) {
    const destinationCode = destination || '';
    const rooms = decodeRooms(room);
    const storedName =
        sessionStorage.getItem('searchSelectionName') || destinationCode;

    const initialSelection: SearchSelectionProps | null = destinationCode
        ? {
              type: 'dst',
              name: storedName,
              code: destinationCode,
              destination: destinationCode,
              country,
          }
        : null;

    const [currentPage, setCurrentPage] = useState<number>(initialPage || 1);
    const [activeFilters, setActiveFilters] = useState<PriceSearchFilterReq>({});
    const [searchData, setSearchData] = useState<PriceSearchDestinationData | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCurrentPage(initialPage || 1);
        setActiveFilters({});
    }, [destinationCode, country, checkIn, checkOut, room, initialPage]);

    const fetchDestinationPrices = useCallback(async () => {
        console.log('[SearchDst] fetchDestinationPrices checking params:', {
            destinationCode,
            checkIn,
            checkOut,
            country,
        });

        if (!destinationCode || !checkIn || !checkOut) {
            console.warn(
                '[SearchDst] Aborting fetch: missing destinationCode, checkIn, or checkOut',
                { destinationCode, checkIn, checkOut },
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const payload: PriceSearchDestinationReq = {
            country: country || 'ID',
            destination: destinationCode,
            checkIn,
            checkOut,
            rooms: transformRoomsToApi(rooms),
            filter: activeFilters,
            page: currentPage,
        };
        console.log('payload', payload);

        try {
            const res = await hotelMicroserviceApi.post<PriceSearchDestinationResponse>(
                '/price-search-by-destination',
                payload,
            );
            console.log('response', res);

            if (res.data?.meta?.status === 'success' || res.data?.data) {
                setSearchData(res.data.data);
            } else {
                setError(res.data?.meta?.message || 'Gagal memuat daftar hotel.');
            }
        } catch (err: unknown) {
            console.error('Error fetching destination prices:', err);
            const errObj = err as { response?: { data?: { meta?: { message?: string } } }; message?: string };
            const msg =
                errObj.response?.data?.meta?.message ||
                errObj.message ||
                'Terjadi kesalahan saat memuat data hotel.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [destinationCode, country, checkIn, checkOut, room, activeFilters, currentPage]);

    useEffect(() => {
        fetchDestinationPrices();
    }, [fetchDestinationPrices]);

    const handleFilterChange = (filters: PriceSearchFilterReq) => {
        setActiveFilters(filters);
        setCurrentPage(1); 
    };

    const handleResetFilters = () => {
        setActiveFilters({});
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const destinationTitle = storedName || 'Destination';

    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold text-primary truncate">
                        Hotel
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        Search
                    </span>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-primary truncate">
                        {destinationTitle}
                    </span>
                </>
            }
        >
            <Head title={`Hotel di ${destinationTitle}`} />

            <HotelBookingForm
                initialSelection={initialSelection}
                initialCheckIn={parseDate(checkIn)}
                initialCheckOut={parseDate(checkOut)}
                initialRooms={rooms}
            />

            <div className="mt-8 mb-12">
                {loading ? (
                    <HotelSearchSkeleton />
                ) : error ? (
                    <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-xl mx-auto my-8 shadow-sm">
                        <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            Gagal Memuat Hasil Pencarian
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchDestinationPrices}
                            className="bg-primary hover:bg-primary-bright text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <HotelSearchFilterSidebar
                                availableFilters={searchData?.filters || null}
                                activeFilters={activeFilters}
                                onChange={handleFilterChange}
                                onReset={handleResetFilters}
                            />
                        </div>

                        <div className="lg:col-span-3 space-y-4">
                            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                                <div>
                                    <h2 className="text-base font-bold text-primary">
                                        Hotel di {destinationTitle}
                                    </h2>
                                    <p className="text-xs text-quaternary mt-0.5">
                                        Menampilkan{' '}
                                        <span className="font-bold text-primary">
                                            {searchData?.total ?? 0}
                                        </span>{' '}
                                        hotel tersedia
                                    </p>
                                </div>
                            </div>

                            {searchData?.results && searchData.results.length > 0 ? (
                                <div className="space-y-4">
                                    {searchData.results.map((hotel: HotelSearchResultItem) => (
                                        <HotelCard
                                            key={hotel.key || hotel.hotelCode}
                                            hotel={hotel}
                                        />
                                    ))}

                                    {searchData.last_page > 1 && (
                                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between mt-6 shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(searchData.page - 1)
                                                }
                                                disabled={!searchData.has_prev}
                                                className="flex items-center gap-1 text-xs font-bold text-primary disabled:text-gray-300 disabled:cursor-not-allowed hover:text-primary-bright px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <ChevronLeft size={16} />
                                                <span>Sebelumnya</span>
                                            </button>

                                            <div className="flex items-center gap-1.5">
                                                {Array.from(
                                                    { length: searchData.last_page },
                                                    (_, i) => i + 1,
                                                )
                                                    .filter((p) => {
                                                        const current = searchData.page;
                                                        return (
                                                            p === 1 ||
                                                            p === searchData.last_page ||
                                                            Math.abs(p - current) <= 1
                                                        );
                                                    })
                                                    .map((p, idx, arr) => {
                                                        const prev = arr[idx - 1];
                                                        const showEllipsis =
                                                            prev && p - prev > 1;

                                                        return (
                                                            <div
                                                                key={p}
                                                                className="flex items-center gap-1.5"
                                                            >
                                                                {showEllipsis && (
                                                                    <span className="text-xs text-gray-400 px-1">
                                                                        ...
                                                                    </span>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handlePageChange(p)
                                                                    }
                                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                                                        searchData.page === p
                                                                            ? 'bg-primary text-white shadow-sm'
                                                                            : 'hover:bg-gray-100 text-gray-700'
                                                                    }`}
                                                                >
                                                                    {p}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(searchData.page + 1)
                                                }
                                                disabled={!searchData.has_next}
                                                className="flex items-center gap-1 text-xs font-bold text-primary disabled:text-gray-300 disabled:cursor-not-allowed hover:text-primary-bright px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <span>Selanjutnya</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
                                    <Building
                                        size={44}
                                        className="mx-auto text-gray-300 mb-3"
                                    />
                                    <h3 className="text-base font-bold text-gray-800 mb-1">
                                        Tidak Ada Hotel Ditemukan
                                    </h3>
                                    <p className="text-xs text-quaternary max-w-md mx-auto mb-4">
                                        Kami tidak menemukan hotel yang sesuai dengan
                                        kriteria pencarian atau filter yang Anda pilih.
                                        Coba sesuaikan filter atau ubah tanggal
                                        menginap.
                                    </p>
                                    {Object.keys(activeFilters).length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleResetFilters}
                                            className="bg-primary hover:bg-primary-bright text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                                        >
                                            Reset Filter
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
