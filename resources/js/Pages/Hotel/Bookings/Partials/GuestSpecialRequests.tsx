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
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#E2E8F0]">
            <div className="gap-2.5 pb-3 border-gray-100 flex items-center border-b">
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
                <div className="gap-2 flex flex-wrap">
                    {availableOptions.map((opt) => {
                        const isSelected = specialRequests.includes(opt);
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onToggleRequest(opt)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl gap-1.5 flex cursor-pointer items-center border transition-all ${
                                    isSelected
                                        ? 'bg-primary text-white border-primary shadow-xs'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {isSelected && (
                                    <Check size={12} className="stroke-[3]" />
                                )}
                                <span>{opt}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4">
                    <label className="text-xs font-bold text-slate-700 tracking-wider mb-1.5 block uppercase">
                        Additional Notes
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Ex: Estimated arrival time at 4 PM, please provide a room near the elevator."
                        value={customRequestNote}
                        onChange={(e) => onChangeNote(e.target.value)}
                        className="bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:ring-primary/20 focus:border-primary w-full resize-none border border-[#E2E8F0] transition-all focus:ring-2 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
