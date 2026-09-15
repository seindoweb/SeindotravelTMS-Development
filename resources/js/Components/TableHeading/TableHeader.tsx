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
    title?: React.ReactNode;
    subtitle?: React.ReactNode;

    searchValue?: string;
    onSearchChange?: (value: string) => void;

    actions?: TableHeaderAction[];

    dropdownLabel?: string;
    dropdownIcon?: React.ReactNode;
    dropdownActions?: TableDropdownAction[];
};

export function TableHeader({
    title = "Recent Transactions",
    subtitle = "These are details about the last transactions",
    searchValue,
    onSearchChange,
    actions = [],
    dropdownLabel = "More",
    dropdownIcon,
    dropdownActions = [],
}: TableHeaderProps) {
    return (
        <div className="items-center w-full px-4 pt-4 pb-4 border-b border-[#E2E8F0] md:flex md:justify-between bg-white">
            <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-primary">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-quaternary">
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
                        buttonIcon={dropdownIcon}
                        actions={dropdownActions}
                    />
                )}
            </div>
        </div>
    );
}
