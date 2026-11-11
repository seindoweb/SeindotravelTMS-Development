import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    Printer,
    Ticket,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface FloatingIssuedActionProps {
    order?: any;
    orderStatus?: string;
    rawOrderCode: string;
    invoiceNumber: string;
    totalPayment: number;
    totalRooms: number;
    totalGuests: number;
    hotelName: string;
}

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

const FloatingIssuedAction: React.FC<FloatingIssuedActionProps> = React.memo(
    ({
        order,
        orderStatus,
        rawOrderCode,
        invoiceNumber,
        totalPayment,
        totalRooms,
        totalGuests,
        hotelName,
    }) => {
        const initialIsIssued =
            (orderStatus &&
                ['C', 'D', 'I'].includes(orderStatus.toUpperCase())) ||
            false;

        const [isIssued, setIsIssued] = useState<boolean>(initialIsIssued);
        const [selectedPaymentStatus, setSelectedPaymentStatus] =
            useState<string>(
                initialIsIssued ||
                    (order?.payment_status || 'unpaid').toLowerCase() === 'paid'
                    ? 'paid'
                    : 'unpaid',
            );
        const [isFloatingMinimized, setIsFloatingMinimized] =
            useState<boolean>(true);
        const [isConfirmModalOpen, setIsConfirmModalOpen] =
            useState<boolean>(false);
        const [isIssuedSuccess, setIsIssuedSuccess] = useState<boolean>(false);
        const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

        const handleIssueVoucher = () => {
            setIsConfirmModalOpen(false);
            setIsSubmitting(true);
            setIsIssued(true);
            setSelectedPaymentStatus('paid');
            setIsIssuedSuccess(true);

            const safeCode = (rawOrderCode || '').replace(/\//g, '-');
            router.visit(route('hotel.orders.orderIssued', safeCode), {
                method: 'post',
                data: {
                    payment_status: 'paid',
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        };

        const calculateTimeRemaining = () => {
            if (!order?.expired_at) {
                return {
                    totalSeconds: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    formatted: '00:00:00',
                    isExpired: true,
                };
            }
            let expiredTimestamp = new Date(order.expired_at).getTime();
            const now = new Date().getTime();
            const diff = Math.max(
                0,
                Math.floor((expiredTimestamp - now) / 1000),
            );

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            return {
                totalSeconds: diff,
                hours,
                minutes,
                seconds,
                formatted,
                isExpired: diff <= 0,
            };
        };

        const [countdown, setCountdown] = useState(calculateTimeRemaining());

        useEffect(() => {
            if (isIssued) {
                return;
            }
            const initial = calculateTimeRemaining();
            setCountdown(initial);
            if (initial.isExpired) {
                return; 
            }
            const timer = setInterval(() => {
                const next = calculateTimeRemaining();
                setCountdown(next);
                if (next.isExpired) {
                    clearInterval(timer);
                }
            }, 1000);
            return () => clearInterval(timer);
        }, [order?.expired_at, isIssued]);

        const handleEnableDemoTimer = () => {
            if (!order?.expired_at) return;
            const now = new Date().getTime();
            const expiredTimestamp = new Date(order.expired_at).getTime();
            const diffMinutes = Math.max(
                0,
                Math.ceil((now - expiredTimestamp) / 60000),
            );
        };

        const isPaid = selectedPaymentStatus === 'paid';
        const canIssue = isPaid && !countdown.isExpired && !isIssued;

        return (
            <>
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
                    <div
                        className={`w-[370px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl border border-slate-200 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25),0_0_0_1px_rgba(15,23,42,0.06)] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-right ${
                            !isFloatingMinimized
                                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible'
                                : 'opacity-0 translate-y-8 scale-95 pointer-events-none invisible absolute bottom-0 right-0'
                        }`}
                    >
                        <div className="px-5 py-4 bg-emerald-600 text-white flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-white/15 text-white border border-white/20 flex items-center justify-center shadow-xs">
                                    {isIssued ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <Ticket size={18} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-white leading-tight">
                                        {isIssued
                                            ? 'Voucher Diterbitkan'
                                            : 'Issued Hotel Action'}
                                    </h4>
                                    <p className="text-[11px] text-emerald-100 font-medium">
                                        Invoice:{' '}
                                        <span className="font-mono font-bold text-white">
                                            {invoiceNumber}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFloatingMinimized(true)}
                                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                                title="Minimize"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 bg-white">
                            {isIssued ? (
                                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 space-y-2.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                                                Voucher Resmi Telah Terbit
                                            </h5>
                                            <p className="text-[11px] text-emerald-700 font-medium leading-tight">
                                                Pemesanan hotel terkonfirmasi
                                                resmi ke supplier.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/90 rounded-xl p-2.5 border border-emerald-100 space-y-1.5 text-[11px]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">
                                                Status Reservasi
                                            </span>
                                            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                                                CONFIRMED
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">
                                                Status Pembayaran
                                            </span>
                                            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                                                PAID (Lunas)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`p-4 rounded-2xl border transition-all ${
                                        countdown.isExpired
                                            ? 'bg-rose-50 border-rose-200'
                                            : countdown.totalSeconds < 300
                                              ? 'bg-amber-50 border-amber-300 animate-pulse'
                                              : 'bg-slate-50 border-slate-200/80'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[11px] font-bold text-quaternary uppercase tracking-wider flex items-center gap-1.5">
                                            <Clock
                                                size={13}
                                                className={
                                                    countdown.isExpired
                                                        ? 'text-rose-500'
                                                        : 'text-slate-500'
                                                }
                                            />
                                            Batas Waktu (Time Limit)
                                        </span>
                                        <span
                                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                                countdown.isExpired
                                                    ? 'bg-rose-100 text-rose-700'
                                                    : countdown.totalSeconds <
                                                        300
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-emerald-100 text-emerald-700'
                                            }`}
                                        >
                                            {countdown.isExpired
                                                ? 'Expired'
                                                : 'Active'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 py-1">
                                        {countdown.isExpired ? (
                                            <div className="flex flex-col items-center py-1">
                                                <span className="font-mono text-xl font-black text-rose-600 tracking-wider">
                                                    00 : 00 : 00
                                                </span>
                                                <p className="text-[11px] text-rose-500 font-semibold mt-1">
                                                    Waktu booking telah berakhir
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col items-center bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs min-w-[42px]">
                                                    <span className="font-mono text-lg font-black text-primary leading-none">
                                                        {String(
                                                            countdown.hours,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-quaternary uppercase mt-0.5">
                                                        Jam
                                                    </span>
                                                </div>
                                                <span className="font-mono font-bold text-slate-300 text-base -mt-2">
                                                    :
                                                </span>
                                                <div className="flex flex-col items-center bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs min-w-[42px]">
                                                    <span className="font-mono text-lg font-black text-primary leading-none">
                                                        {String(
                                                            countdown.minutes,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-quaternary uppercase mt-0.5">
                                                        Menit
                                                    </span>
                                                </div>
                                                <span className="font-mono font-bold text-slate-300 text-base -mt-2">
                                                    :
                                                </span>
                                                <div className="flex flex-col items-center bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs min-w-[42px]">
                                                    <span className="font-mono text-lg font-black text-emerald-600 leading-none">
                                                        {String(
                                                            countdown.seconds,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-quaternary uppercase mt-0.5">
                                                        Detik
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isIssued ? (
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                        Status Pembayaran
                                    </label>
                                    <div className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                            <Check
                                                size={14}
                                                className="stroke-[3] text-emerald-600"
                                            />
                                            PAID (Sudah Lunas)
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                                            Terkunci
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Status pembayaran terkunci otomatis
                                        karena voucher sudah diterbitkan.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                        Status Pembayaran (Select)
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedPaymentStatus}
                                            onChange={(e) =>
                                                setSelectedPaymentStatus(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-primary shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer appearance-none pr-9"
                                        >
                                            <option value="unpaid">
                                                🟠 Waiting Payment (Belum Lunas)
                                            </option>
                                            <option value="paid">
                                                🟢 Paid (Sudah Lunas)
                                            </option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                        {isPaid ? (
                                            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                                <Check
                                                    size={13}
                                                    className="text-emerald-600 stroke-[3]"
                                                />
                                                Pembayaran terverifikasi. Tombol
                                                Issued aktif.
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                                                <AlertCircle
                                                    size={13}
                                                    className="text-amber-500"
                                                />
                                                Ubah ke "Paid" untuk memproses
                                                issued.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider">
                                        Total Tagihan
                                    </span>
                                    <span className="text-sm font-mono font-bold text-primary">
                                        {formatRupiah(totalPayment)}
                                    </span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-quaternary uppercase tracking-wider">
                                        Alokasi
                                    </span>
                                    <span className="text-xs font-bold text-quaternary">
                                        {totalRooms} Room • {totalGuests} Pax
                                    </span>
                                </div>
                            </div>

                            <div className="pt-1">
                                {isIssued ? (
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
                                        >
                                            <Printer size={16} />
                                            CETAK / DOWNLOAD VOUCHER
                                        </button>
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                                <CheckCircle2 size={13} />
                                                Voucher Siap Digunakan
                                            </span>
                                        </div>
                                    </div>
                                ) : canIssue ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsConfirmModalOpen(true)
                                        }
                                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
                                    >
                                        ISSUE HOTEL SEKARANG
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-sm font-bold cursor-not-allowed opacity-80"
                                    >
                                        {countdown.isExpired
                                            ? 'WAKTU EXPIRED'
                                            : 'MENUNGGU PEMBAYARAN'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsFloatingMinimized(false)}
                        className={`group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-full shadow-[0_12px_28px_rgba(5,150,105,0.35),0_0_0_1px_rgba(5,150,105,0.2)] hover:shadow-[0_18px_36px_rgba(5,150,105,0.45)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform cursor-pointer hover:scale-105 origin-bottom-right ${
                            isFloatingMinimized
                                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible'
                                : 'opacity-0 translate-y-4 scale-90 pointer-events-none invisible absolute bottom-0 right-0'
                        }`}
                        title="Klik untuk membuka Issued Action"
                    >
                        {isIssued ? (
                            <>
                                <div className="flex items-center gap-2 font-bold text-xs tracking-wide">
                                    <span className="flex h-5 w-5 rounded-full bg-white/20 items-center justify-center text-white">
                                        <CheckCircle2
                                            size={13}
                                            className="text-white"
                                        />
                                    </span>
                                    <span>Voucher Hotel Issued</span>
                                </div>
                                <div className="h-4 w-px bg-white/20" />
                                <div className="flex items-center gap-1.5 font-bold text-xs text-white bg-white/20 px-2.5 py-1 rounded-full">
                                    <span>CONFIRMED</span>
                                </div>
                                <ChevronUp
                                    size={16}
                                    className="text-white/80 group-hover:text-white group-hover:-translate-y-0.5 transition-transform"
                                />
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 font-bold text-xs tracking-wide">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span
                                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                                countdown.isExpired
                                                    ? 'bg-red-400'
                                                    : 'bg-white'
                                            }`}
                                        />
                                        <span
                                            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                                countdown.isExpired
                                                    ? 'bg-red-300'
                                                    : 'bg-emerald-200'
                                            }`}
                                        />
                                    </span>
                                    <span>Issued Hotel Action</span>
                                </div>
                                <div className="h-4 w-px bg-white/20" />
                                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-100 bg-white/15 px-2.5 py-1 rounded-full">
                                    <Clock
                                        size={12}
                                        className={
                                            countdown.isExpired
                                                ? 'text-red-300'
                                                : 'text-emerald-100'
                                        }
                                    />
                                    <span>{countdown.formatted}</span>
                                </div>
                                <ChevronUp
                                    size={16}
                                    className="text-white/80 group-hover:text-white group-hover:-translate-y-0.5 transition-transform"
                                />
                            </>
                        )}
                    </div>
                </div>

                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all scale-100">
                            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                        <Ticket size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-base text-primary">
                                            Konfirmasi Issued Hotel
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Penerbitan voucher resmi hotel
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                        <span className="text-slate-500 font-medium">
                                            Hotel
                                        </span>
                                        <span className="font-bold text-slate-800 text-right max-w-[220px] truncate">
                                            {hotelName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                        <span className="text-slate-500 font-medium">
                                            Kode Order
                                        </span>
                                        <span className="font-mono font-bold text-slate-800">
                                            {rawOrderCode}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                        <span className="text-slate-500 font-medium">
                                            Status Pembayaran
                                        </span>
                                        <span className="font-bold text-emerald-600">
                                            PAID (Lunas)
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-slate-500 font-bold">
                                            Total Tagihan
                                        </span>
                                        <span className="text-base font-mono font-black text-primary">
                                            {formatRupiah(totalPayment)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Apakah Anda yakin ingin memproses issued
                                    untuk pesanan hotel ini? Setelah di-issued,
                                    voucher hotel akan berstatus resmi dan
                                    dikonfirmasi ke supplier.
                                </p>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleIssueVoucher}
                                    className="px-5 py-2.5 bg-primary hover:bg-primary-bright text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={15} />
                                            Ya, Terbitkan Voucher
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isIssuedSuccess && (
                    <div className="fixed top-6 right-6 z-[70] bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <CheckCircle2
                            size={24}
                            className="text-white shrink-0"
                        />
                        <div>
                            <h5 className="font-bold text-sm">
                                Voucher Hotel Berhasil Diterbitkan!
                            </h5>
                            <p className="text-xs text-emerald-100">
                                Reservasi hotel telah resmi dikonfirmasi ke
                                supplier.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsIssuedSuccess(false)}
                            className="ml-3 text-emerald-200 hover:text-white cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
            </>
        );
    },
);

export default FloatingIssuedAction;
