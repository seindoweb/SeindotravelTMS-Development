import {
    ChevronRight,
    ContactRound,
    ShieldUser,
    UserRound,
    Users,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface AuthenticatedMenuUsersProps {
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthenticatedMenuUsers({
    open,
    onToggle,
    containerRef,
}: AuthenticatedMenuUsersProps) {
    const isAdministratorPage = route().current('user.administrators.*');

    const isCustomerPage = route().current('user.customers.*');

    const isTravellerPage = route().current('user.travellers.*');

    const isUsersPage =
        isAdministratorPage || isCustomerPage || isTravellerPage;

    return (
        <div ref={containerRef} className="relative">
            {/* =====================================================
                USERS BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={onToggle}
                aria-label="Users"
                aria-expanded={open}
                className={[
                    'group h-11 w-11 rounded-xl relative flex items-center justify-center',
                    'transition-all duration-200',
                    isUsersPage || open
                        ? 'bg-primary-bright text-white'
                        : 'text-quaternary-bright hover:bg-primary-bright hover:text-white',
                ].join(' ')}
            >
                <Users size={20} strokeWidth={2} />

                {/* Active indicator */}

                {isUsersPage && (
                    <span className="h-6 w-1 bg-tertiary absolute -left-[9px] rounded-r-full" />
                )}

                {/* Tooltip */}

                {!open && (
                    <span className="rounded-lg bg-primary px-3 py-2 font-semibold text-white shadow-xl pointer-events-none absolute top-1/2 left-[58px] z-[100] -translate-y-1/2 text-[11px] whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Users
                    </span>
                )}
            </button>

            {/* =====================================================
                USERS FLYMENU
            ====================================================== */}

            <div
                className={[
                    'top-0 absolute left-[58px] z-[90] w-[230px]',
                    'ease-out origin-left transition-all duration-200',
                    open
                        ? 'translate-x-0 pointer-events-auto scale-100 opacity-100'
                        : '-translate-x-2 pointer-events-none scale-95 opacity-0',
                ].join(' ')}
            >
                <div className="rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0]">
                    {/* =================================================
                        FLYMENU HEADER
                    ================================================== */}

                    <div className="px-4 py-3 border-secondary-dark bg-secondary border-b">
                        <div className="gap-2 flex items-center">
                            <div className="w-8 h-8 text-white rounded-lg bg-primary flex items-center justify-center">
                                <Users size={15} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-primary">
                                    Users
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage system users
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        MENU ITEMS
                    ================================================== */}

                    <div className="p-2">
                        {/* -------------------------------------------------
                            ADMINISTRATOR
                        -------------------------------------------------- */}

                        <Link
                            href={route('user.administrators.index')}
                            className={[
                                'group gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',
                                isAdministratorPage
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',
                                    isAdministratorPage
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <ShieldUser size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Administrator
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage administrators
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',
                                    isAdministratorPage
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* -------------------------------------------------
                            CUSTOMER
                        -------------------------------------------------- */}

                        <Link
                            href={route('user.customers.index')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',
                                isCustomerPage
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',
                                    isCustomerPage
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <UserRound size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Customer
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage customers
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',
                                    isCustomerPage
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* -------------------------------------------------
                            TRAVELLER
                        -------------------------------------------------- */}

                        <Link
                            href={route('user.travellers.index')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',
                                isTravellerPage
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',
                                    isTravellerPage
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <ContactRound size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Traveller
                                </p>

                                <p className="mt-0.5 text-quaternary-bright truncate text-[10px]">
                                    Manage travellers on customer
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',
                                    isTravellerPage
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
