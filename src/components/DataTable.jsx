import { Button, IconButton } from "@material-tailwind/react";
import React from "react";
import { BiEdit, BiEditAlt } from "react-icons/bi";
import PaginationButtons from "./PaginationButtons";
import { FaEdit } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiEditBoxFill } from "react-icons/ri";
import { MdModeEdit, MdDelete } from "react-icons/md";

const DataTable = ({ headings, contents, onEditClick, onDeleteClick, showDeleteOption }) => {
    const handleOnEditClick = (id) => {
        onEditClick(id)
    }

    const handleOnDeleteClick = (id) => {
        onDeleteClick(id)
    }

    return (
        <div className="flex flex-col dark:bg-box-dark-bg bg-white rounded-lg border">
            <div className="overflow-x-auto">
                <div className="min-w-full divide-y dark:divide-gray-600 divide-gray-200">
                    <table className="min-w-full">
                        <thead className="border-b bg-gray-50 dark:bg-gray-800">
                            <tr>
                                {headings.map((item, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-4 text-xs font-bold text-left text-light-gray uppercase"
                                    >
                                        {item}
                                    </th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-600 divide-gray-200">
                            {contents.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                    <td className="text-blue-200 flex flex-row space-x-2 justify-center">
                                        <IconButton className="flex justify-center" variant="text" onClick={() => handleOnEditClick(row[0])}>
                                            <MdModeEdit />
                                        </IconButton>
                                        {
                                            showDeleteOption ? (
                                                <IconButton className="flex justify-center" variant="text" onClick={() => onDeleteClick(row[0])}>
                                                    <MdDelete />
                                                </IconButton>) : <div></div>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
