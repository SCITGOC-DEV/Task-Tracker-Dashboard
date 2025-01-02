import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export const FilterType = [
    'Today',
    'This Week',
]

const getStartAndEndOfDay = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00.000

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

    return {
        startOfDayTimestamp: startOfDay.toISOString(),
        endOfDayTimestamp: endOfDay.toISOString(),
    };
};

const { startOfDayTimestamp, endOfDayTimestamp } = getStartAndEndOfDay();
console.log('Start of today:', startOfDayTimestamp);
console.log('End of today:', endOfDayTimestamp);

export default function Dropdown({ 
    options,
    value,
    onSelected,
    menuClassName = "", 
    menusClassName = "w-56"
}) {
    const handleOnClick = (e) => {
        onSelected(e)
    }
    return (
        <Menu as="div" className={`relative inline-block text-left ${menuClassName}`}>
            <div>
                <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {value}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                </MenuButton>
            </div>

            <MenuItems
                transition
                className={`${menusClassName} absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in`}
            >
                <div className="py-1">
                    {
                        options.map((filter, index) => (
                            <MenuItem key={index} onClick={() => onSelected(filter)}>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                >
                                    {filter}
                                </a>
                            </MenuItem>
                        ))
                    }
                </div>
            </MenuItems>
        </Menu>
    )
}
