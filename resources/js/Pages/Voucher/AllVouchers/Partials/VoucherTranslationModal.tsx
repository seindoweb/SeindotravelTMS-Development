import RichTextEditor, { sanitizeHtml } from '@/Components/RichTextEditor';
import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Globe, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { VoucherItem, VoucherTranslationItem } from './VoucherDetailModal';

interface VoucherTranslationModalProps {
    isOpen: boolean;
    onClose: () => void;
    voucher: VoucherItem | null;
}

export default function VoucherTranslationModal({
    isOpen,
    onClose,
    voucher,
}: VoucherTranslationModalProps) {
    const [activeLocale, setActiveLocale] = useState<'id' | 'en'>('id');
    const [contentId, setContentId] = useState<string>('');
    const [contentEn, setContentEn] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    useEffect(() => {
        if (voucher && voucher.voucher_translations) {
            const idTranslation = voucher.voucher_translations.find(
                (t: VoucherTranslationItem) => t.locale === 'id',
            );
            const enTranslation = voucher.voucher_translations.find(
                (t: VoucherTranslationItem) => t.locale === 'en',
            );

            setContentId(sanitizeHtml(idTranslation?.description || ''));
            setContentEn(sanitizeHtml(enTranslation?.description || ''));
        } else {
            setContentId('');
            setContentEn('');
        }
    }, [voucher]);

    if (!isOpen || !voucher) return null;

    const currentContent = activeLocale === 'id' ? contentId : contentEn;
    const setCurrentContent = (html: string) => {
        if (activeLocale === 'id') {
            setContentId(html);
        } else {
            setContentEn(html);
        }
    };

    const hasIdTranslation = Boolean(
        voucher.voucher_translations?.some(
            (t) =>
                t.locale === 'id' && (t.description?.trim()?.length ?? 0) > 0,
        ),
    );
    const hasEnTranslation = Boolean(
        voucher.voucher_translations?.some(
            (t) =>
                t.locale === 'en' && (t.description?.trim()?.length ?? 0) > 0,
        ),
    );

    const totalTranslations = (voucher.voucher_translations ?? []).length;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const cleanDescription = sanitizeHtml(currentContent);
        router.post(
            route('voucher.saveTranslation', voucher.id),
            {
                locale: activeLocale,
                description: cleanDescription,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaving(false);
                },
                onError: () => {
                    setSaving(false);
                },
            },
        );
    };

    const handleDelete = () => {
        if (
            !confirm(
                `Are you sure you want to delete the ${
                    activeLocale === 'id' ? 'Indonesian' : 'English'
                } translation?`,
            )
        ) {
            return;
        }

        setDeleting(true);
        router.delete(
            route('voucher.deleteTranslation', [voucher.id, activeLocale]),
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (activeLocale === 'id') {
                        setContentId('');
                    } else {
                        setContentEn('');
                    }
                    setDeleting(false);
                },
                onError: () => {
                    setDeleting(false);
                },
            },
        );
    };

    const isCurrentSaved =
        activeLocale === 'id' ? hasIdTranslation : hasEnTranslation;

    return (
        <div className="inset-0 bg-slate-900/40 p-4 fixed z-50 flex items-center justify-center overflow-y-auto backdrop-blur-[2px]">
            <div className="max-w-2xl bg-white rounded-2xl shadow-xl border-slate-200 relative flex max-h-[90vh] w-full flex-col overflow-hidden border">
                <div className="px-6 py-4 border-slate-200 bg-slate-50 flex items-center justify-between border-b">
                    <div className="gap-3 flex items-center">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Globe size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">
                                Voucher Translations
                            </h3>
                            <p className="text-xs text-slate-500">
                                Voucher ID #{voucher.id} •{' '}
                                {voucher.product_attribute?.attribute?.toUpperCase() ||
                                    'VOUCHER'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {totalTranslations === 0 ? (
                        <div className="gap-2.5 p-3 rounded-xl bg-amber-50 border-amber-200 text-amber-800 text-xs flex items-start border">
                            <AlertCircle
                                size={16}
                                className="mt-0.5 text-amber-600 shrink-0"
                            />
                            <div>
                                <span className="font-semibold block">
                                    Translation Required
                                </span>
                                This voucher cannot be set to{' '}
                                <strong className="font-semibold">
                                    Active
                                </strong>{' '}
                                status until you create at least one translation
                                (Indonesian or English).
                            </div>
                        </div>
                    ) : (
                        <div className="gap-2 px-3 py-2 text-xs rounded-xl bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center border">
                            <CheckCircle2
                                size={16}
                                className="text-emerald-600 shrink-0"
                            />
                            <span>
                                Voucher is eligible for active status (
                                {totalTranslations}/2 languages configured).
                            </span>
                        </div>
                    )}

                    <div className="gap-2 pb-3 border-slate-200 flex items-center border-b">
                        <button
                            type="button"
                            onClick={() => setActiveLocale('id')}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg gap-2 flex items-center transition-all ${
                                activeLocale === 'id'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>🇮🇩 Indonesian (ID)</span>
                            {hasIdTranslation ? (
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        activeLocale === 'id'
                                            ? 'bg-emerald-300'
                                            : 'bg-emerald-500'
                                    }`}
                                />
                            ) : (
                                <span
                                    className={`px-1.5 py-0.2 rounded font-normal text-[10px] ${
                                        activeLocale === 'id'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                    Draft
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveLocale('en')}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg gap-2 flex items-center transition-all ${
                                activeLocale === 'en'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>🇬🇧 English (EN)</span>
                            {hasEnTranslation ? (
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        activeLocale === 'en'
                                            ? 'bg-emerald-300'
                                            : 'bg-emerald-500'
                                    }`}
                                />
                            ) : (
                                <span
                                    className={`px-1.5 py-0.2 rounded font-normal text-[10px] ${
                                        activeLocale === 'en'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                    Draft
                                </span>
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-700">
                                    Description & Terms (
                                    {activeLocale === 'id'
                                        ? 'Bahasa Indonesia'
                                        : 'English'}
                                    )
                                </label>
                                {isCurrentSaved && (
                                    <span className="text-emerald-600 font-medium gap-1 flex items-center text-[11px]">
                                        <CheckCircle2 size={12} />
                                        Saved
                                    </span>
                                )}
                            </div>

                            <RichTextEditor
                                value={currentContent}
                                onChange={setCurrentContent}
                                placeholder={`Write ${
                                    activeLocale === 'id'
                                        ? 'deskripsi dan'
                                        : 'description &'
                                } terms & conditions here...`}
                                minHeight="min-h-[220px]"
                            />
                        </div>

                        <div className="pt-2 border-slate-100 flex items-center justify-between border-t">
                            {isCurrentSaved ? (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting || saving}
                                    className="gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-50 border-rose-200 inline-flex items-center border transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={13} />
                                    <span>
                                        {deleting
                                            ? 'Deleting...'
                                            : 'Delete Language'}
                                    </span>
                                </button>
                            ) : (
                                <div />
                            )}

                            <div className="gap-2 flex items-center">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 border-slate-300 border transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm bg-primary hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {saving
                                        ? 'Saving...'
                                        : `Save ${
                                              activeLocale === 'id'
                                                  ? 'Indonesian'
                                                  : 'English'
                                          }`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
