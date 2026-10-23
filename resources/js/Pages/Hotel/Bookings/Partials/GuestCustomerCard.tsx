import SecondaryButton from '@/Components/SecondaryButton';
import { UserProps } from '@/types';
import { Calendar, Mail, Phone, RefreshCw, User, UserCheck } from 'lucide-react';

export interface GuestCustomerCardProps {
    customer: UserProps | null;
    onOpenSelectModal: () => void;
    onClearCustomer?: () => void;
}

export default function GuestCustomerCard({
    customer,
    onOpenSelectModal,
    onClearCustomer,
}: GuestCustomerCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <UserCheck size={19} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-primary">Customer Data</h2>
                        <p className="text-xs text-quaternary">
                            Customer account data for hotel reservations
                        </p>
                    </div>
                </div>

                <SecondaryButton
                    type="button"
                    onClick={onOpenSelectModal}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl cursor-pointer w-fit"
                >
                    {customer ? (
                        <>
                            <RefreshCw size={13} />
                            <span>Change Customer</span>
                        </>
                    ) : (
                        <>
                            <User size={13} />
                            <span>Select Customer</span>
                        </>
                    )}
                </SecondaryButton>
            </div>

            {customer ? (
                <div className="mt-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/60">
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                Full Name
                            </span>
                            <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                                {customer.title ? `${customer.title} ` : ''}
                                {customer.full_name}
                            </h3>
                        </div>
                        {customer.tracking_code && (
                            <span className="text-[11px] font-mono font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                                ID: {customer.tracking_code}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                        <div className="flex items-start gap-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                            <Mail size={15} className="text-primary shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                    Email
                                </span>
                                <span className="font-medium text-slate-800 truncate block">
                                    {customer.email || '-'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                            <Phone size={15} className="text-primary shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                    Phone Number
                                </span>
                                <span className="font-medium text-slate-800 truncate block">
                                    {customer.phone_number
                                        ? `${customer.dial_code || ''} ${customer.phone_number}`
                                        : '-'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                            <Calendar size={15} className="text-primary shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                    Date of Birth
                                </span>
                                <span className="font-medium text-slate-800 truncate block">
                                    {customer.date_of_birth || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-4 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                    <p className="text-xs text-slate-500">
                        No customer has been selected. Please click the button{' '}
                        <strong className="text-primary cursor-pointer" onClick={onOpenSelectModal}>
                            "Select Customer"
                        </strong>{' '}
                        to select a customer.
                    </p>
                </div>
            )}
        </div>
    );
}
