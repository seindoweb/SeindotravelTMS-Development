import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function AuthenticatedMenuSales() {
    const isSales = route().current('sales.*');

    return (
        <Link
            href={route('sales.index')}
            className={[
                'group relative flex h-11 w-11 items-center justify-center rounded-xl',
                'transition-all duration-200',
                isSales
                    ? 'bg-tertiary text-white shadow-md'
                    : 'text-quaternary-bright hover:bg-[#334155] hover:text-white',
            ].join(' ')}
        >
            <ShoppingCart
                size={20}
                strokeWidth={2}
            />

            {/* Active indicator */}
            {isSales && (
                <span className="absolute -left-[9px] h-6 w-1 rounded-r-full bg-tertiary" />
            )}

            {/* Tooltip */}
            <span className="pointer-events-none absolute left-[58px] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                Sales
            </span>
        </Link>
    );
}
