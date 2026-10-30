import InputAutoComplete from '@/Components/InputAutoComplete';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectOption, {
    SelectOptionProps,
    useSelectOption,
} from '@/Components/SelectOption';
import TextInput from '@/Components/TextInput';
import { useDebounce } from '@/Hooks/useDebounce';
import { api } from '@/libs/http/api';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export const titles: SelectOptionProps[] = [
    { id: 'Mr.', name: 'Mr.' },
    { id: 'Mrs.', name: 'Mrs.' },
    { id: 'Ms.', name: 'Ms.' },
];

type TravellerFormProps = {
    userId: number | '';
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
    issuingCountry: string;
    documentIssueDate: string | null;
    documentExpiryDate: string | null;
    passportNumber: string;
    passportIssuingCountry: string | null;
    passportIssueDate: string | null;
    passportExpiryDate: string | null;
};

type CustomerOption = {
    id: number;
    full_name: string;
    email: string;
};

function CreateTravellerForm() {
    const { data, setData, post, processing, errors } =
        useForm<TravellerFormProps>({
            userId: '',
            title: 'Mr.',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: '',
            documentType: '',
            documentNumber: '',
            issuingCountry: '',
            documentIssueDate: null,
            documentExpiryDate: null,
            passportNumber: '',
            passportIssuingCountry: null,
            passportIssueDate: null,
            passportExpiryDate: null,
        });

    const { selected: selectedTitle, onChange: onTitleChange } =
        useSelectOption<TravellerFormProps>(
            titles,
            data,
            setData as any,
            'title',
        );

    const [searchCustomer, setSearchCustomer] = useState('');
    const debouncedSearchCustomer = useDebounce(searchCustomer, 400);
    const [customers, setCustomers] = useState<CustomerOption[]>([]);
    const [selectedCustomerLabel, setSelectedCustomerLabel] = useState('');

    useEffect(() => {
        if (!debouncedSearchCustomer || debouncedSearchCustomer.length < 3) {
            setCustomers([]);
            return;
        }

        let isMounted = true;
        api.get<CustomerOption[]>(route('user.travellers.searchCustomers'), {
            search: debouncedSearchCustomer,
        })
            .then((res) => {
                if (isMounted) {
                    setCustomers(res ?? []);
                }
            })
            .catch((err) => console.error('Failed to fetch customers:', err));

        return () => {
            isMounted = false;
        };
    }, [debouncedSearchCustomer]);

    const [apiError, setApiError] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        post(route('user.travellers.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Submit success response (Inertia page):', page);
            },
            onError: (errors) => {
                console.log('Submit validation errors:', errors);
                setApiError('Please check the form fields and try again.');
            },
            onFinish: () => {
                console.log('Submit request completed');
            },
        });
    };

    return (
        <div className="max-w-3xl rounded-xl bg-white p-6 shadow-sm border-gray-100 mt-6 mx-auto border">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Create New Traveller
            </h2>

            <form onSubmit={submit} className="space-y-6">
                {apiError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border-red-100 border whitespace-pre-line">
                        {apiError}
                    </div>
                )}
                <div className="gap-6 sm:grid-cols-2 grid grid-cols-1">
                    <div className="sm:col-span-2">
                        <InputAutoComplete
                            name="userId"
                            label="Customer"
                            placeholder="Type customer name or email to search..."
                            setSearch={setSearchCustomer}
                            value={selectedCustomerLabel}
                            setValue={(customer: CustomerOption) => {
                                setData('userId', customer.id);
                                setSelectedCustomerLabel(
                                    `${customer.full_name} — ${customer.email}`,
                                );
                            }}
                            data={customers}
                            dataShow="full_name"
                            dataSubShow="email"
                            dataUnique="id"
                            dataKey={data.userId}
                            checkIcon={true}
                        />
                        <InputError message={errors.userId} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <SelectOption
                            id="title"
                            options={titles}
                            className="mt-1 block w-full"
                            value={selectedTitle}
                            onChange={onTitleChange}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="firstName" value="First Name" />
                        <div className="mt-1 relative">
                            <TextInput
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={data.firstName}
                                onChange={(e) =>
                                    setData('firstName', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter First Name"
                            />
                        </div>
                        <InputError
                            message={errors.firstName}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="lastName" value="Last Name" />
                        <div className="mt-1 relative">
                            <TextInput
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={data.lastName}
                                onChange={(e) =>
                                    setData('lastName', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter Last Name"
                            />
                        </div>
                        <InputError
                            message={errors.lastName}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="dateOfBirth"
                            value="Date of Birth"
                        />
                        <TextInput
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={data.dateOfBirth ?? ''}
                            onChange={(e) =>
                                setData('dateOfBirth', e.target.value)
                            }
                            className="mt-1 text-gray-600 block w-full"
                            required
                        />
                        <InputError
                            message={errors.dateOfBirth}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="nationality" value="Nationality" />
                        <div className="mt-1 relative">
                            <TextInput
                                id="nationality"
                                name="nationality"
                                type="text"
                                maxLength={8}
                                value={data.nationality}
                                onChange={(e) =>
                                    setData('nationality', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter nationality (e.g. ID)"
                            />
                        </div>
                        <InputError
                            message={errors.nationality}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="documentType"
                            value="Document Type"
                        />
                        <div className="mt-1 relative">
                            <TextInput
                                id="documentType"
                                name="documentType"
                                type="text"
                                value={data.documentType}
                                onChange={(e) =>
                                    setData('documentType', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter document type"
                            />
                        </div>
                        <InputError
                            message={errors.documentType}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="documentNumber"
                            value="Document Number"
                        />
                        <div className="mt-1 relative">
                            <TextInput
                                id="documentNumber"
                                name="documentNumber"
                                type="text"
                                value={data.documentNumber}
                                onChange={(e) =>
                                    setData('documentNumber', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter document number"
                            />
                        </div>
                        <InputError
                            message={errors.documentNumber}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="issuingCountry"
                            value="Issuing Country"
                        />
                        <div className="mt-1 relative">
                            <TextInput
                                id="issuingCountry"
                                name="issuingCountry"
                                type="text"
                                maxLength={2}
                                value={data.issuingCountry}
                                onChange={(e) =>
                                    setData('issuingCountry', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter issuing country (e.g. ID)"
                            />
                        </div>
                        <InputError
                            message={errors.issuingCountry}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="documentIssueDate"
                            value="Document Issue Date"
                        />
                        <TextInput
                            id="documentIssueDate"
                            name="documentIssueDate"
                            type="date"
                            value={data.documentIssueDate ?? ''}
                            onChange={(e) =>
                                setData(
                                    'documentIssueDate',
                                    e.target.value || null,
                                )
                            }
                            className="mt-1 text-gray-600 block w-full"
                        />
                        <InputError
                            message={errors.documentIssueDate}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="documentExpiryDate"
                            value="Document Expiry Date"
                        />
                        <TextInput
                            id="documentExpiryDate"
                            name="documentExpiryDate"
                            type="date"
                            value={data.documentExpiryDate ?? ''}
                            onChange={(e) =>
                                setData(
                                    'documentExpiryDate',
                                    e.target.value || null,
                                )
                            }
                            className="mt-1 text-gray-600 block w-full"
                        />
                        <InputError
                            message={errors.documentExpiryDate}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="passportNumber"
                            value="Passport Number"
                        />
                        <div className="mt-1 relative">
                            <TextInput
                                id="passportNumber"
                                name="passportNumber"
                                type="text"
                                value={data.passportNumber}
                                onChange={(e) =>
                                    setData('passportNumber', e.target.value)
                                }
                                className="pl-3 block w-full"
                                required
                                placeholder="Enter passport number"
                            />
                        </div>
                        <InputError
                            message={errors.passportNumber}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="passportIssuingCountry"
                            value="Passport Issuing Country"
                        />
                        <div className="mt-1 relative">
                            <TextInput
                                id="passportIssuingCountry"
                                name="passportIssuingCountry"
                                type="text"
                                maxLength={2}
                                value={data.passportIssuingCountry ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'passportIssuingCountry',
                                        e.target.value || null,
                                    )
                                }
                                className="pl-3 block w-full"
                                placeholder="Enter Passport Issuing Country"
                            />
                        </div>
                        <InputError
                            message={errors.passportIssuingCountry}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="passportIssueDate"
                            value="Passport Issue Date"
                        />
                        <TextInput
                            id="passportIssueDate"
                            name="passportIssueDate"
                            type="date"
                            value={data.passportIssueDate ?? ''}
                            onChange={(e) =>
                                setData(
                                    'passportIssueDate',
                                    e.target.value || null,
                                )
                            }
                            className="mt-1 text-gray-600 block w-full"
                        />
                        <InputError
                            message={errors.passportIssueDate}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="passportExpiryDate"
                            value="Passport Expiry Date"
                        />
                        <TextInput
                            id="passportExpiryDate"
                            name="passportExpiryDate"
                            type="date"
                            value={data.passportExpiryDate ?? ''}
                            onChange={(e) =>
                                setData(
                                    'passportExpiryDate',
                                    e.target.value || null,
                                )
                            }
                            className="mt-1 text-gray-600 block w-full"
                        />
                        <InputError
                            message={errors.passportExpiryDate}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="border-gray-100 pt-6 gap-3 flex items-center justify-end border-t">
                    <button
                        type="button"
                        onClick={() =>
                            router.visit(route('user.travellers.index'))
                        }
                        className="rounded-xl border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 border transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <PrimaryButton
                        className="py-2.5 px-6 rounded-xl"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export default CreateTravellerForm;
