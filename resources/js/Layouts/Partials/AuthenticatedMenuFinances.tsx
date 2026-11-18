import {
    BedDouble,
    ChevronDown,
    ChevronRight,
    GlobeIcon,
    HotelIcon,
    LucideTicketPercent,
    MapPinnedIcon,
    PlaneIcon,
    Share2Icon,
    UserRoundIcon,
    Wallet,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface AuthenticatedMenuFinancesProps {
    url: string;
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthenticatedMenuFinances({
    url,
    open,
    onToggle,
    containerRef,
}: AuthenticatedMenuFinancesProps) {
    /*
    |--------------------------------------------------------------------------
    | Active Routes
    |--------------------------------------------------------------------------
    */

    // const isFlightVouchers = route().current('voucher.indexFlight');
    // const isHotelVouchers = route().current('voucher.indexHotel');
    // const isTourVoucher = route().current('voucher.indexTour');

    const isFinanceFlightVia = route().current('finance.flights.via.*');

    const isFinanceHotelsMg = route().current('finance.hotels.mg.*');

    // Apakah sedang berada di salah satu halaman markup?
    const isFinanceFlightsPage = isFinanceFlightVia;
    // || isFinanceFlightTravelport;
    const isFinanceHotelsPage = isFinanceHotelsMg;
    // || isFinanceHotelsDida;

    // Apakah sedang berada di halaman Distribution Type?
    const isFinancePage =
        // isFlightVouchers ||
        // isHotelVouchers ||
        isFinanceFlightsPage || isFinanceHotelsPage;

    /*
    |--------------------------------------------------------------------------
    | Submenu
    |--------------------------------------------------------------------------
    */

    const [financeFlightsOpen, setFinanceFlightsOpen] =
        useState(isFinanceFlightsPage);

    const [financeHotelsOpen, setFinanceHotelsOpen] =
        useState(isFinanceHotelsPage);

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
        if (isFinanceFlightsPage) {
            setFinanceFlightsOpen(true);
        }
    }, [isFinanceFlightsPage]);

    useEffect(() => {
        if (isFinanceHotelsPage) {
            setFinanceHotelsOpen(true);
        }
    }, [isFinanceHotelsPage]);

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

                    isFinancePage || open
                        ? 'bg-primary-bright text-white'
                        : 'text-quaternary-bright hover:bg-primary-bright hover:text-white',
                ].join(' ')}
            >
                <Wallet size={20} strokeWidth={2} />

                {/* Active indicator */}

                {isFinancePage && (
                    <span className="h-6 w-1 bg-tertiary absolute -left-[9px] rounded-r-full" />
                )}

                {/* Tooltip */}

                {!open && (
                    <span className="rounded-lg bg-primary px-3 py-2 font-semibold text-white shadow-xl pointer-events-none absolute top-1/2 left-[58px] z-[100] -translate-y-1/2 text-[11px] whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Finances
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
                                <Wallet size={15} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-primary">
                                    Finances
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Finances management
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        MENU ITEMS FLIGHTS
                    ================================================== */}
                    <div className="p-2">
                        {/* =================================================
                           Distribution Type Parent
                        ================================================== */}
                        <button
                            type="button"
                            onClick={() =>
                                setFinanceFlightsOpen((value) => !value)
                            }
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex w-full items-center',
                                'transition-all duration-150',

                                isFinanceFlightsPage || financeFlightsOpen
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isFinanceFlightsPage || financeFlightsOpen
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <PlaneIcon size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1 text-left">
                                <p className="text-xs font-semibold">Flight</p>

                                <p className="mt-0.5 text-quaternary-bright truncate text-[10px]">
                                    Manage Finance Flight
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronDown
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-200',

                                    financeFlightsOpen
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

                                financeFlightsOpen
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0',
                            ].join(' ')}
                        >
                            <div className="ml-5 mt-1 pl-2 border-l border-[#E2E8F0]">
                                {/* =========================================
                                    HOTEL MARKUP
                                ========================================== */}

                                <Link
                                    href={route('finance.flights.via.index')}
                                    className={[
                                        'group gap-2 rounded-lg px-3 py-2.5 flex items-center',
                                        'transition-all duration-150',

                                        isFinanceFlightVia
                                            ? 'bg-tertiary/10 text-tertiary'
                                            : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                                    ].join(' ')}
                                >
                                    <div
                                        className={[
                                            'h-6 w-6 rounded-md flex shrink-0 items-center justify-center',

                                            isFinanceFlightVia
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-secondary-dark text-quaternary',
                                        ].join(' ')}
                                    >
                                        <p>V</p>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            VIA
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Kelola deposit di VIA
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={13}
                                        className={[
                                            'shrink-0 transition-transform duration-150',

                                            isFinanceFlightVia
                                                ? 'text-tertiary'
                                                : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                        ].join(' ')}
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* =================================================
                           Finance Hotels
                        ================================================== */}
                        <button
                            type="button"
                            onClick={() =>
                                setFinanceHotelsOpen((value) => !value)
                            }
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex w-full items-center',
                                'transition-all duration-150',

                                isFinanceHotelsPage || financeHotelsOpen
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isFinanceHotelsPage || financeHotelsOpen
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <BedDouble size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1 text-left">
                                <p className="text-xs font-semibold">Hotel</p>

                                <p className="mt-0.5 text-quaternary-bright truncate text-[10px]">
                                    Manage all finances in the hotel provider
                                    account.
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronDown
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-200',

                                    financeHotelsOpen
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

                                financeHotelsOpen
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0',
                            ].join(' ')}
                        >
                            <div className="ml-5 mt-1 pl-2 border-l border-[#E2E8F0]">
                                {/* =========================================
                                    HOTEL MARKUP
                                ========================================== */}

                                <Link
                                    href={route('finance.hotels.mg.index')}
                                    className={[
                                        'group gap-2 rounded-lg px-3 py-2.5 flex items-center',
                                        'transition-all duration-150',

                                        isFinanceHotelsMg
                                            ? 'bg-tertiary/10 text-tertiary'
                                            : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                                    ].join(' ')}
                                >
                                    <div
                                        className={[
                                            'h-6 w-6 rounded-md flex shrink-0 items-center justify-center',

                                            isFinanceHotelsMg
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-secondary-dark text-quaternary',
                                        ].join(' ')}
                                    >
                                        <p>M</p>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            MG Bedbank
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage credit from MG
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={13}
                                        className={[
                                            'shrink-0 transition-transform duration-150',

                                            isFinanceHotelsMg
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
