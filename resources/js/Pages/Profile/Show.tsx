import { Badge } from '@/Components/Badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, UserProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    ChevronRight,
    Coins,
    CreditCard,
    Edit2,
    Globe,
    Mail,
    MapPin,
    Phone,
    Shield,
    ShieldCheck,
    User
} from 'lucide-react';
import React from 'react';

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

interface ProfileProps extends PageProps {
    profileUser?: UserProps;
}

export default function Show({ profileUser }: ProfileProps) {
    const authUser = usePage<PageProps>().props.auth.user;
    const authRoles = usePage<PageProps>().props.auth.roles as string[] | undefined;
    
    const user = profileUser ?? authUser;

    const joinedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    const updatedDate = user.updated_at
        ? new Date(user.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    const birthDate = user.date_of_birth
        ? new Date(user.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    const fullPhone = user.phone_number
        ? [user.dial_code, user.phone_number].filter(Boolean).join(' ')
        : null;

    const fullAddress = [user.address, user.zip_code].filter(Boolean).join(', ') || undefined;

    const userRole = (authRoles && authRoles.length > 0) ? authRoles.join(', ') : 'Administrator';

    return (
        <AuthenticatedLayout
            header={
                <>
                    <button 
                        type="button"
                        onClick={() => router.visit(route('profile.show'))}
                        className="text-sm font-bold truncate text-primary hover:underline"
                    >
                        My Profile
                    </button>
                    <ChevronRight size={14} className="hidden text-[#CBD5E1] sm:block" />
                    <span className="text-sm font-bold truncate text-quaternary">{user.full_name}</span>
                </>
            }
        >
            <Head title={`Profile — ${user.full_name}`} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden relative">
                            <div className="px-5 p-6">
                                <div className="flex justify-center mt-6 mb-4 relative z-10">
                                    <div className="relative">
                                        <img
                                            src={user.profile_photo_path}
                                            alt={user.full_name}
                                            className="h-24 w-24 rounded-2xl object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="text-center mb-5">
                                    <h1 className="text-lg font-bold tracking-tight text-primary">
                                        {user.title ? `${user.title} ` : ''}{user.full_name}
                                    </h1>
                                    <p className="text-xs text-quaternary font-mono mt-0.5 tracking-wider">
                                        {user.tracking_code}
                                    </p>
                                    
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                                        <Badge variant={user.active ? 'green' : 'gray'}>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <Badge variant="purple">
                                            {userRole}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-[#F1F5F9] pt-5">
                                    <div className="flex items-center gap-3 text-xs text-primary mt-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-quaternary-dark">
                                            <Mail size={14} />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="block font-medium truncate">{user.email}</span>
                                            {user.email_verified_at ? (
                                                <span className="text-[10px] text-green-600 flex items-center gap-1 mt-0.5"><ShieldCheck size={10}/> Verified</span>
                                            ) : (
                                                <span className="text-[10px] text-yellow-600 italic">Unverified</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-primary mt-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-quaternary-dark">
                                            <Phone size={14} />
                                        </div>
                                        <div className="flex-1 truncate font-medium">
                                            {fullPhone ?? <span className="italic text-quaternary-bright">No phone number</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-primary mt-2">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-quaternary-dark">
                                            <Calendar size={14} />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="block font-medium">{joinedDate}</span>
                                            <span className="text-[10px] text-quaternary mt-0.5 block">Joined Date</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
                                    <button 
                                        type="button"
                                        onClick={() => router.visit(route('profile.edit'))}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-secondary transition-colors"
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <SectionCard title="Personal Details" icon={User}>
                                <InfoRow label="Gender" value={user.gender} />
                                <InfoRow label="Date of Birth" value={birthDate} />
                                <InfoRow label="Place of Birth" value={user.place_of_birth} />
                                <InfoRow label="Identity Type" value={user.identity_type} />
                                <InfoRow label="Identity Number" value={user.identity_number} />
                            </SectionCard>

                            <SectionCard title="Location" icon={MapPin}>
                                <InfoRow label="Address" value={fullAddress} />
                                <InfoRow label="Country" value={user.countries?.name} />
                                <InfoRow label="State" value={user.states?.name} />
                                <InfoRow label="City" value={user.cities?.name} />
                                <InfoRow label="Zip Code" value={user.zip_code} />
                            </SectionCard>

                        </div>
                            <SectionCard title="Account Settings" icon={CreditCard}>
                                <InfoRow
                                    label="Role"
                                    value={
                                        <span className="flex items-center gap-1.5 font-bold text-purple-600">
                                            <Shield size={12} className="shrink-0" />
                                            <span className="capitalize">{userRole}</span>
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Locale / Lang"
                                    value={
                                        (user.locale ?? user.lang) ? (
                                            <span className="flex items-center gap-1.5 uppercase">
                                                <Globe size={12} className="text-quaternary shrink-0" />
                                                {user.locale ?? user.lang}
                                            </span>
                                        ) : undefined
                                    }
                                />
                                <InfoRow
                                    label="Currency"
                                    value={
                                        (user.currency ?? user.default_currency) ? (
                                            <span className="flex items-center gap-1.5 uppercase">
                                                <Coins size={12} className="text-quaternary shrink-0" />
                                                {user.currency ?? user.default_currency}
                                            </span>
                                        ) : undefined
                                    }
                                />
                                <InfoRow label="Last Updated" value={updatedDate} />
                            </SectionCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
