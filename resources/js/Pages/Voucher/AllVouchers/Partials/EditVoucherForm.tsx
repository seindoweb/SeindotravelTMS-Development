import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { router, useForm } from '@inertiajs/react';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { VoucherItem } from './VoucherDetailModal';
import SelectOption, { useSelectOption } from '@/Components/SelectOption';

interface EditVoucherFormProps {
    voucher: VoucherItem;
    productAttribute: string; // 'flight' | 'hotel' | 'tour'
    productTitle: string; // 'Flight' | 'Hotel' | 'Tour'
}

const voucher_type = [
    { id: 'general', name: 'General' },
    { id: 'signup', name: 'Sign Up Member' },
];

const distribution_type = [
    { id: 'public', name: 'Public (All Users)' },
    { id: 'personal', name: 'Personal (Specific Users)' },
];

const platform = [
    { id: '0', name: 'All Platforms' },
    { id: '1', name: 'Web Only' },
    { id: '2', name: 'Mobile App Only' },
];

const discount_type = [
    { id: 'percentage', name: 'Percentage (%)' },
    { id: 'fixed', name: 'Fixed Amount (IDR)' },
];

const formatForDateTimeLocal = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

export default function EditVoucherForm({
    voucher,
    productAttribute,
    productTitle,
}: EditVoucherFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        voucher.image_url || null,
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'patch',
        name: voucher.name || '',
        product_attribute: productAttribute,
        image: null as File | null,
        delete_image: false,
        voucher_type: voucher.voucher_type || 'general',
        distribution_type: voucher.distribution_type || 'public',
        discount_type: (voucher.discount_type || 'percentage') as
            'percentage' | 'fixed',
        discount_value: String(voucher.discount_value ?? ''),
        max_discount: voucher.max_discount ? String(voucher.max_discount) : '',
        min_order_amount: String(voucher.min_order_amount ?? '0'),
        start_at: formatForDateTimeLocal(voucher.start_at),
        end_at: formatForDateTimeLocal(voucher.end_at),
        usage_limit: voucher.usage_limit ? String(voucher.usage_limit) : '',
        usage_per_user: String(voucher.usage_per_user ?? '1'),
        platform: String(voucher.platform ?? '0'),
    });

    const { selected: selectedVoucherType, onChange: onVoucherTypeChange } =
        useSelectOption<any>(
            voucher_type,
            data,
            setData as any,
            'voucher_type',
        );

    const {
        selected: selectedDistributionType,
        onChange: onDistributionTypeChange,
    } = useSelectOption<any>(
        distribution_type,
        data,
        setData as any,
        'distribution_type',
    );

    const { selected: selectedPlatform, onChange: onPlatformChange } =
        useSelectOption<any>(platform, data, setData as any, 'platform');

    const { selected: selectedDiscountType, onChange: onDiscountTypeChange } =
        useSelectOption<any>(
            discount_type,
            data,
            setData as any,
            'discount_type',
        );

    const getIndexUrl = () => {
        const routeMap: Record<string, string> = {
            flight: route('voucher.indexFlight'),
            hotel: route('voucher.indexHotel'),
            tour: route('voucher.indexTour'),
        };
        return routeMap[productAttribute] || route('voucher.indexHotel');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                image: file,
                delete_image: false,
            }));
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            image: null,
            delete_image: true,
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('voucher.dataUpdate', voucher.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="max-w-4xl rounded-2xl bg-white p-6 sm:p-8 shadow-sm mx-auto border border-[#E2E8F0]">
            <div className="pb-5 mb-6 sm:flex-row sm:items-center gap-2 flex flex-col justify-between border-b border-[#E2E8F0]">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit {productTitle} Voucher #{voucher.id}
                    </h2>
                    <p className="mt-1 text-xs text-quaternary">
                        Update configuration and terms for {productTitle}{' '}
                        voucher.
                    </p>
                </div>
                <div className="text-xs">
                    <span
                        className={`font-semibold px-2.5 py-1 inline-block rounded-full ${
                            voucher.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        Current Status:{' '}
                        {voucher.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="gap-2 md:grid-cols-2 grid grid-cols-1">
                    <div>
                        <InputLabel value="Banner / Voucher Image (Optional)" />
                        <div className="mt-1.5 gap-4 flex items-center">
                            {imagePreview ? (
                                <div className="w-40 h-24 rounded-lg bg-slate-50 relative shrink-0 overflow-hidden border border-[#E2E8F0]">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="p-1 text-white top-1 right-1 bg-black/60 hover:bg-black/80 absolute rounded-full transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="w-40 h-24 border-gray-300 rounded-lg hover:border-gray-400 bg-gray-50 hover:bg-gray-100/60 flex shrink-0 cursor-pointer flex-col items-center justify-center border border-dashed transition-colors"
                                >
                                    <ImageIcon
                                        size={22}
                                        className="text-gray-400"
                                    />
                                    <span className="text-gray-500 mt-1 font-medium text-[11px]">
                                        Select Image
                                    </span>
                                </div>
                            )}
                            <div className="text-xs text-gray-500">
                                <p className="font-semibold text-gray-700">
                                    Supported formats
                                </p>
                                <p className="text-gray-400 mt-0.5 text-[11px]">
                                    PNG, JPG, WebP up to 2MB. Recommended
                                    landscape aspect ratio.
                                </p>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="mt-1 text-xs font-medium text-primary block hover:underline"
                                    >
                                        Change Image
                                    </button>
                                )}
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                        />
                        <InputError message={errors.image} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Voucher Name" />
                        <textarea
                            rows={3}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Add voucher name here..."
                            className="p-3 mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 block w-full"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                </div>

                <div className="gap-5 md:grid-cols-2 grid grid-cols-1">
                    <div>
                        <InputLabel value="Voucher Type" />
                        <SelectOption
                            options={voucher_type}
                            className="mt-1 block w-full"
                            value={selectedVoucherType}
                            onChange={onVoucherTypeChange}
                        />
                        <InputError
                            message={errors.voucher_type}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel value="Distribution Type" />
                        <SelectOption
                            options={distribution_type}
                            className="mt-1 block w-full"
                            value={selectedDistributionType}
                            onChange={onDistributionTypeChange}
                        />
                        <InputError
                            message={errors.distribution_type}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="gap-5 md:grid-cols-3 grid grid-cols-1">
                    <div>
                        <InputLabel value="Discount Type" />
                        <SelectOption
                            options={discount_type}
                            className="mt-1 block w-full"
                            value={selectedDiscountType}
                            onChange={onDiscountTypeChange}
                        />
                        <InputError
                            message={errors.discount_type}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            value={
                                data.discount_type === 'percentage'
                                    ? 'Discount Value (%)'
                                    : 'Discount Value (IDR)'
                            }
                        />
                        <TextInput
                            type="number"
                            min="0"
                            step={
                                data.discount_type === 'percentage'
                                    ? '0.1'
                                    : '1000'
                            }
                            max={
                                data.discount_type === 'percentage'
                                    ? '100'
                                    : undefined
                            }
                            value={data.discount_value}
                            onChange={(e) =>
                                setData('discount_value', e.target.value)
                            }
                            placeholder={
                                data.discount_type === 'percentage'
                                    ? 'e.g. 10'
                                    : 'e.g. 50000'
                            }
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError
                            message={errors.discount_value}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel
                            value={
                                data.discount_type === 'percentage'
                                    ? 'Max. Discount (IDR)'
                                    : 'Max. Discount (IDR) — N/A'
                            }
                        />
                        <TextInput
                            type="number"
                            min="0"
                            step="1000"
                            disabled={data.discount_type === 'fixed'}
                            value={
                                data.discount_type === 'fixed'
                                    ? ''
                                    : data.max_discount
                            }
                            onChange={(e) =>
                                setData('max_discount', e.target.value)
                            }
                            placeholder={
                                data.discount_type === 'percentage'
                                    ? 'Optional, e.g. 100000'
                                    : 'Not applicable for fixed discount'
                            }
                            className={`mt-1 block w-full ${
                                data.discount_type === 'fixed'
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none'
                                    : ''
                            }`}
                        />
                        <p className="text-gray-400 mt-1 text-[10px]">
                            {data.discount_type === 'percentage'
                                ? 'Maximum discount cap in IDR (optional)'
                                : 'Automatically disabled for fixed discount'}
                        </p>
                        <InputError
                            message={errors.max_discount}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="gap-5 md:grid-cols-3 grid grid-cols-1">
                    <div>
                        <InputLabel value="Min. Order Amount (IDR)" />
                        <TextInput
                            type="number"
                            min="0"
                            step="1000"
                            value={data.min_order_amount}
                            onChange={(e) =>
                                setData('min_order_amount', e.target.value)
                            }
                            placeholder="0"
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.min_order_amount}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel value="Total Quota (Optional)" />
                        <TextInput
                            type="number"
                            min="1"
                            value={data.usage_limit}
                            onChange={(e) =>
                                setData('usage_limit', e.target.value)
                            }
                            placeholder="Unlimited"
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.usage_limit}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel value="Limit per User" />
                        <TextInput
                            type="number"
                            min="1"
                            value={data.usage_per_user}
                            onChange={(e) =>
                                setData('usage_per_user', e.target.value)
                            }
                            placeholder="1"
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.usage_per_user}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="gap-5 md:grid-cols-3 grid grid-cols-1">
                    <div>
                        <InputLabel value="Start Date" />
                        <TextInput
                            type="datetime-local"
                            value={data.start_at}
                            onChange={(e) =>
                                setData('start_at', e.target.value)
                            }
                            className="mt-1 text-xs text-gray-700 block w-full"
                        />
                        <InputError
                            message={errors.start_at}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <InputLabel value="End Date" />
                        <TextInput
                            type="datetime-local"
                            value={data.end_at}
                            onChange={(e) => setData('end_at', e.target.value)}
                            className="mt-1 text-xs text-gray-700 block w-full"
                        />
                        <InputError message={errors.end_at} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Target Platform" />
                        <SelectOption
                            options={platform}
                            className="mt-1 block w-full"
                            value={selectedPlatform}
                            onChange={onPlatformChange}
                        />
                        <InputError
                            message={errors.platform}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="pt-6 gap-3 mt-8 flex items-center justify-end border-t border-[#E2E8F0]">
                    <button
                        type="button"
                        onClick={() => router.visit(getIndexUrl())}
                        className="rounded-xl border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 border transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <PrimaryButton
                        className="py-2.5 px-6 rounded-xl"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
