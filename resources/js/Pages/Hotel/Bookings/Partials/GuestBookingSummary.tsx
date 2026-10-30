import PrimaryButton from '@/Components/PrimaryButton';
import {
    BedDouble,
    Building,
    Check,
    Coffee,
    Copy,
    MapPin,
    Moon,
    Shield,
    Star,
    TrendingUp,
} from 'lucide-react';
import React from 'react';

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

const formatDateIndo = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(d);
    } catch {
        return dateStr;
    }
};

export interface GuestBookingSummaryProps {
    hotelName: string;
    hotelRating: number;
    thumbnail?: string;
    address?: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    roomName: string;
    mealPlanName: string;
    isRefundable: boolean;
    currency: string;
    sellingPrice: number;
    ntaPrice: number;
    markup: number;
    copiedPrice: boolean;
    onCopyPrice: (e?: React.MouseEvent) => void;
    onProceed: () => void;
    isProceedDisabled?: boolean;
}

export default function GuestBookingSummary({
    hotelName,
    hotelRating,
    thumbnail,
    address,
    checkInDate,
    checkOutDate,
    nights,
    roomName,
    mealPlanName,
    isRefundable,
    currency,
    sellingPrice,
    ntaPrice,
    markup,
    copiedPrice,
    onCopyPrice,
    onProceed,
    isProceedDisabled = false,
}: GuestBookingSummaryProps) {
    return (
        <div className="lg:sticky lg:top-24 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={hotelName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Building size={48} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: hotelRating }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className="fill-amber-400 text-amber-400"
                                />
                            ))}
                        </div>
                        <h3 className="text-sm font-bold leading-tight line-clamp-1 drop-shadow-sm">
                            {hotelName}
                        </h3>
                    </div>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                        <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                            {address || 'Indonesia'}
                        </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="border-r border-slate-200/80 pr-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Check-In
                            </span>
                            <span className="font-bold text-slate-800 block mt-0.5">
                                {formatDateIndo(checkInDate)}
                            </span>
                            <span className="text-[11px] text-slate-500">From 14:00</span>
                        </div>
                        <div className="pl-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Check-Out
                            </span>
                            <span className="font-bold text-slate-800 block mt-0.5">
                                {formatDateIndo(checkOutDate)}
                            </span>
                            <span className="text-[11px] text-slate-500">Before 12:00</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Moon size={13} className="text-primary" />
                            Duration: <strong>{nights} Night</strong>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BedDouble size={13} className="text-primary" />
                            <strong>1 Room</strong>
                        </span>
                    </div>

                    <hr className="border-slate-100" />

                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                            Selected Room Type
                        </span>
                        <p className="text-sm font-bold text-primary leading-snug">
                            {roomName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                                <Coffee size={11} />
                                {mealPlanName}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                {isRefundable ? 'Refundable' : 'Non-Refundable'}
                            </span>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Net Price</span>
                            <span className="font-semibold text-slate-700">
                                {currency} {formatRupiah(ntaPrice)}
                            </span>
                        </div>

                        {markup > 0 && (
                            <div className="flex items-center justify-between text-xs text-emerald-700">
                                <span className="flex items-center gap-1 font-medium">
                                    <TrendingUp size={11} />
                                    Markup / Profit
                                </span>
                                <span className="font-bold">
                                    +{currency} {formatRupiah(markup)}
                                </span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <div>
                                <span className="text-xs font-bold text-slate-700 block">
                                    Total Payment
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    Tax & Fee Included
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-black text-primary">
                                    {currency} {formatRupiah(sellingPrice)}
                                </span>
                                <button
                                    type="button"
                                    onClick={onCopyPrice}
                                    title={copiedPrice ? 'Tersalin!' : 'Salin total harga'}
                                    className={`p-1 rounded-md border transition-all cursor-pointer ${
                                        copiedPrice
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-primary hover:bg-slate-100'
                                    }`}
                                >
                                    {copiedPrice ? (
                                        <Check size={12} className="text-emerald-600 stroke-[2.5]" />
                                    ) : (
                                        <Copy size={12} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <PrimaryButton
                        type="button"
                        onClick={onProceed}
                        disabled={isProceedDisabled}
                        className={`w-full justify-center py-3 px-4 text-sm font-bold shadow-md hover:shadow-lg mt-2 ${
                            isProceedDisabled
                                ? 'cursor-not-allowed opacity-50 bg-slate-300 hover:bg-slate-300 text-slate-600'
                                : 'cursor-pointer'
                        }`}
                    >
                        Continue to Booking
                    </PrimaryButton>

                    {isProceedDisabled && (
                        <p className="text-[11px] text-amber-600 text-center font-medium">
                            Pilih Customer terlebih dahulu untuk melanjutkan
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
                        <Shield size={12} className="text-emerald-600" />
                        <span>Instant Booking & Secure Payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
