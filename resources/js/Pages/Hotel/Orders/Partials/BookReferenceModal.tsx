import { Check, Copy, Printer, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface BookReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderProductAttribute?: any;
    hotelPreview?: any;
}

export default function BookReferenceModal({
    isOpen,
    onClose,
    orderProductAttribute,
    hotelPreview,
}: BookReferenceModalProps) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [copiedAll, setCopiedAll] = useState<boolean>(false);

    // Lock body scroll when modal is open and handle Escape key
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

    const rawOrderCode =
        orderProductAttribute?.code || order?.invoice_number || '-';
    const invoiceNumber = order?.invoice_number || '-';
    const bookingStatus = (
        hotelBooking?.booking_status ||
        orderProductAttribute?.order_status ||
        'BOOKING'
    ).toUpperCase();
    const sessionId = hotelBooking?.session_id || '-';
    const supplierHotelId = hotelBooking?.hotel || '-';
    const firstRateKey = rooms?.[0]?.rate_key || '-';

    const previewResults = hotelPreview?.results;
    const hotelName =
        previewResults?.name ||
        hotelBooking?.hotel ||
        'Hotel Booking';

    const locationObj = previewResults?.locations;
    const hotelAddress =
        locationObj?.addressMain
            ? [
                  locationObj.addressMain,
                  locationObj.cityName,
                  locationObj.countryName,
              ]
                  .filter(Boolean)
                  .join(', ')
            : hotelBooking?.country || 'Indonesia';

    const checkInDate = hotelBooking?.check_in || '-';
    const checkOutDate = hotelBooking?.check_out || '-';

    const countNights = (ci?: string, co?: string): number => {
        if (!ci || !co) return 1;
        const d1 = new Date(ci);
        const d2 = new Date(co);
        const diff = d2.getTime() - d1.getTime();
        return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = countNights(checkInDate, checkOutDate);
    const totalRooms = rooms.length > 0 ? rooms.length : 1;
    const totalGuests =
        rooms.reduce((acc: number, curr: any) => {
            const adults = parseInt(curr.no_of_adults || '1', 10) || 1;
            const childs = parseInt(curr.no_of_child || '0', 10) || 0;
            return acc + adults + childs;
        }, 0) || 1;

    const leadGuest =
        rooms?.[0]?.hotel_booking_room_paxes?.[0] || customer || null;
    const leadGuestName = leadGuest
        ? `${leadGuest?.salutation ? leadGuest.salutation.trim() + ' ' : ''}${leadGuest?.first_name || ''} ${leadGuest?.last_name || ''}`.trim()
        : customer?.full_name || 'Guest Customer';

    // Reliable copy helper that works in both HTTPS and non-secure HTTP local environments
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
        rooms.forEach((r: any, rIdx: number) => {
            const paxes = r.hotel_booking_room_paxes || [];
            if (paxes.length > 0) {
                paxes.forEach((p: any) => {
                    const name = `${p.salutation ? p.salutation.trim() + ' ' : ''}${p.first_name || ''} ${p.last_name || ''}`.trim();
                    guestLines.push(`  Room ${rIdx + 1}: ${name} (${p.age ? p.age + ' yo' : 'Adult'})`);
                });
            } else {
                guestLines.push(`  Room ${rIdx + 1}: ${leadGuestName}`);
            }
        });

        const fullSummary = `[BOOKING REFERENCE DETAILS]
Order Code        : ${rawOrderCode}
Invoice Number    : ${invoiceNumber}
Status            : ${bookingStatus}

-- SUPPLIER IDENTIFIERS --
Session ID        : ${sessionId}
Supplier Hotel ID : ${supplierHotelId}
Rate Key          : ${firstRateKey}

-- HOTEL & STAY --
Hotel             : ${hotelName}
Location          : ${hotelAddress}
Check-In          : ${checkInDate}
Check-Out         : ${checkOutDate} (${nights} Night${nights > 1 ? 's' : ''})
Room Details      : ${roomDetails?.[0]?.name || 'Standard Room'} (${roomDetails?.[0]?.meal_plan_name || 'Room Only'})
Cancellation      : ${roomDetails?.[0]?.cancellation_policy_type || 'Standard'}

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

    const referenceItems = [
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
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
            <div
                className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                Booking Reference
                            </h2>
                            <span className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {bookingStatus}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Rincian identitas reservasi untuk sinkronisasi supplier & operasional
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title="Tutup (Esc)"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Technical Identifiers
                            </h3>
                            <span className="text-[11px] text-slate-400">
                                Klik untuk menyalin kode
                            </span>
                        </div>

                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden shadow-2xs">
                            {referenceItems.map((item) => {
                                const isCopied = copiedKey === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/70 transition-colors group"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-slate-600">
                                                    {item.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400 hidden sm:inline">
                                                    • {item.description}
                                                </span>
                                            </div>
                                            <div
                                                className="font-mono text-xs font-bold text-slate-900 break-all select-all mt-0.5"
                                                title={item.value}
                                            >
                                                {item.value}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(item.value, item.id)}
                                            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                isCopied
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 active:scale-95'
                                            }`}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check size={13} className="text-emerald-700 stroke-[3]" />
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

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3.5">
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/70">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                    {hotelName}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {hotelAddress}
                                </p>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                                {nights} Malam
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                    Check-In
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block">
                                    {checkInDate}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                    Check-Out
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block">
                                    {checkOutDate}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                    Tipe Kamar
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block truncate">
                                    {roomDetails?.[0]?.name || 'Standard Room'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                    Paket Makan
                                </span>
                                <span className="font-semibold text-slate-900 mt-0.5 block truncate">
                                    {roomDetails?.[0]?.meal_plan_name || 'Room Only'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Guest Allocation ({totalGuests} Pax)
                            </h3>
                            <span className="text-[11px] text-slate-400">
                                {totalRooms} Room
                            </span>
                        </div>

                        <div className="space-y-2">
                            {rooms.map((r: any, rIdx: number) => {
                                const paxes = r.hotel_booking_room_paxes || [];
                                return (
                                    <div
                                        key={rIdx}
                                        className="border border-slate-200 rounded-xl p-3 bg-white space-y-1.5"
                                    >
                                        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                            <span>Kamar {r.room_no || rIdx + 1}</span>
                                            <span className="text-[11px] font-normal text-slate-400">
                                                {r.no_of_adults || 1} Dewasa, {r.no_of_child || 0} Anak
                                            </span>
                                        </div>

                                        <div className="divide-y divide-slate-100 text-xs">
                                            {paxes.length > 0 ? (
                                                paxes.map((p: any, pIdx: number) => (
                                                    <div
                                                        key={pIdx}
                                                        className="py-1.5 flex items-center justify-between text-slate-800"
                                                    >
                                                        <span className="font-medium">
                                                            {p.salutation ? p.salutation.trim() + ' ' : ''}
                                                            {p.first_name} {p.last_name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {pIdx === 0 && rIdx === 0 ? 'Lead Guest • ' : ''}
                                                            {p.age ? `${p.age} th` : 'Adult'}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-1 text-slate-600 font-medium">
                                                    {leadGuestName} (Lead Guest)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleCopyAll}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            copiedAll
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 active:scale-95'
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

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                            <Printer size={14} />
                            Cetak
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-initial px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
