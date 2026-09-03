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

function formatDate(datetime: string | Date): string {
  const date = new Date(datetime);
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export {
    formatDate,
    useT,
};
