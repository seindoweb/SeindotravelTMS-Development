import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    canLogin,
    canRegister,
}: PageProps<{ canLogin: boolean; canRegister: boolean }>) {
    return (
        <>
            <Head title="SeindoTravel TMS" />

            <div className="min-h-screen overflow-hidden text-white bg-slate-950">
                {/* =========================================================
                    HERO
                ========================================================== */}
                <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute rounded-full -left-40 -top-40 h-96 w-96 bg-blue-600/20 blur-3xl animate-pulse" />

                    <div className="absolute rounded-full -right-40 top-20 h-96 w-96 bg-cyan-500/10 blur-3xl animate-pulse" />

                    <div className="absolute rounded-full w-96 h-96 left-1/2 top-1/2 bg-blue-500/5 blur-3xl" />

                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                        }}
                    />

                    <div className="relative grid items-center w-full gap-16 px-6 py-24 mx-auto max-w-7xl lg:grid-cols-2 lg:px-8 lg:py-32">
                        {/* =================================================
                            LEFT CONTENT
                        ================================================== */}
                        <div className="relative z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-300 border rounded-full border-blue-500/20 bg-blue-500/10">
                                <span className="relative flex w-2 h-2">
                                    <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping" />
                                    <span className="relative inline-flex w-2 h-2 bg-blue-400 rounded-full" />
                                </span>

                                Travel Management System
                            </div>

                            {/* Heading */}
                            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                                Manage Your

                                <span className="block text-blue-500">
                                    Travel Business
                                </span>

                                Smarter.
                            </h1>

                            {/* Description */}
                            <p className="max-w-xl mt-6 text-lg leading-8 text-slate-400">
                                Platform terintegrasi untuk mengelola booking,
                                tiket pesawat, hotel, tour, supplier, harga,
                                pembayaran, hingga laporan bisnis travel Anda.
                            </p>

                            {/* CTA */}
                            <div className="flex flex-wrap gap-4 mt-10">
                                 {auth.user ? (
                                    <Link
                                        href={route('dashboard.index')}
                                        className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/30"
                                    >
                                        Dashboard
                                        <ArrowRightIcon />
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/30"
                                            >
                                                Get Started

                                                <ArrowRightIcon />
                                            </Link>
                                        )}
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className="px-6 py-3.5 font-semibold text-slate-200 transition duration-300 border rounded-xl border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"
                                            >
                                                Log In
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Benefits */}
                            <div className="flex flex-wrap mt-10 text-sm gap-x-6 gap-y-3 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckIcon />
                                    All-in-one platform
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckIcon />
                                    Secure & reliable
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            ANIMATED DASHBOARD PREVIEW
                        ================================================== */}
                        <div className="relative flex items-center justify-center">
                            {/* Outer Glow */}
                            <div className="absolute w-4/5 h-4/5 rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />

                            {/* Floating Dashboard */}
                            <div className="relative w-full max-w-xl animate-dashboard-float">
                                {/* Floating notification */}
                                <div className="absolute z-20 flex items-center gap-3 px-4 py-3 border shadow-xl -right-3 -top-5 rounded-xl border-white/10 bg-slate-900/95 shadow-black/30 animate-notification">
                                    <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-emerald-500/10 text-emerald-400">
                                        <CheckIcon />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium">
                                            New Booking
                                        </p>

                                        <p className="text-[10px] text-slate-500">
                                            Booking confirmed
                                        </p>
                                    </div>
                                </div>

                                {/* Floating revenue */}
                                <div className="absolute z-20 flex items-center gap-3 px-4 py-3 border shadow-xl -left-5 bottom-10 rounded-xl border-white/10 bg-slate-900/95 shadow-black/30 animate-revenue">
                                    <div className="flex items-center justify-center text-blue-400 rounded-lg w-9 h-9 bg-blue-500/10">
                                        <TrendingUpIcon />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium">
                                            Revenue
                                        </p>

                                        <p className="text-sm font-bold text-blue-400">
                                            +24.8%
                                        </p>
                                    </div>
                                </div>

                                {/* Browser Window */}
                                <div className="relative p-3 border shadow-2xl rounded-3xl border-white/10 bg-slate-900/90 shadow-black/50 backdrop-blur-xl">
                                    {/* Browser Header */}
                                    <div className="flex items-center gap-2 px-3 pb-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />

                                        <div className="flex-1 h-6 ml-2 rounded-lg bg-white/[0.03]" />
                                    </div>

                                    {/* Dashboard */}
                                    <div className="p-5 border rounded-2xl border-white/10 bg-slate-950">
                                        {/* Dashboard Header */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-400">
                                                    Dashboard
                                                </p>

                                                <h2 className="mt-1 text-xl font-bold">
                                                    Hallo 👋
                                                </h2>
                                            </div>

                                            <div className="relative flex items-center justify-center w-10 h-10 font-bold text-blue-400 rounded-full bg-blue-600/20">
                                                <span className="absolute inset-0 rounded-full animate-ping bg-blue-500/10" />

                                                <span className="relative">
                                                    S
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <StatCard
                                                icon={<TicketIcon />}
                                                title="Bookings"
                                                value="1,248"
                                                delay="0s"
                                            />

                                            <StatCard
                                                icon={<PlaneIcon />}
                                                title="Flights"
                                                value="384"
                                                delay="0.2s"
                                            />

                                            <StatCard
                                                icon={<HotelIcon />}
                                                title="Hotels"
                                                value="527"
                                                delay="0.4s"
                                            />

                                            <StatCard
                                                icon={<UsersIcon />}
                                                title="Customers"
                                                value="2,841"
                                                delay="0.6s"
                                            />
                                        </div>

                                        {/* Chart */}
                                        <div className="p-4 mt-4 border rounded-xl border-white/10 bg-white/[0.03]">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <span className="text-sm font-medium">
                                                        Booking Overview
                                                    </span>

                                                    <p className="mt-1 text-[10px] text-slate-600">
                                                        Monthly performance
                                                    </p>
                                                </div>

                                                <span className="px-2 py-1 text-[10px] rounded-md bg-blue-500/10 text-blue-400">
                                                    This Month
                                                </span>
                                            </div>

                                            <div className="relative flex items-end h-32 gap-2">
                                                {/* Chart Grid */}
                                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                    <div className="border-t border-white/5" />
                                                    <div className="border-t border-white/5" />
                                                    <div className="border-t border-white/5" />
                                                    <div className="border-t border-white/5" />
                                                </div>

                                                {[
                                                    35,
                                                    55,
                                                    42,
                                                    70,
                                                    52,
                                                    85,
                                                    65,
                                                    95,
                                                    72,
                                                    88,
                                                    76,
                                                    100,
                                                ].map((height, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative flex-1 group"
                                                    >
                                                        <div
                                                            className="absolute bottom-0 w-full transition-all duration-700 rounded-t-md bg-blue-600/80 hover:bg-blue-400 animate-chart-bar"
                                                            style={{
                                                                height: `${height}%`,
                                                                animationDelay: `${index * 0.08}s`,
                                                            }}
                                                        />

                                                        {/* Hover dot */}
                                                        <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-blue-300 opacity-0 group-hover:opacity-100 transition" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bottom Status */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex w-2 h-2">
                                                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400" />
                                                    <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                                                </span>

                                                <span className="text-[10px] text-slate-500">
                                                    System operational
                                                </span>
                                            </div>

                                            <span className="text-[10px] text-slate-600">
                                                Updated just now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    FOOTER
                ========================================================== */}
                <footer className="border-t border-white/10">
                    <div className="flex flex-col gap-3 px-6 py-8 mx-auto text-sm max-w-7xl text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                        <p>
                            © {new Date().getFullYear()} SeindoTravel. All
                            rights reserved.
                        </p>

                        <p>
                            Travel Management System
                        </p>
                    </div>
                </footer>
            </div>

            {/* =============================================================
                ANIMATIONS
            ============================================================= */}
            <style>{`
                @keyframes dashboardFloat {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes notificationFloat {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(-6px);
                    }
                }

                @keyframes revenueFloat {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(7px);
                    }
                }

                @keyframes chartBar {
                    0% {
                        transform: scaleY(0);
                        transform-origin: bottom;
                    }

                    100% {
                        transform: scaleY(1);
                        transform-origin: bottom;
                    }
                }

                .animate-dashboard-float {
                    animation: dashboardFloat 5s ease-in-out infinite;
                }

                .animate-notification {
                    animation: notificationFloat 3s ease-in-out infinite;
                }

                .animate-revenue {
                    animation: revenueFloat 4s ease-in-out infinite;
                }

                .animate-chart-bar {
                    animation: chartBar 1s ease-out both;
                }
            `}</style>
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
    icon,
    title,
    value,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    delay: string;
}) {
    return (
        <div
            className="p-4 transition duration-300 border rounded-xl border-white/10 bg-white/[0.03] hover:border-blue-500/30 hover:bg-blue-500/[0.03]"
            style={{
                animation: `statPulse 3s ease-in-out infinite`,
                animationDelay: delay,
            }}
        >
            <div className="flex items-center gap-2 text-blue-400">
                {icon}

                <span className="text-xs text-slate-500">
                    {title}
                </span>
            </div>

            <p className="mt-2 text-xl font-bold">
                {value}
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Icons
|--------------------------------------------------------------------------
*/

function ArrowRightIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 transition group-hover:translate-x-1"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 text-blue-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4 4L19 6"
            />
        </svg>
    );
}

function TrendingUpIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 17l6-6 4 4 7-8"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 7h5v5"
            />
        </svg>
    );
}

function TicketIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.5A2.5 2.5 0 0 0 5.5 6h13A2.5 2.5 0 0 0 21 8.5v1a2.5 2.5 0 0 0 0 5v1a2.5 2.5 0 0 0-2.5 2.5h-13A2.5 2.5 0 0 0 3 15.5a2.5 2.5 0 0 0 0-5v-2Z"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 2"
                d="M12 8v8"
            />
        </svg>
    );
}

function PlaneIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 14.5 3 12l.5-2 9 1.5L16 4.5a1.5 1.5 0 0 1 2.5 1.4L17 12l4.5 2.5a1.5 1.5 0 0 1-1.5 2.6l-5.5-1.8-3 3.2-1.5-.8 1-3.2Z"
            />
        </svg>
    );
}

function HotelIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 20V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16h18M6 16v-4h5v4m2 0v-4h5v4M6 8h5v3H6V8Z"
            />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
            />

            <circle cx="9.5" cy="7" r="4" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 11a4 4 0 1 0 0-8m4 18v-2a4 4 0 0 0-3-3.87"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3 4.5 6v5.5c0 4.8 3.2 8.5 7.5 9.5 4.3-1 7.5-4.7 7.5-9.5V6L12 3Z"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12 2 2 4-4"
            />
        </svg>
    );
}
