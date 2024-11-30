import {IconButton, Menu, MenuHandler, MenuList, MenuItem} from "@material-tailwind/react"; // Import necessary Menu components
import React, {useEffect, useState} from "react";
import {MdDelete, MdModeEdit, MdDeck, Md1K} from "react-icons/md";
import {IoMdInformationCircle} from "react-icons/io";
import EmptyState from "./EmptyState";
import {ErrorProps} from "./props/ErroProps";
import {actions, ActionType} from "../utils/Constants";
import {MenuButton} from "@headlessui/react";
import {DropDown} from "./AppDropdown";
import Pagination from "./Pagination";
import AppIconButton from "./AppIconButton";

const DataTable = ({
                       headings, contents, actions = [], totalPages = 0, currentPage = 0, onPageClick = () => {
    }, onEditClick = () => {
    }, onDeleteClick = () => {
    }, onDetailClick = () => {
    }, showDeleteOption = false, showDetailAction = false, className = "", errorProps = ErrorProps
                   }) => {

    if (contents.length === 0) return <EmptyState title={errorProps.name} description={errorProps.description}
                                                  className={"text-center"}/>

    return (<div className="flex flex-col max-w-full dark:bg-box-dark-bg bg-white">
            <div className="overflow-x-auto"> {/* Enable horizontal scrolling for the table */}
                <div className="max-w-full divide-y transition-all ease-in dark:divide-gray-600 divide-gray-200 border rounded-lg">
                    <table className="min-w-full max-w-full rounded-lg"> {/* Set max width to prevent overflow */}
                        <thead className="border-b rounded-lg bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {headings.map((item, index) => (<th
                                key={index}
                                scope="col"
                                className="px-6 py-4 text-xs font-bold text-left text-light-gray uppercase"
                            >
                                {item}
                            </th>))}
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y dark:divide-gray-600 divide-gray-200">
                        {contents.map((row, rowIndex) => (<tr key={rowIndex} className="align-middle">
                            {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="px-6 py-2 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap"
                                    >
                                        {cellIndex === 0 ? rowIndex+1 : cell}
                                    </td>
                                )
                            )
                            }
                            <td className="flex items-center space-x-2 py-2 justify-center align-middle">
                                {actions.map((actionGroup, groupIndex) => (<div key={groupIndex}>
                                            {/* First, render all Icon type actions */}
                                            {actionGroup.type === ActionType.Icon && (<div className="flex space-x-2">
                                                {actionGroup.actions.map((action, actionIndex) => (
                                                    <AppIconButton
                                                        icon={action.icon}
                                                        title={action.label}
                                                        color={`bg-blue-500 ${action?.color} ${action?.hoverColor}`}
                                                        hoverColor="bg-blue-600"
                                                        onClick={() => action.onClick(row[0])}
                                                    />
                                                ))}
                                            </div>)}
                                        </div>
                                    )
                                )
                                }

                                {/* Then render the dropdown after all the Icon type actions */}
                                {actions.map((actionGroup, groupIndex) => (<div key={groupIndex}>
                                    {actionGroup.type === ActionType.Dropdown && (<DropDown
                                        options={actionGroup.actions}
                                        id={row[0]}
                                    />)}
                                </div>))}
                            </td>
                        </tr>))}
                        </tbody>
                    </table>

                    {0 < totalPages && (<Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        handlePageClick={onPageClick}/>)}
                </div>
            </div>
        </div>

    );
};

export default DataTable;
