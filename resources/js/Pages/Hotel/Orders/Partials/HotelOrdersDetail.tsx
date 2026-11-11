import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    ArrowLeft,
    BedDouble,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    Hotel,
    MapPin,
    PhoneCall,
    Printer,
    ShieldAlert,
    User,
    Users
} from 'lucide-react';
import { useState } from 'react';
import BookReferenceModal from './BookReferenceModal';
import FloatingIssuedAction from './FloatingIssuedAction';

export interface HotelOrderDetailProps {
    orderProductAttribute?: any;
    hotelPreview?: any;
}

const StatusBadge = ({ status }: { status?: string }) => {
    const s = (status || '').toUpperCase();
    if (s === 'ISSUED' || s === 'PAID' || s === 'D' || s === 'DONE') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={14} className="text-emerald-600" />
                {s === 'D' ? 'ISSUED' : s}
            </div>
        );
    }
    if (s === 'CONFIRMED' || s === 'C') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                <CheckCircle2 size={14} className="text-blue-600" />
                CONFIRMED
            </div>
        );
    }
    if (s === 'PENDING' || s === 'UNPAID' || s === 'B' || s === 'BOOKING') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <AlertCircle size={14} className="text-amber-600" />
                {s === 'B' ? 'BOOKING' : s}
            </div>
        );
    }
    if (s === 'CANCELLED' || s === 'FAILED' || s === 'EXPIRED' || s === 'F') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                <AlertCircle size={14} className="text-rose-600" />
                {s === 'F' ? 'CANCELLED' : s}
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status || 'UNKNOWN'}
        </div>
    );
};

const formatRupiah = (amount: number | string | undefined | null) => {
    const num =
        typeof amount === 'string'
            ? parseFloat(amount) || 0
            : Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(num)
        .replace('Rp', 'Rp ');
};

const formatPaymentMethod = (type?: string) => {
    switch (type) {
        case 'CH':
            return 'Cash';
        case 'TF':
            return 'Bank Transfer';
        case 'PG':
            return 'Online Pay';
        case 'UC':
            return 'User Credit';
        default:
            return type || 'Manual';
    }
};

const formatFullDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const day = String(d.getDate()).padStart(2, '0');
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
    ];
    const month = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
};

