import {Header} from "../../components";
import React, {useEffect, useState} from "react";
import useAuth from "../../hooks/useAuth";
import {useLocation, useNavigate} from "react-router-dom";
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTable";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    APPROVE_REQUESTED_TASK_INVENTORY, CANCEL_REQUESTED_TASK_INVENTORY,
    GET_REQUESTED_TASK_INVENTORIES
} from "../../graphql/query/projectInventoryQueries";
import {ActionType} from "../../utils/Constants";
import {BiCheck, BiX} from "react-icons/bi";
import {toast} from "react-toastify";
import ApproveInventoryDialog from "./ApproveInventoryDialog";
import {formatDate} from "../../data/dummy";
import ApproveTaskInventoryDialog from "./ApproveTaskInventoryDialog";

const headings = [
    "Task ID",
    "Return User Name",
    "Return Quantity",
    "Description",
    "Approved Quantity",
    "Received Admin Name",
    "Received Date",
    "Is Approved",
    "Remark",
    "Return Date",
    "Total Quantity",
    "Total Returned Quantity"
];


const RequestedTaskInventories = () => {
    const {role, userName} = useAuth()
    const location = useLocation()
    const [contents, setContents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [open, setOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [dialogData, setDialogData] = useState({inventoryId: null, requestQuantity: null})

    const [getRequestedTaskInventories] = useLazyQuery(GET_REQUESTED_TASK_INVENTORIES, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                setContentData(data.response)
                setPageCount(Math.ceil(data.total.aggregate.count / itemsPerPage));
            }, 500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [approveRequestedTaskInventory] = useMutation(APPROVE_REQUESTED_TASK_INVENTORY, {
        refetchQueries: [{
            query: GET_REQUESTED_TASK_INVENTORIES,
            variables: {
                limit: itemsPerPage,
                offset: currentPage * itemsPerPage
            }
        }],
        fetchPolicy: "network-only",
        onCompleted: data => {
            const response = data.response
            if (response.success) {
                toast.success("The task inventory has been approved successfully.")
                setTimeout(() => {
                    getRequestedTaskInventories({
                        variables: {
                            limit: itemsPerPage,
                            offset: currentPage * itemsPerPage
                        }
                    })
                },200)
            } else toast.error(response.message)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const setContentData = (response) => {
        const result = response.map(task => [
            task.id || "N/A",                                 // Task ID
            task.return_user_name || "N/A",                   // Return User Name
            task.return_qty || "N/A",                         // Return Quantity
            task.description || "N/A",                        // Description
            task.approve_qty || "N/A",                        // Approved Quantity
            task.receive_admin_name || "N/A",                 // Received Admin Name
            formatDate(task.received_date) || "N/A",          // Received Date
            task.is_approved ? "Yes" : "No",                  // Is Approved
            task.remark || "N/A",                             // Remark
            formatDate(task.return_date) || "N/A",            // Return Date
            task.total_qty || "N/A",                          // Total Quantity
            task.total_returned_qty || "N/A"                  // Total Returned Quantity
        ]);

        setContents(result)
    }

    useEffect(() => {
        if (!currentPage) setLoading(true);
        const variables = {
            limit: itemsPerPage,
            offset: currentPage * itemsPerPage
        }
        console.log(variables)
        getRequestedTaskInventories({
            variables: variables
        })
    }, [currentPage, location.key]);

    const handlePageClick = ({selected}) => {
        setCurrentPage(selected);
    };

    const handleCancel = (id) => {
        setOpen(false)
        const variables = {
            return_inventory_task_id: selectedId,
            approve_qty: Number(0),
            is_approved: true,
            description: ""
        }
        approveRequestedTaskInventory({
            variables: variables
        })
    }

    const actions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Cancel",
                    icon: <BiX/>,
                    color: "bg-red-500",
                    hoverColor: "bg-red-600",
                    onClick: (id) => handleCancel(id),
                },
                {
                    label: "Approve",
                    icon: <BiCheck/>,
                    onClick: (id) => {
                        const content = contents.find((content) => content[0] === id)
                        if (content != null || content !== undefined) {
                            setDialogData({inventoryId: content[0], requestQuantity: content[2]})
                            setOpen(true)
                        } else toast.error("Something went wrong!")
                        setOpen(true)
                        setSelectedId(id)
                    },
                }
            ]
        },
    ]

    const handleApprove = (remark, approveQuantity) => {
        setOpen(false)
        const variables = {
            return_inventory_task_id: selectedId,
            approve_qty: Number(approveQuantity),
            is_approved: true,
            description: remark
        }
        console.log('variable: ',variables)
        approveRequestedTaskInventory({
            variables: variables
        })
    }

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <Header
                title="Requested Task Inventories"
                category="Inventory"
                showAddButton={false}
            />

            {
                loading ? <Loading/> : (
                    <DataTable
                        showDeleteOption={false}
                        headings={headings}
                        contents={contents}
                        actions={actions}
                        totalPages={pageCount}
                        currentPage={currentPage}
                        onPageClick={handlePageClick}
                        onEditClick={() => {
                        }}
                        errorProps={{
                            name: "No Requested task Inventories Found",
                            description: "There is no requested task inventories yet."
                        }}
                        onDeleteClick={() => {
                        }}
                    />
                )
            }

            <ApproveTaskInventoryDialog
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleApprove}
                inventoryId={dialogData?.inventoryId}
                requestQuantity={dialogData?.requestQuantity}
            />
        </div>
    )
}

export default RequestedTaskInventories;