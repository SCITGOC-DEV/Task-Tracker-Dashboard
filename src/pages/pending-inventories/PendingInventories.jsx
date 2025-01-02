import {useLazyQuery, useMutation} from "@apollo/client";
import {
    APPROVE_PENDING_INVENTORY,
    APPROVE_RETURNED_PROJECT,
    GET_PENDING_INVENTORIES
} from "../../graphql/query/projectInventoryQueries";
import {toast} from "react-toastify";
import {ActionType} from "../../utils/Constants";
import {MdDelete, MdMore} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Loading from "../../components/Loading";
import {Header} from "../../components";
import PageRoutes from "../../utils/PageRoutes";
import DataTable from "../../components/DataTable";
import AlertDialog from "../../components/AlertDialog";
import {formatDate} from "../../data/dummy";
import {AiOutlineCheck} from "react-icons/ai";
import {BiCheck, BiX} from "react-icons/bi";
import ApproveInventoryDialog from "./ApproveInventoryDialog";
import {DropDown} from "../../components/AppDropdown";
import PendingInventoriesDropdown from "./PendingInventoriesDropdown";
import Dropdown from "../Dropdown";
import useAuth from "../../hooks/useAuth";

const headings = [
    "Transaction ID",
    "Inventory ID",
    "Quantity",
    "Requested By",
    "Requested Date",
    "Transaction Type",
    "Status",
    "Description",
    "Remark",
    "Return Inventory",
    "Is Approved",
    "Updated At"
];

const FilterTypes = [
    {
        title: "Requested Inventories",
        value: "Request"
    },
    {
        title: "Returned Inventories",
        value: "Returned"
    }
]

const PendingInventories = () => {
    const {role} = useAuth()
    const location = useLocation()
    const [contents, setContents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [open, setOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")
    const [dialogData, setDialogData] = useState({inventoryId: null, requestQuantity: null})
    const [filter, setFilter] = useState(FilterTypes[0])
    const [errorProps, setErrorProps] = useState({name: null, description: null})

    const [getPendingInventories] = useLazyQuery(GET_PENDING_INVENTORIES, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                console.log('Fetched Data:', data);
                setContentData(data)
                setPageCount(Math.ceil(data.total.aggregate.count / itemsPerPage));
            }, 500)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const [approveRequestedInventory] = useMutation(APPROVE_PENDING_INVENTORY, {
        refetchQueries: [
            {
                query: GET_PENDING_INVENTORIES,
                variables: {limit: itemsPerPage, offset: currentPage * itemsPerPage, type: filter.value}
            }
        ],
        fetchPolicy: "network-only",
        onCompleted: data => {
            const response = data.response
            if (response.success) {
                toast.success(successMessage)
                getPendingInventories({
                    variables: {
                        limit: itemsPerPage,
                        offset: currentPage * itemsPerPage,
                        type: filter.value
                    }
                })
            } else toast.error(response.message)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const [approveReturnedInventory] = useMutation(APPROVE_RETURNED_PROJECT, {
        refetchQueries: [
            {
                query: GET_PENDING_INVENTORIES,
                variables: {limit: itemsPerPage, offset: currentPage * itemsPerPage, type: filter.value}
            }
        ],
        fetchPolicy: "network-only",
        onCompleted: data => {
            const response = data.response
            if (response.success) {
                toast.success(successMessage)
                getPendingInventories({
                    variables: {
                        limit: itemsPerPage,
                        offset: currentPage * itemsPerPage,
                        type: filter.value
                    }
                })
            } else toast.error(response.message)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const setContentData = (response) => {
        const result = response.project_inventory_transactions.map(transaction => [
            transaction.id || "N/A",                             // Transaction ID
            transaction.inventory_id || "N/A",                   // Inventory ID
            transaction.qty || "N/A",                            // Quantity
            transaction.request_admin || "N/A",                  // Requested By
            formatDate(transaction.requested_at) || "N/A",       // Requested Date
            transaction.transaction_type || "N/A",               // Transaction Type
            transaction.status || "N/A",                         // Status
            transaction.description || "N/A",                    // Description
            transaction.remark || "N/A",                         // Remark
            transaction.is_return_inventory ? "Yes" : "No",      // Return Inventory
            transaction.is_approved ? "Yes" : "No",              // Is Approved
            formatDate(transaction.updated_at) || "N/A"          // Updated At
        ]);
        setContents(result)
    }

    const handleApprove = (remark, approvedQuantity) => {
        if (filter.value === FilterTypes[0].value) {
            const variables = {
                approved_qty: Number(approvedQuantity),
                is_approved: true,
                project_inventory_transaction_id: selectedId,
                remark: remark
            }
            setSuccessMessage("Approved requested inventory successfully!")
            approveRequestedInventory({variables: variables})
            setOpen(false)
        } else {
            const variables = {
                approved_qty: Number(approvedQuantity),
                is_approved: true,
                project_inventory_transaction_id: selectedId,
                remark: remark
            }
            setSuccessMessage("Approved returned inventory successfully!")
            approveReturnedInventory({variables: variables})
            setOpen(false)
        }
    }

    const handleCancel = (id) => {
        if (filter.value === FilterTypes[0].value) {
            setSuccessMessage("Cancelled requested inventory successfully")
            approveRequestedInventory({
                variables: {
                    approved_qty: 0,
                    is_approved: false,
                    project_inventory_transaction_id: id,
                    remark: "reject"
                }
            })
        } else {
            setSuccessMessage("Cancelled returned inventory successfully")
            approveReturnedInventory({
                variables: {
                    approved_qty: 0,
                    is_approved: false,
                    project_inventory_transaction_id: id,
                    remark: "reject"
                }
            })
        }
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
                            setDialogData({inventoryId: content[1], requestQuantity: content[2]})
                            setOpen(true)
                        } else toast.error("Something went wrong!")
                        setOpen(true)
                        setSelectedId(id)
                    },
                }
            ]
        },
    ]

    const handlePageClick = ({selected}) => {
        setCurrentPage(selected);
    };

    const handleOnFilterChange = (selected) => {
        const selectedFilter = FilterTypes.find((filter) => filter.title === selected)
        setFilter(selectedFilter)
    }

    useEffect(() => {
        if (!currentPage) setLoading(true);
        const variables = {limit: itemsPerPage, offset: currentPage * itemsPerPage, type: filter.value}
        getPendingInventories({variables: variables})

        if (filter.value === FilterTypes[0].value) setErrorProps({
            name: "No Requested Inventories",
            description: "There are no requested inventories"
        })
        else setErrorProps({name: "No Returned Inventories", description: "There are no returned inventories"})

    }, [currentPage, filter, location.key]);

    useEffect(() => {
        /*if (role === "admin")*/
    }, []);

    const handleOnAddButtonClick = () => {
        navigate(PageRoutes.AddProject)
    }

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            {/* Header Component */}
            <Header
                title="Pending Inventories"
                category="Inventory"
                showAddButton={false}
                onAddButtonClick={handleOnAddButtonClick}
            />
            <div className="flex justify-between mb-8">
                {
                    role === "admin" && (
                        <Dropdown options={FilterTypes.map((filter) => filter.title)} value={filter.title}
                                  onSelected={handleOnFilterChange}/>
                    )
                }
            </div>

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
                        errorProps={errorProps}
                        onDeleteClick={() => {
                        }}
                    />
                )
            }

            <ApproveInventoryDialog
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleApprove}
                inventoryId={dialogData?.inventoryId}
                requestQuantity={dialogData?.requestQuantity}
            />
        </div>
    )
}

export default PendingInventories;