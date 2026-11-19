import { useMemo, useState } from 'react';
import {
    CalendarDays,
    CircleDollarSign,
    TrendingDown,
    TrendingUp,
    Users,
    WalletCards,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RecentBookingsTable from './Partials/RecentBookingsTable';
import BookingStatusCard from './Partials/BookingStatusCard';
import { Head } from '@inertiajs/react';
import LastRegisteredCustomerCard from './Partials/LastRegisteredCustomerCard';

function StatCard({
    title,
    value,
    change,
    positive,
    icon: Icon,
}: {
    title: string;
    value: string;
    change: string;
    positive: boolean;
    icon: typeof CalendarDays;
}) {
    return (
        <div className="group rounded-2xl bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md border border-[#E2E8F0] transition-all duration-200">
            <div className="gap-3 flex items-start justify-between">
                <div className="h-11 w-11 rounded-xl bg-secondary-dark group-hover:bg-primary group-hover:text-white flex items-center justify-center text-[#334155] transition-colors">
                    <Icon size={21} />
                </div>

                <span
                    className={[
                        'gap-1 px-2 py-1 font-bold flex items-center rounded-full text-[11px]',
                        positive
                            ? 'bg-secondary-dark text-[#334155]'
                            : 'bg-tertiary/10 text-tertiary',
                    ].join(' ')}
                >
                    {positive ? (
                        <TrendingUp size={12} />
                    ) : (
                        <TrendingDown size={12} />
                    )}
                    {change}
                </span>
            </div>

            <div className="mt-5">
                <p className="text-xs font-medium text-quaternary">{title}</p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function Index() {
    return (
        <AuthenticatedLayout
            header={
                <span className="text-sm font-bold text-primary truncate">
                    Dashboard
                </span>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Heading */}
                <div className="gap-4 sm:flex-row sm:items-end sm:justify-between flex flex-col">
                    <div>
                        <div className="mb-2 gap-2 bg-tertiary/10 px-2.5 py-1 font-bold tracking-wider text-tertiary inline-flex items-center rounded-full text-[10px] uppercase">
                            <span className="h-1.5 w-1.5 bg-tertiary rounded-full" />
                            Overview
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-[#0F172A]">
                            Travel Management System
                        </h1>

                        <p className="mt-1.5 text-sm text-quaternary">
                            Overview and management of your travel business
                        </p>
                    </div>

                    <button
                        type="button"
                        className="h-10 gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white shadow-sm inline-flex items-center justify-center transition hover:bg-[#334155]"
                    >
                        <CalendarDays size={16} />
                        28 Aug 2026
                    </button>
                </div>

                {/* Statistics */}
                <div className="gap-4 sm:grid-cols-2 xl:grid-cols-4 grid grid-cols-1">
                    <StatCard
                        title="Total Bookings"
                        value="1,248"
                        change="+12.5%"
                        positive
                        icon={CalendarDays}
                    />

                    <StatCard
                        title="Total Revenue"
                        value="Rp 845.2M"
                        change="+8.2%"
                        positive
                        icon={CircleDollarSign}
                    />

                    <StatCard
                        title="Active Travelers"
                        value="3,842"
                        change="+15.4%"
                        positive
                        icon={Users}
                    />

                    <StatCard
                        title="Pending Payments"
                        value="24"
                        change="-4.8%"
                        positive={false}
                        icon={WalletCards}
                    />
                </div>

                {/* Booking Overview */}
                <div className="gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)] grid grid-cols-1">
                    <BookingStatusCard />
                    <LastRegisteredCustomerCard />
                </div>

                {/* Recent */}
                <RecentBookingsTable />
            </div>
        </AuthenticatedLayout>
    );
}
