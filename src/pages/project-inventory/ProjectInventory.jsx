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

export function ProjectInventory() {
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

    const [deleteProjectById] = useMutation(DELETE_PROJECT_INVENTORY, {
        refetchQueries: [
            {
                query: GET_PROJECT_INVENTORIES,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: data => {
            setLoading(false)
            toast.success("Project inventory has been deleted successfully!");
            loadAllProjects({
                variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
            });
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message);
        },
    })

    const [loadAllProjects] = useLazyQuery(GET_PROJECT_INVENTORIES, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                console.log(data)
                const result = data.project_inventories.map((inventory) => [
                    inventory.id || "N/A",                                          // Inventory ID
                    inventory.project?.project_name || "N/A",                       // Project Name
                    inventory.project?.percentage || "N/A",                         // Percentage
                    inventory.inventory?.admin_name || "N/A",                       // Admin Name
                    inventory.inventory?.email_address || "N/A",                    // Email Address
                    inventory.inventory?.country || "N/A",                          // Country
                    inventory.inventory?.contact_number || "N/A",                   // Contact Number
                    inventory.inventory?.address || "N/A",                          // Address
                    inventory.inventory?.quantity || "N/A",                         // Quantity
                    inventory.inventory?.scit_control_number || "N/A",              // SCIT Control Number
                    inventory.inventory?.serial_number_start || "N/A"               // Serial Number Start
                ]);

                setContents(result);
                setTotalItems(data.total.aggregate.count);
                setPageCount(Math.ceil(data.total.aggregate.count / itemsPerPage));
            }, 600)
        },
        onError: (error) => {
            setLoading(false);
            console.error("Error fetching categories: ", error);
        }
    });

    useEffect(() => {
        if (!currentPage) setLoading(true);
        loadAllProjects({
            variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
        });
    }, [currentPage]);

    const headings = [
        "Inventory ID",
        "Project Name",
        "Percentage",
        "Admin Name",
        "Email Address",
        "Country",
        "Contact Number",
        "Address",
        "Quantity",
        "SCIT Control Number",
        "Serial Number Start"
    ];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (categoryId) => {
        navigate(`/project-inventory/update/${categoryId}`)
    }

    const handleOnDeleteClick = (id) => {
        setId(id)
        setOpen(true)
    }

    const deleteTaskCategory = () => {
        setOpen(false)
        deleteProjectById({
            variables: {
                id: id
            }
        })
    }

    return (
        loading ? (<Loading />) : (
            <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
                <Header title={"Project Inventories"} category="Pages" />
                {
                    (role == "admin") ? (
                        <div className="flex flex-row justify-end">
                            <Link
                                to={PageRoutes.AddProjectInventory}
                                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                                style={{ background: currentColor }}
                            >
                                Add Project
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
                />

                <AlertDialog
                    open={open}
                    onConfirm={deleteTaskCategory}
                    onDismiss={() => setOpen(false)}
                    title={"Delete Project"}
                    description={"Are you sure you want to delete this project inventory? All of your data will be permanently removed. This action cannot be undone."}
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
