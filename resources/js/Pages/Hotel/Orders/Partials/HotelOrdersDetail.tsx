import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    ArrowLeft,
    BedDouble,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    ExternalLink,
    Hotel,
    MapPin,
    PhoneCall,
    Printer,
    ShieldAlert,
    User,
    Users
} from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
    switch (status.toUpperCase()) {
        case 'ISSUED':
        case 'PAID':
            return (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    {status}
                </div>
            );
        case 'PENDING':
        case 'UNPAID':
            return (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <AlertCircle size={14} className="text-amber-600" />
                    {status}
                </div>
            );
        default:
            return (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                    {status}
                </div>
            );
    }
};

const DUMMY_ORDER = {
    title: 'Mr.',
    firstName: 'TRI',
    lastName: 'YUDA',
    email: 'xdhaastore1401@gmail.com',
    phone: '+62 083829675022',
    status: 'ISSUED',
    eTicketUrl: '#',
    reasonNeedsTreatment: '-',
    handlingActionsTaken: '-',
    pricing: {
        nta: 219121,
        addonSSR: 0,
        tax: 0,
        discount: 0,
        markupPrice: 9879,
        totalPayment: 229000
    },
    paymentStatus: 'PAID',
    paymentMethod: 'Online Pay',
    voucher: {
        invoiceNumber: 'SGT20260220-6702-0001',
        correctExpiration: '20 February 2026, 13:47',
        orderCode: 'OHV20260220-39-0001',
        orderTime: 'February 20, 2026 01:27',
        roomCountText: 'ROOM',
        guestCountText: '2 Guest',
        bookingDetails: {
            guestName: 'Ms SRI DELIMA',
            bookingId: 'XXX',
            hotelName: 'Seindo Hotel',
            hotelAddress: 'Jl. Gagak Hitam No.50, Sunggal, Kec. Medan Sunggal, Kota Medan, Sumatera Utara 20122, Indonesia, Medan',
            hotelPhone: '622180629666',
            nationality: 'Indonesia',
            bookingStatus: 'ISSUED'
        },
        roomDetails: [
            {
                roomNo: 1,
                checkIn: '20-Feb-26',
                checkOut: '21-Feb-26',
                nights: 1,
                roomName: 'Deluxe Double Room',
                mealType: 'Room Only'
            }
        ],
        guestDetails: [
            {
                roomNo: 1,
                cancellationPolicy: 'NRF',
                guests: [
                    { type: 'Adult(s)', name: 'Ms SRI DELIMA' },
                    { type: 'Adult(s)', name: 'Mr TRI YUDA' }
                ],
                roomName: 'Deluxe Double Room',
                mealType: 'Room Only'
            }
        ],
        specialServiceRequest: '-',
        paymentDetails: [
            { type: 'Total Hotel Price', amount: 229000 },
            { type: 'Special Service Request', amount: 0 },
            { type: 'Total', amount: 229000, isBold: true },
            { type: 'Discount', amount: 0, isBold: true },
            { type: 'Total price', amount: 229000, isBold: true }
        ]
    }
};

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
};

