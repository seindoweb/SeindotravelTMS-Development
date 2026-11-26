import { formatRupiah } from '@/helpers';
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
                <div className="bottom-6 right-6 pointer-events-none fixed z-50 flex flex-col items-end">
                    <div
                        className={`bg-white rounded-3xl border-slate-200 w-[370px] max-w-[calc(100vw-2rem)] origin-bottom-right transform overflow-hidden border shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25),0_0_0_1px_rgba(15,23,42,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            !isFloatingMinimized
                                ? 'translate-y-0 pointer-events-auto visible scale-100 opacity-100'
                                : 'translate-y-8 bottom-0 right-0 pointer-events-none invisible absolute scale-95 opacity-0'
                        }`}
                    >
                        <div className="px-5 py-4 text-white shadow-xs bg-emerald-600 flex items-center justify-between">
                            <div className="gap-2.5 flex items-center">
                                <div className="text-white shadow-xs w-9 h-9 rounded-xl bg-white/15 border-white/20 flex items-center justify-center border">
                                    {isIssued ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <Ticket size={18} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold leading-tight text-white">
                                        {isIssued
                                            ? 'Voucher Diterbitkan'
                                            : 'Issued Hotel Action'}
                                    </h4>
                                    <p className="text-emerald-100 font-medium text-[11px]">
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
                                className="w-8 h-8 text-white shadow-xs rounded-xl bg-white/15 hover:bg-white/25 flex cursor-pointer items-center justify-center transition-all"
                                title="Minimize"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 bg-white">
                            {isIssued ? (
                                <div className="p-4 rounded-2xl bg-emerald-50 border-emerald-200/90 space-y-2.5 border">
                                    <div className="gap-3 flex items-center">
                                        <div className="text-white shadow-xs w-9 h-9 rounded-xl bg-emerald-600 flex shrink-0 items-center justify-center">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-black tracking-wide text-emerald-950 uppercase">
                                                Voucher Resmi Telah Terbit
                                            </h5>
                                            <p className="text-emerald-700 font-medium leading-tight text-[11px]">
                                                Pemesanan hotel terkonfirmasi
                                                resmi ke supplier.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/90 rounded-xl p-2.5 border-emerald-100 space-y-1.5 border text-[11px]">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-500">
                                                Status Reservasi
                                            </span>
                                            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                                                CONFIRMED
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-500">
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
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-bold text-quaternary tracking-wider gap-1.5 flex items-center text-[11px] uppercase">
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
                                            className={`font-extrabold px-2 py-0.5 tracking-wider rounded-full text-[10px] uppercase ${
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

                                    <div className="gap-2 py-1 flex items-center justify-center">
                                        {countdown.isExpired ? (
                                            <div className="py-1 flex flex-col items-center">
                                                <span className="font-mono text-xl font-black tracking-wider text-rose-600">
                                                    00 : 00 : 00
                                                </span>
                                                <p className="text-rose-500 font-semibold mt-1 text-[11px]">
                                                    Waktu booking telah berakhir
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="gap-2 flex items-center">
                                                <div className="bg-white px-2.5 py-1.5 rounded-xl border-slate-200 shadow-xs flex min-w-[42px] flex-col items-center border">
                                                    <span className="font-mono text-lg font-black text-primary leading-none">
                                                        {String(
                                                            countdown.hours,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="font-bold text-quaternary mt-0.5 text-[9px] uppercase">
                                                        Jam
                                                    </span>
                                                </div>
                                                <span className="-mt-2 font-mono text-base font-bold text-slate-300">
                                                    :
                                                </span>
                                                <div className="bg-white px-2.5 py-1.5 rounded-xl border-slate-200 shadow-xs flex min-w-[42px] flex-col items-center border">
                                                    <span className="font-mono text-lg font-black text-primary leading-none">
                                                        {String(
                                                            countdown.minutes,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="font-bold text-quaternary mt-0.5 text-[9px] uppercase">
                                                        Menit
                                                    </span>
                                                </div>
                                                <span className="-mt-2 font-mono text-base font-bold text-slate-300">
                                                    :
                                                </span>
                                                <div className="bg-white px-2.5 py-1.5 rounded-xl border-slate-200 shadow-xs flex min-w-[42px] flex-col items-center border">
                                                    <span className="font-mono text-lg font-black text-emerald-600 leading-none">
                                                        {String(
                                                            countdown.seconds,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="font-bold text-quaternary mt-0.5 text-[9px] uppercase">
                                                        Detik
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isIssued && (
                                <div className="space-y-1.5">
                                    <label className="font-bold text-primary tracking-wider block text-[11px] uppercase">
                                        Status Pembayaran
                                    </label>
                                    <div className="bg-slate-50 border-emerald-200 rounded-xl px-3.5 py-2.5 flex w-full items-center justify-between border">
                                        <span className="text-xs font-bold text-emerald-700 gap-1.5 flex items-center">
                                            <Check
                                                size={14}
                                                className="text-emerald-600 stroke-[3]"
                                            />
                                            PAID (Sudah Lunas)
                                        </span>
                                        <span className="font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md text-[10px]">
                                            Terkunci
                                        </span>
                                    </div>
                                    <p className="text-slate-400 font-medium text-[10px]">
                                        Status pembayaran terkunci otomatis
                                        karena voucher sudah diterbitkan.
                                    </p>
                                </div>
                            )}

                            {!isIssued && (
                                <div className="space-y-1.5">
                                    <label className="font-bold text-primary tracking-wider block text-[11px] uppercase">
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
                                            className="bg-white border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-primary shadow-xs focus:ring-emerald-500/20 focus:border-emerald-600 pr-9 w-full cursor-pointer appearance-none border transition-all focus:ring-2 focus:outline-none"
                                        >
                                            <option value="unpaid">
                                                🟠 Waiting Payment (Belum Lunas)
                                            </option>
                                            <option value="paid">
                                                🟢 Paid (Sudah Lunas)
                                            </option>
                                        </select>
                                        <div className="right-3 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    <div className="gap-1.5 pt-0.5 flex items-center">
                                        {isPaid ? (
                                            <p className="text-emerald-600 font-semibold gap-1 flex items-center text-[11px]">
                                                <Check
                                                    size={13}
                                                    className="text-emerald-600 stroke-[3]"
                                                />
                                                Pembayaran terverifikasi. Tombol
                                                Issued aktif.
                                            </p>
                                        ) : (
                                            <p className="text-amber-600 font-semibold gap-1 flex items-center text-[11px]">
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

                            <div className="p-3 bg-slate-50 border-slate-200/80 rounded-xl flex items-center justify-between border">
                                <div className="flex flex-col">
                                    <span className="font-bold text-quaternary tracking-wider text-[10px] uppercase">
                                        Total Tagihan
                                    </span>
                                    <span className="font-mono text-sm font-bold text-primary">
                                        {formatRupiah(totalPayment)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end text-right">
                                    <span className="font-bold text-quaternary tracking-wider text-[10px] uppercase">
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
                                            className="gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg group inline-flex w-full cursor-pointer items-center justify-center transition-all active:scale-[0.98]"
                                        >
                                            <Printer size={16} />
                                            CETAK / DOWNLOAD VOUCHER
                                        </button>
                                        <div className="px-1 flex items-center justify-between">
                                            <span className="text-emerald-600 font-semibold gap-1 flex items-center text-[11px]">
                                                <CheckCircle2 size={13} />
                                                Voucher Siap Digunakan
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {selectedPaymentStatus == 'paid' ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsConfirmModalOpen(true)
                                                }
                                                className="gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg group inline-flex w-full cursor-pointer items-center justify-center transition-all active:scale-[0.98]"
                                            >
                                                ISSUE HOTEL SEKARANG
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled
                                                className="gap-2 py-3.5 px-4 bg-slate-100 border-slate-200 text-slate-400 rounded-xl text-sm font-bold inline-flex w-full cursor-not-allowed items-center justify-center border opacity-80"
                                            >
                                                {countdown.isExpired
                                                    ? 'WAKTU EXPIRED'
                                                    : 'MENUNGGU PEMBAYARAN'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsFloatingMinimized(false)}
                        className={`group gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 flex origin-bottom-right transform cursor-pointer items-center rounded-full shadow-[0_12px_28px_rgba(5,150,105,0.35),0_0_0_1px_rgba(5,150,105,0.2)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:shadow-[0_18px_36px_rgba(5,150,105,0.45)] ${
                            isFloatingMinimized
                                ? 'translate-y-0 pointer-events-auto visible scale-100 opacity-100'
                                : 'translate-y-4 bottom-0 right-0 pointer-events-none invisible absolute scale-90 opacity-0'
                        }`}
                        title="Klik untuk membuka Issued Action"
                    >
                        {isIssued ? (
                            <>
                                <div className="gap-2 text-xs font-bold tracking-wide flex items-center">
                                    <span className="w-5 h-5 text-white bg-white/20 flex items-center justify-center rounded-full">
                                        <CheckCircle2
                                            size={13}
                                            className="text-white"
                                        />
                                    </span>
                                    <span>Voucher Hotel Issued</span>
                                </div>
                                <div className="h-4 bg-white/20 w-px" />
                                <div className="gap-1.5 font-bold text-xs text-white bg-white/20 px-2.5 py-1 flex items-center rounded-full">
                                    <span>CONFIRMED</span>
                                </div>
                                <ChevronUp
                                    size={16}
                                    className="text-white/80 group-hover:text-white group-hover:-translate-y-0.5 transition-transform"
                                />
                            </>
                        ) : (
                            <>
                                <div className="gap-2 text-xs font-bold tracking-wide flex items-center">
                                    <span className="h-2.5 w-2.5 relative flex">
                                        <span
                                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                                countdown.isExpired
                                                    ? 'bg-red-400'
                                                    : 'bg-white'
                                            }`}
                                        />
                                        <span
                                            className={`h-2.5 w-2.5 relative inline-flex rounded-full ${
                                                countdown.isExpired
                                                    ? 'bg-red-300'
                                                    : 'bg-emerald-200'
                                            }`}
                                        />
                                    </span>
                                    <span>Issued Hotel Action</span>
                                </div>
                                <div className="h-4 bg-white/20 w-px" />
                                <div className="gap-1.5 font-mono text-xs font-bold text-emerald-100 bg-white/15 px-2.5 py-1 flex items-center rounded-full">
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
                    <div className="inset-0 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in fixed z-[60] flex items-center justify-center duration-200">
                        <div className="max-w-md bg-white shadow-2xl rounded-3xl border-slate-200 w-full scale-100 transform overflow-hidden border transition-all">
                            <div className="px-6 py-5 bg-slate-50 border-slate-100 flex items-center justify-between border-b">
                                <div className="gap-3 flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                        <Ticket size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-primary">
                                            Konfirmasi Issued Hotel
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500">
                                            Penerbitan voucher resmi hotel
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="w-8 h-8 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex cursor-pointer items-center justify-center rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="p-4 space-y-2 text-xs bg-slate-50 rounded-2xl border-slate-200 border">
                                    <div className="pb-2 border-slate-200 flex items-center justify-between border-b">
                                        <span className="font-medium text-slate-500">
                                            Hotel
                                        </span>
                                        <span className="font-bold text-slate-800 max-w-[220px] truncate text-right">
                                            {hotelName}
                                        </span>
                                    </div>
                                    <div className="pb-2 border-slate-200 flex items-center justify-between border-b">
                                        <span className="font-medium text-slate-500">
                                            Kode Order
                                        </span>
                                        <span className="font-mono font-bold text-slate-800">
                                            {rawOrderCode}
                                        </span>
                                    </div>
                                    <div className="pb-2 border-slate-200 flex items-center justify-between border-b">
                                        <span className="font-medium text-slate-500">
                                            Status Pembayaran
                                        </span>
                                        <span className="font-bold text-emerald-600">
                                            PAID (Lunas)
                                        </span>
                                    </div>
                                    <div className="pt-1 flex items-center justify-between">
                                        <span className="font-bold text-slate-500">
                                            Total Tagihan
                                        </span>
                                        <span className="font-mono text-base font-black text-primary">
                                            {formatRupiah(totalPayment)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs leading-relaxed text-slate-500">
                                    Apakah Anda yakin ingin memproses issued
                                    untuk pesanan hotel ini? Setelah di-issued,
                                    voucher hotel akan berstatus resmi dan
                                    dikonfirmasi ke supplier.
                                </p>
                            </div>

                            <div className="gap-3 px-6 py-4 bg-slate-50 border-slate-100 flex items-center justify-end border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="px-4 py-2.5 bg-white border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer border transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleIssueVoucher}
                                    className="px-5 py-2.5 bg-primary hover:bg-primary-bright text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg gap-1.5 flex cursor-pointer items-center transition-all disabled:cursor-not-allowed disabled:opacity-75"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-3.5 h-3.5 border-white/30 border-t-white animate-spin rounded-full border-2" />
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
                    <div className="top-6 right-6 bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-2xl gap-3 animate-in fade-in slide-in-from-top-4 fixed z-[70] flex items-center duration-300">
                        <CheckCircle2
                            size={24}
                            className="text-white shrink-0"
                        />
                        <div>
                            <h5 className="text-sm font-bold">
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
