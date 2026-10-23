import { Check } from 'lucide-react';

export const defaultSpecialRequestOptions: string[] = [
    'Non-Smoking Room',
    'Smoking Room',
    'High Floor',
    'Large Bed (King/Queen)',
    'Twin Beds',
    'Connecting Rooms',
    'Late Check-in',
    'Early Check-in',
];

export interface GuestSpecialRequestsProps {
    specialRequests: string[];
    onToggleRequest: (req: string) => void;
    customRequestNote: string;
    onChangeNote: (note: string) => void;
    availableOptions?: string[];
}

export default function GuestSpecialRequests({
    specialRequests,
    onToggleRequest,
    customRequestNote,
    onChangeNote,
    availableOptions = defaultSpecialRequestOptions,
}: GuestSpecialRequestsProps) {
    return (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <div>
                    <h2 className="text-base font-bold text-primary">
                        Special Requests (Optional)
                    </h2>
                    <p className="text-xs text-quaternary">
                        Subject to hotel availability at check-in
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                    {availableOptions.map((opt) => {
                        const isSelected = specialRequests.includes(opt);
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onToggleRequest(opt)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-primary text-white border-primary shadow-xs'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {isSelected && <Check size={12} className="stroke-[3]" />}
                                <span>{opt}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Additional Notes
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Ex: Estimated arrival time at 4 PM, please provide a room near the elevator."
                        value={customRequestNote}
                        onChange={(e) => onChangeNote(e.target.value)}
                        className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
