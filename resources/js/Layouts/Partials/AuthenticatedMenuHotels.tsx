import {
    BedDouble,
    ChevronRight,
    Hotel,
    Settings,
    UserRound,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface AuthenticatedMenuHotelsProps {
    url: string;
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthenticatedMenuHotels({
    url,
    open,
    onToggle,
    containerRef,
}: AuthenticatedMenuHotelsProps) {
    const isGeneralSettings =
        url === '/settings/general';

    const isUserSettings =
        url === '/settings/users';

    const isSettingsPage =
        isGeneralSettings ||
        isUserSettings;

    return (
        <div
            ref={containerRef}
            className="relative"
        >

            {/* =====================================================
                SETTINGS BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={onToggle}
                aria-label="Settings"
                aria-expanded={open}
                className={[
                    'group relative flex h-11 w-11 items-center justify-center rounded-xl',
                    'transition-all duration-200',

                    isSettingsPage || open
                        ? 'bg-primary-bright text-white'
                        : 'text-quaternary-bright hover:bg-primary-bright hover:text-white',
                ].join(' ')}
            >
                <Hotel
                    size={20}
                    strokeWidth={2}
                />

                {/* Active indicator */}

                {isSettingsPage && (
                    <span className="absolute -left-[9px] h-6 w-1 rounded-r-full bg-tertiary" />
                )}

                {/* Tooltip */}

                {!open && (
                    <span className="pointer-events-none absolute left-[58px] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                        Settings
                    </span>
                )}
            </button>


            {/* =====================================================
                SETTINGS FLYMENU
            ====================================================== */}

            <div
                className={[
                    'absolute left-[58px] top-0 z-[90] w-[230px]',
                    'origin-left transition-all duration-200 ease-out',

                    open
                        ? 'pointer-events-auto translate-x-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-x-2 scale-95 opacity-0',
                ].join(' ')}
            >
                <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">

                    {/* =================================================
                        FLYMENU HEADER
                    ================================================== */}

                    <div className="px-4 py-3 border-b border-secondary-dark bg-secondary">

                        <div className="flex items-center gap-2">

                            <div className="flex items-center justify-center w-8 h-8 text-white rounded-lg bg-primary">
                                <Settings size={15} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-primary">
                                    Settings
                                </p>

                                <p className="mt-0.5 text-[10px] text-quaternary-bright">
                                    System configuration
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MENU ITEMS
                    ================================================== */}

                    <div className="p-2">

                        {/* =================================================
                            GENERAL SETTINGS
                        ================================================== */}

                        <Link
                            href="/settings/general"
                            className={[
                                'group flex items-center gap-3 rounded-xl px-3 py-3',
                                'transition-all duration-150',

                                isGeneralSettings
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >

                            {/* Icon */}

                            <div
                                className={[
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',

                                    isGeneralSettings
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <Settings size={16} />
                            </div>


                            {/* Text */}

                            <div className="flex-1 min-w-0">

                                <p className="text-xs font-semibold">
                                    General Settings
                                </p>

                                <p className="mt-0.5 text-[10px] text-quaternary-bright">
                                    General configuration
                                </p>

                            </div>


                            {/* Arrow */}

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isGeneralSettings
                                        ? 'text-tertiary'
                                        : 'text-[#CBD5E1] group-hover:translate-x-0.5',
                                ].join(' ')}
                            />

                        </Link>


                        {/* =================================================
                            USER SETTINGS
                        ================================================== */}

                        <Link
                            href="/settings/users"
                            className={[
                                'group mt-1 flex items-center gap-3 rounded-xl px-3 py-3',
                                'transition-all duration-150',

                                isUserSettings
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >

                            {/* Icon */}

                            <div
                                className={[
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',

                                    isUserSettings
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <UserRound size={16} />
                            </div>


                            {/* Text */}

                            <div className="flex-1 min-w-0">

                                <p className="text-xs font-semibold">
                                    User Settings
                                </p>

                                <p className="mt-0.5 text-[10px] text-quaternary-bright">
                                    Manage user preferences
                                </p>

                            </div>


                            {/* Arrow */}

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isUserSettings
                                        ? 'text-tertiary'
                                        : 'text-[#CBD5E1] group-hover:translate-x-0.5',
                                ].join(' ')}
                            />

                        </Link>

                    </div>

                </div>
            </div>

        </div>
    );
}
