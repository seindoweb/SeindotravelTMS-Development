import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TablePaginate from '@/Components/TablePaginate';
import TextInput from '@/Components/TextInput';
import { formatDate } from '@/helpers';
import { api } from '@/libs/http/api';
import { Paginate, UserProps } from '@/types';
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Check, Loader2, Search, User, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

export interface SelectCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (customer: UserProps) => void;
    selectedCustomerId?: string | number;
}

export default function SelectCustomerModal({
    isOpen,
    onClose,
    onSelect,
    selectedCustomerId,
}: SelectCustomerModalProps) {
    const [search, setSearch] = useState('');
    const [pageData, setPageData] = useState<Paginate<UserProps> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchCustomers = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === 'string'
                    ? await api.get<Paginate<UserProps>>(urlOrPage, { search })
                    : await api.get<Paginate<UserProps>>(
                          route('user.customers.dataList'),
                          {
                              page: urlOrPage,
                              search,
                          },
                      );
            setPageData(res);
        } catch (error) {
            console.error('Failed to retrieve customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                fetchCustomers(1);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search, isOpen]);

    const customers = pageData?.data ?? [];

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="inset-0 bg-slate-900/60 backdrop-blur-xs fixed transition-opacity" />
                </TransitionChild>

                <div className="inset-0 p-4 sm:p-6 md:p-10 fixed z-10 flex items-center justify-center overflow-y-auto">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="max-w-4xl bg-white rounded-2xl shadow-2xl border-slate-200 flex max-h-[90vh] w-full flex-col overflow-hidden border">
                            <div className="px-6 py-4 border-slate-100 bg-slate-50/50 flex items-center justify-between border-b">
                                <div className="gap-3 flex items-center">
                                    <div className="w-10 h-10 font-bold rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">
                                            Select Customer
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Select registered customer data as
                                            ticket purchaser
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-4 bg-white border-slate-100 border-b">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="left-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2"
                                    />
                                    <TextInput
                                        type="text"
                                        placeholder="Search by customer name..."
                                        className="py-2 pl-10 pr-4 text-xs sm:text-sm w-full"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="p-4 flex-1 overflow-x-auto">
                                {loading && !pageData ? (
                                    <div className="gap-3 py-16 text-slate-400 flex flex-col items-center justify-center">
                                        <Loader2
                                            size={28}
                                            className="animate-spin text-primary"
                                        />
                                        <span className="text-xs">
                                            Loading customer data...
                                        </span>
                                    </div>
                                ) : customers.length === 0 ? (
                                    <div className="py-16 text-xs text-slate-400 text-center">
                                        No customer found.
                                    </div>
                                ) : (
                                    <table className="text-xs w-full text-left">
                                        <thead>
                                            <tr className="border-slate-100 text-slate-400 tracking-wider border-b text-[10px] uppercase">
                                                <th className="px-3 py-3 font-bold">
                                                    Customer Name
                                                </th>
                                                <th className="px-3 py-3 font-bold">
                                                    Email
                                                </th>
                                                <th className="px-3 py-3 font-bold">
                                                    Phone
                                                </th>
                                                <th className="px-3 py-3 font-bold">
                                                    Birthdate
                                                </th>
                                                <th className="px-3 py-3 font-bold text-right">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-slate-50 divide-y">
                                            {customers.map((c, idx) => {
                                                const isSelected =
                                                    String(
                                                        selectedCustomerId,
                                                    ) ===
                                                    String(
                                                        c.index || c.key || idx,
                                                    );
                                                return (
                                                    <tr
                                                        key={
                                                            c.key ||
                                                            c.index ||
                                                            idx
                                                        }
                                                        className={`hover:bg-slate-50/80 transition-colors ${
                                                            isSelected
                                                                ? 'bg-primary/5'
                                                                : ''
                                                        }`}
                                                    >
                                                        <td className="px-3 py-3">
                                                            <div className="font-bold text-slate-800">
                                                                {c.title
                                                                    ? `${c.title} `
                                                                    : ''}
                                                                {c.full_name}
                                                            </div>
                                                            <span className="text-slate-400 text-[10px]">
                                                                ID:{' '}
                                                                {c.tracking_code ||
                                                                    c.index ||
                                                                    '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3 text-slate-600">
                                                            {c.email || '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-slate-600">
                                                            {c.phone_number
                                                                ? `${c.dial_code || ''} ${c.phone_number}`
                                                                : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-slate-600">
                                                            {c.date_of_birth
                                                                ? formatDate(
                                                                      c.date_of_birth,
                                                                  )
                                                                : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-right">
                                                            <PrimaryButton
                                                                type="button"
                                                                onClick={() => {
                                                                    onSelect(c);
                                                                    onClose();
                                                                }}
                                                                className={`py-1.5 px-3 text-xs ${
                                                                    isSelected
                                                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {isSelected ? (
                                                                    <span className="gap-1 flex items-center">
                                                                        <Check
                                                                            size={
                                                                                12
                                                                            }
                                                                        />{' '}
                                                                        Selected
                                                                    </span>
                                                                ) : (
                                                                    'Select'
                                                                )}
                                                            </PrimaryButton>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {pageData &&
                                pageData.links &&
                                pageData.links.length > 3 && (
                                    <TablePaginate
                                        page={pageData}
                                        loading={loading}
                                        onNavigate={(url) =>
                                            fetchCustomers(url)
                                        }
                                    />
                                )}

                            <div className="px-6 py-3 border-slate-100 bg-slate-50 flex justify-end border-t">
                                <SecondaryButton
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-xs"
                                >
                                    Close
                                </SecondaryButton>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
