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
import { Button } from "@material-tailwind/react";
import PageRoutes from "../../utils/PageRoutes";
import AlertDialog from "../../components/AlertDialog";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { GET_ALL_INVENTORY_RECORDS } from "../../graphql/query/inventoryQueries";

export function InventoryRecords() {
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

    const [loadAllInventoryCategories] = useLazyQuery(GET_ALL_INVENTORY_RECORDS, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                const result = data.inventories.map(inventory => {
                    const {
                        inventory_category: {
                            manufacturer = "N/A",
                            model_type = "N/A",
                            part_number = "N/A",
                            device = "N/A"
                        } = {},                       // Fallback to empty object if `inventory_category` is null or undefined
                        id = "N/A",
                        address = "N/A",
                        admin_name = "N/A",
                        contact_number = "N/A",
                        country = "N/A",
                        date_purchase_received = "N/A",
                        date_release = "N/A",
                        date_return = "N/A",
                        delivered_to_client = "N/A",
                        delivery_receipt_no = "N/A",
                        email_address = "N/A",
                        is_return = "N/A",
                        location_stock = "N/A",
                        quantity = "N/A",
                        scit_control_number = "N/A",
                        serial_number = "N/A",
                        serial_number_end = "N/A",
                        serial_number_start = "N/A",
                        stock_office = "N/A",
                        supplier = "N/A",
                        total_amount = "N/A",
                        total_stock_amount = "N/A",
                        total_unit_release = "N/A",
                        type = "N/A",
                        unit_price = "N/A",
                        unit_return = "N/A",
                        units_in_stock = "N/A",
                        units_on_request = "N/A",
                        website = "N/A"
                    } = inventory;
                
                    return [
                        id,
                        manufacturer,
                        model_type,
                        part_number,
                        device,
                        address,
                        admin_name,
                        contact_number,
                        country,
                        date_purchase_received,
                        date_release,
                        date_return,
                        delivered_to_client,
                        delivery_receipt_no,
                        email_address,
                        is_return,
                        location_stock,
                        quantity,
                        scit_control_number,
                        serial_number,
                        serial_number_end,
                        serial_number_start,
                        stock_office,
                        supplier,
                        total_amount,
                        total_stock_amount,
                        total_unit_release,
                        type,
                        unit_price,
                        unit_return,
                        units_in_stock,
                        units_on_request,
                        website
                    ];
                });
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

    const headings = [
        "ID",
        "Manufacturer",
        "Model Type",
        "Part Number",
        "Device",
        "Address",
        "Admin Name",
        "Contact Number",
        "Country",
        "Date Purchase Received",
        "Date Release",
        "Date Return",
        "Delivered to Client",
        "Delivery Receipt No.",
        "Email Address",
        "Is Return",
        "Location Stock",
        "Quantity",
        "SCIT Control Number",
        "Serial Number",
        "Serial Number End",
        "Serial Number Start",
        "Stock Office",
        "Supplier",
        "Total Amount",
        "Total Stock Amount",
        "Total Unit Release",
        "Type",
        "Unit Price",
        "Unit Return",
        "Units in Stock",
        "Units on Request",
        "Website"
      ];
      

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
                <Header title={"Inventories"} category="Pages" />
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
