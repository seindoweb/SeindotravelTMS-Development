import React from "react";
import Skeleton from "./Skeleton";

type Props = {
    /** jumlah baris */
    rows?: number;

    /** class wrapper container */
    containerClassName?: string;

    /** background untuk row striped (selang-seling) */
    stripedBgClassName?: string;

    /** background untuk row normal */
    rowBgClassName?: string;

    /** apakah pakai efek striped */
    striped?: boolean;

    /** custom lebar skeleton per row (optional) */
    labelWidths?: string[]; // contoh: ["w-24","w-28","w-20"]
    valueWidths?: string[]; // contoh: ["w-40","w-56","w-64"]
};

export default function ContentInformationSkeleton({
    rows = 3,
    containerClassName = "bg-white border border-gray-200 rounded-lg",
    stripedBgClassName = "bg-gray-50",
    rowBgClassName = "bg-white",
    striped = true,
    labelWidths,
    valueWidths,
}: Props) {
    const count = Math.max(0, rows);

    return (
        <div
            className={["w-full overflow-hidden", containerClassName].join(" ")}
        >
            {Array.from({ length: count }).map((_, i) => (
                <RowSkeleton
                    key={i}
                    striped={striped ? i % 2 === 0 : false}
                    stripedBgClassName={stripedBgClassName}
                    rowBgClassName={rowBgClassName}
                    labelWidth={labelWidths?.[i]}
                    valueWidth={valueWidths?.[i]}
                />
            ))}
        </div>
    );
}

function RowSkeleton({
    striped,
    stripedBgClassName,
    rowBgClassName,
    labelWidth,
    valueWidth,
}: {
    striped: boolean;
    stripedBgClassName: string;
    rowBgClassName: string;
    labelWidth?: string;
    valueWidth?: string;
}) {
    return (
        <div
            className={[
                "grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-2 sm:items-center",
                striped ? stripedBgClassName : rowBgClassName,
            ].join(" ")}
        >
            {/* Left: label */}
            <div className="flex items-center">
                <Skeleton
                    className={["h-5 rounded-md", labelWidth ?? "w-28"].join(
                        " "
                    )}
                />
            </div>

            {/* Right: value */}
            <div className="flex items-center sm:justify-start">
                <Skeleton
                    className={["h-5 rounded-md", valueWidth ?? "w-56"].join(
                        " "
                    )}
                />
            </div>
        </div>
    );
}
