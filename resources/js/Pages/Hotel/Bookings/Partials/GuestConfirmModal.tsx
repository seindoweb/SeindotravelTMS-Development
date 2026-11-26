import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { UserProps } from '@/types';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { RoomPaxGroup } from './GuestPaxForm';
import { formatRupiah } from '@/helpers';

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
        <div className="inset-0 p-4 bg-black/60 animate-in fade-in fixed z-50 flex items-center justify-center duration-200">
            <div className="bg-white rounded-2xl max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 relative flex max-h-[90vh] w-full flex-col duration-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 absolute cursor-pointer transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="gap-3 flex items-center">
                    <div className="w-10 h-10 font-bold rounded-xl bg-primary/10 text-primary flex shrink-0 items-center justify-center">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-primary">
                            Confirm Order Details
                        </h3>
                        <p className="text-xs text-quaternary">
                            Please check the data again before continuing to
                            booking
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-3 text-xs bg-slate-50 border-slate-200/80 rounded-xl flex-1 overflow-y-auto border">
                    {customer && (
                        <div className="pb-2.5 border-slate-200/80 border-b">
                            <span className="font-bold text-slate-400 tracking-wider mb-1 block text-[10px] uppercase">
                                Customer
                            </span>
                            <div className="text-slate-800 flex justify-between">
                                <span className="font-bold">
                                    {customer.title ? `${customer.title} ` : ''}
                                    {customer.full_name}
                                </span>
                                <span className="text-slate-500">
                                    {customer.phone_number || customer.email}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="text-slate-500">Hotel:</span>
                        <span className="font-bold text-slate-800 text-right">
                            {hotelName}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Room Type:</span>
                        <span className="font-bold text-slate-800 text-right">
                            {roomName}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Schedule:</span>
                        <span className="font-semibold text-slate-800 text-right">
                            {checkInDate} - {checkOutDate} ({nights} Malam)
                        </span>
                    </div>

                    <div className="pt-2 space-y-2 border-slate-200/80 border-t">
                        <span className="font-bold text-slate-500 block">
                            List of Guests:
                        </span>
                        {roomsPax.map((r, rIdx) => (
                            <div
                                key={rIdx}
                                className="space-y-1 bg-white p-2.5 rounded-lg border-slate-100 border"
                            >
                                <span className="font-bold text-primary block text-[11px]">
                                    Room #{r.roomNo} ({r.noOfAdults} Adults
                                    {r.noOfChild > 0
                                        ? `, ${r.noOfChild} Children`
                                        : ''}
                                    )
                                </span>
                                <div className="pl-1 space-y-1">
                                    {r.pax.map((p, pIdx) => (
                                        <div
                                            key={pIdx}
                                            className="text-slate-700 flex justify-between text-[11px]"
                                        >
                                            <span>
                                                Pax {pIdx + 1} (
                                                {p.type === 'child'
                                                    ? 'Child'
                                                    : 'Adult'}
                                                ):{' '}
                                                <strong>
                                                    {p.salutation} {p.firstName}{' '}
                                                    {p.lastName}
                                                </strong>
                                            </span>
                                            {p.age && (
                                                <span className="text-slate-500">
                                                    {p.age} years old
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-slate-200 flex items-baseline justify-between border-t">
                        <span className="font-bold text-slate-700">
                            Total Payment:
                        </span>
                        <span className="text-base font-black text-primary">
                            {currency} {formatRupiah(sellingPrice)}
                        </span>
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-rose-50 border-rose-200 text-rose-700 p-3 rounded-xl gap-2.5 text-xs flex items-start border">
                        <AlertCircle
                            size={16}
                            className="mt-0.5 text-rose-600 shrink-0"
                        />
                        <div>
                            <span className="font-bold block">
                                Gagal Memproses Pemesanan:
                            </span>
                            <span className="text-rose-600">
                                {errorMessage}
                            </span>
                        </div>
                    </div>
                )}

                <div className="gap-3 pt-2 flex items-center">
                    <SecondaryButton
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="py-2.5 px-4 text-sm flex-1 cursor-pointer justify-center disabled:opacity-50"
                    >
                        Check Again
                    </SecondaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="py-2.5 px-4 text-sm shadow-md gap-2 flex flex-1 cursor-pointer items-center justify-center disabled:opacity-50"
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
