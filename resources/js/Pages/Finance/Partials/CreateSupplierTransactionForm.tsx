import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectOption, { useSelectOption } from '@/Components/SelectOption';
import TextInput from '@/Components/TextInput';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
import { SupplierBalanceItem, SupplierItem } from './SupplierTransactionTable';
import { formatRupiah } from '@/helpers';

export const TRANSACTION_TYPE_OPTIONS = [
    { id: 'topup', name: 'Top Up / Deposit (+)' },
    { id: 'initial', name: 'Initial / Opening Balance (+)' },
    { id: 'usage', name: 'Usage / Booking Deduction (-)' },
    { id: 'refund', name: 'Refund / Return (+)' },
    { id: 'adjustment_in', name: 'Adjustment In (+)' },
    { id: 'adjustment_out', name: 'Adjustment Out (-)' },
    { id: 'payment', name: 'Payment' },
];

export const REFERENCE_TYPE_OPTIONS = [
    { id: 'manual', name: 'Manual' },
    { id: 'opening_balance', name: 'Opening Balance' },
    { id: 'booking', name: 'Booking' },
    { id: 'booking_cancellation', name: 'Booking Cancellation' },
    { id: 'booking_refund', name: 'Booking Refund' },
    { id: 'credit_payment', name: 'Credit Payment' },
];

interface CreateSupplierTransactionFormProps {
    supplier: SupplierItem | null;
    balance: SupplierBalanceItem | null;
    storeUrl: string;
    backUrl: string;
    supplierTitle: string;
    categoryTitle: string;
}

export default function CreateSupplierTransactionForm({
    supplier,
    balance,
    storeUrl,
    backUrl,
    supplierTitle,
    categoryTitle,
}: CreateSupplierTransactionFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        transaction_type: 'topup',
        reference_type: 'manual',
        amount: '',
        description: '',
    });

    const {
        selected: selectedTransactionType,
        onChange: onTransactionTypeChange,
    } = useSelectOption<any>(
        TRANSACTION_TYPE_OPTIONS,
        data,
        setData as any,
        'transaction_type',
    );

    const { selected: selectedReferenceType, onChange: onReferenceTypeChange } =
        useSelectOption<any>(
            REFERENCE_TYPE_OPTIONS,
            data,
            setData as any,
            'reference_type',
        );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(storeUrl, {
            preserveScroll: true,
        });
    };

    return (
        <div className="max-w-2xl space-y-4 mx-auto">
            <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-[#E2E8F0]">
                <div className="pb-4 mb-6 border-b border-[#E2E8F0]">
                    <h2 className="text-lg font-bold text-gray-900">
                        Record {supplierTitle} Transaction
                    </h2>
                    <p className="mt-1 text-xs text-quaternary">
                        Input transaction type, reference type, amount, and
                        description for {supplierTitle} ({categoryTitle}).
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="gap-5 md:grid-cols-2 grid grid-cols-1">
                        <div>
                            <InputLabel value="Transaction Type *" />
                            <SelectOption
                                options={TRANSACTION_TYPE_OPTIONS}
                                className="mt-1 block w-full"
                                value={selectedTransactionType}
                                onChange={onTransactionTypeChange}
                            />
                            <InputError
                                message={errors.transaction_type}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <InputLabel value="Reference Type *" />
                            <SelectOption
                                options={REFERENCE_TYPE_OPTIONS}
                                className="mt-1 block w-full"
                                value={selectedReferenceType}
                                onChange={onReferenceTypeChange}
                            />
                            <InputError
                                message={errors.reference_type}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Amount (IDR) *" />
                        <div className="mt-1 rounded-md shadow-sm relative">
                            <TextInput
                                type="number"
                                min={1}
                                step={1}
                                required
                                value={data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value)
                                }
                                placeholder="e.g. 5000000"
                                className="block w-full"
                            />
                        </div>
                        {data.amount && Number(data.amount) > 0 && (
                            <p className="mt-1 font-mono text-xs font-semibold text-emerald-700">
                                Equivalent: {formatRupiah(data.amount)}
                            </p>
                        )}
                        <InputError message={errors.amount} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Description / Notes (Optional)" />
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Add reason, payment reference, invoice number, or deposit confirmation notes..."
                            className="p-3 mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 block w-full"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-1"
                        />
                    </div>

                    <div className="gap-3 pt-4 flex items-center justify-end border-t border-[#E2E8F0]">
                        <button
                            type="button"
                            onClick={() => router.visit(backUrl)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 border-slate-300 border transition-colors"
                        >
                            Cancel
                        </button>

                        <PrimaryButton disabled={processing}>
                            {processing
                                ? 'Submitting...'
                                : 'Submit Transaction'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
