import {
    ChevronRight,
    LogOut,
    Settings,
    UserRound,
} from 'lucide-react';

import { Link } from '@inertiajs/react';
import { UserProps } from '@/types';

interface AuthenticatedProfileProps {
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
    user: UserProps
}

export default function AuthenticatedProfile({
    open,
    onToggle,
    containerRef,
    user,
}: AuthenticatedProfileProps) {
    return (
        <div
            ref={containerRef}
            className="relative"
        >

            {/* =====================================================
                PROFILE BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={onToggle}
                aria-label="Profile"
                aria-expanded={open}
                className={[
                    'flex items-center gap-2 rounded-xl p-1.5',
                    'transition-all duration-200',
                    'hover:bg-secondary',

                    open
                        ? 'bg-secondary'
                        : '',
                ].join(' ')}
            >

                {/* Avatar */}

                <div className="flex items-center justify-center text-white rounded-full h-9 w-9 bg-primary">
                    <UserRound
                        size={16}
                        strokeWidth={2}
                    />
                </div>


                {/* User Information */}

                <div className="hidden text-left sm:block">

                    <p className="text-xs font-bold text-primary">
                        {user.full_name}
                    </p>

                    <p className="mt-0.5 text-[10px] text-quaternary">
                        {user.email}
                    </p>

                </div>


                {/* Chevron */}

                <ChevronRight
                    size={14}
                    className={[
                        'hidden text-quaternary-bright transition-transform duration-200 sm:block',

                        open
                            ? 'rotate-90'
                            : '',
                    ].join(' ')}
                />

            </button>


            {/* =====================================================
                PROFILE DROPDOWN
            ====================================================== */}

            <div
                className={[
                    'absolute right-0 top-12 z-[100] w-[200px]',
                    'origin-top-right transition-all duration-200 ease-out',

                    open
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
                ].join(' ')}
            >

                <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-2xl">

                    {/* =================================================
                        PROFILE HEADER
                    ================================================== */}

                    <div className="px-3 py-3">

                        <div className="flex items-center gap-2.5">

                            <div className="flex items-center justify-center w-8 h-8 text-white rounded-full shrink-0 bg-primary">
                                <UserRound
                                    size={14}
                                />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-bold truncate text-primary">
                                    Travel Admin
                                </p>

                                <p className="mt-0.5 text-[10px] text-quaternary-bright">
                                    Administrator
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MENU
                    ================================================== */}

                    <div className="pt-1 border-t border-secondary-dark">

                        {/* Profile */}

                        <Link
                            href={route('profile.show')}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-quaternary-dark transition hover:bg-secondary hover:text-primary"
                        >
                            <UserRound
                                size={15}
                            />

                            <span>
                                Profile
                            </span>
                        </Link>


                        {/* Preferences */}

                        <Link
                            href="/settings/general"
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-quaternary-dark transition hover:bg-secondary hover:text-primary"
                        >
                            <Settings
                                size={15}
                            />

                            <span>
                                Preferences
                            </span>
                        </Link>


                        {/* Divider */}

                        <div className="my-1 border-t border-secondary-dark" />


                        {/* Sign Out */}

                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-tertiary transition hover:bg-tertiary/5"
                        >
                            <LogOut
                                size={15}
                            />

                            <span>
                                Sign Out
                            </span>
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}
