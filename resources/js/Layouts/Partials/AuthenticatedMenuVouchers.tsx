import {
    ChevronDown,
    ChevronRight,
    GlobeIcon,
    HotelIcon,
    LucideTicketPercent,
    MapPinnedIcon,
    PlaneIcon,
    Share2Icon,
    UserRoundIcon,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface AuthenticatedMenuVouchersProps {
    url: string;
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthenticatedMenuVouchers({
    url,
    open,
    onToggle,
    containerRef,
}: AuthenticatedMenuVouchersProps) {
    /*
    |--------------------------------------------------------------------------
    | Active Routes
    |--------------------------------------------------------------------------
    */

    const isFlightVouchers = route().current('voucher.indexFlight');
    const isHotelVouchers = route().current('voucher.indexHotel');
    const isTourVoucher = route().current('voucher.indexTour');

    // Hotel Markup
    const isHotelMarkup = route().current('hotel.markups.hotel.*');

    // Destination Markup
    const isDestinationMarkup = route().current('hotel.markups.destination.*');

    // Apakah sedang berada di salah satu halaman markup?
    const isDistributionTypePage = isHotelMarkup || isDestinationMarkup;

    // Apakah sedang berada di halaman Distribution Type?
    const isVouchersPage =
        isFlightVouchers ||
        isHotelVouchers ||
        isTourVoucher ||
        isDistributionTypePage;

    /*
    |--------------------------------------------------------------------------
    | Markup Submenu
    |--------------------------------------------------------------------------
    */

    const [distributionTypeOpen, setDistributionTypeOpen] = useState(
        isDistributionTypePage,
    );

    /*
    |--------------------------------------------------------------------------
    | Automatically Open Distribution Type Submenu
    |--------------------------------------------------------------------------
    |
    | Kalau user sedang berada di DistributionType atau Submenu dibawahnya,
    | submenu otomatis terbuka.
    |
    */

    useEffect(() => {
        if (isDistributionTypePage) {
            setDistributionTypeOpen(true);
        }
    }, [isDistributionTypePage]);

    return (
        <div ref={containerRef} className="relative">
            {/* =====================================================
                HOTELS BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={onToggle}
                aria-label="Hotels"
                aria-expanded={open}
                className={[
                    'group h-11 w-11 rounded-xl relative flex items-center justify-center',
                    'transition-all duration-200',

                    isVouchersPage || open
                        ? 'bg-primary-bright text-white'
                        : 'text-quaternary-bright hover:bg-primary-bright hover:text-white',
                ].join(' ')}
            >
                <LucideTicketPercent size={20} strokeWidth={2} />

                {/* Active indicator */}

                {isVouchersPage && (
                    <span className="h-6 w-1 bg-tertiary absolute -left-[9px] rounded-r-full" />
                )}

                {/* Tooltip */}

                {!open && (
                    <span className="rounded-lg bg-primary px-3 py-2 font-semibold text-white shadow-xl pointer-events-none absolute top-1/2 left-[58px] z-[100] -translate-y-1/2 text-[11px] whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Vouchers
                    </span>
                )}
            </button>

            {/* =====================================================
                VOUCHERS FLYMENU
            ====================================================== */}

            <div
                className={[
                    'top-0 absolute left-[58px] z-[90] w-[250px]',
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
                                <LucideTicketPercent size={15} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-primary">
                                    Vouchers
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Vouchers management
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        MENU ITEMS
                    ================================================== */}
                    <div className="p-2">
                        {/* =================================================
                            Flight Vouchers
                        ================================================== */}

                        <Link
                            href={route('voucher.indexFlight')}
                            className={[
                                'group gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isFlightVouchers
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isFlightVouchers
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <PlaneIcon size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Flight Vouchers
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage flight vouchers
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isFlightVouchers
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* =================================================
                            Hotel Vouchers
                        ================================================== */}

                        <Link
                            href={route('voucher.indexHotel')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isHotelVouchers
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isHotelVouchers
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <HotelIcon size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Hotel Vouchers
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage hotel vouchers
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isHotelVouchers
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* =================================================
                            Tour Vouchers
                        ================================================== */}
                        <Link
                            href={route('voucher.indexTour')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isTourVoucher
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isTourVoucher
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <MapPinnedIcon size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Tour Vouchers
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage tour vouchers
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isTourVoucher
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* =================================================
                           Distribution Type Parent
                        ================================================== */}
                        <button
                            type="button"
                            onClick={() =>
                                setDistributionTypeOpen((value) => !value)
                            }
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex w-full items-center',
                                'transition-all duration-150',

                                isDistributionTypePage || distributionTypeOpen
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isDistributionTypePage ||
                                    distributionTypeOpen
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <Share2Icon size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1 text-left">
                                <p className="text-xs font-semibold">
                                    Distribution Type
                                </p>

                                <p className="mt-0.5 text-quaternary-bright truncate text-[10px]">
                                    Manage public and personal voucher
                                    distribution
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronDown
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-200',

                                    distributionTypeOpen
                                        ? 'text-tertiary rotate-180'
                                        : 'text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </button>

                        {/* =================================================
                            Distribution Type Submenu
                        ================================================== */}

                        <div
                            className={[
                                'overflow-hidden transition-all duration-200',

                                distributionTypeOpen
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0',
                            ].join(' ')}
                        >
                            <div className="ml-5 mt-1 pl-2 border-l border-[#E2E8F0]">
                                {/* =========================================
                                    HOTEL MARKUP
                                ========================================== */}

                                <Link
                                    href={route('hotel.markups.hotel.index')}
                                    className={[
                                        'group gap-2 rounded-lg px-3 py-2.5 flex items-center',
                                        'transition-all duration-150',

                                        isHotelMarkup
                                            ? 'bg-tertiary/10 text-tertiary'
                                            : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                                    ].join(' ')}
                                >
                                    <div
                                        className={[
                                            'h-6 w-6 rounded-md flex shrink-0 items-center justify-center',

                                            isHotelMarkup
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-secondary-dark text-quaternary',
                                        ].join(' ')}
                                    >
                                        <UserRoundIcon size={13} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            Personal
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage personal voucher
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={13}
                                        className={[
                                            'shrink-0 transition-transform duration-150',

                                            isHotelMarkup
                                                ? 'text-tertiary'
                                                : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                        ].join(' ')}
                                    />
                                </Link>

                                {/* =========================================
                                    PUBLIC VOUCHERS
                                ========================================== */}

                                <Link
                                    href={route(
                                        'hotel.markups.destination.index',
                                    )}
                                    className={[
                                        'group mt-1 gap-2 rounded-lg px-3 py-2.5 flex items-center',
                                        'transition-all duration-150',

                                        isDestinationMarkup
                                            ? 'bg-tertiary/10 text-tertiary'
                                            : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                                    ].join(' ')}
                                >
                                    <div
                                        className={[
                                            'h-6 w-6 rounded-md flex shrink-0 items-center justify-center',

                                            isDestinationMarkup
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-secondary-dark text-quaternary',
                                        ].join(' ')}
                                    >
                                        <GlobeIcon size={13} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            Public
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage public voucher
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={13}
                                        className={[
                                            'shrink-0 transition-transform duration-150',

                                            isDestinationMarkup
                                                ? 'text-tertiary'
                                                : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                        ].join(' ')}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
