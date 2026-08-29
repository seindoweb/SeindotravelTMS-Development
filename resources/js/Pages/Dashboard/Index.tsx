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
        <div className="group rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-dark text-[#334155] transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={21} />
                </div>

                <span
                    className={[
                        'flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold',
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
                <p className="text-xs font-medium text-quaternary">
                    {title}
                </p>

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
                <span className="text-sm font-bold truncate text-primary">
                    Dashboard
                </span>
            }>
            <Head title="Dashboard" />

            <div className="space-y-6">

                {/* Heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                            Overview
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                            Travel Management System
                        </h1>

                        <p className="mt-1.5 text-sm text-quaternary">
                            Overview and management of your travel business
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#334155]"
                    >
                        <CalendarDays size={16} />
                        28 Aug 2026
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                {/* Recent */}
                <RecentBookingsTable />

                {/* Booking Overview */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
                    <BookingStatusCard />
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
