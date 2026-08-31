import React from "react";

export default function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={[
                "animate-pulse rounded-md bg-gray-200/80",
                className,
            ].join(" ")}
        />
    );
}
