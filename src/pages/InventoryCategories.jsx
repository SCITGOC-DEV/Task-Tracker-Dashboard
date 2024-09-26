import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { Header } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_INVENTORY_CATEGORY, getAllInventoryCategories } from "../graphql/query/inventoryCategoryQueries";
import Loading from "../components/Loading";
import PaginationButtons from "../components/PaginationButtons";
import Pagination from "../components/Pagination";
import { Button } from "@material-tailwind/react";
import PageRoutes from "../utils/PageRoutes";
import AlertDialog from "../components/AlertDialog";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

export function InventoryCategories() {
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
            toast.error(error.message);
        },
    })

    const [loadAllInventoryCategories] = useLazyQuery(getAllInventoryCategories, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                const result = data.inventory_categories.map(category => [
                    category.id || "N/A",                      // If id is null, use "N/A"
                    category.device || "N/A",                  // If device is null, use "N/A"
                    category.manufacturer || "N/A",            // If manufacturer is null, use "N/A"
                    category.model_type || "N/A",              // If model_type is null, use "N/A"
                    category.part_number || "N/A",             // If part_number is null, use "N/A"
                    category.updated_at || "N/A"
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
        loadAllInventoryCategories({
            variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
        });
    }, [currentPage]);

    const headings = ["ID", "Device", "Manufacturer", "Model", "Part Number", "Updated At"];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (categoryId) => {
        //console.log(id)
        navigate(`/inventory-categories/edit/${categoryId}`)
    }

    const handleOnDeleteClick = (id) => {
        setId(id)
        setOpen(true)
    }

    const deleteTaskCategory = () => {
        setOpen(false)
        deleteInventoryCategory({
            variables: {
                id: id
            }
        })
    }

    return (


        loading ? (<Loading />) : (
            <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
                <Header title={"Inventory Categories"} category="Pages" />
                {
                    (role == "admin") ? (
                        <div className="flex flex-row justify-end">
                            <Link
                                to={PageRoutes.AddInventoryCategory}
                                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                                style={{ background: currentColor }}
                            >
                                Add Category
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
