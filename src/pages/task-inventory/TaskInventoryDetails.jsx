import BackButton from "../../components/BackButton";
import AppIconButton from "../../components/AppIconButton";
import {FaPlus, FaTrash} from "react-icons/fa";
import {Header} from "../../components";
import TwoColumnsDetailsLayout from "../../components/TwoColumnsDetailsLayout";
import AlertDialog from "../../components/AlertDialog";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {formatDate} from "../../data/dummy";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    ADD_INVENTORY_QUANTITY,
    DELETE_TASK_INVENTORY_BY_ID,
    GET_TASK_INVENTORY_DETAILS_BY_ID,
    RETURN_TASK_INVENTORY
} from "../../graphql/query/taskInventoryQueries";
import {toast} from "react-toastify";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";
import {IoReturnUpForwardOutline} from "react-icons/io5";
import ReturnInventoryProjectDialog from "../project-inventory/ReturnInventoryProjectDialog";
import ReturnTaskInventoryDialog from "./ReturnTaskInventoryDialog";
import AddQuantityDialog from "./AddQuantityDialog";

const headings = [
    // Task Information
    "Task Name",                          // task.task_name

    // Inventory Information
    "Part Number",                        // inventory.part_number
    "SCIT Control Number",                // inventory.scit_control_number
    "Serial Number Start",                // inventory.serial_number_start
    "Serial Number End",                  // inventory.serial_number_end
    "Address",                            // inventory.address
    "Country",                            // inventory.country
    "Email Address",                      // inventory.email_address
    "Stock Office",                       // inventory.stock_office
    "Unit Price",                         // inventory.unit_price
    "Total Amount",                       // inventory.total_amount
    "Total Stock Amount",                 // inventory.total_stock_amount
    "Total Unit Release",                 // inventory.total_unit_release

    // Rental and Return Information
    "Rent Date",                          // rent_date
    "Request Date",                       // request_date
    "Request User Name",                  // request_user_name
    "Return Date",                        // return_date
    "Actual Rent Date",                   // actual_rent_date
    "Actual Return Date",                 // actual_return_date
    "Return Received User Name",          // return_received_user_name

    // Task Inventory Specific Information
    "Inventory ID",                       // inventory_id
    "Project ID",                         // project_id
    "Status",                             // status
    "Remark",                             // remark
    "Is Return",                          // is_return
    "Total Quantity",                     // total_qty
    "Used Quantity",                      // used_qty

    // Meta Information
    "Created At",                         // created_at
    "Updated At",                         // updated_at
    "Approved User Name",                 // approved_user_name
    "Task ID"                             // task_id
];

