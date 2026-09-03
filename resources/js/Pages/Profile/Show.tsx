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
    User,
} from 'lucide-react';
import React from 'react';

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <div className="gap-3 py-3 grid grid-cols-[110px_1fr] items-start border-b border-[#F1F5F9] last:border-0">
            <span className="font-bold tracking-wider text-quaternary pt-0.5 text-[10px] uppercase">
                {label}
            </span>
            <span className="text-xs font-medium text-primary">
                {value ?? (
                    <span className="font-normal text-quaternary-bright italic">
                        —
                    </span>
                )}
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
        <div className="rounded-2xl bg-white shadow-sm hover:shadow-md w-full overflow-hidden border border-[#E2E8F0] transition-shadow">
            <div className="gap-2.5 bg-secondary/50 px-5 py-4 flex items-center border-b border-[#F1F5F9]">
                <div className="w-8 h-8 bg-white rounded-lg shadow-sm text-primary flex items-center justify-center">
                    <Icon size={16} />
                </div>
                <h3 className="text-xs font-bold tracking-wider text-primary uppercase">
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
    const authRoles = usePage<PageProps>().props.auth.roles as
        string[] | undefined;

    const user = profileUser ?? authUser;

    const joinedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : null;

    const updatedDate = user.updated_at
        ? new Date(user.updated_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : null;

    const birthDate = user.date_of_birth
        ? new Date(user.date_of_birth).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : null;

    const fullPhone = user.phone_number
        ? [user.dial_code, user.phone_number].filter(Boolean).join(' ')
        : null;

    const fullAddress =
        [user.address, user.zip_code].filter(Boolean).join(', ') || undefined;

    const userRole =
        authRoles && authRoles.length > 0
            ? authRoles.join(', ')
            : 'Administrator';

    return (
        <AuthenticatedLayout
            header={
                <>
                    <button
                        type="button"
                        onClick={() => router.visit(route('profile.show'))}
                        className="text-sm font-bold text-primary truncate hover:underline"
                    >
                        Profile
                    </button>
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-quaternary truncate">
                        {user.full_name}
                    </span>
                </>
            }
        >
            <Head title={`Profile`} />

            <div className="space-y-6">
                <div className="gap-6 lg:grid-cols-12 grid grid-cols-1 items-start">
                    <div className="space-y-6 lg:col-span-4 xl:col-span-3">
                        <div className="rounded-2xl bg-white shadow-sm relative overflow-hidden border border-[#E2E8F0]">
                            <div className="p-6 px-5">
                                <div className="mt-6 mb-4 relative z-10 flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={user.profile_photo_path}
                                            alt={user.full_name}
                                            className="w-24 h-24 rounded-2xl object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="mb-5 text-center">
                                    <h1 className="text-lg font-bold tracking-tight text-primary">
                                        {user.title ? `${user.title} ` : ''}
                                        {user.full_name}
                                    </h1>
                                    <p className="text-xs text-quaternary font-mono mt-0.5 tracking-wider">
                                        {user.tracking_code}
                                    </p>

                                    <div className="mt-3 gap-1.5 flex flex-wrap items-center justify-center">
                                        <Badge
                                            variant={
                                                user.active ? 'green' : 'gray'
                                            }
                                        >
                                            {user.active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                        <Badge variant="purple">
                                            {userRole}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-5 border-t border-[#F1F5F9]">
                                    <div className="gap-3 mt-2 text-xs text-primary flex items-center">
                                        <div className="h-7 w-7 bg-secondary text-quaternary-dark flex shrink-0 items-center justify-center rounded-full">
                                            <Mail size={14} />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="font-medium block truncate">
                                                {user.email}
                                            </span>
                                            {user.email_verified_at ? (
                                                <span className="text-green-600 gap-1 mt-0.5 flex items-center text-[10px]">
                                                    <ShieldCheck size={10} />{' '}
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600 text-[10px] italic">
                                                    Unverified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="gap-3 mt-2 text-xs text-primary flex items-center">
                                        <div className="h-7 w-7 bg-secondary text-quaternary-dark flex shrink-0 items-center justify-center rounded-full">
                                            <Phone size={14} />
                                        </div>
                                        <div className="font-medium flex-1 truncate">
                                            {fullPhone ?? (
                                                <span className="text-quaternary-bright italic">
                                                    No phone number
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="gap-3 mt-2 text-xs text-primary flex items-center">
                                        <div className="h-7 w-7 bg-secondary text-quaternary-dark flex shrink-0 items-center justify-center rounded-full">
                                            <Calendar size={14} />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="font-medium block">
                                                {joinedDate}
                                            </span>
                                            <span className="text-quaternary mt-0.5 block text-[10px]">
                                                Joined Date
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit(route('profile.edit'))
                                        }
                                        className="gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-secondary flex w-full items-center justify-center border border-[#E2E8F0] transition-colors"
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                        <div className="gap-6 lg:grid-cols-2 grid grid-cols-1 items-start">
                            <SectionCard title="Personal Details" icon={User}>
                                <InfoRow label="Gender" value={user.gender} />
                                <InfoRow
                                    label="Date of Birth"
                                    value={birthDate}
                                />
                                <InfoRow
                                    label="Place of Birth"
                                    value={user.place_of_birth}
                                />
                                <InfoRow
                                    label="Identity Type"
                                    value={user.identity_type}
                                />
                                <InfoRow
                                    label="Identity Number"
                                    value={user.identity_number}
                                />
                            </SectionCard>

                            <SectionCard title="Location" icon={MapPin}>
                                <InfoRow label="Address" value={fullAddress} />
                                <InfoRow
                                    label="Country"
                                    value={user.countries?.name}
                                />
                                <InfoRow
                                    label="State"
                                    value={user.states?.name}
                                />
                                <InfoRow
                                    label="City"
                                    value={user.cities?.name}
                                />
                                <InfoRow
                                    label="Zip Code"
                                    value={user.zip_code}
                                />
                            </SectionCard>
                        </div>
                        <SectionCard title="Account Settings" icon={CreditCard}>
                            <InfoRow
                                label="Role"
                                value={
                                    <span className="gap-1.5 font-bold text-purple-600 flex items-center">
                                        <Shield
                                            size={12}
                                            className="shrink-0"
                                        />
                                        <span className="capitalize">
                                            {userRole}
                                        </span>
                                    </span>
                                }
                            />
                            <InfoRow
                                label="Locale / Lang"
                                value={
                                    (user.locale ?? user.lang) ? (
                                        <span className="gap-1.5 flex items-center uppercase">
                                            <Globe
                                                size={12}
                                                className="text-quaternary shrink-0"
                                            />
                                            {user.locale ?? user.lang}
                                        </span>
                                    ) : undefined
                                }
                            />
                            <InfoRow
                                label="Currency"
                                value={
                                    (user.currency ?? user.default_currency) ? (
                                        <span className="gap-1.5 flex items-center uppercase">
                                            <Coins
                                                size={12}
                                                className="text-quaternary shrink-0"
                                            />
                                            {user.currency ??
                                                user.default_currency}
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
