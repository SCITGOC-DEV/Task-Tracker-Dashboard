import React, {useEffect} from 'react';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {ChevronDownIcon, EllipsisVerticalIcon} from '@heroicons/react/20/solid'

const menuItems = [
    {title: "Account settings", action: () => console.log("Account settings clicked")},
    {title: "Support", action: () => console.log("Support clicked")},
    {title: "License", action: () => console.log("License clicked")},
    {title: "Sign out", action: () => console.log("Sign out clicked"), isButton: true},
];

export default function AppDropdown({title, value, options, onSelected, error = null}) {
    const [selected, setSelected] = React.useState("Select Option");

    useEffect(() => {
        setSelected(value)
    }, [value]);

    return (
        <div className="w-full">
            <p className={`mb-1 min-w-full`}>{title}</p>
            <Menu as="div" className="w-full relative inline-block text-left">
                <div className="w-full">
                    <MenuButton
                        className="inline-flex justify-between w-full items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <p>{selected}</p>
                        <ChevronDownIcon aria-hidden="true" className="ml-1 h-5 w-5 text-gray-400"/>
                    </MenuButton>
                </div>

                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <div className="py-1">
                        {options.map((item, index) => (
                            <MenuItem key={index}>
                                {({active}) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelected(item);
                                            onSelected(item);
                                        }}
                                        className={`block w-full px-4 py-2 text-left text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                                    >
                                        {item}
                                    </button>
                                )}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}


export function DropDown({options, id}) {
    const [selected, setSelected] = React.useState(options[0]);


    return (
        <div className="w-full">
            <Menu as="div" className="w-full relative inline-block text-left">
                <div className="w-full">
                    <MenuButton
                        className="inline-flex justify-between w-full items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <EllipsisVerticalIcon aria-hidden="true" className="ml-1 h-5 w-5 text-gray-400"/>

                    </MenuButton>
                </div>

                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <div className="py-1">
                        {options.map((item, index) => (
                            <MenuItem key={index}>
                                {({active}) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            item.onClick(id);
                                        }}
                                        className={`block w-full px-4 py-2 text-left text-sm text-gray-700 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                                    >
                                        <span className="flex items-center">
                                            {item.icon} {/* Render item icon */}
                                            <span className="ml-2">{item.label}</span> {/* Render item label */}
                                        </span>
                                    </button>
                                )}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
}