import SecondaryButton from '@/Components/SecondaryButton';
import { formatDate } from '@/helpers';
import { UserProps } from '@/types';
import {
    Calendar,
    Mail,
    Phone,
    RefreshCw,
    User,
    UserCheck,
} from 'lucide-react';

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
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#E2E8F0]">
            <div className="gap-3 pb-4 border-gray-100 sm:flex-row sm:items-center flex flex-col justify-between border-b">
                <div className="gap-2.5 flex items-center">
                    <div>
                        <h2 className="text-base font-bold text-primary">
                            Customer Data
                        </h2>
                        <p className="text-xs text-quaternary">
                            Customer account data for hotel reservations
                        </p>
                    </div>
                </div>

                <SecondaryButton
                    type="button"
                    onClick={onOpenSelectModal}
                    className="gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl inline-flex w-fit cursor-pointer items-center justify-center"
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
                <div className="p-4 mt-4 bg-slate-50/80 border-slate-200/80 rounded-2xl sm:p-5 border">
                    <div className="gap-2 pb-3 mb-3 sm:flex-row sm:items-center border-slate-200/60 flex flex-col justify-between border-b">
                        <div>
                            <span className="font-bold tracking-wider text-slate-400 block text-[10px] uppercase">
                                Full Name
                            </span>
                            <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                                {customer.title ? `${customer.title} ` : ''}
                                {customer.full_name}
                            </h3>
                        </div>
                        {customer.tracking_code && (
                            <span className="font-mono font-medium text-slate-500 bg-white border-slate-200 px-2.5 py-0.5 rounded-md sm:self-auto self-start border text-[11px]">
                                ID: {customer.tracking_code}
                            </span>
                        )}
                    </div>

                    <div className="sm:grid-cols-3 gap-3.5 text-xs grid grid-cols-1">
                        <div className="gap-2 text-slate-600 bg-white p-2.5 rounded-xl border-slate-100 flex items-start border">
                            <Mail
                                size={15}
                                className="text-primary mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                                <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                                    Email
                                </span>
                                <span className="font-medium text-slate-800 block truncate">
                                    {customer.email || '-'}
                                </span>
                            </div>
                        </div>

                        <div className="gap-2 text-slate-600 bg-white p-2.5 rounded-xl border-slate-100 flex items-start border">
                            <Phone
                                size={15}
                                className="text-primary mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                                <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                                    Phone Number
                                </span>
                                <span className="font-medium text-slate-800 block truncate">
                                    {customer.phone_number
                                        ? `${customer.dial_code || ''} ${customer.phone_number}`
                                        : '-'}
                                </span>
                            </div>
                        </div>

                        <div className="gap-2 text-slate-600 bg-white p-2.5 rounded-xl border-slate-100 flex items-start border">
                            <Calendar
                                size={15}
                                className="text-primary mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                                <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                                    Date of Birth
                                </span>
                                <span className="font-medium text-slate-800 block truncate">
                                    {customer.date_of_birth
                                        ? formatDate(customer.date_of_birth)
                                        : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 mt-4 border-slate-200 rounded-2xl border-2 border-dashed text-center">
                    <p className="text-xs text-slate-500">
                        No customer has been selected. Please click the button{' '}
                        <strong
                            className="text-primary cursor-pointer"
                            onClick={onOpenSelectModal}
                        >
                            "Select Customer"
                        </strong>{' '}
                        to select a customer.
                    </p>
                </div>
            )}
        </div>
    );
}
