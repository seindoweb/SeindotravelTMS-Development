import { Search } from "lucide-react";
import * as React from "react";

type TableSearchProps = {
    id?: string;
    name?: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
};

export function TableSearch({
    id = "search",
    name = "search",
    label = "Search",
    value,
    onChange,
    onKeyDown,
    disabled,
    className = "",
}: TableSearchProps) {
    return (
        <>
            <div className={`relative w-full md:max-w-sm min-w-[200px] ${className}`}>
                <Search
                    size={18}
                    className="absolute -translate-y-1/2 left-3 top-1/2 text-quaternary-bright"
                />

                <input
                id={id}
                name={name}
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    placeholder={label}
                    className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-secondary pl-9 pr-3 text-sm text-[#334155] outline-none transition placeholder:text-quaternary-bright focus:border-quaternary-bright focus:bg-white"
                />
            </div>
        </>
    );
}
