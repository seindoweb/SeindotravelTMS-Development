import { usePage } from "@inertiajs/react";

function useT() {
    const { translations } = usePage().props as any;

    return (key: string, fallback?: string) => {
        const [group, k] = key.split(".");
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
    if (value === null || value === undefined || value === "") return "";
    return Number(value).toLocaleString("en-US");
};

export {
    formatDate,
  useT,
    formatNumber,
};
