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
import {ActionType} from "../../utils/Constants";
import {Md1K, MdDeck, MdDelete, MdModeEdit} from "react-icons/md";

export function InventoryRecords() {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const { role } = useAuth()
    const {id} = useParams()

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0)
    const [contents, setContents] = useState([]);
    const [open, setOpen] = useState(false)
    const [inventoryId, setInventoryId] = useState(0)

    const [manufacturer, setManufacturer] = useState(null)
    const [modelType, setModelType] = useState(null)

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
                variables: { id: id, limit: itemsPerPage, offset: currentPage * itemsPerPage }
            });
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message);
        },
    })

    const [loadAllInventoryCategories] = useLazyQuery(GET_ALL_INVENTORY_RECORDS, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                setManufacturer(data.inventory_categories[0].manufacturer)
                setModelType(data.inventory_categories[0].model_type)
                const result = data.inventory_categories[0].inventory.map(inventory => {
                    const {
                        inventory_category: {
                            manufacturer = "N/A",
                            model_type = "N/A"
                        } = {},                      // Fallback to empty object if `inventory_category` is null or undefined
                        id = "N/A",
                        quantity = "N/A",
                        unit_price = "N/A",
                        date_purchase_received = "N/A"
                    } = inventory;

                    return [
                        id,                            // ID
                        manufacturer,                  // Manufacturer
                        model_type,                    // Model Type
                        quantity,                      // Quantity
                        unit_price,                    // Unit Price
                        date_purchase_received         // Date Purchase Received
                    ];
                });
                setContents(result);
                setTotalItems(data.inventory_categories[0].total.aggregate.count);
                setPageCount(Math.ceil(data.inventory_categories[0].total.aggregate.count / itemsPerPage));
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
            variables: { id: id, limit: itemsPerPage, offset: currentPage * itemsPerPage }
        });
    }, [currentPage]);

    const headings = [
        "ID",
        "Manufacturer",
        "Model Type",
        "Quantity",
        "Unit Price",
        "Date Purchase Received"
    ];

    const actions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Edit",
                    icon: <MdModeEdit/>,
                    onClick: (id) => handleOnEditClick(id),
                },
                {
                    label: "Delete",
                    icon: <MdDelete/>,
                    onClick: (id) => handleOnDeleteClick(id),
                }
            ]
        }
    ]

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (inventoryId) => {
        //console.log(id)
        navigate(`/inventory-categories/inventories/update/${id}/${inventoryId}`)
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
                <Header title={"Inventories"} category="Pages" />

                <div className="p-4 bg-white rounded-md border-b my-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
                    <div className="space-y-2">
                        <div>
                            <span className="block font-semibold text-gray-600">Manufacturer:</span>
                            <span className="text-gray-700">{manufacturer}</span>
                        </div>
                        <div>
                            <span className="block font-semibold text-gray-600">Model Type:</span>
                            <span className="text-gray-700">{modelType}</span>
                        </div>
                    </div>
                </div>
                {
                    (role == "admin") ? (
                        <div className="flex flex-row justify-end">
                            <Link
                                to={`/inventory-categories/inventories/add/${id}`}
                                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                                style={{background: currentColor}}
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
                    actions={actions}
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
