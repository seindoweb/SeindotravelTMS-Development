import { formatRupiah } from '@/helpers';
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
    name: string;
    product_attribute_id: number;
    image_path?: string | null;
    image_url: string;
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
        <div className="inset-0 p-4 bg-slate-900/50 backdrop-blur-sm fixed z-50 flex items-center justify-center">
            <div
                className="max-w-xl bg-white rounded-xl shadow-xl border-slate-200 relative flex max-h-[90vh] w-full flex-col overflow-hidden border"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 bg-white border-slate-200 flex items-center justify-between border-b">
                    <div>
                        <div className="gap-2 flex items-center">
                            <h3 className="text-base font-semibold text-slate-900">
                                Voucher Details #{voucher.id}
                            </h3>
                            {voucher.index && (
                                <span className="font-mono text-xs text-slate-400">
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
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                    <div className="rounded-lg border-slate-200 bg-slate-50 overflow-hidden border">
                        <img
                            src={voucher?.image_url}
                            alt={`Voucher ${voucher.id}`}
                            className="h-44 m-auto w-auto object-cover"
                        />
                    </div>

                    <div>
                        <span className="text-slate-400 font-medium block text-[11px]">
                            Voucher Name
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 text-xs block capitalize">
                            {voucher.name}
                        </span>
                    </div>

                    <div className="py-4 text-xs gap-x-6 gap-y-4 border-slate-100 grid grid-cols-2 border-y">
                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Product Category
                            </span>
                            <span className="font-semibold text-slate-800 mt-0.5 block capitalize">
                                {voucher.product_attribute?.product ||
                                    voucher.product_attribute?.attribute ||
                                    '-'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Voucher Status
                            </span>
                            <span
                                className={`mt-0.5 font-semibold text-xs px-2 py-0.5 rounded inline-block ${
                                    voucher.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {voucher.status === 'active'
                                    ? 'Active'
                                    : 'Draft'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Voucher Type
                            </span>
                            <span className="font-semibold text-slate-800 mt-0.5 block capitalize">
                                {voucher.voucher_type === 'signup'
                                    ? 'Sign Up Member'
                                    : 'General'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Distribution
                            </span>
                            <span className="font-semibold text-slate-800 mt-0.5 block capitalize">
                                {voucher.distribution_type === 'personal'
                                    ? 'Personal (Specific Users)'
                                    : 'Public (All Users)'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Discount Value
                            </span>
                            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
                                {isPercentage
                                    ? `${voucher.discount_value}%`
                                    : formatRupiah(voucher.discount_value)}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
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
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Min. Order Amount
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block">
                                {Number(voucher.min_order_amount) > 0
                                    ? formatRupiah(voucher.min_order_amount)
                                    : 'IDR 0 (No minimum)'}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
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
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Quota Usage
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 block">
                                {voucher.used_count} /{' '}
                                {voucher.usage_limit ?? '∞'} (Max{' '}
                                {voucher.usage_per_user ?? 1}x/user)
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block text-[11px]">
                                Validity Period
                            </span>
                            <span className="font-medium text-slate-800 mt-0.5 leading-relaxed block">
                                {formatDateEnglish(voucher.start_at)} to{' '}
                                {formatDateEnglish(voucher.end_at)}
                            </span>
                        </div>
                    </div>

                    {/* Terms & Descriptions (Translations) */}
                    <div className="pt-2 border-slate-100 border-t">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 gap-1.5 flex items-center">
                                <Globe size={14} className="text-primary" />
                                <span>Terms & Descriptions</span>
                            </span>
                            <div className="gap-1 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setDetailLocale('id')}
                                    className={`px-2 py-0.5 font-semibold rounded text-[11px] ${
                                        detailLocale === 'id'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    ID{' '}
                                    {voucher.voucher_translations?.some(
                                        (t) =>
                                            t.locale === 'id' && t.description,
                                    )
                                        ? '✓'
                                        : ''}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDetailLocale('en')}
                                    className={`px-2 py-0.5 font-semibold rounded text-[11px] ${
                                        detailLocale === 'en'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    EN{' '}
                                    {voucher.voucher_translations?.some(
                                        (t) =>
                                            t.locale === 'en' && t.description,
                                    )
                                        ? '✓'
                                        : ''}
                                </button>
                            </div>
                        </div>

                        {(() => {
                            const currentDesc =
                                voucher.voucher_translations?.find(
                                    (t) => t.locale === detailLocale,
                                )?.description;

                            if (currentDesc) {
                                return (
                                    <div
                                        className="p-3 bg-slate-50 border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed max-h-40 [&_ul]:pl-4 [&_ol]:pl-4 [&_p]:mb-1 overflow-y-auto border [&_ol]:list-decimal [&_ul]:list-disc"
                                        dangerouslySetInnerHTML={{
                                            __html: currentDesc,
                                        }}
                                    />
                                );
                            }

                            return (
                                <div className="p-3 text-xs bg-amber-50/50 border-amber-200 rounded-xl text-amber-700 border border-dashed">
                                    No{' '}
                                    {detailLocale === 'id'
                                        ? 'Indonesian'
                                        : 'English'}{' '}
                                    translation configured yet.
                                </div>
                            );
                        })()}
                    </div>

                    <div className="text-slate-400 gap-2 flex flex-wrap justify-between text-[11px]">
                        <span>
                            Created: {formatDateEnglish(voucher.created_at)}
                            {voucher.creator?.full_name
                                ? ` by ${voucher.creator.full_name}`
                                : ''}
                        </span>
                        <span>
                            Updated: {formatDateEnglish(voucher.updated_at)}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-3 border-slate-200 bg-slate-50 flex items-center justify-between border-t">
                    <div className="gap-2 flex items-center">
                        <button
                            type="button"
                            onClick={() =>
                                router.visit(route('voucher.edit', voucher.id))
                            }
                            className="gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 rounded-md border-primary/30 inline-flex items-center border transition-colors"
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
                                className="gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border-emerald-200 inline-flex items-center border transition-colors"
                            >
                                <Globe size={14} />
                                <span>Manage Translations</span>
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-md text-slate-700 hover:bg-slate-200/60 border-slate-300 border transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
