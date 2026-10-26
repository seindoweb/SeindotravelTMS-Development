import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { UserProps } from '@/types';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { RoomPaxGroup } from './GuestPaxForm';

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

export interface GuestConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customer?: UserProps | null;
    roomsPax: RoomPaxGroup[];
    hotelName: string;
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    currency: string;
    sellingPrice: number;
    isSubmitting?: boolean;
    errorMessage?: string | null;
}

export default function GuestConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    customer,
    roomsPax,
    hotelName,
    roomName,
    checkInDate,
    checkOutDate,
    nights,
    currency,
    sellingPrice,
    isSubmitting = false,
    errorMessage = null,
}: GuestConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-primary">
                            Confirm Order Details
                        </h3>
                        <p className="text-xs text-quaternary">
                            Please check the data again before continuing to booking
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 text-xs overflow-y-auto flex-1">
                    {customer && (
                        <div className="pb-2.5 border-b border-slate-200/80">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                                Customer
                            </span>
                            <div className="flex justify-between text-slate-800">
                                <span className="font-bold">
                                    {customer.title ? `${customer.title} ` : ''}
                                    {customer.full_name}
                                </span>
                                <span className="text-slate-500">{customer.phone_number || customer.email}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="text-slate-500">Hotel:</span>
                        <span className="font-bold text-slate-800 text-right">{hotelName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Room Type:</span>
                        <span className="font-bold text-slate-800 text-right">{roomName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Schedule:</span>
                        <span className="font-semibold text-slate-800 text-right">
                            {checkInDate} - {checkOutDate} ({nights} Malam)
                        </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                        <span className="text-slate-500 block font-bold">List of Guests:</span>
                        {roomsPax.map((r, rIdx) => (
                            <div key={rIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-primary block text-[11px]">
                                    Room #{r.roomNo} ({r.noOfAdults} Adults{r.noOfChild > 0 ? `, ${r.noOfChild} Children` : ''})
                                </span>
                                <div className="space-y-1 pl-1">
                                    {r.pax.map((p, pIdx) => (
                                        <div key={pIdx} className="flex justify-between text-slate-700 text-[11px]">
                                            <span>
                                                Pax {pIdx + 1} ({p.type === 'child' ? 'Child' : 'Adult'}):{' '}
                                                <strong>{p.salutation} {p.firstName} {p.lastName}</strong>
                                            </span>
                                            {p.age && <span className="text-slate-500">{p.age} years old</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                        <span className="font-bold text-slate-700">Total Payment:</span>
                        <span className="text-base font-black text-primary">
                            {currency} {formatRupiah(sellingPrice)}
                        </span>
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                        <div>
                            <span className="font-bold block">Gagal Memproses Pemesanan:</span>
                            <span className="text-rose-600">{errorMessage}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <SecondaryButton
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 justify-center py-2.5 px-4 text-sm cursor-pointer disabled:opacity-50"
                    >
                        Check Again
                    </SecondaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex-1 justify-center py-2.5 px-4 text-sm shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>Yes, Continue</span>
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
