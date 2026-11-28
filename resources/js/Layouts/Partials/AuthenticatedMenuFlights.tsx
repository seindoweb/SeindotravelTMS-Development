import {
    BadgeDollarSign,
    BedDouble,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Hotel,
    LucideTowerControl,
    MapPinned,
    Plane,
    PlaneIcon,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface AuthenticatedMenuFlightsProps {
    url: string;
    open: boolean;
    onToggle: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthenticatedMenuFlights({
    url,
    open,
    onToggle,
    containerRef,
}: AuthenticatedMenuFlightsProps) {
    /*
    |--------------------------------------------------------------------------
    | Active Routes
    |--------------------------------------------------------------------------
    */

    const isFlightOrders = route().current('flight.orders.*');

    const isFlightBookings = route().current('flight.bookings.*');

    // Airline Markup
    const isAirlineMarkup = route().current('flight.markups.airline.*');

    // Airport Markup
    const isAirportMarkup = route().current('flight.markups.airport.*');

    // Apakah sedang berada di salah satu halaman markup?
    const isMarkupPage = isAirlineMarkup || isAirportMarkup;

    // Apakah sedang berada di halaman Flights?
    const isFlightsPage = isFlightOrders || isFlightBookings || isMarkupPage;

    /*
    |--------------------------------------------------------------------------
    | Markup Submenu
    |--------------------------------------------------------------------------
    */

    const [markupOpen, setMarkupOpen] = useState(isMarkupPage);

    /*
    |--------------------------------------------------------------------------
    | Automatically Open Markup Submenu
    |--------------------------------------------------------------------------
    |
    | Kalau user sedang berada di Hotel Markup atau Destination Markup,
    | submenu otomatis terbuka.
    |
    */

    useEffect(() => {
        if (isMarkupPage) {
            setMarkupOpen(true);
        }
    }, [isMarkupPage]);

    return (
        <div ref={containerRef} className="relative">
            {/* =====================================================
                HOTELS BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={onToggle}
                aria-label="Flights"
                aria-expanded={open}
                className={[
                    'group h-11 w-11 rounded-xl relative flex items-center justify-center',
                    'transition-all duration-200',

                    isFlightsPage || open
                        ? 'bg-primary-bright text-white'
                        : 'text-quaternary-bright hover:bg-primary-bright hover:text-white',
                ].join(' ')}
            >
                <Plane size={20} strokeWidth={2} />

                {/* Active indicator */}

                {isFlightsPage && (
                    <span className="h-6 w-1 bg-tertiary absolute -left-[9px] rounded-r-full" />
                )}

                {/* Tooltip */}

                {!open && (
                    <span className="rounded-lg bg-primary px-3 py-2 font-semibold text-white shadow-xl pointer-events-none absolute top-1/2 left-[58px] z-[100] -translate-y-1/2 text-[11px] whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Flights
                    </span>
                )}
            </button>

            {/* =====================================================
                HOTELS FLYMENU
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
                                <Plane size={15} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-primary">
                                    Flights
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Flight management
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        MENU ITEMS
                    ================================================== */}

                    <div className="p-2">
                        {/* =================================================
                            FLIGHT ORDERS
                        ================================================== */}

                        <Link
                            href={route('flight.orders.index')}
                            className={[
                                'group gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isFlightOrders
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isFlightOrders
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <ClipboardList size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Flight Orders
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage flight orders
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isFlightOrders
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* =================================================
                            FLIGHT BOOKINGS
                        ================================================== */}

                        <Link
                            href={route('flight.bookings.index')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isFlightBookings
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isFlightBookings
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <PlaneIcon size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Flight Bookings
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage flight bookings
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isFlightBookings
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* =================================================
                            MARKUPS PARENT
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() => setMarkupOpen((value) => !value)}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex w-full items-center',
                                'transition-all duration-150',

                                isMarkupPage || markupOpen
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isMarkupPage || markupOpen
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <BadgeDollarSign size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1 text-left">
                                <p className="text-xs font-semibold">Markups</p>

                                <p className="mt-0.5 text-quaternary-bright truncate text-[10px]">
                                    Manage hotel price markups
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronDown
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-200',

                                    markupOpen
                                        ? 'text-tertiary rotate-180'
                                        : 'text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </button>

                        {/* =================================================
                            MARKUP SUBMENU
                        ================================================== */}

                        <div
                            className={[
                                'overflow-hidden transition-all duration-200',

                                markupOpen
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0',
                            ].join(' ')}
                        >
                            <div className="ml-5 mt-1 pl-2 border-l border-[#E2E8F0]">
                                {/* =========================================
                                    AIRLINE MARKUP
                                ========================================== */}

                                <Link
                                    href={route('flight.markups.airline.index')}
                                    className={[
                                        'group gap-2 rounded-lg px-3 py-2.5 flex items-center',
                                        'transition-all duration-150',

                                        isAirlineMarkup
                                            ? 'bg-tertiary/10 text-tertiary'
                                            : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                                    ].join(' ')}
                                >
                                    <div
                                        className={[
                                            'h-6 w-6 rounded-md flex shrink-0 items-center justify-center',

                                            isAirlineMarkup
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-secondary-dark text-quaternary',
                                        ].join(' ')}
                                    >
                                        <PlaneIcon size={13} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            Airline Markup
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage airline markups
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={13}
                                        className={[
                                            'shrink-0 transition-transform duration-150',

                                            isAirlineMarkup
                                                ? 'text-tertiary'
                                                : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                        ].join(' ')}
                                    />
                                </Link>

                                {/* =========================================
                                    AIRPORT MARKUP
                                ========================================== */}

                                <Link
                                    href={route('flight.markups.airport.index')}
                                    className={[
                                        'group mt-1 gap-2 rounded-lg px-3 py-2.5 flex items-center',
                                        'transition-all duration-150',

                                        isAirportMarkup
                                            ? 'bg-tertiary/10 text-tertiary'
                                            : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                                    ].join(' ')}
                                >
                                    <div
                                        className={[
                                            'h-6 w-6 rounded-md flex shrink-0 items-center justify-center',

                                            isAirportMarkup
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-secondary-dark text-quaternary',
                                        ].join(' ')}
                                    >
                                        <LucideTowerControl size={13} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            Airport Markup
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage airport markups
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={13}
                                        className={[
                                            'shrink-0 transition-transform duration-150',

                                            isAirportMarkup
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