function HotelOrdersDetail() {
    const order = DUMMY_ORDER;
    
  return (
     <div className="">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Order Details</h1>
                        <p className="text-sm text-quaternary mt-1">Please review the complete booking information before proceeding.</p>
                    </div>
                    <Link
                        href={route('hotel.orders.list')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
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
                                    <h2 className="text-lg font-bold text-primary">Customer Order</h2>
                                    <p className="text-[11px] text-quaternary font-medium uppercase tracking-wider">Primary Contact</p>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-quaternary font-medium uppercase tracking-wider">Full Name</p>
                                        <p className="text-base font-bold text-primary">{order.title} {order.firstName} {order.lastName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-quaternary font-medium uppercase tracking-wider">Contact Info</p>
                                        <p className="text-sm font-medium text-primary">{order.email}</p>
                                        <p className="text-sm font-medium text-primary">{order.phone}</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-xs text-quaternary font-medium uppercase tracking-wider">Booking Status</p>
                                        <div><StatusBadge status={order.status} /></div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs text-quaternary font-medium uppercase tracking-wider">E-Ticket</p>
                                        <a href={order.eTicketUrl} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                            View E-Ticket
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <p className="text-xs text-quaternary font-medium uppercase tracking-wider">Needs Treatment Reason</p>
                                        <p className="text-sm font-medium text-primary">{order.reasonNeedsTreatment}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <p className="text-xs text-quaternary font-medium uppercase tracking-wider">Handling Actions Taken</p>
                                        <p className="text-sm font-medium text-primary">{order.handlingActionsTaken}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row items-center gap-3 justify-end mt-auto border-t border-[#E2E8F0]">
                                <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                    See Book Reference
                                </button>
                                <button className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-sm inline-flex items-center justify-center gap-2">
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
                                    <h2 className="text-lg font-bold text-primary">Price & Payment</h2>
                                    <p className="text-[11px] text-quaternary font-medium uppercase tracking-wider">Financial Breakdown</p>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-quaternary font-medium">Net Travel Agent (NTA)</span>
                                    <span className="text-sm font-mono font-semibold text-primary">{formatRupiah(order.pricing.nta)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-quaternary font-medium">Addon SSR</span>
                                    <span className="text-sm font-mono font-semibold text-primary">{formatRupiah(order.pricing.addonSSR)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-quaternary font-medium">Tax</span>
                                    <span className="text-sm font-mono font-semibold text-primary">{formatRupiah(order.pricing.tax)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 pb-4">
                                    <span className="text-sm text-quaternary font-medium">Discount</span>
                                    <span className="text-sm font-mono font-semibold text-rose-500">-{formatRupiah(order.pricing.discount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-bold text-primary">Markup Price</span>
                                    <span className="text-sm font-mono font-bold text-emerald-600">+{formatRupiah(order.pricing.markupPrice)}</span>
                                </div>

                                <div className="mt-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Total Payment</span>
                                        <span className="text-2xl font-bold text-primary tracking-tight">{formatRupiah(order.pricing.totalPayment)}</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <StatusBadge status={order.paymentStatus} />
                                        <p className="text-xs text-slate-500 mt-2 font-medium">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 relative z-0">
                        <div className="absolute -inset-1 bg-gradient-to-b from-gray-200 to-transparent rounded-[2.5rem] blur opacity-30"></div>
                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden relative border border-gray-200">
                            <div className="bg-[#F8FAFC] px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-2 border-dashed border-gray-300 relative">
                                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gray-100 rounded-full border-r-2 border-t-2 border-dashed border-gray-300 transform rotate-45 hidden md:block"></div>
                                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gray-100 rounded-full border-l-2 border-t-2 border-dashed border-gray-300 transform -rotate-45 hidden md:block"></div>

                                <div className="flex items-center gap-2">
                                    <div>
                                        <img className="w-auto h-16 object-contain" src="/assets/images/seindo_logo.png" alt="Logo Seindo Travel" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                                    <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl flex flex-col w-full md:w-auto shadow-sm">
                                        <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-0.5">Invoice Number</span>
                                        <span className="text-lg font-mono font-bold text-primary tracking-tight">{order.voucher.invoiceNumber}</span>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end text-xs text-quaternary font-medium mt-1 gap-1">
                                        <span>Order Time: <span className="font-bold text-primary">{order.voucher.orderTime}</span></span>
                                        <span className="flex items-center gap-1.5 text-rose-500">
                                            <AlertCircle size={14} /> Exp: {order.voucher.correctExpiration}
                                        </span>
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
                                            <h3 className="text-2xl font-extrabold text-primary mb-2 tracking-tight">{order.voucher.bookingDetails.hotelName}</h3>
                                            <div className="flex items-start gap-2 text-quaternary mb-2">
                                                <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                                                <p className="text-sm leading-relaxed font-medium">{order.voucher.bookingDetails.hotelAddress}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-bold bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                                                <PhoneCall size={14} className="text-quaternary" />
                                                <span className="text-sm">{order.voucher.bookingDetails.hotelPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-1">Booking ID</span>
                                            <span className="font-bold text-primary">{order.voucher.bookingDetails.bookingId}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-1">Rooms</span>
                                            <span className="font-bold text-primary">{order.voucher.roomCountText}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                            <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-1">Guests</span>
                                            <span className="font-bold text-primary">{order.voucher.guestCountText}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Code</span>
                                        <span className="font-mono font-bold text-primary text-lg break-all">{order.voucher.orderCode}</span>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                        <div className="absolute right-0 top-0 opacity-5">
                                            <Users size={120} className="text-slate-900 -mt-6 -mr-6" />
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2 relative z-10">
                                            <Users size={16} /> Guest Information
                                        </h4>
                                        <div className="relative z-10 flex flex-col gap-4">
                                            {order.voucher.guestDetails.map((room, rIdx) => (
                                                <div key={rIdx} className="bg-white border border-slate-200 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">Room {room.roomNo}</span>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{room.cancellationPolicy}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {room.guests.map((guest, gIdx) => (
                                                            <div key={gIdx} className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-400 w-16">{guest.type}</span>
                                                                <span className="text-sm font-bold text-slate-700">{guest.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-2 pt-4 border-t border-slate-200 flex justify-between">
                                                <div>
                                                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lead Guest Nationality</span>
                                                    <span className="text-sm font-bold text-slate-700">{order.voucher.bookingDetails.nationality}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block absolute left-[58%] top-8 bottom-8 w-px border-l-2 border-dashed border-gray-200"></div>

                                <div className="lg:col-span-5 flex flex-col gap-6">
                                    <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                                        <BedDouble size={20} className="text-slate-400" /> Stay Details
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        {order.voucher.roomDetails.map((room, idx) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300 group-hover:bg-slate-400 transition-colors"></div>
                                                <div className="flex justify-between items-start mb-5 pl-2">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">Room {room.roomNo}</span>
                                                        <h5 className="font-bold text-primary text-base leading-tight">{room.roomName}</h5>
                                                        <p className="text-xs text-quaternary font-medium mt-1.5 flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-quaternary"></span>
                                                            {room.mealType}
                                                        </p>
                                                    </div>
                                                    <div className="text-right bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                                        <span className="text-2xl font-black text-primary block leading-none">{room.nights}</span>
                                                        <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mt-1 block">Nights</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 ml-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-0.5">Check In</span>
                                                        <span className="text-sm font-bold text-primary">{room.checkIn}</span>
                                                    </div>
                                                    <div className="w-10 h-px border-t-2 border-dashed border-gray-300"></div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider mb-0.5">Check Out</span>
                                                        <span className="text-sm font-bold text-primary">{room.checkOut}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Archive size={14} /> Special Requests
                                        </h4>
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                            {order.voucher.specialServiceRequest === '-' ? 'No special requests' : order.voucher.specialServiceRequest}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-8 flex justify-end">
                                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary hover:bg-primary-bright text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                                            <Printer size={18} />
                                            DOWNLOAD PDF
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-[#E2E8F0] overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto">
                        <div className="bg-slate-50 text-slate-900 p-10 md:w-1/3 flex flex-col justify-center items-start relative overflow-hidden border-r border-slate-200">
                            <div className="absolute -right-10 -bottom-10 opacity-5">
                                <CreditCard size={180} />
                            </div>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 border border-slate-200 relative z-10 shadow-sm">
                                <CreditCard size={28} className="text-slate-400" />
                            </div>
                            <h3 className="text-3xl font-extrabold tracking-tight mb-3 relative z-10 text-primary">Payment Receipt</h3>
                            <p className="text-slate-500 text-sm mb-10 leading-relaxed relative z-10">Official record of payment for booking <span className="text-primary font-bold">{order.voucher.bookingDetails.bookingId}</span></p>
                            
                            <div className="w-full space-y-5 relative z-10 bg-white p-5 rounded-2xl border border-slate-200">
                                <div>
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Payment Method</span>
                                    <span className="font-bold text-lg text-primary">{order.paymentMethod}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Status</span>
                                    <StatusBadge status={order.paymentStatus} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-10 md:w-2/3 bg-white flex flex-col justify-center">
                            <h4 className="text-xs font-bold text-quaternary uppercase tracking-widest mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                                <CircleDollarSign size={16} /> Transaction Breakdown
                            </h4>
                            
                            <div className="space-y-5">
                                {order.voucher.paymentDetails.map((item, idx) => {
                                    const isTotal = item.type.toLowerCase().includes('total price');
                                    return (
                                        <div key={idx} className={`flex justify-between items-center ${isTotal ? 'mt-8 pt-6 border-t-2 border-gray-900' : ''}`}>
                                            <span className={`text-base ${item.isBold ? "font-bold text-primary" : "text-quaternary font-medium"}`}>{item.type}</span>
                                            <span className={`text-base font-mono ${item.isBold ? (isTotal ? "text-2xl font-black text-primary tracking-tight" : "font-bold text-primary") : "text-gray-600 font-medium"}`}>
                                                {item.type.toLowerCase() === 'discount' ? '-' : ''}{formatRupiah(item.amount)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
            </div>
  )
}

export default HotelOrdersDetail