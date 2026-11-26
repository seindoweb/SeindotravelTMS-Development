import OrderStatusBadge from '@/Components/OrderStatusBadge';
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
    Star,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import BookReferenceModal from './BookReferenceModal';
import FloatingIssuedAction from './FloatingIssuedAction';

export interface HotelOrderDetailProps {
    orderProductAttribute?: any;
    hotelPreview?: any;
}

const StatusBadge = ({ status }: { status?: string }) => {
    return <OrderStatusBadge status={status} size="lg" />;
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
    const [isBookRefModalOpen, setIsBookRefModalOpen] =
        useState<boolean>(false);

    const order = orderProductAttribute?.order;
    const customer = order?.user;
    const testing = orderProductAttribute;
    const hotelBooking = testing?.hotel_booking;
    const roomDetails = hotelBooking?.hotel_booking_room_details || [];
    const rooms = hotelBooking?.hotel_booking_rooms || [];

    const referenceId = orderProductAttribute?.reference_id ?? '-';
    const rawOrderCode =
        orderProductAttribute?.code || order?.invoice_number || '-';
       console.log('woiiiiii:', rawOrderCode);
    const invoiceNumber = order?.invoice_number || '-';
    const orderStatus = orderProductAttribute?.order_status || 'B';
    const paymentStatus = order?.payment_status || 'unpaid';
    const paymentMethod = formatPaymentMethod(order?.type_of_payment);

    const previewResults = hotelPreview?.results;
    const hotelName =
        previewResults?.name || hotelBooking?.hotel_booking_details?.name;

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

    const hotelPhone =
        previewResults?.phone ||
        locationObj?.phone ||
        customer?.phone_number ||
        '-';

    const tax = parseFloat(order?.tax_amount) || 0;
    const discount = parseFloat(order?.discount_amount) || 0;
    const totalPayment = parseFloat(order?.total_amount);
    const nta = parseFloat(roomDetails?.[0].nta_price);
    const markups = parseFloat(roomDetails?.[0].markup_price);

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
        hotelBooking?.special_requests || 'No special requests';

    const leadGuestNationality =
        hotelBooking?.pic_guest_nationality || customer?.nationality || 'ID';

    return (
        <>
            <div className="space-y-8">
                <div className="gap-4 sm:flex-row sm:items-center flex flex-col items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                            Order Details
                        </h1>
                        <p className="mt-1 text-sm text-quaternary">
                            Please review the complete booking information
                            before proceeding.
                        </p>
                    </div>
                    <Link
                        href={route('hotel.orders.list')}
                        className="gap-2 px-5 py-2.5 bg-white border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md inline-flex cursor-pointer items-center border transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to Orders
                    </Link>
                </div>

                <div className="gap-6 xl:grid-cols-2 relative z-10 grid grid-cols-1">
                    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md group relative flex flex-col overflow-hidden border border-[#E2E8F0] transition-shadow">
                        <div className="top-0 left-0 h-1 bg-primary absolute w-full"></div>
                        <div className="px-6 py-5 gap-4 flex items-center border-b border-[#F1F5F9]">
                            <div className="w-10 h-10 bg-slate-100 text-slate-600 flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                <User size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-primary">
                                    Customer Order
                                </h2>
                                <p className="text-quaternary font-medium tracking-wider text-[11px] uppercase">
                                    Primary Contact
                                </p>
                            </div>
                        </div>

                        <div className="gap-6 p-6 flex flex-1 flex-col">
                            <div className="gap-6 sm:grid-cols-2 grid grid-cols-1">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium tracking-wider text-quaternary uppercase">
                                        Full Name
                                    </p>
                                    <p className="text-base font-bold text-primary">
                                        {customer?.title
                                            ? `${customer.title} `
                                            : ''}
                                        {customer?.full_name ||
                                            'Guest Customer'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium tracking-wider text-quaternary uppercase">
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

                            <div className="via-gray-200 h-px w-full bg-gradient-to-r from-transparent to-transparent"></div>

                            <div className="gap-6 sm:grid-cols-2 grid grid-cols-1">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium tracking-wider text-quaternary uppercase">
                                        Booking Status
                                    </p>
                                    <div>
                                        <StatusBadge status={orderStatus} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-medium tracking-wider text-quaternary uppercase">
                                        Invoice Number
                                    </p>
                                    <p className="font-mono text-sm font-bold text-primary break-all">
                                        {invoiceNumber}
                                    </p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs font-medium tracking-wider text-quaternary uppercase">
                                        Created By Admin
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                        {order?.creator?.full_name ||
                                            'Customer / System'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 sm:flex-row gap-3 mt-auto flex flex-col items-center justify-end border-t border-[#E2E8F0]">
                            {['C', 'D'].includes(orderStatus?.toUpperCase() ?? '') && (
                                <button
                                    type="button"
                                    onClick={() => setIsBookRefModalOpen(true)}
                                    className="sm:w-auto px-5 py-2.5 bg-white border-gray-300 hover:border-emerald-500 rounded-xl text-sm font-bold text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-xs gap-2 inline-flex w-full cursor-pointer items-center justify-center border transition-all active:scale-98"
                                >
                                    See Book Reference
                                </button>
                            )}
                            <button
                                type="button"
                                className="sm:w-auto px-5 py-2.5 bg-rose-50 border-rose-200 rounded-xl text-sm font-bold text-rose-700 hover:bg-rose-100 shadow-sm gap-2 inline-flex w-full cursor-pointer items-center justify-center border transition-colors"
                            >
                                <ShieldAlert size={16} />
                                Take Countermeasures
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md group relative flex flex-col overflow-hidden border border-[#E2E8F0] transition-shadow">
                        <div className="top-0 left-0 h-1 bg-primary absolute w-full"></div>
                        <div className="px-6 py-5 gap-4 flex items-center border-b border-[#F1F5F9]">
                            <div className="w-10 h-10 bg-slate-100 text-slate-600 flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                <CircleDollarSign size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-primary">
                                    Price & Payment
                                </h2>
                                <p className="text-quaternary font-medium tracking-wider text-[11px] uppercase">
                                    Financial Breakdown
                                </p>
                            </div>
                        </div>

                        <div className="gap-4 p-6 flex flex-1 flex-col">
                            <div className="py-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-quaternary">
                                    Net Travel Agent (NTA) test
                                </span>
                                <span className="font-mono text-sm font-semibold text-primary">
                                    {formatRupiah(nta)}
                                </span>
                            </div>
                            <div className="py-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-quaternary">
                                    Tax
                                </span>
                                <span className="font-mono text-sm font-semibold text-primary">
                                    {formatRupiah(tax)}
                                </span>
                            </div>
                            <div className="py-2 pb-4 border-gray-200 flex items-center justify-between border-b border-dashed">
                                <span className="text-sm font-medium text-quaternary">
                                    Discount
                                </span>
                                <span className="font-mono text-sm font-semibold text-rose-500">
                                    -{formatRupiah(discount)}
                                </span>
                            </div>
                            <div className="py-2 flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">
                                    Markup Price
                                </span>
                                <span className="font-mono text-sm font-bold text-emerald-600">
                                    +{formatRupiah(markups)}
                                </span>
                            </div>

                            <div className="p-5 mt-4 bg-slate-50 border-slate-200 rounded-2xl flex items-center justify-between border">
                                <div>
                                    <span className="mb-1 text-xs font-medium tracking-wider text-slate-500 block uppercase">
                                        Total Payment
                                    </span>
                                    <span className="text-2xl font-bold tracking-tight text-primary">
                                        {formatRupiah(totalPayment)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end text-right">
                                    <StatusBadge status={paymentStatus} />
                                    <p className="mt-2 mr-3 text-xs font-medium text-slate-500">
                                        {paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-0">
                    <div className="-inset-1 from-gray-200 blur absolute rounded-[2.5rem] bg-gradient-to-b to-transparent opacity-30"></div>
                    <div className="bg-white shadow-sm border-gray-200 relative overflow-hidden rounded-[2rem] border">
                        <div className="px-8 py-8 md:flex-row md:items-center gap-6 border-gray-300 relative flex flex-col items-start justify-between border-b-2 border-dashed bg-[#F8FAFC]">
                            <div className="w-8 h-8 bg-gray-100 border-gray-300 -bottom-4 -left-4 md:block absolute hidden rotate-45 transform rounded-full border-t-2 border-r-2 border-dashed"></div>
                            <div className="w-8 h-8 bg-gray-100 border-gray-300 -bottom-4 -right-4 md:block absolute hidden -rotate-45 transform rounded-full border-t-2 border-l-2 border-dashed"></div>

                            <div className="gap-2 flex items-center">
                                <div>
                                    <img
                                        className="h-14 w-auto object-contain"
                                        src="/assets/images/seindo-logo.png"
                                        alt="Logo Seindo Travel"
                                        onError={(e) => {
                                            (
                                                e.target as HTMLElement
                                            ).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="gap-2 md:items-end md:w-auto flex w-full flex-col items-start">
                                <div className="px-5 py-3 bg-white border-gray-200 shadow-sm rounded-xl md:w-auto flex w-full flex-col border">
                                    <span className="font-bold text-quaternary tracking-wider mb-0.5 text-[10px] uppercase">
                                        Order Code
                                    </span>
                                    <span className="font-mono text-lg font-bold tracking-tight text-primary">
                                        {rawOrderCode}
                                    </span>
                                </div>
                                <div className="gap-1 mt-1 text-xs font-medium md:items-end text-quaternary flex flex-col items-start">
                                    <span>
                                        Order Time:{' '}
                                        <span className="font-bold text-primary">
                                            {formatFullDate(order?.created_at)}
                                        </span>
                                    </span>
                                    {order?.expired_at && (
                                        <span className="gap-1.5 text-rose-500 flex items-center">
                                            <AlertCircle size={14} /> Exp:{' '}
                                            {formatFullDate(order.expired_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="gap-10 p-8 lg:p-10 lg:grid-cols-12 relative grid grid-cols-1">
                            <div className="gap-8 lg:col-span-7 flex flex-col">
                                <div className="gap-4 flex items-start">
                                    <div className="shadow-sm w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 border-slate-200 flex shrink-0 items-center justify-center border">
                                        <Hotel size={26} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-primary">
                                            {hotelName}
                                        </h3>
                                        <div className="gap-2 mb-2 text-quaternary flex items-start">
                                            <MapPin
                                                size={16}
                                                className="mt-0.5 text-slate-400 shrink-0"
                                            />
                                            <p className="text-sm font-medium leading-relaxed">
                                                {hotelAddress}
                                            </p>
                                        </div>
                                        <div className="gap-2 text-primary font-bold bg-gray-50 px-3 py-1.5 rounded-lg flex w-fit items-center">
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

                                <div className="gap-4 grid grid-cols-2">
                                    <div className="p-4 bg-white border-gray-200 shadow-sm rounded-2xl col-span-2 flex flex-col items-center justify-center border text-center">
                                        <span className="font-bold text-quaternary tracking-wider mb-1 text-[10px] uppercase">
                                            Reference ID
                                        </span>
                                        <span
                                            className="font-mono text-xs font-bold text-primary"
                                            title={referenceId}
                                        >
                                            {referenceId}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-white border-gray-200 shadow-sm rounded-2xl flex flex-col items-center justify-center border text-center">
                                        <span className="font-bold text-quaternary tracking-wider mb-1 text-[10px] uppercase">
                                            Rooms
                                        </span>
                                        <span className="font-bold text-primary">
                                            {totalRooms} Kamar
                                        </span>
                                    </div>
                                    <div className="p-4 bg-white border-gray-200 shadow-sm rounded-2xl flex flex-col items-center justify-center border text-center">
                                        <span className="font-bold text-quaternary tracking-wider mb-1 text-[10px] uppercase">
                                            Guests
                                        </span>
                                        <span className="font-bold text-primary">
                                            {totalGuests} Tamu
                                        </span>
                                    </div>
                                </div>

                                <div className="gap-3 p-5 shadow-sm bg-slate-50 rounded-2xl border-slate-200 sm:flex-row sm:items-center flex flex-col items-start justify-between border">
                                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                                        Order Code
                                    </span>
                                    <span className="font-mono text-lg font-bold text-primary break-all">
                                        {rawOrderCode}
                                    </span>
                                </div>

                                <div className="p-6 shadow-sm bg-slate-50 border-slate-200 rounded-2xl relative overflow-hidden border">
                                    <div className="top-0 right-0 absolute opacity-5">
                                        <Users
                                            size={120}
                                            className="-mt-6 -mr-6 text-slate-900"
                                        />
                                    </div>
                                    <h4 className="gap-2 mb-5 text-xs font-bold tracking-wider text-slate-700 relative z-10 flex items-center uppercase">
                                        <Users size={16} /> Guest Information
                                    </h4>
                                    <div className="gap-4 relative z-10 flex flex-col">
                                        {rooms.length === 0 ? (
                                            <div className="p-4 text-xs text-gray-500 bg-white border-slate-200 rounded-xl border">
                                                Data tamu belum tersedia.
                                            </div>
                                        ) : (
                                            rooms.map(
                                                (room: any, rIdx: number) => {
                                                    const paxes =
                                                        room.hotel_booking_room_paxes ||
                                                        [];
                                                    return (
                                                        <div
                                                            key={rIdx}
                                                            className="p-4 space-y-3 bg-white border-slate-200 rounded-xl border"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="px-2 py-1 text-xs font-bold rounded-md text-slate-700 bg-slate-100">
                                                                    Room{' '}
                                                                    {room.room_no ||
                                                                        rIdx +
                                                                            1}{' '}
                                                                    (
                                                                    {room.no_of_adults ||
                                                                        1}{' '}
                                                                    Dewasa
                                                                    {parseInt(
                                                                        room.no_of_child ||
                                                                            '0',
                                                                        10,
                                                                    ) > 0
                                                                        ? `, ${room.no_of_child} Anak`
                                                                        : ''}
                                                                    )
                                                                </span>
                                                                <span className="font-bold text-slate-500 tracking-wider p-1 border-slate-200 rounded-lg border text-[10px] uppercase">
                                                                    {roomDetails?.cancellation_policy_type ||
                                                                        'Flexi'}
                                                                </span>
                                                            </div>
                                                            <div className="gap-2 flex flex-col">
                                                                {paxes.length ===
                                                                0 ? (
                                                                    <p className="text-xs text-gray-400">
                                                                        Tamu
                                                                        Kamar{' '}
                                                                        {rIdx +
                                                                            1}
                                                                    </p>
                                                                ) : (
                                                                    paxes.map(
                                                                        (
                                                                            p: any,
                                                                            pIdx: number,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    pIdx
                                                                                }
                                                                                className="text-sm flex items-center justify-between"
                                                                            >
                                                                                <div className="gap-2 flex items-center">
                                                                                    <span className="text-xs font-bold text-slate-400">
                                                                                        Pax{' '}
                                                                                        {pIdx +
                                                                                            1}

                                                                                        :
                                                                                    </span>
                                                                                    <span className="font-bold text-slate-700">
                                                                                        {p.salutation
                                                                                            ? `${p.salutation.trim()} `
                                                                                            : ''}
                                                                                        {
                                                                                            p.first_name
                                                                                        }{' '}
                                                                                        {
                                                                                            p.last_name
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                {p.age && (
                                                                                    <span className="text-xs font-medium text-slate-400">
                                                                                        {
                                                                                            p.age
                                                                                        }{' '}
                                                                                        thn
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ),
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )
                                        )}

                                        <div className="pt-4 mt-2 border-slate-200 flex items-center justify-between border-t">
                                            <div>
                                                <span className="font-bold text-slate-500 tracking-wider mb-1 block text-[10px] uppercase">
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

                            <div className="lg:block top-8 bottom-8 border-gray-200 absolute left-[58%] hidden w-px border-l-2 border-dashed"></div>

                            <div className="gap-6 lg:col-span-5 flex flex-col">
                                <h4 className="gap-2 text-lg font-bold text-primary flex items-center">
                                    <BedDouble
                                        size={20}
                                        className="text-slate-400"
                                    />{' '}
                                    Stay Details
                                </h4>

                                <div className="space-y-4">
                                    {rooms.map((room: any, idx: number) => {
                                        const roomInfo = roomDetails[idx];
                                        return (
                                            <div
                                                key={idx}
                                                className="p-5 bg-white border-gray-200 shadow-sm rounded-2xl hover:shadow-md group relative overflow-hidden border transition-shadow"
                                            >
                                                <div className="top-0 left-0 w-1.5 bg-slate-300 group-hover:bg-primary absolute h-full transition-colors"></div>
                                                <div className="pl-2 mb-5 flex items-start justify-between">
                                                    <div>
                                                        <span className="font-bold text-slate-600 bg-slate-100 border-slate-200 px-2 py-1 rounded-md mb-2 tracking-wider inline-block border text-[10px] uppercase">
                                                            Room{' '}
                                                            {room.room_no ||
                                                                idx + 1}
                                                        </span>
                                                        <h5 className="text-base font-bold leading-tight text-primary">
                                                            {roomInfo?.name ||
                                                                'Standard Room'}
                                                        </h5>
                                                        <p className="text-xs text-quaternary font-medium mt-1.5 gap-1.5 flex items-center">
                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                            {roomInfo?.meal_plan_name ||
                                                                'Room Only'}
                                                        </p>
                                                    </div>
                                                    <div className="px-3 py-2 border-gray-100 bg-gray-50 rounded-xl border text-right">
                                                        <span className="text-2xl font-black text-primary block leading-none">
                                                            {nights}
                                                        </span>
                                                        <span className="font-bold text-quaternary tracking-wider mt-1 block text-[10px] uppercase">
                                                            Malam
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl p-4 ml-2 flex items-center justify-between border border-[#E2E8F0] bg-[#F8FAFC]">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-quaternary tracking-wider mb-0.5 text-[10px] uppercase">
                                                            Check In
                                                        </span>
                                                        <span className="text-sm font-bold text-primary">
                                                            {formatShortDate(
                                                                checkInDate,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="w-10 border-gray-300 h-px border-t-2 border-dashed"></div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="font-bold text-quaternary tracking-wider mb-0.5 text-[10px] uppercase">
                                                            Check Out
                                                        </span>
                                                        <span className="text-sm font-bold text-primary">
                                                            {formatShortDate(
                                                                checkOutDate,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="p-5 shadow-sm bg-slate-50 border-slate-200 rounded-2xl border">
                                    <h4 className="gap-2 mb-2 text-xs font-bold tracking-wider text-slate-700 flex items-center uppercase">
                                        <Archive size={14} /> Special Requests
                                    </h4>
                                    <p className="text-sm font-medium leading-relaxed text-slate-600">
                                        {specialRequest}
                                    </p>
                                </div>

                                <div className="pt-6 mt-auto flex justify-end">
                                    <a
                                        href={route(
                                            'hotel.orders.orderPreviewPdf',
                                            (rawOrderCode || '').replace(
                                                /\//g,
                                                '-',
                                            ),
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sm:w-auto gap-2.5 px-6 py-3.5 bg-primary hover:bg-primary-bright text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg inline-flex w-full cursor-pointer items-center justify-center transition-all active:scale-[0.98]"
                                    >
                                        <Printer size={18} />
                                        DOWNLOAD / PRINT ORDER
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm hover:shadow-md md:flex-row mx-auto flex flex-col overflow-hidden rounded-[2rem] border border-[#E2E8F0] transition-shadow">
                    <div className="p-10 bg-slate-50 text-slate-900 md:w-1/3 border-slate-200 relative flex flex-col items-start justify-center overflow-hidden border-r">
                        <div className="-right-10 -bottom-10 absolute opacity-5">
                            <CreditCard size={180} />
                        </div>
                        <div className="mb-8 bg-white shadow-sm w-14 h-14 rounded-2xl border-slate-200 relative z-10 flex items-center justify-center border">
                            <CreditCard size={28} className="text-slate-400" />
                        </div>
                        <h3 className="mb-3 text-3xl font-extrabold tracking-tight text-primary relative z-10">
                            Payment Receipt
                        </h3>
                        <p className="mb-10 text-sm leading-relaxed text-slate-500 relative z-10">
                            Official record of payment for booking{' '}
                            <span className="font-bold text-primary">
                                {rawOrderCode}
                            </span>
                        </p>

                        <div className="p-5 space-y-5 bg-white rounded-2xl border-slate-200 relative z-10 w-full border">
                            <div>
                                <span className="text-slate-400 font-bold tracking-widest mb-1.5 block text-[10px] uppercase">
                                    Payment Method
                                </span>
                                <span className="text-lg font-bold text-primary">
                                    {paymentMethod}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold tracking-widest mb-2 block text-[10px] uppercase">
                                    Status
                                </span>
                                <StatusBadge status={paymentStatus} />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white md:w-2/3 flex flex-col justify-center">
                        <h4 className="gap-2 pb-4 mb-6 text-xs font-bold tracking-widest border-gray-100 text-quaternary flex items-center border-b uppercase">
                            <CircleDollarSign size={16} /> Transaction Breakdown
                        </h4>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-quaternary">
                                    Total Hotel Price
                                </span>
                                <span className="font-mono text-base font-bold text-primary">
                                    {formatRupiah(totalPayment)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-quaternary">
                                    Discount
                                </span>
                                <span className="font-mono text-base font-bold text-rose-500">
                                    -{formatRupiah(discount)}
                                </span>
                            </div>
                            <div className="pt-6 mt-8 border-gray-900 flex items-center justify-between border-t-2">
                                <span className="text-base font-bold text-primary">
                                    Total Price
                                </span>
                                <span className="font-mono text-2xl font-black tracking-tight text-primary">
                                    {formatRupiah(totalPayment)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BookReferenceModal
                isOpen={isBookRefModalOpen}
                onClose={() => setIsBookRefModalOpen(false)}
                orderProductAttribute={orderProductAttribute}
                hotelPreview={hotelPreview}
                orderCode={rawOrderCode}
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
        </>
    );
}
