import { usePage } from "@inertiajs/react";

function useT() {
    const { translations } = usePage().props as any;

    return (key: string, fallback?: string) => {
        const [group, k] = key.split(".");
        return translations?.[group]?.[k] ?? fallback ?? key;
    };
}

export {
    useT,
};
