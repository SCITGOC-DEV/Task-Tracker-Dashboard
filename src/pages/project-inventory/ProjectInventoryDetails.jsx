import BackButton from "../../components/BackButton";
import AppIconButton from "../../components/AppIconButton";
import {IoMdCreate} from "react-icons/io";
import {FaTrash} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {Header} from "../../components";
import TwoColumnsDetailsLayout from "../../components/TwoColumnsDetailsLayout";
import {formatDate} from "../../data/dummy";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    DELETE_PROJECT_INVENTORY_BY_ID,
    GET_PROJECT_INVENTORY_DETAILS, RETURN_INVENTORY_PROJECT, RETURN_PROJECT_INVENTORY
} from "../../graphql/query/projectInventoryQueries";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AlertDialog from "../../components/AlertDialog";
import {toast} from "react-toastify";
import Loading from "../../components/Loading";
import {IoReturnUpForwardOutline} from "react-icons/io5";
import ReturnInventoryProjectDialog from "./ReturnInventoryProjectDialog";
import useAuth from "../../hooks/useAuth";

const detailsHeadings = [
    // Project Information
    "Project Name",
    "Start Date",
    "Project Status",
    "Percentage",
    "Project Description",
    "Project ID",

    // Inventory Information
    "SCIT Control Number",
    "Inventory Category ID",
    "Address",
    "Country",
    "Email Address",
    "Stock Office",
    "Serial Number Start",
    "Serial Number End",
    "Total Quantity",
    "Total Stock Amount",
    "Units on Request",
    "Unit Return",
    "Total Unit Release",
    "Supplier",
    "Date Purchase Received",
    "Date Release",
    "Date Return",
    "Delivered To Client",
    "Delivery Receipt No.",
    "Unit Price",
    "Total Amount",

    // Meta Information
    "Is Return",
    "Created At",
    "Created By",
    "Updated At",
    "Status"
];

const ProjectInventoryDetails = ({navigation}) => {
    const [contents, setContents] = React.useState([]);
    const location = useLocation()
    const {id, inventoryId} = useParams()
    const [projectName, setProjectName] = useState("")
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [returnDialogOpen, setReturnDialogOpen] = useState(false)
    const [totalQuantity, setTotalQuantity] = useState(null)
    const [isReturn, setIsReturn] = useState(false)
    const {role} = useAuth()

    const setContentData = (project_inventory) => {
        setProjectName(project_inventory.project.project_name)
        setTotalQuantity(project_inventory.total_qty)
        setIsReturn(project_inventory.is_return)
        const content = [
            project_inventory.project.project_name || "N/A",                               // Project Name
            formatDate(project_inventory.project.start_date) || "N/A",                    // Start Date
            project_inventory.project.status || "N/A",                                    // Project Status
            `${project_inventory.project.percentage}%` || "N/A",                               // Percentage
            project_inventory.project.project_description || "N/A",                       // Project Description
            project_inventory.project_id || "N/A",                                         // Project ID

            project_inventory.inventory.scit_control_number || "N/A",                    // SCIT Control Number
            project_inventory.inventory.inventory_category_id || "N/A",                   // Inventory Category ID
            project_inventory.inventory.address || "N/A",                                 // Address
            project_inventory.inventory.country || "N/A",                                 // Country
            project_inventory.inventory.email_address || "N/A",                          // Email Address
            project_inventory.inventory.stock_office || "N/A",                           // Stock Office
            project_inventory.inventory.serial_number_start || "N/A",                    // Serial Number Start
            project_inventory.inventory.serial_number_end || "N/A",                      // Serial Number End
            project_inventory.total_qty || "N/A",                               // Quantity
            project_inventory.inventory.total_stock_amount || "N/A",                     // Total Stock Amount
            project_inventory.inventory.units_on_request || "N/A",                       // Units on Request
            project_inventory.inventory.unit_return || "N/A",                            // Unit Return
            project_inventory.inventory.total_unit_release || "N/A",                     // Total Unit Release
            project_inventory.inventory.supplier || "N/A",                               // Supplier
            formatDate(project_inventory.inventory.date_purchase_received) || "N/A",    // Date Purchase Received
            formatDate(project_inventory.inventory.date_release) || "N/A",              // Date Release
            formatDate(project_inventory.inventory.date_return) || "N/A",               // Date Return
            project_inventory.inventory.delivered_to_client || "N/A",                    // Delivered To Client
            project_inventory.inventory.delivery_receipt_no || "N/A",                    // Delivery Receipt No.
            project_inventory.inventory.unit_price || "N/A",                             // Unit Price
            project_inventory.inventory.total_amount || "N/A",                           // Total Amount

            project_inventory.is_return ? "Yes" : "No",                                  // Is Return (Yes/No)
            formatDate(project_inventory.created_at) || "N/A",                           // Created At
            project_inventory.created_by || "N/A",                                       // Created By
            formatDate(project_inventory.updated_at) || "N/A",                           // Updated At
            project_inventory.status || "N/A"                                            // Status
        ];
        setContents(content)
    }

    const [getProjectInventoryDetails] = useLazyQuery(GET_PROJECT_INVENTORY_DETAILS, {
        onCompleted: data => {
            console.log(data)
            setTimeout(() => {
                setLoading(false)
                setContentData(data.project_inventories[0])
            }, 500)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const [deleteProjectInventoryById] = useMutation(DELETE_PROJECT_INVENTORY_BY_ID, {
        onCompleted: data => {
            toast.success("Project inventory has been deleted successfully.")
            navigate(-1)
            setOpen(false)
        },
        onError: error => {
            toast.error(error.message)
            setOpen(false)
        }
    })

    const [returnProjectInventory] = useMutation(RETURN_PROJECT_INVENTORY,{
        onCompleted: data => {
            const response = data.response;
            setTimeout(() => {
                setLoading(false)
                if (response.success) toast.success("Returned project inventory successfully!")
                else toast.error(response.message);
            },500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const handleDeleteProjectInventoryById = () => {
        deleteProjectInventoryById({
            variables: {
                id: id
            }
        })
    }

    const handleReturnProject = (values) => {
        setReturnDialogOpen(false)
        returnProjectInventory({
            variables: {
                inventory_id: inventoryId,
                project_id: id,
                requested_at: new Date().toISOString(),
                total_qty: values.totalQuantity,
                description: values.description
            }
        })
    }

    useEffect(() => {
        setLoading(true)
        getProjectInventoryDetails({variables: {id: inventoryId}})
    }, [location.key]);

    if (loading) return <Loading/>

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <div className="flex mb-12 justify-between items-start">
                <BackButton onBackClick={() => navigate(-1)}/>
                <div className="flex space-x-2">
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
                    title={`Project Inventory Details`}
                    category={<>
                        Project Name: {projectName}
                    </>}
                    showAddButton={isReturn && role === "projectadmin"}
                    icon={<IoReturnUpForwardOutline/>}
                    buttonTitle="Return Inventory"
                    onAddButtonClick={() => setReturnDialogOpen(true)}
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
                onConfirm={handleDeleteProjectInventoryById}
                onDismiss={() => setOpen(false)}
                title={"Delete Project Inventory"}
                description={"Are you sure you want to delete this project inventory? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />

            <ReturnInventoryProjectDialog
                open={returnDialogOpen}
                onConfirm={handleReturnProject}
                totalQuantity={totalQuantity}
                onClose={() => setReturnDialogOpen(false)}
            />

        </div>
    )
}

export default ProjectInventoryDetails;