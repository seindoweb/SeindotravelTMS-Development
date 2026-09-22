import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectOption, { useSelectOption } from '@/Components/SelectOption';
import TextInput from '@/Components/TextInput';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { MarkupDestinationProps, PageProps } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

const markupTypes = [
    { id: 'fixed', name: 'Fixed Amount' },
    { id: 'percent', name: 'Percentage (%)' },
];

type MarkupFormProps = {
    key: number;
    markupType: string;
    description: string;
    scopeCode: string;
    markupValue: string | number;
    isActive: boolean;
    validFrom: string | null;
    validUntil: string | null;
};

const formatForInput = (dateStr: string | null) => {
    if (!dateStr) return "";
    return dateStr.substring(0, 16);
};

export default function EditMarkUpDestinationForm({ initialData }: { initialData: MarkupDestinationProps }) {
    const {
        data,
        setData,
        errors,
    } = useForm<MarkupFormProps>({
        key: Number(initialData.key),
        markupType: initialData.markupType || "fixed",
        description: initialData.description || "",
        scopeCode: initialData.scopeCode || "",
        markupValue: initialData.markupValue || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        validFrom: formatForInput(initialData.validFrom),
        validUntil: formatForInput(initialData.validUntil),
    });

    const { auth } = usePage<PageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { selected: selectedMarkupType, onChange: onMarkupTypeChange } = useSelectOption<MarkupFormProps>(
        markupTypes,
        data,
        setData as any,
        'markupType'
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setData(name as keyof MarkupFormProps, checked as any);
        } else {
            setData(name as keyof MarkupFormProps, value as any);
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setApiError(null);

        try {
            const payload = {
                ...data,
                markupValue: Number(data.markupValue) || 0,
                validFrom: data.validFrom ? new Date(data.validFrom).toISOString() : null,
                validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
                email: auth.user.email,
                scopeType: "dst"
            };

            const res = await hotelMicroserviceApi.post('/markup-rule/change', payload);
            
            if (res.data?.meta?.code === 200) {
                router.visit(route('hotel.markups.destination.index'));
            } else {
                setApiError(res.data?.meta?.message || 'Failed to update markup rule.');
            }
        } catch (error: any) {
            console.error("failed to update markup:", error);

            const errData = error?.response?.data?.data?.errors;
            if (errData && typeof errData === 'object') {
                const messages = Object.entries(errData)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join('\n');
                setApiError(messages);
            } else {
                setApiError(
                    error?.response?.data?.meta?.message ||
                    'An error occurred while updating the markup rule.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Destination Markup</h2>
            
            <form onSubmit={submit} className="space-y-6">
                {apiError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 whitespace-pre-line">
                        {apiError}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="scopeCode" value="Destination Code (Scope Code)" />
                        <TextInput
                            id="scopeCode"
                            name="scopeCode"
                            type="text"
                            value={data.scopeCode}
                            className="mt-1 block w-full bg-gray-50 text-gray-500"
                            onChange={handleChange}
                            required
                            readOnly
                        />
                        <InputError message={errors.scopeCode} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="markupType" value="Markup Type" />
                        <SelectOption
                            options={markupTypes}
                            className="block w-full mt-1"
                            value={selectedMarkupType}
                            onChange={onMarkupTypeChange}
                        />
                        <InputError message={errors.markupType} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="markupValue" value="Markup Value" />
                        <div className="relative mt-1">
                            <TextInput
                                id="markupValue"
                                name="markupValue"
                                type="number"
                                min="0"
                                step="any"
                                value={data.markupValue as any}
                                className="block w-full pl-3"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError message={errors.markupValue} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="validFrom" value="Valid From (Optional)" />
                        <TextInput
                            id="validFrom"
                            name="validFrom"
                            type="datetime-local"
                            value={data.validFrom ?? ""}
                            className="mt-1 block w-full text-gray-600"
                            onChange={handleChange}
                        />
                        <InputError message={errors.validFrom} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="validUntil" value="Valid Until (Optional)" />
                        <TextInput
                            id="validUntil"
                            name="validUntil"
                            type="datetime-local"
                            value={data.validUntil ?? ""}
                            className="mt-1 block w-full text-gray-600"
                            onChange={handleChange}
                        />
                        <InputError message={errors.validUntil} className="mt-2" />
                    </div>
                    
                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="description" value="Description (Optional)" />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            rows={3}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    
                    <div className="sm:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <Checkbox
                                name="isActive"
                                checked={data.isActive}
                                onChange={handleChange}
                                className="h-5 w-5 text-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">Set as Active</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end border-t border-gray-100 pt-6 gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit(route('hotel.markups.destination.index'))}
                        className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <PrimaryButton className="py-2.5 px-6 rounded-xl" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Markup'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}