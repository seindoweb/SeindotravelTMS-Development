import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    ChevronRight,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Calendar,
    Globe,
    Coins,
    ShieldCheck,
    User,
    Briefcase,
    FileText,
    Activity,
    SearchX
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/Badge';
import { UserProps } from '@/types';
import clsx from 'clsx';

interface Props {
    customer: UserProps;
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[110px_1fr] gap-3 py-3 border-b border-[#F1F5F9] last:border-0 items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary pt-0.5">
                {label}
            </span>
            <span className="text-xs text-primary font-medium">
                {value ?? <span className="italic text-quaternary-bright font-normal">—</span>}
            </span>
        </div>
    );
}

function SectionCard({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md w-full">
            <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] bg-secondary/50 px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-primary">
                    <Icon size={16} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                    {title}
                </h3>
            </div>
            <div className="px-5">{children}</div>
        </div>
    );
}

export default function Show({ customer }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'documents' | 'activity'>('overview');

    const joinedDate = customer.created_at
        ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    const updatedDate = customer.updated_at
        ? new Date(customer.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    const birthDate = customer.date_of_birth
        ? new Date(customer.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    const fullPhone = customer.phone_number
        ? [customer.dial_code, customer.phone_number].filter(Boolean).join(' ')
        : null;

    const fullAddress = [customer.address, customer.zip_code].filter(Boolean).join(', ') || undefined;

    return (
        <AuthenticatedLayout
            header={
                <>
                    <span className="text-sm font-bold truncate text-primary">Users</span>
                    <ChevronRight size={14} className="hidden text-[#CBD5E1] sm:block" />
                    <button
                        type="button"
                        onClick={() => router.visit(route('user.customers.index'))}
                        className="text-sm font-bold truncate text-primary hover:underline"
                    >
                        Customers
                    </button>
                    <ChevronRight size={14} className="hidden text-[#CBD5E1] sm:block" />
                    <span className="text-sm font-bold truncate text-quaternary">{customer.full_name}</span>
                </>
            }
        >
            <Head title={`Customer — ${customer.full_name}`} />

            <div className="space-y-6">

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => router.visit(route('user.customers.index'))}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-quaternary hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Customers
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden relative h-auto">
                            <div className="px-5 p-6">
                                <div className="flex justify-center mt6 mb-4 relative z-10">
                                    <div className="relative">
                                        <img
                                            src={customer.profile_photo_path}
                                            alt={customer.full_name}
                                            className="h-24 w-24 rounded-2xl object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="text-center mb-5">
                                    <h1 className="text-lg font-bold tracking-tight text-primary">
                                        {customer.title ? `${customer.title} ` : ''}{customer.full_name}
                                    </h1>
                                    <p className="text-xs text-quaternary font-mono mt-0.5 tracking-wider">
                                        {customer.tracking_code}
                                    </p>
                                    
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                                        <Badge variant={customer.active ? 'green' : 'gray'}>
                                            {customer.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-[#F1F5F9] pt-5">
                                    <div className="flex items-center gap-3 text-xs text-primary mt-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-quaternary-dark">
                                            <Mail size={14} />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="block font-medium truncate">{customer.email}</span>
                                            {customer.email_verified_at ? (
                                                <span className="text-[10px] text-green-600 flex items-center gap-1 mt-0.5"><ShieldCheck size={10}/> Verified</span>
                                            ) : (
                                                <span className="text-[10px] text-yellow-600 italic">Unverified</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-primary">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-quaternary-dark">
                                            <Phone size={14} />
                                        </div>
                                        <div className="flex-1 truncate font-medium">
                                            {fullPhone ?? <span className="italic text-quaternary-bright">No phone number</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-primary">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-quaternary-dark">
                                            <Calendar size={14} />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="block font-medium">{joinedDate}</span>
                                            <span className="text-[10px] text-quaternary mt-0.5 block">Joined Date</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        <div className="flex items-center gap-1 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar">
                            {[
                                { id: 'overview', label: 'Overview', icon: User },
                                { id: 'bookings', label: 'Bookings History', icon: Briefcase },
                                { id: 'documents', label: 'Documents', icon: FileText },
                                { id: 'activity', label: 'Activity Logs', icon: Activity },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap",
                                            isActive 
                                                ? "border-primary text-primary" 
                                                : "border-transparent text-quaternary hover:text-primary hover:border-[#E2E8F0]"
                                        )}
                                    >
                                        <Icon size={16} className={isActive ? 'text-primary' : 'text-quaternary'} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="pt-2">
                            {activeTab === 'overview' && (
                                <div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                        <SectionCard title="Personal Details" icon={User}>
                                            <InfoRow label="Gender" value={customer.gender} />
                                            <InfoRow label="Date of Birth" value={birthDate} />
                                            <InfoRow label="Place of Birth" value={customer.place_of_birth} />
                                            <InfoRow label="Identity Type" value={customer.identity_type} />
                                            <InfoRow label="Identity Number" value={customer.identity_number} />
                                        </SectionCard>

                                        <SectionCard title="Location" icon={MapPin}>
                                            <InfoRow label="Address" value={fullAddress} />
                                            <InfoRow label="Country" value={customer.countries?.name} />
                                            <InfoRow label="State" value={customer.states?.name} />
                                            <InfoRow label="City" value={customer.cities?.name} />
                                            <InfoRow label="Zip Code" value={customer.zip_code} />
                                        </SectionCard>

                                    </div>
                                    <div className='mt-6'>
                                        <SectionCard title="Account Settings" icon={CreditCard}>
                                            <InfoRow
                                                label="Locale / Lang"
                                                value={
                                                    (customer.locale ?? customer.lang) ? (
                                                        <span className="flex items-center gap-1.5 uppercase">
                                                            <Globe size={12} className="text-quaternary shrink-0" />
                                                            {customer.locale ?? customer.lang}
                                                        </span>
                                                    ) : undefined
                                                }
                                            />
                                            <InfoRow
                                                label="Currency"
                                                value={
                                                    (customer.currency ?? customer.default_currency) ? (
                                                        <span className="flex items-center gap-1.5 uppercase">
                                                            <Coins size={12} className="text-quaternary shrink-0" />
                                                            {customer.currency ?? customer.default_currency}
                                                        </span>
                                                    ) : undefined
                                                }
                                            />
                                            <InfoRow
                                                label="Has Credit"
                                                value={
                                                    <Badge variant={customer.has_credit ? 'blue' : 'gray'}>
                                                        {customer.has_credit ? 'Eligible' : 'Not Eligible'}
                                                    </Badge>
                                                }
                                            />
                                            <InfoRow label="Last Updated" value={updatedDate} />
                                        </SectionCard>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bookings' && (
                                <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAFC]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 text-[#94A3B8]">
                                        <Briefcase size={28} />
                                    </div>
                                    <h3 className="text-sm font-bold text-primary mb-1">No Bookings Yet</h3>
                                    <p className="text-xs text-quaternary max-w-sm text-center mb-6">
                                        This customer hasn't made any travel bookings yet. Once they do, their transaction history will appear here.
                                    </p>
                                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] shadow-sm rounded-xl text-xs font-bold text-primary hover:bg-secondary transition-colors">
                                        Create Manual Booking
                                    </button>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAFC]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 text-[#94A3B8]">
                                        <SearchX size={28} />
                                    </div>
                                    <h3 className="text-sm font-bold text-primary mb-1">No Documents Uploaded</h3>
                                    <p className="text-xs text-quaternary max-w-sm text-center mb-6">
                                        Passports, visas, and other identity documents can be securely stored here.
                                    </p>
                                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] shadow-sm rounded-xl text-xs font-bold text-primary hover:bg-secondary transition-colors">
                                        Upload Document
                                    </button>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAFC]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 text-[#94A3B8]">
                                        <Activity size={28} />
                                    </div>
                                    <h3 className="text-sm font-bold text-primary mb-1">No Recent Activity</h3>
                                    <p className="text-xs text-quaternary max-w-sm text-center">
                                        System logs and customer activities will be recorded here for auditing purposes.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
