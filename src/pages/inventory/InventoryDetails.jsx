import BackButton from "../../components/BackButton";
import AppIconButton from "../../components/AppIconButton";
import {IoMdCreate} from "react-icons/io";
import {FaTrash} from "react-icons/fa";
import {Header} from "../../components";
import TwoColumnsDetailsLayout from "../../components/TwoColumnsDetailsLayout";
import DataTable from "../../components/DataTable";
import AlertDialog from "../../components/AlertDialog";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useLazyQuery, useMutation} from "@apollo/client";
import {DELETE_INVENTORY_BY_ID, GET_ALL_INVENTORIES, GET_INVENTORY_BY_ID} from "../../graphql/query/inventoryQueries";
import {formatDate} from "../../data/dummy";
import Loading from "../../components/Loading";
import {toast} from "react-toastify";

const detailsHeadings = [
    // Identification and General Information
    "Part Number",
    "SCIT Control Number",
    "Type",
    "Inventory Category ID",

    // Contact and Location Information
    "Admin Name",
    "Address",
    "Contact Number",
    "Email Address",
    "Country",
    "Website",
    "Location Stock",
    "Stock Office",

    // Inventory and Serial Information
    "Serial Number Start",
    "Serial Number End",
    "Quantity",
    "Total Stock Amount",
    "Units on Request",
    "Unit Return",
    "Total Unit Release",

    // Purchase and Delivery Information
    "Supplier",
    "Date Purchase Received",
    "Date Release",
    "Date Return",
    "Delivered To Client",
    "Delivery Receipt No.",

    // Financial Information
    "Unit Price",
    "Total Amount",

    // Meta Information
    "Is Return",
    "Created At",
    "Updated At"
];


