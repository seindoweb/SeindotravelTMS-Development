import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TablePaginate from '@/Components/TablePaginate';
import TextInput from '@/Components/TextInput';
import { api } from '@/libs/http/api';
import { Paginate, TravellerProps, UserProps } from '@/types';
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Check, Loader2, Search, User, UserX, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

export interface SelectTravellerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (traveller: TravellerProps) => void;
    selectedTravellerId?: string | number;
    customer?: UserProps | null;
    userId?: number | string | null;
}

export default function SelectTravellerModal({
    isOpen,
    onClose,
    onSelect,
    selectedTravellerId,
    customer,
    userId,
}: SelectTravellerModalProps) {
    const [search, setSearch] = useState('');
    const [pageData, setPageData] = useState<Paginate<TravellerProps> | null>(
        null,
    );
    const [loading, setLoading] = useState(false);

    const customerUserId = customer?.id || customer?.index || userId;

    const fetchTravellers = async (urlOrPage: string | number = 1) => {
        if (!customerUserId) {
            setPageData(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res =
                typeof urlOrPage === 'string'
                    ? await api.get<Paginate<TravellerProps>>(urlOrPage, {
                          search,
                          user_id: customerUserId,
                      })
                    : await api.get<Paginate<TravellerProps>>(
                          route('user.travellers.retrieveData'),
                          {
                              page: urlOrPage,
                              search,
                              user_id: customerUserId,
                          },
                      );
            setPageData(res);
        } catch (error) {
            console.error('Failed to retrieve travellers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (!customerUserId) {
                setPageData(null);
                setLoading(false);
                return;
            }

            const timer = setTimeout(() => {
                fetchTravellers(1);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search, isOpen, customerUserId]);

    const travellers = pageData?.data ?? [];

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
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">
                                            Select Traveller
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            {customer
                                                ? `Select registered traveller for ${customer.full_name}`
                                                : 'Select registered traveller data as guest'}
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

                            {customerUserId && (
                                <div className="p-4 border-slate-100 bg-white border-b">
                                    <div className="relative">
                                        <Search
                                            size={16}
                                            className="left-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2"
                                        />
                                        <TextInput
                                            type="text"
                                            placeholder="Search by traveller name..."
                                            className="pl-10 pr-4 text-xs sm:text-sm py-2 disabled:bg-slate-50 disabled:text-slate-400 w-full"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="p-4 flex-1 overflow-x-auto">
                                {!customerUserId ? (
                                    <div className="py-16 text-slate-400 text-xs gap-2 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-slate-100 text-slate-400 mb-1 flex items-center justify-center rounded-full">
                                            <UserX size={24} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm">
                                            Customer Belum Dipilih
                                        </span>
                                        <span className="text-slate-400 max-w-sm">
                                            Silakan pilih customer terlebih
                                            dahulu untuk melihat daftar
                                            traveller yang terelasi.
                                        </span>
                                    </div>
                                ) : loading && !pageData ? (
                                    <div className="py-16 text-slate-400 gap-3 flex flex-col items-center justify-center">
                                        <Loader2
                                            size={28}
                                            className="animate-spin text-primary"
                                        />
                                        <span className="text-xs">
                                            Loading traveller data...
                                        </span>
                                    </div>
                                ) : travellers.length === 0 ? (
                                    <div className="py-16 text-slate-400 text-xs text-center">
                                        No traveller found for this customer.
                                    </div>
                                ) : (
                                    <table className="text-xs w-full text-left">
                                        <thead>
                                            <tr className="border-slate-100 text-slate-400 tracking-wider border-b text-[10px] uppercase">
                                                <th className="py-3 px-3 font-bold">
                                                    Traveller Name
                                                </th>
                                                <th className="py-3 px-3 font-bold">
                                                    Birthdate
                                                </th>
                                                <th className="py-3 px-3 font-bold text-right">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-slate-50 divide-y">
                                            {travellers.map((t, idx) => {
                                                const isSelected =
                                                    String(
                                                        selectedTravellerId,
                                                    ) ===
                                                    String(
                                                        t.index || t.key || idx,
                                                    );
                                                return (
                                                    <tr
                                                        key={
                                                            t.key ||
                                                            t.index ||
                                                            idx
                                                        }
                                                        className={`hover:bg-slate-50/80 transition-colors ${
                                                            isSelected
                                                                ? 'bg-primary/5'
                                                                : ''
                                                        }`}
                                                    >
                                                        <td className="py-3 px-3">
                                                            <div className="font-bold text-slate-800">
                                                                {t.title
                                                                    ? `${t.title} `
                                                                    : ''}
                                                                {t.first_name}{' '}
                                                                {t.last_name}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 text-slate-600">
                                                            {t.date_of_birth ||
                                                                '-'}
                                                        </td>
                                                        <td className="py-3 px-3 text-right">
                                                            <PrimaryButton
                                                                type="button"
                                                                onClick={() => {
                                                                    onSelect(t);
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

                            {customerUserId &&
                                pageData &&
                                pageData.links &&
                                pageData.links.length > 3 && (
                                    <TablePaginate
                                        page={pageData}
                                        loading={loading}
                                        onNavigate={(url) =>
                                            fetchTravellers(url)
                                        }
                                    />
                                )}

                            <div className="px-6 py-3 border-slate-100 bg-slate-50 flex justify-end border-t">
                                <SecondaryButton
                                    type="button"
                                    onClick={onClose}
                                    className="text-xs py-2 px-4"
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
