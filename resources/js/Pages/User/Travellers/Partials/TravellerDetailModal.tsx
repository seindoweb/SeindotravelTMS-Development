import { formatDate } from '@/helpers';
import { TravellerProps } from '@/types';
import { router } from '@inertiajs/react';
import {
    Calendar,
    Check,
    Clock,
    Copy,
    CreditCard,
    Edit3,
    FileText,
    Globe,
    ShieldCheck,
    User,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type TravellerDetailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    traveller: TravellerProps | null;
};

export default function TravellerDetailModal({
    isOpen,
    onClose,
    traveller,
}: TravellerDetailModalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [copiedDoc, setCopiedDoc] = useState(false);
    const [copiedPassport, setCopiedPassport] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen || !traveller) return null;

    const fullName = [
        traveller.title,
        traveller.first_name,
        traveller.last_name,
    ]
        .filter(Boolean)
        .join(' ');

    const initials =
        [traveller.first_name?.[0], traveller.last_name?.[0]]
            .filter(Boolean)
            .join('')
            .toUpperCase() || 'TR';

    const handleCopy = (text: string, type: 'doc' | 'passport') => {
        if (!text) return;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }

        if (type === 'doc') {
            setCopiedDoc(true);
            setTimeout(() => setCopiedDoc(false), 1200);
        } else {
            setCopiedPassport(true);
            setTimeout(() => setCopiedPassport(false), 1200);
        }
    };

    const handleEdit = () => {
        onClose();
        router.visit(
            route('user.travellers.edit', traveller.index || traveller.id),
        );
    };

    return (
        <>
            <div
                className="inset-0 bg-black/60 backdrop-blur-sm fixed z-[100] transition-opacity"
                onClick={onClose}
            />

            <div className="inset-0 p-3 sm:p-6 fixed z-[110] flex items-center justify-center">
                <div
                    ref={scrollRef}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl relative max-h-[92vh] w-full overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        title="Close (Esc)"
                        className="top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm absolute z-20 rounded-full transition-all"
                    >
                        <X size={18} />
                    </button>

                    <div className="from-slate-900 via-slate-800 to-primary text-white px-6 pt-7 pb-6 rounded-t-2xl relative overflow-hidden bg-gradient-to-br">
                        <div className="-right-8 -bottom-10 pointer-events-none absolute opacity-10 select-none">
                            <User size={180} />
                        </div>

                        <div className="gap-4 relative z-10 flex items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border-white/20 text-xl font-black text-white shadow-inner flex shrink-0 items-center justify-center border">
                                {initials}
                            </div>
                            <div className="min-w-0 pr-8 flex-1">
                                <div className="gap-2 flex flex-wrap items-center">
                                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                                        {fullName}
                                    </h2>
                                </div>
                                <div className="gap-2 mt-2 text-xs text-white/80 flex flex-wrap items-center">
                                    <span className="gap-1 bg-white/15 backdrop-blur-sm border-white/20 px-2.5 py-0.5 font-semibold text-white inline-flex items-center rounded-full border">
                                        <Globe size={11} />
                                        {traveller.nationality || 'N/A'}
                                    </span>
                                    <span className="gap-1 bg-white/15 backdrop-blur-sm border-white/20 px-2.5 py-0.5 font-medium text-white/90 inline-flex items-center rounded-full border">
                                        <Calendar size={11} />
                                        {formatDate(traveller.date_of_birth)}
                                    </span>
                                    <span className="font-mono text-white/60 ml-auto text-[11px]">
                                        ID: {traveller.index || traveller.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-5">
                        <div className="sm:grid-cols-4 gap-2.5 grid grid-cols-2">
                            <div className="bg-slate-50 border-slate-200/70 rounded-xl px-3 py-2.5 border">
                                <div className="gap-1.5 text-gray-400 mb-1 flex items-center">
                                    <Globe size={13} className="text-primary" />
                                    <span className="tracking-wider font-semibold text-[10px] uppercase">
                                        Nationality
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">
                                    {traveller.nationality || '—'}
                                </span>
                            </div>

                            <div className="bg-slate-50 border-slate-200/70 rounded-xl px-3 py-2.5 border">
                                <div className="gap-1.5 text-gray-400 mb-1 flex items-center">
                                    <Calendar
                                        size={13}
                                        className="text-primary"
                                    />
                                    <span className="tracking-wider font-semibold text-[10px] uppercase">
                                        Date of Birth
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">
                                    {formatDate(traveller.date_of_birth)}
                                </span>
                            </div>

                            <div className="bg-slate-50 border-slate-200/70 rounded-xl px-3 py-2.5 border">
                                <div className="gap-1.5 text-gray-400 mb-1 flex items-center">
                                    <Clock size={13} className="text-primary" />
                                    <span className="tracking-wider font-semibold text-[10px] uppercase">
                                        Registered
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">
                                    {traveller.created_at
                                        ? formatDate(traveller.created_at)
                                        : '—'}
                                </span>
                            </div>

                            <div className="bg-slate-50 border-slate-200/70 rounded-xl px-3 py-2.5 border">
                                <div className="gap-1.5 text-gray-400 mb-1 flex items-center">
                                    <Users size={13} className="text-primary" />
                                    <span className="tracking-wider font-semibold truncate text-[10px] uppercase">
                                        Customer
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-800 block truncate">
                                    {traveller.user?.full_name || '—'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 border">
                            <div className="gap-2 flex items-center justify-between">
                                <div className="gap-2 flex items-center">
                                    <FileText
                                        size={17}
                                        className="text-primary"
                                    />
                                    <h4 className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                                        National Identity Document
                                    </h4>
                                </div>
                                {traveller.document_type && (
                                    <span className="font-bold bg-primary/10 text-primary border-primary/20 px-2.5 py-0.5 inline-flex items-center rounded-full border text-[11px] uppercase">
                                        {traveller.document_type}
                                    </span>
                                )}
                            </div>

                            <div className="bg-white rounded-xl border-slate-200/70 p-3.5 gap-3 flex items-center justify-between border">
                                <div>
                                    <span className="tracking-wider text-gray-400 font-bold mb-0.5 block text-[10px] uppercase">
                                        Document Number
                                    </span>
                                    <span className="text-lg font-mono font-black text-gray-900 tracking-wider">
                                        {traveller.document_number || '—'}
                                    </span>
                                </div>

                                {traveller.document_number && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                traveller.document_number || '',
                                                'doc',
                                            )
                                        }
                                        title={
                                            copiedDoc
                                                ? 'Copied!'
                                                : 'Copy document number'
                                        }
                                        className={`gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex cursor-pointer items-center border transition-all ${
                                            copiedDoc
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 scale-105'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-primary shadow-sm'
                                        }`}
                                    >
                                        {copiedDoc ? (
                                            <>
                                                <Check
                                                    size={13}
                                                    className="text-emerald-600 stroke-[2.5]"
                                                />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="sm:grid-cols-2 gap-3 pt-1 grid grid-cols-1">
                                <div className="bg-white/80 rounded-xl border-slate-200/60 p-3 border">
                                    <span className="tracking-wider text-gray-400 font-bold block text-[10px] uppercase">
                                        Issuing Country
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800 mt-1 block">
                                        {traveller.issuing_country || '—'}
                                    </span>
                                </div>

                                <div className="bg-white/80 rounded-xl border-slate-200/60 p-3 border">
                                    <span className="tracking-wider text-gray-400 font-bold block text-[10px] uppercase">
                                        Validity Period
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800 mt-1 block">
                                        {traveller.document_issue_date
                                            ? formatDate(
                                                  traveller.document_issue_date,
                                              )
                                            : '—'}{' '}
                                        <span className="text-gray-400 font-normal">
                                            to
                                        </span>{' '}
                                        {traveller.document_expiry_date
                                            ? formatDate(
                                                  traveller.document_expiry_date,
                                              )
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 border">
                            <div className="gap-2 flex items-center justify-between">
                                <div className="gap-2 flex items-center">
                                    <CreditCard
                                        size={17}
                                        className="text-primary"
                                    />
                                    <h4 className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                                        Passport Information
                                    </h4>
                                </div>
                                <span className="font-bold bg-amber-500/10 text-amber-700 border-amber-500/20 px-2.5 py-0.5 inline-flex items-center rounded-full border text-[11px] uppercase">
                                    Passport
                                </span>
                            </div>

                            <div className="bg-white rounded-xl border-slate-200/70 p-3.5 gap-3 flex items-center justify-between border">
                                <div>
                                    <span className="tracking-wider text-gray-400 font-bold mb-0.5 block text-[10px] uppercase">
                                        Passport Number
                                    </span>
                                    <span className="text-lg font-mono font-black text-gray-900 tracking-wider">
                                        {traveller.passport_number || '—'}
                                    </span>
                                </div>

                                {traveller.passport_number && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                traveller.passport_number || '',
                                                'passport',
                                            )
                                        }
                                        title={
                                            copiedPassport
                                                ? 'Copied!'
                                                : 'Copy passport number'
                                        }
                                        className={`gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex cursor-pointer items-center border transition-all ${
                                            copiedPassport
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 scale-105'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-primary shadow-sm'
                                        }`}
                                    >
                                        {copiedPassport ? (
                                            <>
                                                <Check
                                                    size={13}
                                                    className="text-emerald-600 stroke-[2.5]"
                                                />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="sm:grid-cols-2 gap-3 pt-1 grid grid-cols-1">
                                <div className="bg-white/80 rounded-xl border-slate-200/60 p-3 border">
                                    <span className="tracking-wider text-gray-400 font-bold block text-[10px] uppercase">
                                        Issuing Country
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800 mt-1 block">
                                        {traveller.passport_issuing_country ||
                                            '—'}
                                    </span>
                                </div>

                                <div className="bg-white/80 rounded-xl border-slate-200/60 p-3 border">
                                    <span className="tracking-wider text-gray-400 font-bold block text-[10px] uppercase">
                                        Validity Period
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800 mt-1 block">
                                        {traveller.passport_issue_date
                                            ? formatDate(
                                                  traveller.passport_issue_date,
                                              )
                                            : '—'}{' '}
                                        <span className="text-gray-400 font-normal">
                                            to
                                        </span>{' '}
                                        {traveller.passport_expiry_date
                                            ? formatDate(
                                                  traveller.passport_expiry_date,
                                              )
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {traveller.user && (
                            <div className="gap-3 bg-amber-50/70 border-amber-200/80 rounded-2xl p-4 flex items-center justify-between border">
                                <div className="gap-3 flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold text-sm flex shrink-0 items-center justify-center">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <span className="tracking-wider text-amber-700 font-bold block text-[10px] uppercase">
                                            Account Customer Owner
                                        </span>
                                        <h5 className="text-sm font-bold text-gray-900 leading-snug">
                                            {traveller.user.full_name}
                                        </h5>
                                        <p className="text-xs text-gray-500">
                                            {traveller.user.email}
                                        </p>
                                    </div>
                                </div>

                                <span className="gap-1 font-semibold bg-white text-amber-800 border-amber-200 px-2.5 py-1 rounded-lg shadow-xs inline-flex items-center border text-[11px]">
                                    <ShieldCheck
                                        size={13}
                                        className="text-amber-600"
                                    />
                                    Linked
                                </span>
                            </div>
                        )}

                        <div className="from-primary/5 to-primary/10 border-primary/15 rounded-2xl px-5 py-4 border bg-gradient-to-br">
                            <div className="gap-3 flex flex-wrap items-center justify-between">
                                <div>
                                    <span className="tracking-wider text-gray-400 font-bold block text-[11px] uppercase">
                                        Traveller Management
                                    </span>
                                    <span className="text-sm font-bold text-gray-700 mt-0.5 block">
                                        Data is verified & stored
                                    </span>
                                </div>

                                <div className="gap-2 flex items-center">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-xl border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 border transition-all active:scale-[0.98]"
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark inline-flex items-center transition-all active:scale-[0.98]"
                                    >
                                        <Edit3 size={13} />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
