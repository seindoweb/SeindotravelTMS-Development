import {
    AlertCircle,
    Check,
    Copy,
    Loader2,
    Printer,
    RefreshCw,
    X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export interface BookReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderProductAttribute?: any;
    hotelPreview?: any;
    orderCode?: string;
}

export default function BookReferenceModal({
    isOpen,
    onClose,
    orderProductAttribute,
    hotelPreview,
    orderCode,
}: BookReferenceModalProps) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [copiedAll, setCopiedAll] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiData, setApiData] = useState<any>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const rawOrderCode =
        orderCode ||
        orderProductAttribute?.code ||
        orderProductAttribute?.order?.invoice_number ||
        '-';

    const fetchReservationDetails = useCallback(async () => {
        if (!rawOrderCode || rawOrderCode === '-') return;

        setIsLoading(true);
        setApiError(null);

        const safeCode = rawOrderCode.replace(/\//g, '-');

        try {
            const res = await fetch(
                route('hotel.orders.orderBookReference', safeCode),
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            const json = await res.json();

            if (!res.ok || json?.meta?.status === 'error') {
                const msg =
                    json?.data?.errors?.general ||
                    json?.meta?.message ||
                    json?.message ||
                    'Gagal memuat rincian terbaru dari supplier';
                setApiError(msg);
            } else {
                setApiData(json);
            }
        } catch {
            setApiError('Gagal terhubung ke layanan reservasi.');
        } finally {
            setIsLoading(false);
        }
    }, [rawOrderCode]);

    useEffect(() => {
        if (isOpen) {
            fetchReservationDetails();
        } else {
            setApiData(null);
            setApiError(null);
            setIsLoading(false);
            setCopiedKey(null);
            setCopiedAll(false);
        }
    }, [isOpen, fetchReservationDetails]);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const order = orderProductAttribute?.order;
    const customer = order?.user;
    const hotelBooking = orderProductAttribute?.hotel_booking;
    const roomDetails = hotelBooking?.hotel_booking_room_details || [];
    const rooms = hotelBooking?.hotel_booking_rooms || [];
    const invoiceNumber = order?.invoice_number || '-';

    const results = apiData?.data?.results;
    const bookingDetails = results?.bookingDetails;
    const apiHotel = bookingDetails?.hotels?.hotel;
    const apiRoomDetails = apiHotel?.roomDetails;
    const apiRooms = apiRoomDetails?.rooms?.room;
    const apiRoomsList = Array.isArray(apiRooms)
        ? apiRooms
        : apiRooms
          ? [apiRooms]
          : [];

    const bookingStatus = (
        bookingDetails?.status ||
        hotelBooking?.booking_status ||
        orderProductAttribute?.order_status ||
        'BOOKING'
    ).toUpperCase();

    const mgBookingID = bookingDetails?.mgBookingID || orderProductAttribute?.reference_id || null;
    const agencyVoucherNo = bookingDetails?.agencyVoucherNo || null;
    const sessionId =
        results?.sessionID || hotelBooking?.session_id || '-';
    const supplierHotelId =
        apiHotel?.code || hotelBooking?.hotel || '-';
    const firstRateKey = rooms?.[0]?.rate_key || '-';

    const previewResults = hotelPreview?.results;
    const hotelName =
        apiHotel?.name ||
        previewResults?.name ||
        hotelBooking?.hotel ||
        'Hotel Booking';

    const locationObj = previewResults?.locations;
    const hotelAddress = locationObj?.addressMain
        ? [
              locationObj.addressMain,
              locationObj.cityName,
              locationObj.countryName,
          ]
              .filter(Boolean)
              .join(', ')
        : hotelBooking?.country || 'Indonesia';

    const checkInDate =
        bookingDetails?.checkIn || hotelBooking?.check_in || '-';
    const checkOutDate =
        bookingDetails?.checkOut || hotelBooking?.check_out || '-';

    const countNights = (ci?: string, co?: string): number => {
        if (!ci || !co) return 1;
        const d1 = new Date(ci);
        const d2 = new Date(co);
        const diff = d2.getTime() - d1.getTime();
        return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = countNights(checkInDate, checkOutDate);
    const roomTypeName =
        apiRoomDetails?.name || roomDetails?.[0]?.name || 'Standard Room';
    const mealPlanName =
        apiRoomDetails?.mealPlanName ||
        apiRoomDetails?.mealPlan ||
        roomDetails?.[0]?.meal_plan_name ||
        'Room Only';

    const totalRooms =
        apiRoomsList.length > 0
            ? apiRoomsList.length
            : rooms.length > 0
              ? rooms.length
              : 1;

    const leadGuest =
        rooms?.[0]?.hotel_booking_room_paxes?.[0] || customer || null;
    const leadGuestName = leadGuest
        ? `${leadGuest?.salutation ? leadGuest.salutation.trim() + ' ' : ''}${leadGuest?.first_name || ''} ${leadGuest?.last_name || ''}`.trim()
        : customer?.full_name || 'Guest Customer';

    const totalGuests =
        apiRoomsList.length > 0
            ? apiRoomsList.reduce((acc: number, curr: any) => {
                  const adults = parseInt(curr?.noOfAdults || '1', 10) || 1;
                  const childs = parseInt(curr?.noOfChild || '0', 10) || 0;
                  return acc + adults + childs;
              }, 0)
            : rooms.reduce((acc: number, curr: any) => {
                  const adults = parseInt(curr?.no_of_adults || '1', 10) || 1;
                  const childs = parseInt(curr?.no_of_child || '0', 10) || 0;
                  return acc + adults + childs;
              }, 0) || 1;

    const copyToClipboard = (text: string, keyId: string) => {
        if (!text || text === '-') return;

        let success = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text);
                success = true;
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                success = document.execCommand('copy');
                textArea.remove();
            }
        } catch (err) {
            console.error('Copy failed:', err);
        }

        if (success) {
            setCopiedKey(keyId);
            setTimeout(() => setCopiedKey(null), 1500);
        }
    };

    const handleCopyAll = () => {
        const guestLines: string[] = [];

        if (apiRoomsList.length > 0) {
            apiRoomsList.forEach((r: any, rIdx: number) => {
                const paxes = r?.paxDetails?.pax || [];
                const paxArr = Array.isArray(paxes) ? paxes : [paxes];
                if (paxArr.length > 0) {
                    paxArr.forEach((p: any) => {
                        const name =
                            `${p?.salutation ? p.salutation.trim() + ' ' : ''}${p?.firstName || ''} ${p?.lastName || ''}`.trim();
                        guestLines.push(
                            `  Room ${r.roomNo || rIdx + 1}: ${name} (${p?.age ? p.age + ' yo' : 'Adult'})`,
                        );
                    });
                } else {
                    guestLines.push(`  Room ${r.roomNo || rIdx + 1}: ${leadGuestName}`);
                }
            });
        } else {
            rooms.forEach((r: any, rIdx: number) => {
                const paxes = r.hotel_booking_room_paxes || [];
                if (paxes.length > 0) {
                    paxes.forEach((p: any) => {
                        const name =
                            `${p.salutation ? p.salutation.trim() + ' ' : ''}${p.first_name || ''} ${p.last_name || ''}`.trim();
                        guestLines.push(
                            `  Room ${rIdx + 1}: ${name} (${p.age ? p.age + ' yo' : 'Adult'})`,
                        );
                    });
                } else {
                    guestLines.push(`  Room ${rIdx + 1}: ${leadGuestName}`);
                }
            });
        }

        const fullSummary = `[BOOKING REFERENCE DETAILS]
Order Code        : ${rawOrderCode}
Invoice Number    : ${invoiceNumber}
Status            : ${bookingStatus}

-- SUPPLIER IDENTIFIERS (MG BEDBANK) --
${mgBookingID ? `MG Booking ID     : ${mgBookingID}\n` : ''}${agencyVoucherNo ? `Agency Voucher No : ${agencyVoucherNo}\n` : ''}Session ID        : ${sessionId}
Supplier Hotel ID : ${supplierHotelId}
Rate Key          : ${firstRateKey}

-- HOTEL & STAY --
Hotel             : ${hotelName}
Location          : ${hotelAddress}
Check-In          : ${checkInDate}
Check-Out         : ${checkOutDate} (${nights} Night${nights > 1 ? 's' : ''})
Room Details      : ${roomTypeName} (${mealPlanName})

-- GUESTS (${totalGuests} Pax / ${totalRooms} Room) --
${guestLines.join('\n')}`;

        let success = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(fullSummary);
                success = true;
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = fullSummary;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                success = document.execCommand('copy');
                textArea.remove();
            }
        } catch (err) {
            console.error('Copy all failed:', err);
        }

        if (success) {
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        }
    };

    const referenceItems: Array<{
        id: string;
        label: string;
        value: string;
        description: string;
        highlight?: boolean;
    }> = [];

    if (mgBookingID) {
        referenceItems.push({
            id: 'mgBookingId',
            label: 'MG Booking ID',
            value: mgBookingID,
            description: 'Nomor booking konfirmasi dari supplier MG Bedbank',
            highlight: true,
        });
    }

    if (agencyVoucherNo) {
        referenceItems.push({
            id: 'agencyVoucherNo',
            label: 'Agency Voucher No.',
            value: agencyVoucherNo,
            description: 'Nomor voucher resmi dari supplier MG',
            highlight: true,
        });
    }

    referenceItems.push(
        {
            id: 'sessionId',
            label: 'Microservice Session ID',
            value: sessionId,
            description: 'Kunci sesi API microservice',
        },
        {
            id: 'rateKey',
            label: 'Supplier Rate Key',
            value: firstRateKey,
            description: 'Kunci tarif kamar unik dari supplier',
        },
        {
            id: 'hotelCode',
            label: 'Supplier Hotel Code',
            value: supplierHotelId,
            description: 'ID hotel pada database supplier',
        },
        {
            id: 'orderCode',
            label: 'TMS Order Code',
            value: rawOrderCode,
            description: 'Kode referensi internal sistem TMS',
        },
        {
            id: 'invoice',
            label: 'Invoice Number',
            value: invoiceNumber,
            description: 'Nomor tagihan pembayaran',
        },
    );

    return (
        <div className="inset-0 p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs fixed z-[100] flex items-center justify-center">
            <div
                className="bg-white rounded-2xl max-w-2xl shadow-2xl border-slate-200 animate-in fade-in zoom-in-95 flex max-h-[92vh] w-full flex-col overflow-hidden border duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 bg-white border-slate-100 flex shrink-0 items-center justify-between border-b">
                    <div className="space-y-0.5">
                        <div className="gap-2.5 flex items-center">
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Booking Reference
                            </h2>
                            <span className="font-semibold tracking-wide px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[11px]">
                                {bookingStatus}
                            </span>
                            {isLoading && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                                    <Loader2 size={11} className="animate-spin" />
                                    Live Syncing...
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            Rincian identitas reservasi untuk sinkronisasi supplier & operasional
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={fetchReservationDetails}
                            disabled={isLoading}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
                            title="Refresh data dari supplier"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                            title="Tutup (Esc)"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 text-slate-800 overflow-y-auto">
                    {apiError && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex items-start gap-3 text-xs text-amber-800">
                            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold">Informasi Supplier Offline</p>
                                <p className="text-amber-700 mt-0.5">{apiError}. Menampilkan data lokal tersimpan.</p>
                            </div>
                            <button
                                type="button"
                                onClick={fetchReservationDetails}
                                className="font-bold underline cursor-pointer text-amber-900 hover:text-amber-950"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    <div>
                        <div className="mb-2.5 flex items-center justify-between">
                            <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                Technical Identifiers
                            </h3>
                            <span className="text-slate-400 text-[11px]">
                                Klik untuk menyalin kode
                            </span>
                        </div>

                        <div className="bg-white border-slate-200 rounded-xl divide-slate-100 shadow-2xs divide-y overflow-hidden border">
                            {referenceItems.map((item) => {
                                const isCopied = copiedKey === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className={`p-3.5 sm:flex-row sm:items-center gap-2.5 group flex flex-col justify-between transition-colors ${
                                            item.highlight
                                                ? 'bg-blue-50/40 hover:bg-blue-50/80'
                                                : 'hover:bg-slate-50/70'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="gap-2 flex items-center">
                                                <span className={`text-xs font-semibold ${item.highlight ? 'text-blue-900' : 'text-slate-600'}`}>
                                                    {item.label}
                                                </span>
                                                <span className="text-slate-400 sm:inline hidden text-[10px]">
                                                    • {item.description}
                                                </span>
                                            </div>
                                            <div
                                                className={`font-mono text-xs font-bold mt-0.5 break-all select-all ${
                                                    item.highlight ? 'text-blue-700' : 'text-slate-900'
                                                }`}
                                                title={item.value}
                                            >
                                                {item.value}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                copyToClipboard(
                                                    item.value,
                                                    item.id,
                                                )
                                            }
                                            className={`gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex shrink-0 cursor-pointer items-center transition-all ${
                                                isCopied
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 border'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80 border active:scale-95'
                                            }`}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check
                                                        size={13}
                                                        className="text-emerald-700 stroke-[3]"
                                                    />
                                                    <span>Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={13} />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3.5 border">
                        <div className="gap-3 pb-3 border-slate-200/70 flex items-start justify-between border-b">
                            <div>
                                <h4 className="text-sm font-bold leading-snug text-slate-900">
                                    {hotelName}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {hotelAddress}
                                </p>
                            </div>
                            <span className="text-xs font-bold text-slate-700 bg-white border-slate-200 px-2.5 py-1 rounded-md shrink-0 border">
                                {nights} Malam
                            </span>
                        </div>

                        <div className="gap-4 text-xs sm:grid-cols-4 grid grid-cols-2">
                            <div>
                                <span className="font-bold text-slate-400 tracking-wider block text-[10px] uppercase">
                                    Check-In
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block">
                                    {checkInDate}
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-slate-400 tracking-wider block text-[10px] uppercase">
                                    Check-Out
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block">
                                    {checkOutDate}
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-slate-400 tracking-wider block text-[10px] uppercase">
                                    Tipe Kamar
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block truncate" title={roomTypeName}>
                                    {roomTypeName}
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-slate-400 tracking-wider block text-[10px] uppercase">
                                    Paket Makan
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block truncate" title={mealPlanName}>
                                    {mealPlanName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2.5 flex items-center justify-between">
                            <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                Guest Allocation ({totalGuests} Pax)
                            </h3>
                            <span className="text-slate-400 text-[11px]">
                                {totalRooms} Room
                            </span>
                        </div>

                        <div className="space-y-2">
                            {apiRoomsList.length > 0 ? (
                                apiRoomsList.map((r: any, rIdx: number) => {
                                    const paxes = r?.paxDetails?.pax || [];
                                    const paxArr = Array.isArray(paxes) ? paxes : [paxes];
                                    return (
                                        <div
                                            key={rIdx}
                                            className="border-slate-200 rounded-xl p-3 bg-white space-y-1.5 border"
                                        >
                                            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                                <span>
                                                    Kamar {r.roomNo || rIdx + 1}
                                                </span>
                                                <span className="font-normal text-slate-400 text-[11px]">
                                                    {r.noOfAdults || 1} Dewasa
                                                    {r.noOfChild > 0 ? `, ${r.noOfChild} Anak` : ''}
                                                </span>
                                            </div>

                                            <div className="text-xs divide-slate-100 divide-y">
                                                {paxArr.length > 0 ? (
                                                    paxArr.map((p: any, pIdx: number) => (
                                                        <div
                                                            key={pIdx}
                                                            className="py-1.5 text-slate-800 flex items-center justify-between"
                                                        >
                                                            <span className="font-medium">
                                                                {p.salutation
                                                                    ? p.salutation.trim() + ' '
                                                                    : ''}
                                                                {p.firstName}{' '}
                                                                {p.lastName}
                                                            </span>
                                                            <span className="text-slate-400 text-[10px]">
                                                                {pIdx === 0 && rIdx === 0
                                                                    ? 'Lead Guest • '
                                                                    : ''}
                                                                {p.age ? `${p.age} th` : 'Adult'}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-1 font-medium text-slate-600">
                                                        {leadGuestName} (Lead Guest)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                rooms.map((r: any, rIdx: number) => {
                                    const paxes = r.hotel_booking_room_paxes || [];
                                    return (
                                        <div
                                            key={rIdx}
                                            className="border-slate-200 rounded-xl p-3 bg-white space-y-1.5 border"
                                        >
                                            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                                <span>
                                                    Kamar {r.room_no || rIdx + 1}
                                                </span>
                                                <span className="font-normal text-slate-400 text-[11px]">
                                                    {r.no_of_adults || 1} Dewasa,{' '}
                                                    {r.no_of_child || 0} Anak
                                                </span>
                                            </div>

                                            <div className="text-xs divide-slate-100 divide-y">
                                                {paxes.length > 0 ? (
                                                    paxes.map(
                                                        (p: any, pIdx: number) => (
                                                            <div
                                                                key={pIdx}
                                                                className="py-1.5 text-slate-800 flex items-center justify-between"
                                                            >
                                                                <span className="font-medium">
                                                                    {p.salutation
                                                                        ? p.salutation.trim() +
                                                                          ' '
                                                                        : ''}
                                                                    {p.first_name}{' '}
                                                                    {p.last_name}
                                                                </span>
                                                                <span className="text-slate-400 text-[10px]">
                                                                    {pIdx === 0 &&
                                                                    rIdx === 0
                                                                        ? 'Lead Guest • '
                                                                        : ''}
                                                                    {p.age
                                                                        ? `${p.age} th`
                                                                        : 'Adult'}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="py-1 font-medium text-slate-600">
                                                        {leadGuestName} (Lead Guest)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="gap-3 px-6 py-4 bg-slate-50 border-slate-200 sm:flex-row flex shrink-0 flex-col items-center justify-between border-t">
                    <button
                        type="button"
                        onClick={handleCopyAll}
                        className={`sm:w-auto gap-2 px-4 py-2 rounded-xl text-xs font-bold inline-flex w-full cursor-pointer items-center justify-center transition-all ${
                            copiedAll
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700 border active:scale-95'
                        }`}
                    >
                        {copiedAll ? (
                            <>
                                <Check size={14} className="stroke-[3]" />
                                <span>Semua Rincian Berhasil Disalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                <span>Salin Semua Rincian</span>
                            </>
                        )}
                    </button>

                    <div className="gap-2 sm:w-auto flex w-full items-center">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="sm:flex-initial gap-1.5 px-4 py-2 bg-white border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold inline-flex flex-1 cursor-pointer items-center justify-center border transition-colors"
                        >
                            <Printer size={14} />
                            Cetak
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-xs font-bold text-white sm:flex-initial bg-slate-900 hover:bg-slate-800 rounded-xl flex-1 cursor-pointer transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
