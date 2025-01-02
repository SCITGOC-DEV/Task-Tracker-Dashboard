import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import BackButton from "../../../components/BackButton";
import AppIconButton from "../../../components/AppIconButton";
import {IoMdCreate} from "react-icons/io";
import {FaTrash} from "react-icons/fa";
import {Header} from "../../../components";
import DataTable from "../../../components/DataTable";
import AlertDialog from "../../../components/AlertDialog";
import {
    DELETE_ASSIGNED_TASK_BY_ID,
    GET_ASSIGNED_USERS_BY_TASK_ID, GET_TASK_INVENTORIES_BY_TASK_ID,
    GET_TASKS_BY_ID
} from "../../../graphql/query/getTaskByID";
import {useLazyQuery, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import Loading from "../../../components/Loading";
import {formatDate} from "../../../data/dummy";
import {goBack} from "../../../utils/Methods";
import TwoColumnsDetailsLayout from "../../../components/TwoColumnsDetailsLayout";
import {ActionType} from "../../../utils/Constants";
import {MdMore} from "react-icons/md";
import {IoPersonRemoveSharp} from "react-icons/io5";
import AssignTaskToUserDialog from "../../../components/AssignTaskToUserDialog";
import PageRoutes from "../../../utils/PageRoutes";
import useAuth from "../../../hooks/useAuth";

const headings = [
    "Task Name",
    "Status",
    "Created At",
    "Created By",
    "Percentage",
    "Note",
    "Dispatch",
    "Location Name",
    "Start Date",
    "End Date",
    "Quantity",
    "Hardware",
    "Project Name",
    "Start Coordinates",
    "End Coordinates",
    "Actual Start Time",
    "Actual End Time",
    "Updated At",
    "Permit Photo",
    "Signature Photo",
];

const userHeadings = [
    "No",
    "User Name",
    "Email",
    "Phone Number",
    "Address",
]

const inventoryHeadings = [
    "No",
    "Admin Name",
    "Device",
    "Manufacturer",
    "Model Type",
    "Total Quantity",
    "Quantity"
]


const TaskDetails = () => {
    const {id, taskId} = useParams();
    const location = useLocation()
    const [loading, setLoading] = useState(true);
    const [taskName, setTaskName] = useState("");
    const navigate = useNavigate()
    const [taskDetails, setTaskDetails] = useState([])
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [taskInventories, setTaskInventories] = useState([]);
    const [projectName, setProjectName] = useState('')
    const [deleteTaskOpen, setDeleteTaskOpen] = useState(false)
    const [deAssignOpen, setDeAssignOpen] = useState(false)
    const [assignTaskOpen, setAssignTaskOpen] = useState(false)
    const { role } = useAuth()

    const taskItemPerPage = 5

    const [assignTaskId, setAssignTaskId] = useState(0)

    const [usersPageCount, setUsersPageCount] = useState(0)
    const [usersCurrentPage, setUsersCurrentPage] = useState(0)

    const [inventoriesPageCount, setInventoriesPageCount] = useState(0)
    const [inventoriesCurrentPage, setInventoriesCurrentPage] = useState(0)

    const setTaskDetailData = (task) => {
        setProjectName(task.project?.project_name)
        console.log(task)
        const taskContents = [
            task.task_name || "N/A",                 // Task Name
            task.status || "N/A",                    // Status
            formatDate(task.created_at) || "N/A",                // Created At
            task.created_by || "N/A",                // Created By
            task.percentage != null ? task.percentage : "N/A",  // Percentage (check for null)
            task.note || "N/A",                      // Note
            task.dispatch || "N/A",                  // Dispatch
            task.fk_location_name || "N/A",          // Location Name
            formatDate(task.start_date_time) || "N/A",           // Start Date
            formatDate(task.end_date_time) || "N/A",             // End Date
            task.quantity != null ? task.quantity : "N/A",      // Quantity (check for null)
            task.hardware || "N/A",                  // Hardware
            task.project?.project_name || "N/A",     // Project Name
            task.start_coords || "N/A",              // Start Coordinates
            task.end_coords || "N/A",                // End Coordinates
            formatDate(task.actual_start_date_time) || "N/A",    // Actual Start Time
            formatDate(task.actual_end_date_time) || "N/A",      // Actual End Time
            formatDate(task.updated_at) || "N/A",                // Updated At
            task.permit_photo_url || "N/A",          // Permit Photo URL (can be image)
            task.signature_photo_url || "N/A"        // Signature Photo URL (can be image)
        ];
        setTaskDetails(taskContents);
    }

    const setAssignedUsersData = (data) => {
        setAssignedUsers([])
        const result = data.map((item) => [
            item.id || "N/A",
            item.user.username || "N/A",
            item.user.email || "N/A",
            item.user.phone || "N/A",
            item.user.address || "N/A"
        ])
        console.log('assignedUsers: ', result.length);
        setAssignedUsers(result)
    }

    const setTaskInventoriesData = (data) => {
        console.log(data.inventory)
        const result = data.map((inventory) => [
            inventory.id || "N/A",
            inventory.inventory.admin_name || "N/A",
            inventory.inventory.inventory_category.device || "N/A",
            inventory.inventory.inventory_category.manufacturer || "N/A",
            inventory.inventory.inventory_category.model_type || "N/A",
            inventory.total_qty || "N/A",
            inventory.qty || "N/A",
        ])
        setTaskInventories(result)
    }

    const assignedUserActions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Deassign",
                    color: "bg-red-500",
                    hoverColor: "bg-red-600",
                    icon: <IoPersonRemoveSharp/>,
                    onClick: (assignTaskId) => {
                        setAssignTaskId(assignTaskId)
                        setDeAssignOpen(true)
                    },
                },
                {
                    label: "Edit",
                    color: "bg-blue-500",
                    hoverColor: "bg-blue-600",
                    icon: <IoPersonRemoveSharp/>,
                    onClick: (assignTaskId) => {
                        setAssignTaskId(assignTaskId)
                        setDeAssignOpen(true)
                    },
                }
            ]
        }
    ]

    const inventoriesActions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Detail",
                    icon: <MdMore/>,
                    onClick: (id) => navigate(`/projects/tasks/task-inventory/details/${id}`),
                }
            ]
        }
    ]

    const [loadTaskDetails] = useLazyQuery(GET_TASKS_BY_ID, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            console.log(data)
            setTimeout(() => {
                setLoading(false)
                const task = data.tasks[0]; // Assuming there’s only one task with the provided ID
                setTaskName(task?.task_name);

                setTaskDetailData(task)
                setAssignedUsersData(task.users)
                setTaskInventoriesData(task.task_inventories)

                setUsersPageCount(Math.ceil(task.users_count.aggregate.count/ taskItemPerPage))
                setInventoriesPageCount(Math.ceil(task.inventories_count.aggregate.count/ taskItemPerPage))
            }, 500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [loadAssignedUsers] = useLazyQuery(GET_ASSIGNED_USERS_BY_TASK_ID, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
            console.log('active: ', data.tasks[0].users.length)
            setAssignedUsersData(data.tasks[0].users)
            setUsersPageCount(Math.ceil(data.tasks[0].users_count.aggregate.count/ taskItemPerPage))
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const [loadTaskInventories] = useLazyQuery(GET_TASK_INVENTORIES_BY_TASK_ID, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
            setTaskInventoriesData(data.tasks[0].task_inventories)
            setInventoriesPageCount(Math.ceil(data.tasks[0].inventories_count.aggregate.count / taskItemPerPage))
        }
    })

    const [deassignTaskById] = useMutation(DELETE_ASSIGNED_TASK_BY_ID, {
        refetchQueries: [{query: GET_ASSIGNED_USERS_BY_TASK_ID}],
        onCompleted: data => {
            const response = data.task_remove_assigned_task
            console.log(response)
            if (response.success) {
                toast.success("Successfully deassigned the task!")
                setDeAssignOpen(false)
                setTimeout(() => {
                    loadAssignedUsers({
                        variables: {
                            taskId: taskId,
                            limit: taskItemPerPage,
                            offset: usersCurrentPage * taskItemPerPage,
                        }
                    })
                },500)
            } else toast.error(response.message)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    useEffect(() => {
        loadAssignedUsers({
            variables: {
                taskId: taskId,
                limit: taskItemPerPage,
                offset: usersCurrentPage * taskItemPerPage,
            }
        })
    }, [usersCurrentPage]);

    useEffect(() => {
        loadTaskInventories({
            variables: {
                taskId: taskId,
                limit: taskItemPerPage,
                offset: inventoriesCurrentPage * taskItemPerPage,
            }
        })
    }, [inventoriesCurrentPage]);

    const handleUserPageChange = ({selected}) => {
        setUsersCurrentPage(selected)
    }
    const handleInventoriesPageChange = ({selected}) => {
        setInventoriesCurrentPage(selected)
    }

    const handleOnAssignedTask = () => {
        loadAssignedUsers({
            variables: {
                taskId: taskId,
                limit: taskItemPerPage,
                offset: usersCurrentPage * taskItemPerPage,
            }
        })
        setAssignTaskOpen(false)
    }

    const deleteTaskCategory = () => {

    }

    useEffect(() => {
        loadTaskDetails({variables: {taskId: taskId}})
    }, [location.key]);

    const handleDeAssignTask = () => {
        deassignTaskById({variables: {task_id: taskId, assigned_task_id: assignTaskId}})
    }

    if (loading) return <Loading/>

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <div className="flex mb-12 justify-between items-start">
                <BackButton onBackClick={() => navigate(-1)}/>
                <div className="flex space-x-2">
                    <AppIconButton
                        title={"Edit"}
                        icon={<IoMdCreate/>}
                        color={"bg-blue-500"}
                        hoverColor={"bg-blue-600"}
                        onClick={() => navigate(`/projects/details/task-details/edit/${id}/${taskId}`)}
                    />
                    <AppIconButton
                        color={"bg-red-500"}
                        hoverColor={"bg-red-600"}
                        title={"Delete"}
                        icon={<FaTrash/>}
                        onClick={() => setDeleteTaskOpen(true)}
                    />
                </div>
            </div>

            <Header
                title={`Tasks Details ( ${taskName} )`}
                category="Pages"
                showAddButton={false}  // Ensure this is true when you want the button to show
                buttonTitle={"Add Task"}
                onAddButtonClick={() => navigate(`/projects/tasks/add/${id}`)}
            />

            <TwoColumnsDetailsLayout
                mainTitle={`Project - ${projectName}`}
                firstColumnTitle="Task Information"
                secondColumnTitle="Additional Information"
                headings={headings}
                contents={taskDetails}/>

            <div className="my-12">
                <Header
                    title={`Assigned Users`}
                    category={`All assigned users related to the ${taskName}`}
                    showAddButton={role === "projectadmin"}  // Ensure this is true when you want the button to show
                    buttonTitle={"Assign Task To Users"}
                    onAddButtonClick={() => setAssignTaskOpen(true)}
                />
                <DataTable
                    headings={userHeadings}
                    contents={assignedUsers}
                    actions={assignedUserActions}
                    totalPages={usersPageCount}
                    currentPage={usersCurrentPage}
                    onPageClick={handleUserPageChange}
                    errorProps={{
                        name: "No Assigned Users Found",
                        description: "You haven't assigned tasks to any users yet. Assign a new task to users to get started.",
                    }}
                />
            </div>

            <div className="my-12">
                <Header
                    title={`Task Inventories`}
                    category={`All task inventories related to the ${taskName}`}
                    showAddButton={role === "projectadmin"}  // Ensure this is true when you want the button to show
                    buttonTitle={"Add Task Inventory"}
                    onAddButtonClick={() => navigate(`${PageRoutes.AddTaskInventory}/${id}/${taskId}`)}
                />
                <DataTable
                    headings={inventoryHeadings}
                    contents={taskInventories}
                    actions={inventoriesActions}
                    totalPages={inventoriesPageCount}
                    currentPage={inventoriesCurrentPage}
                    onPageClick={handleInventoriesPageChange}
                    errorProps={{
                        name: "No Task Inventories Found",
                        description: "You haven't added any task inventories yet. Create a new task inventory to get started.",
                    }}
                />
            </div>

            <AssignTaskToUserDialog
                taskId={taskId}
                show={assignTaskOpen}
                onDismiss={handleOnAssignedTask}
            />


            <AlertDialog
                open={deleteTaskOpen}
                onConfirm={deleteTaskCategory}
                onDismiss={() => setDeleteTaskOpen(false)}
                title={"Delete Task"}
                description={"Are you sure you want to delete this task? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />

            <AlertDialog
                open={deAssignOpen}
                onConfirm={handleDeAssignTask}
                onDismiss={() => setDeAssignOpen(false)}
                title={"Deassign User"}
                description={"Are you sure you want to deassign this user? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Deassign"}
                dismissTitle={"Cancel"}
            />
        </div>
    )
}

export default TaskDetails;