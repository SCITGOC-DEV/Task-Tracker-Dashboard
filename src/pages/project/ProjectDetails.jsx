import React, {useEffect, useState} from "react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {MdMore} from "react-icons/md";
import {useStateContext} from "../../contexts/ContextProvider";
import useAuth from "../../hooks/useAuth";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTable";
import AlertDialog from "../../components/AlertDialog";
import {DELETE_TASK} from "../../graphql/mutation/deleteTask";
import {GET_ALL_TASKS_BY_PROJECT_ID} from "../../graphql/query/getAllTasks";
import {ActionType} from "../../utils/Constants";
import {Header} from "../../components";
import {formatDate} from "../../data/dummy";
import {
    DELETE_PROJECT_BY_ID,
    GET_ALL_PROJECTS,
    GET_ALL_TASKS_AND_INVENTORIES_BY_PROJECT_ID
} from "../../graphql/query/projectQueries";
import AppIconButton from "../../components/AppIconButton";
import {IoMdCreate} from "react-icons/io";
import {FaTrash} from "react-icons/fa";
import {GET_PROJECT_INVENTORIES} from "../../graphql/query/projectInventoryQueries";
import {goBack} from "../../utils/Methods";
import TwoColumnsDetailsLayout from "../../components/TwoColumnsDetailsLayout";
import taskDetails from "./tasks/TaskDetails";

const taskHeadings = [
    "No",
    "Task Name",
    "Location Name",
    "Percentage",
    "Hardware",
    "Quantity",
    "Start Date & Time",
    "End Date & Time"
];

const inventoryHeadings = [
    "No",            // ID of the inventory
    "Manufacturer",            // Manufacturer of the inventory device
    "Model Type",              // Model type of the inventory device
    "Device",                   // Device type of the inventory
    "Status",                  // Status of the inventory (e.g., "Using", "Returned")
    "Total Quantity",          // Total quantity of inventory items
    //"Used Quantity",           // Quantity already used
];

const detailsHeadings = [
    "Project Name",
    "Actual End Date",
    "Actual Start Date",
    "Created At",
    "Created By",
    "End Date",
    "Percentage",
    "Project Description",
    "Status",
    "Start Date",
    "Updated At"
]

