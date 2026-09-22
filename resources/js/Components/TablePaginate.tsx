import { Paginate } from "@/types";
import React from "react";

function stripHtmlEntities(label: string) {
    if (label.includes("Sebelumnya") || label.includes("Previous")) {
        return "";
    }
    if (label.includes("Berikutnya") || label.includes("Next")) {
        return "";
    }
    // biar "&laquo; Previous" tampil bagus
    return label.replaceAll("&laquo;", "«").replaceAll("&raquo;", "»");
}

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(" ");
}

export default function TablePaginate<T>({
    page,
    loading = false,
    onNavigate,
}: {
    page: Paginate<T>;
    loading?: boolean;
    onNavigate: (url: string) => void;
}) {
    const numberLinks = (page.links || []).filter((l) => {
        const txt = stripHtmlEntities(l.label).toLowerCase();
        return !txt.includes("previous") && !txt.includes("next");
    });
    return (
        <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
            {/* Prev */}
            <button
                className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                disabled={!page.prev_page_url}
                onClick={() =>
                    page.prev_page_url && onNavigate(page.prev_page_url)
                }
            >
                Prev
            </button>

            {/* Numbers */}
            {!loading ? (
                <div className="items-center hidden gap-2 lg:flex ">
                    {numberLinks.map((l, idx) => {
                        const label = stripHtmlEntities(l.label);
                        const isDots = label === "...";
                        const isActive = l.active;

                        return (
                            <button
                                key={idx}
                                type="button"
                                disabled={!l.url || isDots}
                                onClick={() => l.url && onNavigate(l.url)}
                                className={cx(
                                    "relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
                                    isActive
                                        ? "border border-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
                                        : "hover:bg-gray-900/10 active:bg-gray-900/20",
                                )}
                            >
                                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="items-center hidden gap-2 lg:flex">
                    {/* first pages */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 bg-gray-200 rounded-lg"
                        />
                    ))}

                    {/* dots */}
                    <div className="w-6 h-4 bg-gray-200 rounded" />

                    {/* last pages */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 bg-gray-200 rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Next */}
            <button
                className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                disabled={!page.next_page_url}
                onClick={() =>
                    page.next_page_url && onNavigate(page.next_page_url)
                }
            >
                Next
            </button>
        </div>
    );
}
