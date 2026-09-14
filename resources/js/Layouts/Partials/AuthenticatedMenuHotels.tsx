import {
    BadgeDollarSign,
    BedDouble,
    ChevronRight,
    ClipboardList,
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
    const isHotelOrders = route().current('hotel.orders.*');

    const isHotelBookings = route().current('hotel.bookings.*');

    const isHotelMarkups = route().current('hotel.markups.*');

    const isHotelsPage = isHotelOrders || isHotelBookings;

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
                            {/* Icon */}

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

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Hotel Orders
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage hotel orders
                                </p>
                            </div>

                            {/* Arrow */}

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
                            {/* Icon */}

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

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Hotel Bookings
                                </p>

                                <p className="mt-0.5 text-quaternary-bright text-[10px]">
                                    Manage hotel bookings
                                </p>
                            </div>

                            {/* Arrow */}

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
                            HOTEL MARKUPS
                        ================================================== */}

                        <Link
                            href={route('hotel.markups.index')}
                            className={[
                                'group mt-1 gap-3 rounded-xl px-3 py-3 flex items-center',
                                'transition-all duration-150',

                                isHotelMarkups
                                    ? 'bg-tertiary/10 text-tertiary'
                                    : 'text-quaternary-dark hover:bg-secondary hover:text-primary',
                            ].join(' ')}
                        >
                            {/* Icon */}

                            <div
                                className={[
                                    'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',

                                    isHotelMarkups
                                        ? 'bg-tertiary/10 text-tertiary'
                                        : 'bg-secondary-dark text-quaternary',
                                ].join(' ')}
                            >
                                <BadgeDollarSign size={16} />
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold">
                                    Hotel Markups
                                </p>

                                <p className="mt-0.5 text-quaternary-bright truncate text-[10px]">
                                    Manage hotel price markups
                                </p>
                            </div>

                            {/* Arrow */}

                            <ChevronRight
                                size={15}
                                className={[
                                    'shrink-0 transition-transform duration-150',

                                    isHotelMarkups
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
