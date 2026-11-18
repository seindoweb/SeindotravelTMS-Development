import { router } from '@inertiajs/react';
import { Edit, Globe, Image as ImageIcon, X } from 'lucide-react';
import React, { useState } from 'react';

export interface ProductAttributeItem {
    id: number;
    attribute: string;
    model: string;
    product: string;
}

export interface VoucherTranslationItem {
    id: number;
    voucher_id: number;
    locale: 'id' | 'en';
    description: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface VoucherItem {
    id: number;
    index?: string;
    key?: string;
    product_attribute_id: number;
    image_path?: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: string | number;
    max_discount?: string | number | null;
    min_order_amount: string | number;
    start_at?: string | null;
    end_at?: string | null;
    voucher_type: 'general' | 'signup';
    distribution_type: 'public' | 'personal';
    usage_limit?: number | null;
    usage_per_user?: number | null;
    used_count: number;
    platform: number; // 0=All, 1=Web, 2=Mobile
    status: 'draft' | 'active' | 'inactive' | 'expired' | 'exhausted';
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        full_name?: string;
        email?: string;
    };
    product_attribute?: ProductAttributeItem;
    voucher_translations?: VoucherTranslationItem[];
}

interface VoucherDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    voucher: VoucherItem | null;
    onOpenTranslation?: (voucher: VoucherItem) => void;
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

const formatDateEnglish = (dateStr?: string | null) => {
    if (!dateStr) return 'Unlimited';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function VoucherDetailModal({
    isOpen,
    onClose,
    voucher,
    onOpenTranslation,
}: VoucherDetailModalProps) {
    const [detailLocale, setDetailLocale] = useState<'id' | 'en'>('id');

    if (!isOpen || !voucher) return null;

    const isPercentage = voucher.discount_type === 'percentage';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div
                className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">
                                Voucher Details #{voucher.id}
                            </h3>
                            {voucher.index && (
                                <span className="text-xs font-mono text-slate-400">
                                    ({voucher.index})
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Complete promotional voucher configuration details.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {voucher.image_path ? (
                        <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img
                                src={voucher.image_path}
                                alt={`Voucher ${voucher.id}`}
                                className="w-full h-44 object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-20 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center gap-2 text-slate-400 text-xs">
                            <ImageIcon size={16} />
                            <span>No banner image available</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs border-y border-slate-100 py-4">
                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Product Category
                            </span>
                            <span className="font-semibold text-slate-800 capitalize mt-0.5 block">
                                {voucher.product_attribute?.product ||
                                    voucher.product_attribute?.attribute ||
                                    '-'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Voucher Status
                            </span>
                            <span
                                className={`inline-block mt-0.5 font-semibold text-xs px-2 py-0.5 rounded ${
                                    voucher.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {voucher.status === 'active' ? 'Active' : 'Draft'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Voucher Type
                            </span>
                            <span className="font-semibold text-slate-800 capitalize mt-0.5 block">
                                {voucher.voucher_type === 'signup'
                                    ? 'Sign Up Member'
                                    : 'General'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Distribution
                            </span>
                            <span className="font-semibold text-slate-800 capitalize mt-0.5 block">
                                {voucher.distribution_type === 'personal'
                                    ? 'Personal (Specific Users)'
                                    : 'Public (All Users)'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Discount Value
                            </span>
                            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
                                {isPercentage
                                    ? `${voucher.discount_value}%`
                                    : formatRupiah(voucher.discount_value)}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Max. Discount
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block">
                                {isPercentage
                                    ? voucher.max_discount
                                        ? formatRupiah(voucher.max_discount)
                                        : 'Unlimited'
                                    : 'Not applicable (Fixed Discount)'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Min. Order Amount
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block">
                                {Number(voucher.min_order_amount) > 0
                                    ? formatRupiah(voucher.min_order_amount)
                                    : 'IDR 0 (No minimum)'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Target Platform
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block">
                                {voucher.platform === 1
                                    ? 'Web Only'
                                    : voucher.platform === 2
                                      ? 'Mobile App Only'
                                      : 'All Platforms'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Quota Usage
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block">
                                {voucher.used_count} / {voucher.usage_limit ?? '∞'} (Max {voucher.usage_per_user ?? 1}x/user)
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 block text-[11px] font-medium">
                                Validity Period
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                                {formatDateEnglish(voucher.start_at)} to {formatDateEnglish(voucher.end_at)}
                            </span>
                        </div>
                    </div>

                    {/* Terms & Descriptions (Translations) */}
                    <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Globe size={14} className="text-primary" />
                                <span>Terms & Descriptions</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setDetailLocale('id')}
                                    className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                                        detailLocale === 'id'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    ID {voucher.voucher_translations?.some(t => t.locale === 'id' && t.description) ? '✓' : ''}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDetailLocale('en')}
                                    className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                                        detailLocale === 'en'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    EN {voucher.voucher_translations?.some(t => t.locale === 'en' && t.description) ? '✓' : ''}
                                </button>
                            </div>
                        </div>

                        {(() => {
                            const currentDesc = voucher.voucher_translations?.find(
                                t => t.locale === detailLocale
                            )?.description;

                            if (currentDesc) {
                                return (
                                    <div
                                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed max-h-40 overflow-y-auto [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-1"
                                        dangerouslySetInnerHTML={{ __html: currentDesc }}
                                    />
                                );
                            }

                            return (
                                <div className="p-3 bg-amber-50/50 border border-dashed border-amber-200 rounded-xl text-xs text-amber-700">
                                    No {detailLocale === 'id' ? 'Indonesian' : 'English'} translation configured yet.
                                </div>
                            );
                        })()}
                    </div>

                    <div className="text-[11px] text-slate-400 flex flex-wrap justify-between gap-2">
                        <span>
                            Created: {formatDateEnglish(voucher.created_at)}
                            {voucher.creator?.full_name ? ` by ${voucher.creator.full_name}` : ''}
                        </span>
                        <span>Updated: {formatDateEnglish(voucher.updated_at)}</span>
                    </div>
                </div>

                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.visit(route('voucher.edit', voucher.id))}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 rounded-md border border-primary/30 transition-colors"
                        >
                            <Edit size={14} />
                            <span>Edit Voucher</span>
                        </button>

                        {onOpenTranslation && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenTranslation(voucher);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                            >
                                <Globe size={14} />
                                <span>Manage Translations</span>
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-md border border-slate-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
