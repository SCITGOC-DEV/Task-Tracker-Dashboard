import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { Header } from "../../components";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
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
import {GET_ALL_INVENTORIES, GET_ALL_INVENTORY_RECORDS} from "../../graphql/query/inventoryQueries";
import {ActionType} from "../../utils/Constants";
import {Md1K, MdDeck, MdDelete, MdModeEdit, MdMore} from "react-icons/md";
import {formatDate} from "../../data/dummy";

export function InventoryRecords() {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const { role } = useAuth()
    //const {id} = useParams()

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0)
    const [contents, setContents] = useState([]);
    const [open, setOpen] = useState(false)
    const [inventoryId, setInventoryId] = useState(0)
    const location = useLocation()

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

    const setData = (response) => {
        const allInventories = response.inventories.map(inventory => ([
            inventory.id || "N/A",
            inventory.scit_control_number,
            inventory.country || "N/A",
            inventory.part_number || "N/A",
            inventory.quantity || "N/A",
            inventory.total_amount || "N/A",
            inventory.unit_price || "N/A",
            inventory.inventory_category?.manufacturer || "N/A",
            inventory.inventory_category?.model_type || "N/A",
            formatDate(inventory.created_at) || "N/A",
        ])
        );
        setContents(allInventories)
    }

    const [loadAllInventoryCategories] = useLazyQuery(GET_ALL_INVENTORIES, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                /*setManufacturer(data.inventory_categories[0].manufacturer)
                setModelType(data.inventory_categories[0].model_type)*/
                console.log(data)
                setData(data)
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
        const variables = { limit: itemsPerPage, offset: currentPage * itemsPerPage }
        console.log('variables: ',variables)
        loadAllInventoryCategories({
            variables: variables
        });
    }, [currentPage,location.key]);

    const headings = [
        "ID",
        "SCIT Control Number",
        "Country",
        "Part Number",
        "Quantity",
        "Total Amount",
        "Unit Price",
        "Manufacturer",
        "Model Type",
        "Created At",
    ];

    const actions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Detail",
                    icon: <MdMore/>,
                    onClick: (id) => navigate(`/inventory/inventories/details/${id}`),
                },
            ]
        }
    ]

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (id) => {
        //console.log(id)
        navigate(`/inventory/inventories/update/${id}`)
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
                <Header title={"Inventories"} category="Pages" buttonTitle="Add Inventory" onAddButtonClick={() => navigate(PageRoutes.AddInventoryMain)} />

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