const ProjectDetails = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const taskItemPerPage = 10;
    const inventoryItemPerPage = 5;
    const { role } = useAuth()
    const { id } = useParams()
    const location = useLocation()

    const [taskCurrentPage, setTaskCurrentPage] = useState(0);
    const [taskPageCount, setTaskPageCount] = useState(0);
    const [inventoryCurrentPage, setInventoryCurrentPage] = useState(0);
    const [inventoryPageCount, setInventoryPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [allTasks, setAllTasks] = useState([]);
    const [open, setOpen] = useState(false)
    const [taskId, setTaskId] = useState(0)
    const [projectDetails, setProjectDetails] = useState([]);

    const [allInventories, setAllInventories] = useState([])
    const [projectName, setProjectName] = useState(null)

    const [deleteProjectById] = useMutation(DELETE_PROJECT_BY_ID, {
        refetchQueries: [
            {
                query: GET_ALL_PROJECTS,
            },
        ],
        fetchPolicy: "network-only",
        onCompleted: data => {
            setLoading(false)
            console.log(data)
            toast.success("Project has been deleted successfully!");
            navigate(-1)
            /*loadAllTasks({
                variables: { projectId: id, limit: taskItemPerPage, offset: taskCurrentPage * taskItemPerPage }
            });*/
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message);
        },
    })

    const setTaskData = (data) => {
        const result = data?.map((task) => [
            task.id || "N/A",                               // Task ID
            task.task_name || "N/A",                        // Task Name
            task.fk_location_name || "N/A",                 // Location Name
            task.percentage || "N/A",                       // Percentage
            task.hardware || "N/A",                         // Hardware
            task.quantity || "N/A",                         // Quantity
            formatDate(task.start_date_time) || "N/A",                  // Start Date & Time
            formatDate(task.end_date_time) || "N/A"                     // End Date & Time
        ]);
        setAllTasks(result);
    }

    const setInventoryData = (data) => {
        const result = data?.map((inventory) => [
            inventory.id || "N/A",                                         // Inventory ID
            inventory.inventory.inventory_category.manufacturer || "N/A",  // Manufacturer
            inventory.inventory.inventory_category.model_type || "N/A",    // Model Type
            inventory.inventory.inventory_category.device || "N/A",         // Device
            inventory.status || "N/A",                                     // Status
            inventory.total_qty || "N/A",                                  // Total Quantity
            //inventory.used_qty || "N/A",                                   // Used Quantity
        ]);
        setAllInventories(result)
    }

    const setProjectDetailData = (data) => {
        const result =  [
            data.project_name || "N/A",
            data.actual_end_date || "N/A",
            data.actual_start_date || "N/A",
            data.created_at || "N/A",
            data.created_by || "N/A",
            data.end_date || "N/A",
            data.percentage || "N/A",
            data.project_description || "N/A",
            data.status || "N/A",
            data.start_date || "N/A",
            data.updated_at || "N/A"
        ]
        setProjectDetails(result)
    }

    const [loadInitialData] = useLazyQuery(GET_ALL_TASKS_AND_INVENTORIES_BY_PROJECT_ID, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)

                setProjectName(data.projects[0].project_name)

                setInventoryData(data.projects[0].inventories)
                setTaskData(data.projects[0].tasks)
                setProjectDetailData(data.projects[0])

                // pagination
                setTaskPageCount(Math.ceil(data.projects[0].tasks_count.aggregate.count/ taskItemPerPage))
                setInventoryPageCount(Math.ceil(data.projects[0].inventories_count.aggregate.count/inventoryItemPerPage))
            }, 500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [loadAllTasks] = useLazyQuery(GET_ALL_TASKS_BY_PROJECT_ID, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTaskData(data.projects[0].task)
            setTaskPageCount(Math.ceil(data.projects[0].total.aggregate.count / taskItemPerPage));
        },
        onError: (error) => {
            setLoading(false);
        }
    });

    const [loadAllInventories] = useLazyQuery(GET_PROJECT_INVENTORIES, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            setInventoryData(data.projects[0].project_inventory)
            setInventoryPageCount(Math.ceil(data.projects[0].total.aggregate.count/inventoryItemPerPage))
        }
    })

    useEffect(() => {
        loadAllInventories({variables: {id: id, limit: inventoryItemPerPage, offset: inventoryItemPerPage * inventoryCurrentPage}});
    }, [inventoryCurrentPage]);

    useEffect(() => {
        loadAllTasks({
            variables: { projectId: id, limit: taskItemPerPage, offset: taskCurrentPage * taskItemPerPage }
        });
    }, [taskCurrentPage]);

    useEffect(() => {
        setLoading(true)
        loadInitialData({variables: {id: id}})
    }, [location.key]);

    const taskActions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Detail",
                    icon: <MdMore/>,
                    onClick: (taskId) => navigate(`/projects/details/task-details/${id}/${taskId}`),
                }
            ]
        },
    ]

    const inventoryActions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Detail",
                    icon: <MdMore/>,
                    onClick: (id) => navigate(`/projects/details/task-details/edit/${id}/${taskId}`),
                }
            ]
        },
    ]

    const handleTaskPageClick = ({ selected }) => {
        setTaskCurrentPage(selected);
    };

    const handleInventoryPageClick = ({ selected }) => {
        setInventoryCurrentPage(selected);
    }

    const deleteTaskCategory = () => {
        setOpen(false)
        deleteProjectById({
            variables: {
                id: taskId
            }
        })
    }

    return (
        loading ? (<Loading />) : (
            <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
                <div className="flex mb-12 justify-between items-start">
                    <BackButton onBackClick={() => navigate(-1)}/>
                    <div className="flex space-x-2">
                        <AppIconButton
                            title={"Edit"}
                            color={"bg-blue-500"}
                            hoverColor={"bg-blue-600"}
                            icon={<IoMdCreate/>}
                            onClick={() => navigate(`/projects/update/${id}`)}
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
                        title={`Project Details ( ${projectName} )`}
                        category="Pages"
                        showAddButton={false}
                    />

                    <TwoColumnsDetailsLayout
                        firstColumnTitle="Project Information"
                        secondColumnTitle="Additional Information"
                        headings={detailsHeadings}
                        contents={projectDetails}
                        />
                </div>

                <div className="my-12">
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
                />
            </div>

        )
    );
};

export default ProjectDetails;
