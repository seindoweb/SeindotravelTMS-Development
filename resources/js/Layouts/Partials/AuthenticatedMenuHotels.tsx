import {
    BadgeDollarSign,
    BedDouble,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Hotel,
    MapPinned,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    /*
    |--------------------------------------------------------------------------
    | Active Routes
    |--------------------------------------------------------------------------
    */

    const isHotelOrders = route().current('hotel.orders.*');

    const isHotelBookings = route().current('hotel.bookings.*');

    // Hotel Markup
    const isHotelMarkup = route().current('hotel.markups.hotel.*');

    // Destination Markup
    const isDestinationMarkup = route().current('hotel.markups.destination.*');

    // Apakah sedang berada di salah satu halaman markup?
    const isMarkupPage = isHotelMarkup || isDestinationMarkup;

    // Apakah sedang berada di halaman Hotels?
    const isHotelsPage = isHotelOrders || isHotelBookings || isMarkupPage;

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
                aria-label="Hotels"
                aria-expanded={open}
                className={[
                    'group h-11 w-11 rounded-xl relative flex items-center justify-center',
                    'transition-all duration-200',

                    isHotelsPage || open
                        ? 'bg-primary-bright text-white'
                        : 'text-quaternary-bright hover:bg-primary-bright hover:text-white',
                ].join(' ')}
            >
                <BedDouble size={20} strokeWidth={2} />

                {/* Active indicator */}

                {isHotelsPage && (
                    <span className="h-6 w-1 bg-tertiary absolute -left-[9px] rounded-r-full" />
                )}

                {/* Tooltip */}

                {!open && (
                    <span className="rounded-lg bg-primary px-3 py-2 font-semibold text-white shadow-xl pointer-events-none absolute top-1/2 left-[58px] z-[100] -translate-y-1/2 text-[11px] whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Hotels
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
                                <BedDouble size={15} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-primary">
                                    Hotels
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Hotel management
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        MENU ITEMS
                    ================================================== */}

                    <div className="p-2">
                        {/* =================================================
                            HOTEL ORDERS
                        ================================================== */}

                        <Link
                            href={route('hotel.orders.list')}
                            className={[
                                'group gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isHotelOrders
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isHotelOrders
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <ClipboardList size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Hotel Orders
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage hotel orders
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isHotelOrders
                                        ? 'text-tertiary'
                                        : 'group-hover:translate-x-0.5 text-[#CBD5E1]',
                                ].join(' ')}
                            />
                        </Link>

                        {/* =================================================
                            HOTEL BOOKINGS
                        ================================================== */}

                        <Link
                            href={route('hotel.bookings.index')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isHotelBookings
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isHotelBookings
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <BedDouble size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Hotel Bookings
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage hotel bookings
                                </p>
                            </div>

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isHotelBookings
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
                                        <Hotel size={13} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            Hotel Markup
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage hotel markups
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
                                    DESTINATION MARKUP
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
                                        <MapPinned size={13} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[11px]">
                                            Destination Markup
                                        </p>

                                        <p className="mt-0.5 text-quaternary-bright truncate text-[9px]">
                                            Manage destination markups
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