const InventoryDetails = () => {
    const navigate = useNavigate();
    const {id} = useParams()
    const [open, setOpen] = React.useState(false);
    const [inventory, setInventory] = React.useState('');
    const [contents, setContents] = React.useState([]);
    const [loading, setLoading] = useState(true)

    const [manufacturer, setManufacturer] = useState(null);
    const [modelType, setModelType] = useState(null);
    const location = useLocation()
    const [inventoryCategoryId, setInventoryCategoryId] = useState(null)

    const setContentData = (inventory) => {
        setManufacturer(inventory.inventory_category.manufacturer)
        setModelType(inventory.inventory_category.model_type)
        setInventoryCategoryId(inventory.inventory_category.id)

        const result =  [                               // ID
            inventory.part_number || "N/A",                         // Part Number
            inventory.scit_control_number || "N/A",                 // SCIT Control Number
            inventory.type || "N/A",                                // Type
            inventory.inventory_category_id || "N/A",               // Inventory Category ID
            inventory.admin_name || "N/A",                          // Admin Name
            inventory.address || "N/A",                             // Address
            inventory.contact_number || "N/A",                      // Contact Number
            inventory.email_address || "N/A",                       // Email Address
            inventory.country || "N/A",                             // Country
            inventory.website || "N/A",                             // Website
            inventory.location_stock || "N/A",                      // Location Stock
            inventory.stock_office || "N/A",                        // Stock Office
            inventory.serial_number_start || "N/A",                 // Serial Number Start
            inventory.serial_number_end || "N/A",                   // Serial Number End
            inventory.quantity || "N/A",                            // Quantity
            inventory.total_stock_amount || "N/A",                  // Total Stock Amount
            inventory.units_on_request || "N/A",                    // Units on Request
            inventory.unit_return || "N/A",                         // Unit Return
            inventory.total_unit_release || "N/A",                  // Total Unit Release
            inventory.supplier || "N/A",                            // Supplier
            formatDate(inventory.date_purchase_received) || "N/A",  // Date Purchase Received
            formatDate(inventory.date_release) || "N/A",            // Date Release
            formatDate(inventory.date_return) || "N/A",             // Date Return
            inventory.delivered_to_client || "N/A",                 // Delivered To Client
            inventory.delivery_receipt_no || "N/A",                 // Delivery Receipt No.
            inventory.unit_price || "N/A",                          // Unit Price
            inventory.total_amount || "N/A",                        // Total Amount
            inventory.is_return ? "Yes" : "No",                     // Is Return (Yes/No)
            formatDate(inventory.created_at) || "N/A",              // Created At
            formatDate(inventory.updated_at) || "N/A"               // Updated At
        ];
        setContents(result)
    }

    const [loadInventoryById] = useLazyQuery(GET_INVENTORY_BY_ID, {
        onCompleted: data =>  {
            setTimeout(() => {
                setLoading(false)
                setContentData(data.inventories[0])
            },500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [deleteInventoryById] = useMutation(DELETE_INVENTORY_BY_ID, {
        refetchQueries: [GET_ALL_INVENTORIES],
        fetchPolicy: "network-only",
        onCompleted: data => {
            toast.success("Inventory deleted successfully.")
            navigate(-1)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const deleteInventory = () => {
        deleteInventoryById({
            variables: {inventoryId: id}
        })
    }

    useEffect(() => {
        loadInventoryById({variables: {id: id}})
    }, [location.key]);

    if (loading) return <Loading/>

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <div className="flex mb-12 justify-between items-start">
                <BackButton onBackClick={() => navigate(-1)}/>
                <div className="flex space-x-2">
                    <AppIconButton
                        title={"Edit"}
                        color={"bg-blue-500"}
                        hoverColor={"bg-blue-600"}
                        icon={<IoMdCreate/>}
                        onClick={() => navigate(`/projects/inventories/update/${id}/${inventoryCategoryId}`)}
                    />
                    <AppIconButton
                        color={"bg-red-500"}
                        hoverColor={"bg-red-600"}
                        title={"Delete"}
                        icon={<FaTrash/>}
                        onClick={() => setOpen(true)}
                    />
                </div>
            </div>

            <div>
                <Header
                    title={`Inventory Details`}
                    category={<>
                        Manufacturer: {manufacturer} <br />
                        Model Type: {modelType}
                    </>}
                    showAddButton={false}
                />

                <TwoColumnsDetailsLayout
                    firstColumnTitle="Inventory Information"
                    secondColumnTitle="Additional Information"
                    headings={detailsHeadings}
                    contents={contents}
                />
            </div>

            <AlertDialog
                open={open}
                onConfirm={deleteInventory}
                onDismiss={() => setOpen(false)}
                title={"Delete Project"}
                description={"Are you sure you want to delete this inventory? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />

            {/*<div className="my-12">
                <Header
                    title={`Tasks`}
                    category={`All tasks related to the ${projectName}`}
                    showAddButton={true}  // Ensure this is true when you want the button to show
                    buttonTitle={"Add Task"}
                    onAddButtonClick={() => navigate(`/projects/tasks/add/${id}`)}
                />

                <DataTable
                    headings={taskHeadings}
                    contents={allTasks}
                    actions={taskActions}
                    totalPages={taskPageCount}
                    currentPage={taskCurrentPage}
                    onPageClick={handleTaskPageClick}
                    errorProps={{
                        name: "No Tasks Found",
                        description: "You haven't added any tasks yet. Create a new task to get started.",
                    }}
                />
            </div>

            <div className="my-12">
                <Header
                    title={`Inventories`}
                    category={`All inventories related to the ${projectName}`}
                    showAddButton={true}  // Ensure this is also true
                    buttonTitle={"Add Inventory To Project"}
                    onAddButtonClick={() => navigate(`/projects/project-inventory/add/${id}`)}
                />

                <DataTable
                    headings={inventoryHeadings}
                    contents={allInventories}
                    actions={inventoryActions}
                    totalPages={inventoryPageCount}
                    currentPage={inventoryCurrentPage}
                    onPageClick={handleInventoryPageClick}
                    errorProps={{
                        name: "No Inventories Found",
                        description: "You haven't added any inventories yet. Create a new inventory to get started.",
                    }}
                />
            </div>

            <AlertDialog
                open={open}
                onConfirm={deleteTaskCategory}
                onDismiss={() => setOpen(false)}
                title={"Delete Project"}
                description={"Are you sure you want to delete this project? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />*/}
        </div>
    )
}

export default InventoryDetails;