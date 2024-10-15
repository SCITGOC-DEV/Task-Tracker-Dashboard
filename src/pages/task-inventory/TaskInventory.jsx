import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { Header } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_INVENTORY_CATEGORY, getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";
import Loading from "../../components/Loading";
import PaginationButtons from "../../components/PaginationButtons";
import Pagination from "../../components/Pagination";
import { Button, Input } from "@material-tailwind/react";
import PageRoutes from "../../utils/PageRoutes";
import AlertDialog from "../../components/AlertDialog";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { GET_ALL_INVENTORY_RECORDS } from "../../graphql/query/inventoryQueries";
import { GET_ALL_INVENTORY_HISTORIES } from "../../graphql/query/inventoryHistoryQueries";
import {DELETE_PROJECT_BY_ID, GET_ALL_PROJECTS} from "../../graphql/query/projectQueries";
import TextFieldWithSuggestions, { InputFieldWithSuggestion } from "../../components/TextFieldWithSuggestions";
import { InputButton } from "../../components/InnputButton";
import { InputWithError } from "../../components/InputWithError";
import {DELETE_PROJECT_INVENTORY, GET_PROJECT_INVENTORIES} from "../../graphql/query/projectInventoryQueries";
import {DELETE_TASK_INVENTORY_BY_ID, GET_ALL_TASK_INVENTORIES} from "../../graphql/query/taskInventoryQueries";
import AlertSnackbar from "../../components/AlertSnackbar";
import EmptyState from "../../components/EmptyState";

export function TaskInventory() {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const { role } = useAuth()

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0)
    const [contents, setContents] = useState([]);
    const [open, setOpen] = useState(false)
    const [id, setId] = useState(0)
    const [error, setError] = useState(null)

    const [deleteTaskInventoryById] = useMutation(DELETE_TASK_INVENTORY_BY_ID, {
        refetchQueries: [
            {
                query: GET_ALL_TASK_INVENTORIES,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: data => {
            setLoading(false)
            toast.success("Task inventory has been deleted successfully!");
            getAllTaskInventories({
                variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
            });
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message);
        },
    })

    const [getAllTaskInventories] = useLazyQuery(GET_ALL_TASK_INVENTORIES, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                const result = data.task_inventories.map((taskInventory) => [
                    taskInventory.id || "N/A",                                           // Task Inventory ID
                    taskInventory.task_name?.task_name || "N/A",                         // Task Name
                    taskInventory.status || "N/A",                                       // Status
                    taskInventory.approved_user_name || "N/A",                           // Approved User Name
                    taskInventory.project?.project_name || "N/A",                        // Project Name
                    taskInventory.qty || "N/A",                                          // Quantity
                    taskInventory.request_user_name || "N/A",                            // Request User Name
                    taskInventory.remark || "N/A",                                       // Remark
                    taskInventory.actual_rent_date || "N/A"                              // Actual Rent Date
                ]);

                setContents(result);
                setTotalItems(data.total.aggregate.count);
                setPageCount(Math.ceil(data.total.aggregate.count / itemsPerPage));
            }, 600)
        },
        onError: (error) => {
            setLoading(false);
            setError(error.message)
        }
    });

    useEffect(() => {
        if (!currentPage) setLoading(true);
        getAllTaskInventories({
            variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
        });
    }, [currentPage]);

    const headings = [
        "Task Inventory ID",
        "Task Name",
        "Status",
        "Approved User Name",
        "Project Name",
        "Quantity",
        "Request User Name",
        "Remark",
        "Actual Rent Date"
    ];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (categoryId) => {
        navigate(`/task-inventory/edit/${categoryId}`)
    }

    const handleOnDeleteClick = (id) => {
        setId(id)
        setOpen(true)
    }

    const deleteTaskCategory = () => {
        setOpen(false)
        deleteTaskInventoryById({
            variables: {
                id: id
            }
        })
    }

    return (
        loading ? (<Loading />) : (
            <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
                <Header title={"Task Inventories"} category="Pages" />

                {
                    (role == "admin") ? (
                        <div className="flex flex-row justify-end">
                            <Link
                                to={PageRoutes.AddTaskInventory}
                                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                                style={{ background: currentColor }}
                            >
                                Add Task Inventory
                            </Link>
                        </div>
                    ) : <div></div>
                }

                <DataTable
                    showDeleteOption={role == "admin"}
                    headings={headings}
                    contents={contents}
                    className={"h-screen"}
                    onEditClick={handleOnEditClick}
                    onDeleteClick={handleOnDeleteClick}
                    errorProps={{
                        name: "No Tasks Available",
                        description: "You currently have no tasks in your inventory. Add new tasks to get started.",
                    }}
                />

                <AlertDialog
                    open={open}
                    onConfirm={deleteTaskCategory}
                    onDismiss={() => setOpen(false)}
                    title={"Delete Project"}
                    description={"Are you sure you want to delete this task inventory? All of your data will be permanently removed. This action cannot be undone."}
                    confirmTitle={"Delete"}
                    dismissTitle={"Cancel"}
                />

                <Pagination
                    totalPages={pageCount}
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                />

                <AlertSnackbar
                    message={error}
                    className="fixed bottom-4 right-4 z-50"  // Position bottom-right with a fixed position
                />
            </div>
        )


    );
}
