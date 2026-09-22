import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectOption, { useSelectOption } from '@/Components/SelectOption';
import TextInput from '@/Components/TextInput';
import { hotelMicroserviceApi } from '@/libs/http/mikroserviceApi';
import { PageProps } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

const markupTypes = [
    { id: 'fixed', name: 'Fixed Amount' },
    { id: 'percent', name: 'Percentage (%)' },
];

type MarkupFormProps = {
    markupType: string;
    description: string;
    scopeCode: string;
    markupValue: string;
    isActive: boolean;
    validFrom: string | null;
    validUntil: string | null;
};

export default function CreateMarkUpHotelForm() {
    const { data, setData, setError, clearErrors, errors } =
        useForm<MarkupFormProps>({
            markupType: 'fixed',
            description: '',
            scopeCode: '',
            markupValue: '',
            isActive: true,
            validFrom: null,
            validUntil: null,
        });

    const { auth } = usePage<PageProps>().props;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { selected: selectedMarkupType, onChange: onMarkupTypeChange } =
        useSelectOption<MarkupFormProps>(
            markupTypes,
            data,
            setData as any,
            'markupType',
        );

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
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
        clearErrors();

        try {
            const payload = {
                ...data,
                markupValue: Number(data.markupValue) || 0,
                validFrom: data.validFrom
                    ? new Date(data.validFrom).toISOString()
                    : null,
                validUntil: data.validUntil
                    ? new Date(data.validUntil).toISOString()
                    : null,
                email: auth.user.email,
                scopeType: 'htl',
            };

            const res = await hotelMicroserviceApi.post(
                '/markup-rule/store',
                payload,
            );

            if (res.data?.meta?.code === 200) {
                router.visit(route('hotel.markups.hotel.index'));
            } else {
                setError(
                    res.data?.meta?.message || 'Failed to create markup rule.',
                );
            }
        } catch (error: any) {
            console.error('failed to create markup:', error);
            // console.log("resp api:", error?.response?.data);

            const errorMessage =
                error?.response?.data?.meta?.message ||
                error?.response?.data?.data?.errors?.body ||
                'An error occurred while creating the markup rule.';

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl rounded-xl bg-white p-6 shadow-sm border-gray-100 mt-6 mx-auto border">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Create New Hotel Markup
            </h2>

            <form onSubmit={submit} className="space-y-6">
                {errors && Object.keys(errors).length > 0 && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border-red-100 border">
                        {Object.values(errors)[0]}
                    </div>
                )}

                <div className="gap-6 sm:grid-cols-2 grid grid-cols-1">
                    <div className="sm:col-span-2">
                        <InputLabel
                            htmlFor="scopeCode"
                            value="Hotel Code (Scope Code)"
                        />
                        <TextInput
                            id="scopeCode"
                            name="scopeCode"
                            type="text"
                            value={data.scopeCode}
                            className="mt-1 block w-full"
                            onChange={handleChange}
                            required
                            placeholder="e.g. ID10000888"
                        />
                        <InputError
                            message={errors.scopeCode}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="markupType" value="Markup Type" />
                        <SelectOption
                            options={markupTypes}
                            className="mt-1 block w-full"
                            value={selectedMarkupType}
                            onChange={onMarkupTypeChange}
                        />
                        <InputError
                            message={errors.markupType}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="markupValue"
                            value="Markup Value"
                        />
                        <div className="mt-1 relative">
                            <TextInput
                                id="markupValue"
                                name="markupValue"
                                type="number"
                                min="0"
                                step="any"
                                value={data.markupValue}
                                className="pl-3 block w-full"
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </div>
                        <InputError
                            message={errors.markupValue}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="validFrom"
                            value="Valid From (Optional)"
                        />
                        <TextInput
                            id="validFrom"
                            name="validFrom"
                            type="datetime-local"
                            value={data.validFrom ?? ''}
                            className="mt-1 text-gray-600 block w-full"
                            onChange={handleChange}
                        />
                        <InputError
                            message={errors.validFrom}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="validUntil"
                            value="Valid Until (Optional)"
                        />
                        <TextInput
                            id="validUntil"
                            name="validUntil"
                            type="datetime-local"
                            value={data.validUntil ?? ''}
                            className="mt-1 text-gray-600 block w-full"
                            onChange={handleChange}
                        />
                        <InputError
                            message={errors.validUntil}
                            className="mt-2"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel
                            htmlFor="description"
                            value="Description (Optional)"
                        />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm block w-full"
                            rows={3}
                            placeholder="Enter any notes or description here..."
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="gap-3 flex cursor-pointer items-center">
                            <Checkbox
                                name="isActive"
                                checked={data.isActive}
                                onChange={handleChange}
                                className="h-5 w-5 text-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Set as Active
                            </span>
                        </label>
                    </div>
                </div>

                <div className="border-gray-100 pt-6 gap-3 flex items-center justify-end border-t">
                    <button
                        type="button"
                        onClick={() =>
                            router.visit(route('hotel.markups.hotel.index'))
                        }
                        className="rounded-xl border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 border transition-all active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <PrimaryButton
                        className="py-2.5 px-6 rounded-xl"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Markup'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
