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

    const formatPolicyDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                return new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }).format(date);
            }
        } catch {
            // fallback
        }
        return dateStr;
    };

    return (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                    Cancellation Policy & Terms
                </h3>
            </div>

           {selectedRoom.cancellationPolicies && selectedRoom.cancellationPolicies.length > 0 && (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="space-y-3.5 pl-1">
                    {selectedRoom.cancellationPolicies.map((policy, idx) => {
                        const penalty = parseFloat(String(policy.percent ?? policy.value ?? 0)) || 0;
                        const isFree = penalty === 0 || policy.type === 'freeCancellation';

                        return (
                            <div key={idx} className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                            isFree
                                                ? 'bg-emerald-500 ring-4 ring-emerald-100'
                                                                : 'bg-rose-500 ring-4 ring-rose-100'
                                                        }`}
                                                    />
                                                    <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                                                        {formatPolicyDate(policy.fromDate)} – {formatPolicyDate(policy.toDate)}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-1.5 pl-4 sm:pl-5 text-xs">
                                                    <span className="text-slate-400 font-mono select-none">└</span>
                                                    <span
                                                        className={
                                                            isFree
                                                                ? 'text-emerald-700 font-medium'
                                                                : 'text-slate-600'
                                                        }
                                                    >
                                                        {isFree
                                                            ? 'Free cancellation. No penalty fees yet.'
                                                            : `Cancellation penalty of ${penalty}% of the total price.`}
                                                    </span>
                                                </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