const TaskInventoryDetails = ({navigation}) => {
    const navigate = useNavigate()
    const [contents, setContents] = React.useState([]);
    const {id} = useParams()
    const [open, setOpen] = React.useState(false);
    const [taskName, setTaskName] = useState("")
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const {role} = useAuth()
    const [totalQuantity, setTotalQuantity] = useState(null)
    const [addQuantityDialogOpen, setAddQuantityDialogOpen] = React.useState(false);

    const setContentData = (task_inventory) => {
        setTaskName(task_inventory.task.task_name || "N/A")
        setTotalQuantity(task_inventory.total_qty)
        const content = [
            task_inventory?.task?.task_name || "N/A",                                // Task Name

            // Inventory Information
            task_inventory.inventory.part_number || "N/A",                         // Part Number
            task_inventory.inventory.scit_control_number || "N/A",                 // SCIT Control Number
            task_inventory.inventory.serial_number_start || "N/A",                 // Serial Number Start
            task_inventory.inventory.serial_number_end || "N/A",                   // Serial Number End
            task_inventory.inventory.address || "N/A",                             // Address
            task_inventory.inventory.country || "N/A",                             // Country
            task_inventory.inventory.email_address || "N/A",                       // Email Address
            task_inventory.inventory.stock_office || "N/A",                        // Stock Office
            task_inventory.inventory.unit_price || "N/A",                          // Unit Price
            task_inventory.inventory.total_amount || "N/A",                        // Total Amount
            task_inventory.inventory.total_stock_amount || "N/A",                  // Total Stock Amount
            task_inventory.inventory.total_unit_release || "N/A",                  // Total Unit Release

            // Rental and Return Information
            formatDate(task_inventory.rent_date) || "N/A",                         // Rent Date
            formatDate(task_inventory.request_date) || "N/A",                      // Request Date
            task_inventory.request_user_name || "N/A",                             // Request User Name
            formatDate(task_inventory.return_date) || "N/A",                        // Return Date
            formatDate(task_inventory.actual_rent_date) || "N/A",                  // Actual Rent Date
            formatDate(task_inventory.actual_return_date) || "N/A",                // Actual Return Date
            task_inventory.return_received_user_name || "N/A",                      // Return Received User Name

            // Task Inventory Specific Information
            task_inventory.inventory_id || "N/A",                                  // Inventory ID
            task_inventory.project_id || "N/A",                                     // Project ID
            task_inventory.status || "N/A",                                         // Status
            task_inventory.remark || "N/A",                                         // Remark
            task_inventory.is_return ? "Yes" : "No",                                // Is Return (Yes/No)
            task_inventory.total_qty || "N/A",                                      // Total Quantity
            task_inventory.used_qty || "N/A",                                       // Used Quantity

            // Meta Information
            formatDate(task_inventory.created_at) || "N/A",                        // Created At
            formatDate(task_inventory.updated_at) || "N/A",                        // Updated At
            task_inventory.approved_user_name || "N/A",                             // Approved User Name
            task_inventory.task_id || "N/A"                                         // Task ID
        ];
        setContents(content)
    }

    const [getTaskInventoryDetails] = useLazyQuery(GET_TASK_INVENTORY_DETAILS_BY_ID,{
        onCompleted: data => {
            console.log(data)
            setTimeout(() => {
                setLoading(false)
                setContentData(data.task_inventories[0])
            },500)
        },
        onError: (error) => {
            console.log(error.message)
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [deleteTaskInventoryById] = useMutation(DELETE_TASK_INVENTORY_BY_ID, {
        onCompleted: data => {
            setOpen(false)
            toast.success("Task inventory has been deleted successfully.")
            navigate(-1)
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [returnInventoryTask] = useMutation(RETURN_TASK_INVENTORY, {
        onCompleted: data => {
            const response = data.response;
            setTimeout(() => {
                setLoading(false)
                if (response.success) toast.success("Returned task inventory successfully!")
                else toast.error(response.message);
            },500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [addInventoryQuantity] = useMutation(ADD_INVENTORY_QUANTITY, {
        refetchQueries: [{
            query: GET_TASK_INVENTORY_DETAILS_BY_ID,
            variables: {id: id}
        }],
        fetchPolicy: "network-only",
        onCompleted: data => {
            const response = data.response
            console.log(data)
            if (response.success) {
                getTaskInventoryDetails({variables: {id: id}})
                toast.success("Quantity has been added successfully!")
            }
            else toast.error(response.message)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const handleDeleteTaskInventoryById = () => {
        deleteTaskInventoryById({variables: {id: id}})
    }

    const handleAddQuantity = (data) => {
        const variables = {
            inventory_id: id,
            qty: Number(data.quantity),
            remark: data.remark
        }
        console.log(variables)
        addInventoryQuantity({
            variables: variables
        })
    }

    useEffect(() => {
        setLoading(true)
        getTaskInventoryDetails({variables: {id: id}})
    }, [location.key]);

    if (loading) return <Loading/>

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <div className="flex mb-12 justify-between items-start">
                <BackButton onBackClick={() => navigate(-1)}/>
                <div className="flex space-x-2">
                    <AppIconButton
                        color={"bg-blue-500"}
                        hoverColor={"bg-blue-600"}
                        title={"Add Quantity"}
                        icon={<FaPlus/>}
                        onClick={() => setAddQuantityDialogOpen(true)}
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
                    title={`Task Inventory Details`}
                    category={<>
                        Task Name: {taskName}
                    </>}
                    icon={<IoReturnUpForwardOutline/>}
                    buttonTitle="Return Task Inventory"
                    showAddButton={false}
                />

                <TwoColumnsDetailsLayout
                    firstColumnTitle="Inventory Information"
                    secondColumnTitle="Additional Information"
                    headings={headings}
                    contents={contents}
                />
            </div>
            <AlertDialog
                open={open}
                onConfirm={handleDeleteTaskInventoryById}
                onDismiss={() => setOpen(false)}
                title={"Delete Task Inventory"}
                description={"Are you sure you want to delete this task inventory? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />

            <AddQuantityDialog
                open={addQuantityDialogOpen}
                onConfirm={handleAddQuantity}
                onClose={() => setAddQuantityDialogOpen(false)}
                />
        </div>
    )
}

export default TaskInventoryDetails;