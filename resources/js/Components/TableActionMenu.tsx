import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { MoreVertical } from 'lucide-react';
import { Fragment } from 'react';

export type ActionMenuItem = {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'default' | 'danger' | 'info';
};

export type TableActionMenuProps = {
    groups: ActionMenuItem[][];
    menuWidth?: string;
};

export default function TableActionMenu({ groups, menuWidth = 'w-40' }: TableActionMenuProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="rounded-lg p-2 text-quaternary transition-colors hover:bg-gray-100">
                <MoreVertical size={16} />
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems
                    anchor="bottom end"
                    className={`z-50 ${menuWidth} divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none [--anchor-gap:6px]`}
                >
                    {groups.map((group, groupIdx) => (
                        <div key={groupIdx} className="p-1">
                            {group.map((item, itemIdx) => (
                                <MenuItem key={itemIdx}>
                                    {({ active }) => {
                                        let activeClass = 'bg-gray-50 text-primary';
                                        let normalClass = 'text-gray-700';
                                        let iconColorClass = 'text-gray-400 group-hover:text-primary';

                                        if (item.variant === 'danger') {
                                            activeClass = 'bg-red-50 text-red-600';
                                            normalClass = 'text-red-600';
                                            iconColorClass = 'text-red-500';
                                        } else if (item.variant === 'info') {
                                            activeClass = 'bg-gray-50 text-blue-600';
                                            normalClass = 'text-blue-600';
                                            iconColorClass = 'text-blue-500';
                                        }

                                        const className = `group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            active ? activeClass : normalClass
                                        }`;

                                        const content = (
                                            <>
                                                {item.icon && (
                                                    <span className={iconColorClass}>
                                                        {item.icon}
                                                    </span>
                                                )}
                                                {item.label}
                                            </>
                                        );

                                        if (item.href) {
                                            return (
                                                <Link href={item.href} className={className}>
                                                    {content}
                                                </Link>
                                            );
                                        }

                                        return (
                                            <button onClick={item.onClick} className={className}>
                                                {content}
                                            </button>
                                        );
                                    }}
                                </MenuItem>
                            ))}
                        </div>
                    ))}
                </MenuItems>
            </Transition>
        </Menu>
    );
}
