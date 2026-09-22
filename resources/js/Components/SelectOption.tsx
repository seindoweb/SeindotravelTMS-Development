"use client";

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type SelectOptionProps = {
    id: any;
    name: string;
    info?: string;
};

type Props = {
    id?: string | null;
    options: SelectOptionProps[];
    value: SelectOptionProps;
    onChange: (value: SelectOptionProps) => void;

    className?: string;
    disabled?: boolean;
};

export default forwardRef<HTMLButtonElement, Props>(function SelectOption(
    { id, options, value, onChange, className = "", disabled = false },
    ref,
) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled} by="id">
            <div className={clsx("relative mt-1", className)}>
                <ListboxButton
                    ref={buttonRef}
                    className="border border-gray-300 grid py-2 w-full text-base focus:shadow-lg focus:outline-primary focus:border-primary focus:border-3 focus:-outline-offset-2 focus:outline-2 placeholder:text-gray-400  cursor-default grid-cols-1 rounded-md bg-white py-1.6 pr-2 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                >
                    <span className="flex w-full col-start-1 row-start-1 gap-2 pr-6">
                        <span className="truncate">{value.name}</span>
                        <span className="text-gray-500 truncate">
                            {value.info ?? ""}
                        </span>
                    </span>

                    <ChevronsUpDownIcon
                        aria-hidden="true"
                        className="self-center col-start-1 row-start-1 text-gray-500 size-5 justify-self-end sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                    {options.map((person) => (
                        <ListboxOption
                            key={person.id}
                            value={person}
                            className={({ focus }) =>
                                clsx(
                                    "relative cursor-default select-none py-2 pl-3 pr-9 outline-none",
                                    focus
                                        ? "bg-primary text-white "
                                        : "text-gray-900 ",
                                )
                            }
                        >
                            {({ focus, selected }) => (
                                <>
                                    <div className="flex">
                                        <span
                                            className={clsx(
                                                "truncate",
                                                selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                            )}
                                        >
                                            {person.name}
                                        </span>

                                        <span
                                            className={clsx(
                                                "ml-2 truncate",
                                                focus
                                                    ? "text-default-bright"
                                                    : "text-gray-500",
                                            )}
                                        >
                                            {person.info ?? ""}
                                        </span>
                                    </div>

                                    <span
                                        className={clsx(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            selected
                                                ? "text-primary"
                                                : "hidden",
                                            focus && "text-white",
                                        )}
                                    >
                                        <Check
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>
                                </>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
});

export function useSelectOption<T>(
    options: SelectOptionProps[],
    data: T,
    setData: <K extends keyof T>(key: K, value: T[K]) => void,
    fieldKey: keyof T,
) {
    const fallback = options[0] ?? null;

    const [selected, setSelected] = useState<SelectOptionProps | null>(
        fallback,
    );

    useEffect(() => {
        if (!fallback) return;

        const currentValue = data[fieldKey];

        // ✅ jika kosong → pakai option pertama
        if (
            currentValue === null ||
            currentValue === undefined ||
            currentValue === ""
        ) {
            setSelected(fallback);
            setData(fieldKey, fallback.id as any);
            return;
        }

        const found =
            options.find((opt) => opt.id === currentValue) ?? fallback;

        setSelected(found);
    }, [data[fieldKey], options]);

    const onChange = (opt: SelectOptionProps) => {
        setSelected(opt);
        setData(fieldKey, opt.id as any);
    };

    return {
        selected: selected ?? fallback,
        onChange,
    };
}
