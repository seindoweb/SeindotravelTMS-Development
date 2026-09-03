import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { AlertTriangle, ChevronRight, Shield, User } from 'lucide-react';
import { useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const [activeTab, setActiveTab] = useState<
        'profile' | 'security' | 'danger'
    >('profile');
    const user = usePage<PageProps>().props.auth.user;

    const tabs = [
        {
            id: 'profile',
            label: 'Personal Information',
            icon: User,
            desc: 'Update your account profile and email.',
        },
        {
            id: 'security',
            label: 'Security & Password',
            icon: Shield,
            desc: 'Ensure your account is using a long, random password.',
        },
        {
            id: 'danger',
            label: 'Delete Account',
            icon: AlertTriangle,
            desc: 'Permanently delete your account.',
        },
    ];

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
                    <ChevronRight
                        size={14}
                        className="sm:block hidden text-[#CBD5E1]"
                    />
                    <span className="text-sm font-bold text-quaternary truncate">
                        Update
                    </span>
                </>
            }
        >
            <Head title="Profile Settings" />

            <div className="space-y-6">
                <div className="gap-6 lg:grid-cols-12 grid grid-cols-1 items-start">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="rounded-2xl bg-white shadow-sm p-2 gap-1 top-6 sticky flex flex-col overflow-hidden border border-[#E2E8F0]">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            setActiveTab(tab.id as any)
                                        }
                                        className={clsx(
                                            'gap-3 p-3 rounded-xl flex w-full items-start text-left transition-all',
                                            isActive
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-primary hover:bg-[#F1F5F9]',
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                'h-8 w-8 rounded-lg shadow-sm flex shrink-0 items-center justify-center',
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-white text-primary border border-[#E2E8F0]',
                                            )}
                                        >
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">
                                                {tab.label}
                                            </div>
                                            <div
                                                className={clsx(
                                                    'mt-0.5 leading-tight text-[10px]',
                                                    isActive
                                                        ? 'text-white/80'
                                                        : 'text-quaternary',
                                                )}
                                            >
                                                {tab.desc}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="rounded-2xl bg-white shadow-sm p-6 sm:p-8 min-h-[400px] border border-[#E2E8F0]">
                            {activeTab === 'profile' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-full"
                                    />
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <UpdatePasswordForm className="max-w-full" />
                                </div>
                            )}

                            {activeTab === 'danger' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <DeleteUserForm className="max-w-full" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
