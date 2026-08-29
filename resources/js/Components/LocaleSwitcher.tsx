import { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";

type Locale = "en" | "id";

const LOCALES: { value: Locale; label: string; flag: string }[] = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "id", label: "Bahasa", flag: "🇮🇩" },
];

export default function LocaleSwitcher({
    className = "",
}: {
    className?: string;
}) {
    const { locale } = usePage().props as any;
    const current: Locale = (locale ?? "en") as Locale;

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selected = LOCALES.find((l) => l.value === current) ?? LOCALES[0];

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const setLocale = (next: Locale) => {
        if (next === current) return;
        setOpen(false);

        router.post(
            route("locale.set"),
            { locale: next },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div
            ref={wrapperRef}
            className={"relative inline-block text-left " + className}
        >
            {/* Button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center justify-between w-full gap-2 px-3 py-2 text-sm font-medium text-gray-900 bg-transparent shadow-sm rounded-b-md ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span className="inline-flex items-center gap-2">
                    <span className="text-base leading-none">
                        {selected.flag}
                    </span>
                    <span className="truncate">{selected.label}</span>
                </span>

                {/* Chevron */}
                <svg
                    className="w-4 h-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Menu */}
            <div
                className={[
                    "absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none",
                    open ? "block" : "hidden",
                ].join(" ")}
                role="menu"
                aria-orientation="vertical"
            >
                <div className="py-1">
                    {LOCALES.map((l) => {
                        const active = l.value === current;

                        return (
                            <button
                                key={l.value}
                                type="button"
                                onClick={() => setLocale(l.value)}
                                className={[
                                    "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                                    active
                                        ? "bg-gray-50 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                ].join(" ")}
                                role="menuitem"
                            >
                                <span className="text-base leading-none">
                                    {l.flag}
                                </span>
                                <span className="flex-1">{l.label}</span>

                                {active && (
                                    <svg
                                        className="w-4 h-4 text-indigo-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