const countNights = (ci?: string, co?: string): number => {
    if (!ci || !co) return 1;
    const d1 = new Date(ci);
    const d2 = new Date(co);
    const diff = d2.getTime() - d1.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

export default function HotelOrdersDetail({
    orderProductAttribute,
    hotelPreview,
}: HotelOrderDetailProps) {
    const [isBookRefModalOpen, setIsBookRefModalOpen] = useState<boolean>(false);

    const order = orderProductAttribute?.order;
    const customer = order?.user;
    const testing = orderProductAttribute;
    const hotelBooking = testing?.hotel_booking;
    const roomDetails = hotelBooking?.hotel_booking_room_details || [];
    const rooms = hotelBooking?.hotel_booking_rooms || [];

    const rawOrderCode =
        orderProductAttribute?.code || order?.invoice_number || '-';
    const invoiceNumber = order?.invoice_number || '-';
    const orderStatus = orderProductAttribute?.order_status || 'B';
    const paymentStatus = order?.payment_status || 'unpaid';
    const paymentMethod = formatPaymentMethod(order?.type_of_payment);

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

    const hotelPhone =
        previewResults?.phone ||
        locationObj?.phone ||
        customer?.phone_number ||
        '-';

    const tax = parseFloat(order?.tax_amount) || 0;
    const discount = parseFloat(order?.discount_amount) || 0;
    const totalPayment =
        parseFloat(order?.total_amount)
    const nta = parseFloat(roomDetails?.[0].nta_price);
    const markups = parseFloat(roomDetails?.[0].markup_price)

    const checkInDate = hotelBooking?.check_in || '-';
    const checkOutDate = hotelBooking?.check_out || '-';
    const nights = countNights(checkInDate, checkOutDate);

    const totalRooms = rooms.length > 0 ? rooms.length : 1;
    const totalGuests =
        rooms.reduce((acc: number, curr: any) => {
            const adults = parseInt(curr.no_of_adults || '1', 10) || 1;
            const childs = parseInt(curr.no_of_child || '0', 10) || 0;
            return acc + adults + childs;
        }, 0) || 1;

    const specialRequest =
        hotelBooking?.special_requests ||
        'No special requests';

    const leadGuestNationality =
        hotelBooking?.pic_guest_nationality ||
        customer?.nationality ||
        'ID';

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                        Order Details
                    </h1>
                    <p className="text-sm text-quaternary mt-1">
                        Please review the complete booking information before proceeding.
                    </p>
                </div>
                <Link
                    href={route('hotel.orders.list')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-[#E2E8F0] flex flex-col overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                    <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-primary">
                                Customer Order
                            </h2>
                            <p className="text-[11px] text-quaternary font-medium uppercase tracking-wider">
                                Primary Contact
                            </p>
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-quaternary font-medium uppercase tracking-wider">
                                    Full Name
                                </p>
                                <p className="text-base font-bold text-primary">
                                    {customer?.title ? `${customer.title} ` : ''}
                                    {customer?.full_name || 'Guest Customer'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-quaternary font-medium uppercase tracking-wider">
                                    Contact Info
                                </p>
                                <p className="text-sm font-medium text-primary">
                                    {customer?.email || '-'}
                                </p>
                                <p className="text-sm font-medium text-primary">
                                    {customer?.phone_number
                                        ? `${customer.dial_code || '+62'} ${customer.phone_number}`
                                        : '-'}
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-xs text-quaternary font-medium uppercase tracking-wider">
                                    Booking Status
                                </p>
                                <div>
                                    <StatusBadge status={orderStatus} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-quaternary font-medium uppercase tracking-wider">
                                    Order Code
                                </p>
                                <p className="text-sm font-mono font-bold text-primary break-all">
                                    {rawOrderCode}
                                </p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-xs text-quaternary font-medium uppercase tracking-wider">
                                    Created By Admin
                                </p>
                                <p className="text-sm font-medium text-primary">
                                    {order?.creator?.full_name || 'Customer / System'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row items-center gap-3 justify-end mt-auto border-t border-[#E2E8F0]">
                        <button
                            type="button"
                            onClick={() => setIsBookRefModalOpen(true)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 hover:border-emerald-500 rounded-xl text-sm font-bold text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                            See Book Reference
                        </button>
                        <button
                            type="button"
                            className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ShieldAlert size={16} />
                            Take Countermeasures
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-[#E2E8F0] flex flex-col overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                    <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
                            <CircleDollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-primary">
                                Price & Payment
                            </h2>
                            <p className="text-[11px] text-quaternary font-medium uppercase tracking-wider">
                                Financial Breakdown
                            </p>
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-quaternary font-medium">
                                Net Travel Agent (NTA) test
                            </span>
                            <span className="text-sm font-mono font-semibold text-primary">
                                {formatRupiah(nta)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-quaternary font-medium">
                                Tax
                            </span>
                            <span className="text-sm font-mono font-semibold text-primary">
                                {formatRupiah(tax)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 pb-4">
                            <span className="text-sm text-quaternary font-medium">
                                Discount
                            </span>
                            <span className="text-sm font-mono font-semibold text-rose-500">
                                -{formatRupiah(discount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-bold text-primary">
                                Markup Price
                            </span>
                            <span className="text-sm font-mono font-bold text-emerald-600">
                                +{formatRupiah(markups)}
                            </span>
                        </div>

                        <div className="mt-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-center">
                            <div>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">
                                    Total Payment
                                </span>
                                <span className="text-2xl font-bold text-primary tracking-tight">
                                    {formatRupiah(totalPayment)}
                                </span>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <StatusBadge status={paymentStatus} />
                                <p className="text-xs text-slate-500 mt-2 mr-3 font-medium">
                                    {paymentMethod}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-0">
                <div className="absolute -inset-1 bg-gradient-to-b from-gray-200 to-transparent rounded-[2.5rem] blur opacity-30"></div>
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden relative border border-gray-200">
                    <div className="bg-[#F8FAFC] px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-2 border-dashed border-gray-300 relative">
                        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gray-100 rounded-full border-r-2 border-t-2 border-dashed border-gray-300 transform rotate-45 hidden md:block"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gray-100 rounded-full border-l-2 border-t-2 border-dashed border-gray-300 transform -rotate-45 hidden md:block"></div>

                        <div className="flex items-center gap-2">
                            <div>
                                <img
                                    className="w-auto h-14 object-contain"
                                    src="/assets/images/seindo_logo.png"
                                    alt="Logo Seindo Travel"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display =
                                            'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                            <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl flex flex-col w-full md:w-auto shadow-sm">
                                <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-0.5">
                                    Invoice Number
                                </span>
                                <span className="text-lg font-mono font-bold text-primary tracking-tight">
                                    {invoiceNumber}
                                </span>
                            </div>
                            <div className="flex flex-col items-start md:items-end text-xs text-quaternary font-medium mt-1 gap-1">
                                <span>
                                    Order Time:{' '}
                                    <span className="font-bold text-primary">
                                        {formatFullDate(order?.created_at)}
                                    </span>
                                </span>
                                {order?.expired_at && (
                                    <span className="flex items-center gap-1.5 text-rose-500">
                                        <AlertCircle size={14} /> Exp:{' '}
                                        {formatFullDate(order.expired_at)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                        <div className="lg:col-span-7 flex flex-col gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                                    <Hotel size={26} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-extrabold text-primary mb-2 tracking-tight">
                                        {hotelName}
                                    </h3>
                                    <div className="flex items-start gap-2 text-quaternary mb-2">
                                        <MapPin
                                            size={16}
                                            className="shrink-0 mt-0.5 text-slate-400"
                                        />
                                        <p className="text-sm leading-relaxed font-medium">
                                            {hotelAddress}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary font-bold bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                                        <PhoneCall
                                            size={14}
                                            className="text-quaternary"
                                        />
                                        <span className="text-sm">
                                            {hotelPhone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-1">
                                        Session ID
                                    </span>
                                    <span
                                        className="font-bold text-primary font-mono text-xs truncate max-w-[120px]"
                                        title={hotelBooking?.session_id || '-'}
                                    >
                                        {hotelBooking?.session_id
                                            ? `...${hotelBooking.session_id.slice(-8)}`
                                            : '-'}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-1">
                                        Rooms
                                    </span>
                                    <span className="font-bold text-primary">
                                        {totalRooms} Kamar
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-1">
                                        Guests
                                    </span>
                                    <span className="font-bold text-primary">
                                        {totalGuests} Tamu
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Order Code
                                </span>
                                <span className="font-mono font-bold text-primary text-lg break-all">
                                    {rawOrderCode}
                                </span>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-5">
                                    <Users
                                        size={120}
                                        className="text-slate-900 -mt-6 -mr-6"
                                    />
                                </div>
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2 relative z-10">
                                    <Users size={16} /> Guest Information
                                </h4>
                                <div className="relative z-10 flex flex-col gap-4">
                                    {rooms.length === 0 ? (
                                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-gray-500">
                                            Data tamu belum tersedia.
                                        </div>
                                    ) : (
                                        rooms.map((room: any, rIdx: number) => {
                                            const paxes =
                                                room.hotel_booking_room_paxes ||
                                                [];
                                            return (
                                                <div
                                                    key={rIdx}
                                                    className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                                                            Room {room.room_no || rIdx + 1} ({room.no_of_adults || 1} Dewasa
                                                            {parseInt(room.no_of_child || '0', 10) > 0 ? `, ${room.no_of_child} Anak` : ''})
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border p-1 border-slate-200 rounded-lg">
                                                            {roomDetails?.cancellation_policy_type || 'Flexi'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {paxes.length === 0 ? (
                                                            <p className="text-xs text-gray-400">
                                                                Tamu Kamar {rIdx + 1}
                                                            </p>
                                                        ) : (
                                                            paxes.map(
                                                                (
                                                                    p: any,
                                                                    pIdx: number,
                                                                ) => (
                                                                    <div
                                                                        key={pIdx}
                                                                        className="flex justify-between items-center text-sm"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-bold text-slate-400">
                                                                                Pax {pIdx + 1}:
                                                                            </span>
                                                                            <span className="font-bold text-slate-700">
                                                                                {p.salutation ? `${p.salutation.trim()} ` : ''}
                                                                                {p.first_name} {p.last_name}
                                                                            </span>
                                                                        </div>
                                                                        {p.age && (
                                                                            <span className="text-xs text-slate-400 font-medium">
                                                                                {p.age} thn
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    <div className="mt-2 pt-4 border-t border-slate-200 flex justify-between items-center">
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                Lead Guest Nationality
                                            </span>
                                            <span className="text-sm font-bold text-slate-700">
                                                {leadGuestNationality}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block absolute left-[58%] top-8 bottom-8 w-px border-l-2 border-dashed border-gray-200"></div>

                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                                <BedDouble size={20} className="text-slate-400" />{' '}
                                Stay Details
                            </h4>

                            <div className="space-y-4">
                                {rooms.map((room: any, idx: number) => {
                                    const roomInfo =
                                        roomDetails[idx];
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300 group-hover:bg-primary transition-colors"></div>
                                            <div className="flex justify-between items-start mb-5 pl-2">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">
                                                        Room {room.room_no || idx + 1}
                                                    </span>
                                                    <h5 className="font-bold text-primary text-base leading-tight">
                                                        {roomInfo?.name || 'Standard Room'}
                                                    </h5>
                                                    <p className="text-xs text-quaternary font-medium mt-1.5 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        {roomInfo?.meal_plan_name || 'Room Only'}
                                                    </p>
                                                </div>
                                                <div className="text-right bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                                    <span className="text-2xl font-black text-primary block leading-none">
                                                        {nights}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mt-1 block">
                                                        Malam
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 ml-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-0.5">
                                                        Check In
                                                    </span>
                                                    <span className="text-sm font-bold text-primary">
                                                        {formatShortDate(checkInDate)}
                                                    </span>
                                                </div>
                                                <div className="w-10 h-px border-t-2 border-dashed border-gray-300"></div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-0.5">
                                                        Check Out
                                                    </span>
                                                    <span className="text-sm font-bold text-primary">
                                                        {formatShortDate(checkOutDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Archive size={14} /> Special Requests
                                </h4>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    {specialRequest}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary hover:bg-primary-bright text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                >
                                    <Printer size={18} />
                                    DOWNLOAD / PRINT ORDER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-[#E2E8F0] overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto">
                <div className="bg-slate-50 text-slate-900 p-10 md:w-1/3 flex flex-col justify-center items-start relative overflow-hidden border-r border-slate-200">
                    <div className="absolute -right-10 -bottom-10 opacity-5">
                        <CreditCard size={180} />
                    </div>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 border border-slate-200 relative z-10 shadow-sm">
                        <CreditCard size={28} className="text-slate-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight mb-3 relative z-10 text-primary">
                        Payment Receipt
                    </h3>
                    <p className="text-slate-500 text-sm mb-10 leading-relaxed relative z-10">
                        Official record of payment for booking{' '}
                        <span className="text-primary font-bold">
                            {rawOrderCode}
                        </span>
                    </p>

                    <div className="w-full space-y-5 relative z-10 bg-white p-5 rounded-2xl border border-slate-200">
                        <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">
                                Payment Method
                            </span>
                            <span className="font-bold text-lg text-primary">
                                {paymentMethod}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                                Status
                            </span>
                            <StatusBadge status={paymentStatus} />
                        </div>
                    </div>
                </div>

                <div className="p-10 md:w-2/3 bg-white flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-quaternary uppercase tracking-widest mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                        <CircleDollarSign size={16} /> Transaction Breakdown
                    </h4>

                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-base text-quaternary font-medium">
                                Total Hotel Price
                            </span>
                            <span className="text-base font-mono font-bold text-primary">
                                {formatRupiah(totalPayment)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base text-quaternary font-medium">
                                Discount
                            </span>
                            <span className="text-base font-mono font-bold text-rose-500">
                                -{formatRupiah(discount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-900">
                            <span className="text-base font-bold text-primary">
                                Total Price
                            </span>
                            <span className="text-2xl font-mono font-black text-primary tracking-tight">
                                {formatRupiah(totalPayment)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <BookReferenceModal
                isOpen={isBookRefModalOpen}
                onClose={() => setIsBookRefModalOpen(false)}
                orderProductAttribute={orderProductAttribute}
                hotelPreview={hotelPreview}
            />

            <FloatingIssuedAction
                order={order}
                orderStatus={orderProductAttribute?.order_status}
                rawOrderCode={rawOrderCode}
                invoiceNumber={invoiceNumber}
                totalPayment={totalPayment}
                totalRooms={totalRooms}
                totalGuests={totalGuests}
                hotelName={hotelName}
            />
        </div>
    );
}
