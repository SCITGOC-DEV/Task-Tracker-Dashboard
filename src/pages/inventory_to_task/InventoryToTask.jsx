import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { Header } from "../../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_INVENTORY_CATEGORY, getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";
import Loading from "../../components/Loading";
import PaginationButtons from "../../components/PaginationButtons";
import Pagination from "../../components/Pagination";
import { Button } from "@material-tailwind/react";
import PageRoutes from "../../utils/PageRoutes";
import AlertDialog from "../../components/AlertDialog";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { GET_ALL_INVENTORY_RECORDS } from "../../graphql/query/inventoryQueries";
import { GET_ALL_INVENTORY_HISTORIES } from "../../graphql/query/inventoryHistoryQueries";

export function InventoryToTask() {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const { role } = useAuth()
    const {id,taskId} = useParams()

    console.log(id, taskId);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0)
    const [contents, setContents] = useState([]);
    const [open, setOpen] = useState(false)
    const [inventoryId, setInventoryId] = useState(0)

    const [deleteInventoryCategory] = useMutation(DELETE_INVENTORY_CATEGORY, {
        refetchQueries: [
            {
                query: getAllInventoryCategories,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: data => {
            setLoading(false)
            toast.success("Task have been deleted! Successfully!");
            loadAllInventoryCategories({
                variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
            });
        },
        onError: (error) => {
            setLoading(false)
            console.log(error.message)
            toast.error(error.message);
        },
    })

    const [loadAllInventoryCategories] = useLazyQuery(GET_ALL_INVENTORY_HISTORIES, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                const result = data.task_inventories.map(item => [
                    item.task.task_name || "N/A",                    // Task name
                    item.task.project.project_name || "N/A",         // Project name
                    item.inventory.serial_number_end || "N/A",       // Serial number end
                    item.inventory.serial_number_start || "N/A",     // Serial number start
                    item.inventory.inventory_category.model_type || "N/A"  // Model type
                ]);
                setContents(result);
                setTotalItems(data.total.aggregate.count);
                setPageCount(Math.ceil(data.total.aggregate.count / itemsPerPage));
            }, 500)
        },
        onError: (error) => {
            setLoading(false);
            console.error("Error fetching categories: ", error);
            toast.error(error.message)
        }
    });

    useEffect(() => {
        if (!currentPage) setLoading(true);
        loadAllInventoryCategories({
            variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
        });
    }, [currentPage]);

    const headings = [
        "SCIT Control Number",   // Corresponds to scit_control_number
        "Serial Number End",      // Corresponds to serial_number_end
        "Serial Number Start",     // Corresponds to serial_number_start
        "Project Name",           // Corresponds to project_name
        "Task Name",              // Corresponds to task_name
        "Model Type"              // Corresponds to model_type
    ];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (categoryId) => {
        navigate(`/inventory-categories/edit/${categoryId}`)
    }

    const handleOnDeleteClick = (id) => {
        setInventoryId(id)
        setOpen(true)
    }

    const deleteTaskCategory = () => {
        setOpen(false)
        deleteInventoryCategory({
            variables: {
                id: inventoryId
            }
        })
    }

    return (

        loading ? (<Loading />) : (
            <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
                <Header title={"Task Inventories"} category="Pages" />

                <Link
                    to={`/projects/tasks/${id}`}
                    className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                    style={{ background: currentColor }}
                >
                    Back
                </Link>
                {
                    (role == "admin") ? (
                        <div className="flex flex-row justify-end">
                            <Link
                                to={`/projects/tasks/task-inventories/add/${id}/${taskId}`}
                                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                                style={{ background: currentColor }}
                            >
                                Add Inventory
                            </Link>
                        </div>
                    ) : <div></div>
                }
                <DataTable
                    showDeleteOption={role == "admin"}
                    headings={headings}
                    contents={contents}
                    onEditClick={handleOnEditClick}
                    onDeleteClick={handleOnDeleteClick}
                    errorProps={{
                        name: 'No Inventory History Available',
                        description: 'It seems there are no records in your inventory history. Please add items to see them here.',
                    }}
                />

                <AlertDialog
                    open={open}
                    onConfirm={deleteTaskCategory}
                    onDismiss={() => setOpen(false)}
                    title={"Delete task category"}
                    description={"Are you sure you want to delete task category? All of your data will be permanently removed. This action cannot be undone."}
                    confirmTitle={"Delete"}
                    dismissTitle={"Cancel"}
                />

                <Pagination
                    totalPages={pageCount}
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                />
            </div>
        )


    );
}
