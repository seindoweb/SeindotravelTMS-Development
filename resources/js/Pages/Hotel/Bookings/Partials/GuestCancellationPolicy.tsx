import { HotelRoomDetail } from '@/types';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export interface GuestCancellationPolicyProps {
    selectedRoom?: HotelRoomDetail | null;
    isRefundable: boolean;
}

export default function GuestCancellationPolicy({
    selectedRoom,
    isRefundable,
}: GuestCancellationPolicyProps) {
    if (!selectedRoom) return null;

    return (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                    Cancellation Policy & Terms
                </h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border shrink-0 ${
                        isRefundable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                >
                    {isRefundable ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {isRefundable ? 'Cancelable (Refundable)' : 'Not Cancelable'}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                    {isRefundable
                        ? 'This reservation can be cancelled according to the penalty deadline stated in the room details.'
                        : 'This room is Non-Refundable. Cancellation or date change fees are subject to a 100% penalty.'}
                </p>
            </div>

            {selectedRoom.message && selectedRoom.message.trim() !== '' && (
                <div className="flex items-start gap-2.5 bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                        <span className="font-bold text-amber-950 block mb-0.5">
                           Additional Notes from the Hotel:
                        </span>
                        <p className="text-amber-800 leading-relaxed whitespace-pre-line">
                            {selectedRoom.message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
