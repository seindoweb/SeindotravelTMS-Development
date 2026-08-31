import * as React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export type TableDropdownAction = {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
};

type TableDropdownProps = {
    label?: string;
    actions: TableDropdownAction[];
    align?: "left" | "right";
    buttonIcon?: React.ReactNode;
};

export function TableDropdown({
    label = "Actions",
    actions,
    align = "right",
    buttonIcon,
}: TableDropdownProps) {
    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center justify-between w-full h-full gap-2 px-4 py-2 text-xs font-bold text-gray-900 uppercase transition bg-gray-200 rounded-lg select-none hover:shadow md:w-auto">
                <div>
                    {buttonIcon ? (
                        <span className="w-4 h-4">{buttonIcon}</span>
                    ) : null}
                    {label}
                </div>
                <div>
                    <svg
                        className="w-4 h-4"
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
                </div>
            </MenuButton>

            <MenuItems
                className={[
                    "absolute z-[10] mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-lg focus:outline-none",
                    align === "right" ? "right-0" : "left-0",
                ].join(" ")}
            >
                {actions.map((action, idx) => (
                    <MenuItem key={idx} disabled={action.disabled}>
                        {({ active, disabled }) => (
                            <button
                                type="button"
                                onClick={action.onClick}
                                disabled={disabled}
                                className={[
                                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ",
                                    active ? "bg-gray-100" : "",
                                    disabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "",
                                    action.danger
                                        ? "text-red-600"
                                        : "text-gray-900",
                                ].join(" ")}
                            >
                                {action.icon ? (
                                    <span className="w-4 h-4">
                                        {action.icon}
                                    </span>
                                ) : null}
                                <span className="truncate">{action.label}</span>
                            </button>
                        )}
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
