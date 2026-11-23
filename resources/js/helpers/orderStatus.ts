import {
    AlertCircle,
    CheckCircle2,
    Clock,
    LucideIcon,
    RefreshCw,
    XCircle,
} from 'lucide-react';
import React from 'react';

export type OrderStatusInitial =
    | 'B'
    | 'P'
    | 'C'
    | 'D'
    | 'A'
    | 'F'
    | 'E'
    | 'X';

export interface OrderStatusConfig {
    initial: OrderStatusInitial;
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
    icon: LucideIcon;
}

export const ORDER_STATUS_MAP: Record<OrderStatusInitial, OrderStatusConfig> = {
    B: {
        initial: 'B',
        label: 'Booking',
        bgClass: 'bg-order-b-light',
        textClass: 'text-order-b-dark',
        borderClass: 'border-order-b-border',
        dotClass: 'bg-order-b',
        icon: Clock,
    },
    P: {
        initial: 'P',
        label: 'Progress',
        bgClass: 'bg-order-p-light',
        textClass: 'text-order-p-dark',
        borderClass: 'border-order-p-border',
        dotClass: 'bg-order-p',
        icon: RefreshCw,
    },
    C: {
        initial: 'C',
        label: 'Confirmed',
        bgClass: 'bg-order-c-light',
        textClass: 'text-order-c-dark',
        borderClass: 'border-order-c-border',
        dotClass: 'bg-order-c',
        icon: CheckCircle2,
    },
    D: {
        initial: 'D',
        label: 'Issued',
        bgClass: 'bg-order-d-light',
        textClass: 'text-order-d-dark',
        borderClass: 'border-order-d-border',
        dotClass: 'bg-order-d',
        icon: CheckCircle2,
    },
    A: {
        initial: 'A',
        label: 'Aborted',
        bgClass: 'bg-order-a-light',
        textClass: 'text-order-a-dark',
        borderClass: 'border-order-a-border',
        dotClass: 'bg-order-a',
        icon: AlertCircle,
    },
    F: {
        initial: 'F',
        label: 'Failed',
        bgClass: 'bg-order-f-light',
        textClass: 'text-order-f-dark',
        borderClass: 'border-order-f-border',
        dotClass: 'bg-order-f',
        icon: AlertCircle,
    },
    E: {
        initial: 'E',
        label: 'Expired',
        bgClass: 'bg-order-e-light',
        textClass: 'text-order-e-dark',
        borderClass: 'border-order-e-border',
        dotClass: 'bg-order-e',
        icon: Clock,
    },
    X: {
        initial: 'X',
        label: 'Cancelled',
        bgClass: 'bg-order-x-light',
        textClass: 'text-order-x-dark',
        borderClass: 'border-order-x-border',
        dotClass: 'bg-order-x',
        icon: XCircle,
    },
};

/**
 * Normalize any status string into a recognized OrderStatusConfig
 */
export function getOrderStatus(status?: string | null): OrderStatusConfig {
    if (!status) {
        return ORDER_STATUS_MAP.B;
    }

    const s = status.trim().toUpperCase();

    // Direct match by single letter initial
    if (s in ORDER_STATUS_MAP) {
        return ORDER_STATUS_MAP[s as OrderStatusInitial];
    }

    // Match by common alias names
    if (s === 'BOOKING' || s === 'PENDING' || s === 'UNPAID') {
        return ORDER_STATUS_MAP.B;
    }
    if (s === 'PROGRESS' || s === 'PROCESSING' || s === 'IN_PROGRESS') {
        return ORDER_STATUS_MAP.P;
    }
    if (s === 'CONFIRMED') {
        return ORDER_STATUS_MAP.C;
    }
    if (s === 'DONE' || s === 'ISSUED' || s === 'PAID' || s === 'COMPLETED') {
        return ORDER_STATUS_MAP.D;
    }
    if (s === 'ABORTED' || s === 'ABORT') {
        return ORDER_STATUS_MAP.A;
    }
    if (s === 'FAILED' || s === 'FAIL' || s === 'ERROR') {
        return ORDER_STATUS_MAP.F;
    }
    if (s === 'EXPIRED' || s === 'TIMEOUT') {
        return ORDER_STATUS_MAP.E;
    }
    if (s === 'CANCELLED' || s === 'CANCELED' || s === 'CANCEL' || s === 'VOID') {
        return ORDER_STATUS_MAP.X;
    }

    // Default fallback
    return ORDER_STATUS_MAP.B;
}
