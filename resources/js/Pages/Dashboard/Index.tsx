import { useMemo, useState } from 'react';
import { CalendarDays, CircleDollarSign, WalletCards } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RecentBookingsTable from './Partials/RecentBookingsTable';
import BookingStatusCard from './Partials/BookingStatusCard';
import { Head } from '@inertiajs/react';
import LastRegisteredCustomerCard from './Partials/LastRegisteredCustomerCard';
import SupplierBalanceCard from './Partials/SupplierBalanceCard';
import StatCard from './Partials/StatCard';
import StatCardActiveUsers from './Partials/StatCardActiveUsers';

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

                    <StatCardActiveUsers />

                    <StatCard
                        title="Pending Payments"
                        value="24"
                        change="-4.8%"
                        positive={false}
                        icon={WalletCards}
                    />
                </div>

                {/* Booking Overview */}
                <div className="gap-6 xl:grid-cols-3 grid grid-cols-1">
                    <BookingStatusCard />
                    <SupplierBalanceCard />
                    <LastRegisteredCustomerCard />
                </div>

                {/* Recent */}
                <RecentBookingsTable />
            </div>
        </AuthenticatedLayout>
    );
}
