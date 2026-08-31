import * as React from "react";
import { TableSearch } from "./TableSearch";
import { TableDropdown, TableDropdownAction } from "./TableDropdown";

type TableHeaderAction = {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
};

type TableHeaderProps = {
    title?: string;
    subtitle?: string;

    searchValue?: string;
    onSearchChange?: (value: string) => void;

    actions?: TableHeaderAction[];

    dropdownLabel?: string;
    dropdownActions?: TableDropdownAction[];
};

export function TableHeader({
    title = "Recent Transactions",
    subtitle = "These are details about the last transactions",
    searchValue,
    onSearchChange,
    actions = [],
    dropdownLabel = "More",
    dropdownActions = [],
}: TableHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-0 pb-4 w-full">
            <div>
                <h3 className="text-sm font-bold text-primary">
                    {title}
                </h3>
                <p className="mt-0.5 text-[11px] text-quaternary">
                    {subtitle}
                </p>
            </div>

            <div className="grid w-full gap-2 md:flex shrink-0 md:w-max">
                <div className="w-full md:w-72">
                    <TableSearch
                        id="transactions-search"
                        label="Search"
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
                {/* <button class="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 ">
                    Click me
                </button> */}
                {actions.map((action, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`
                        flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all hover:shadow-lg disabled:pointer-events-none disabled:opacity-50 active:scale-95
                        ${
                            action.variant === "secondary" &&
                            "bg-gray-200 text-gray-900"
                        }
                        ${
                            action.variant === "danger" &&
                            "bg-red-600 text-white"
                        }
                        ${
                            (!action.variant || action.variant === "primary") &&
                            "bg-primary text-white"
                        }

                        `}
                    >
                        {action.icon ? (
                            <span className="w-4 h-4">{action.icon}</span>
                        ) : null}
                        {action.label}
                    </button>
                ))}

                {/* Dropdown */}
                {dropdownActions.length > 0 && (
                    <TableDropdown
                        label={dropdownLabel}
                        actions={dropdownActions}
                    />
                )}
            </div>
        </div>
    );
}
