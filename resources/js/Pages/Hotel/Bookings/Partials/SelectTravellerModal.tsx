import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TablePaginate from '@/Components/TablePaginate';
import TextInput from '@/Components/TextInput';
import { api } from '@/libs/http/api';
import { Paginate, TravellerProps } from '@/types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Check, Loader2, Search, User, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

export interface SelectTravellerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (traveller: TravellerProps) => void;
    selectedTravellerId?: string | number;
}

export default function SelectTravellerModal({
    isOpen,
    onClose,
    onSelect,
    selectedTravellerId,
}: SelectTravellerModalProps) {
    const [search, setSearch] = useState('');
    const [pageData, setPageData] = useState<Paginate<TravellerProps> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchTravellers = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === 'string'
                    ? await api.get<Paginate<TravellerProps>>(urlOrPage, { search })
                    : await api.get<Paginate<TravellerProps>>(route('user.travellers.retrieveData'), {
                          page: urlOrPage,
                          search,
                      });
            setPageData(res);
        } catch (error) {
            console.error('Failed to retrieve travellers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                fetchTravellers(1);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search, isOpen]);

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
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">
                                            Select Traveller
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Select registered traveller data as guest
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

                            <div className="p-4 border-b border-slate-100 bg-white">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <TextInput
                                        type="text"
                                        placeholder="Search by traveller name..."
                                        className="w-full pl-10 pr-4 text-xs sm:text-sm py-2"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto flex-1 p-4">
                                {loading && !pageData ? (
                                    <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <Loader2 size={28} className="animate-spin text-primary" />
                                        <span className="text-xs">Loading traveller data...</span>
                                    </div>
                                ) : travellers.length === 0 ? (
                                    <div className="py-16 text-center text-slate-400 text-xs">
                                        No traveller found.
                                    </div>
                                ) : (
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                                                <th className="py-3 px-3 font-bold">Traveller Name</th>
                                                <th className="py-3 px-3 font-bold">Birthdate</th>
                                                <th className="py-3 px-3 text-right font-bold">Action</th>
                                                        
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {travellers.map((t, idx) => {
                                                const isSelected =
                                                    String(selectedTravellerId) === String(t.index || t.key || idx);
                                                return (
                                                    <tr
                                                        key={t.key || t.index || idx}
                                                        className={`hover:bg-slate-50/80 transition-colors ${
                                                            isSelected ? 'bg-primary/5' : ''
                                                        }`}
                                                    >
                                                        <td className="py-3 px-3">
                                                            <div className="font-bold text-slate-800">
                                                                {t.title ? `${t.title} ` : ''}
                                                                {t.first_name} {t.last_name}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 text-slate-600">
                                                            {t.date_of_birth || '-'}
                                                        </td>
                                                        <td className="py-3 px-3 text-right">
                                                            <PrimaryButton
                                                                type="button"
                                                                onClick={() => {
                                                                    onSelect(t);
                                                                    onClose();
                                                                }}
                                                                className={`py-1.5 px-3 text-xs ${
                                                                    isSelected ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                                                                }`}
                                                            >
                                                                {isSelected ? (
                                                                    <span className="flex items-center gap-1">
                                                                        <Check size={12} /> Selected
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

                            {pageData && pageData.links && pageData.links.length > 3 && (
                                <TablePaginate
                                    page={pageData}
                                    loading={loading}
                                    onNavigate={(url) => fetchTravellers(url)}
                                />
                            )}

                            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <SecondaryButton type="button" onClick={onClose} className="text-xs py-2 px-4">
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
