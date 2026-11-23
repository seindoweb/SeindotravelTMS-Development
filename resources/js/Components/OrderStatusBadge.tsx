import { getOrderStatus } from '@/helpers/orderStatus';
import React from 'react';

export interface OrderStatusBadgeProps {
    status?: string | null;
    size?: 'sm' | 'md' | 'lg';
    withIcon?: boolean;
    withDot?: boolean;
    customLabel?: string;
    className?: string;
}

export default function OrderStatusBadge({
    status,
    size = 'md',
    withIcon = true,
    withDot = false,
    customLabel,
    className = '',
}: OrderStatusBadgeProps) {
    const config = getOrderStatus(status);
    const IconComponent = config.icon;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px] gap-1',
        md: 'px-2.5 py-1 text-xs gap-1.5',
        lg: 'px-3 py-1.5 text-xs gap-1.5',
    }[size];

    const iconSizes = {
        sm: 11,
        md: 13,
        lg: 14,
    }[size];

    return (
        <span
            className={`inline-flex items-center font-bold rounded-full border ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses} ${className}`}
        >
            {withDot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}
                />
            )}
            {withIcon && !withDot && (
                <IconComponent size={iconSizes} className="shrink-0" />
            )}
            <span>{customLabel || config.label}</span>
        </span>
    );
}
