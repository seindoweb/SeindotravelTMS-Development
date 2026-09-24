import React, { useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface dataListProps {
    [key: string]: any;
}

interface InputAutoCompleteProps {
    colSpan?: string;
    label?: string;
    name: string;
    checkIcon?: boolean;
    type?: string;
    placeholder?: string;
    setSearch: (val: string) => void;
    value?: any;
    setValue: (val: any) => void;
    data?: dataListProps[];
    dataShow: string;
    dataSubShow?: string;
    dataKey?: any;
    dataUnique: string;
    allowManualInput?: boolean;
    onManualInput?: (val: string) => void;
}

function InputAutoComplete({
    colSpan,
    label,
    name,
    checkIcon = false,
    type = 'text',
    placeholder = 'Search...',
    setSearch,
    value = '',
    setValue,
    dataShow,
    dataSubShow,
    dataKey = null,
    dataUnique,
    data = [],
    allowManualInput = false,
    onManualInput,
}: InputAutoCompleteProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const justSelectedRef = useRef(false); 
    const hasTypedRef = useRef(false); 

    // localInput: always reflects what's visible in the input
    const [localInput, setLocalInput] = useState<string>(value ?? '');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setLocalInput(value ?? '');
        hasTypedRef.current = false;
    }, [value]);

    // Click outside → close dropdown, revert to last selected value if nothing typed
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                // If user didn't type anything or manual input is disabled, revert
                if (!allowManualInput || !hasTypedRef.current) {
                    setLocalInput(value ?? '');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [value, allowManualInput]);

    const handleSelect = (item: dataListProps) => {
        justSelectedRef.current = true;
        hasTypedRef.current = false;
        setValue(item);
        const displayLabel =
            dataSubShow && item[dataSubShow]
                ? `${item[dataShow]} — ${item[dataSubShow]}`
                : (item[dataShow] ?? '');
        setLocalInput(displayLabel);
        setIsOpen(false);
        setSearch('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        hasTypedRef.current = true;
        setLocalInput(val);
        setIsOpen(true);
        setSearch(val);
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            hasTypedRef.current = false;
            setLocalInput(value ?? '');
            setSearch('');
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsOpen(false);
            if (allowManualInput && hasTypedRef.current && onManualInput) {
                if (localInput !== (value ?? '')) {
                    onManualInput(localInput);
                }
            }
            hasTypedRef.current = false;
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (
                containerRef.current &&
                !containerRef.current.contains(document.activeElement)
            ) {
                setIsOpen(false);
                // If user just picked from list, skip manual input callback
                if (justSelectedRef.current) {
                    justSelectedRef.current = false;
                    hasTypedRef.current = false;
                    return;
                }

                // If user didn't type anything (e.g. just clicked into input and blurred), do nothing!
                if (!hasTypedRef.current) {
                    setLocalInput(value ?? '');
                    return;
                }

                hasTypedRef.current = false;

                if (!allowManualInput) {
                    setLocalInput(value ?? '');
                } else if (onManualInput && localInput !== (value ?? '')) {
                    onManualInput(localInput);
                }
            }
        }, 150);
    };

    const showDropdown =
        isOpen && hasTypedRef.current && localInput.length >= 1;

    return (
        <div className={`relative ${colSpan ?? 'col-span-full'}`} ref={containerRef}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-medium leading-6 text-gray-900 block"
                >
                    {label}
                </label>
            )}
            <div className="mt-2">
                <input
                    ref={inputRef}
                    type={type}
                    id={name}
                    name={name}
                    value={localInput}
                    placeholder={placeholder}
                    autoComplete="off"
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="rounded-md py-1.5 text-gray-900 shadow-sm ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6 block w-full border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset"
                />
            </div>

            <Transition
                show={showDropdown}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <ul
                    className="py-1 mt-1 bg-white rounded-md shadow-lg max-h-60 ring-black ring-opacity-5 sm:text-sm absolute z-50 w-full overflow-auto ring-1 focus:outline-none"
                    role="listbox"
                >
                    {data.length > 0 ? (
                        data.map((item, i) => {
                            const isSelected = dataKey === item[dataUnique];
                            return (
                                <li
                                    key={i}
                                    id={`listbox-option-${i}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(e) => e.preventDefault()} 
                                    onClick={() => handleSelect(item)}
                                    className="relative cursor-pointer select-none px-3 py-2.5 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                >
                                    <span className="font-medium block truncate">
                                        {item[dataShow]}
                                    </span>
                                    {dataSubShow && (
                                        <span className="text-[11px] block truncate opacity-70">
                                            {item[dataSubShow]}
                                        </span>
                                    )}
                                    {checkIcon && isSelected && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li
                            className="px-3 py-2.5 text-center text-gray-400 italic text-sm cursor-default select-none"
                            role="option"
                        >
                            {localInput.length < 3
                                ? 'Type at least 3 characters to search'
                                : 'No results found'}
                        </li>
                    )}
                </ul>
            </Transition>
        </div>
    );
}

export default InputAutoComplete;
