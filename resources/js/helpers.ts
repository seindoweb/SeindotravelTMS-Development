import { usePage } from '@inertiajs/react';

function useT() {
    const { translations } = usePage().props as any;

    return (key: string, fallback?: string) => {
        const [group, k] = key.split('.');
        return translations?.[group]?.[k] ?? fallback ?? key;
    };
}

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

function formatDate(datetime: string | Date | null): string {
    if (!datetime) return '-';
    const date = new Date(datetime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

const formatNumber = (value: number | string) => {
    if (value === null || value === undefined || value === '') return '';
    return Number(value).toLocaleString('en-US');
};

const formatRupiah = (amount: number | string | undefined | null) => {
    const num =
        typeof amount === 'string'
            ? parseFloat(amount) || 0
            : Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

export { formatDate, formatRupiah, useT, formatNumber };
