import React, {useEffect, useState} from "react";
import { Header, PaginationButtons } from "../../../components";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import { GET_ALL_TASKS_BY_PROJECT_ID } from "../../../graphql/query/getAllTasks";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useStateContext } from "../../../contexts/ContextProvider";
import { formatDate } from "../../../data/dummy";
import IconButton from "../../../components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { FaRegEdit } from "react-icons/fa";
import { DELETE_TASK } from "../../../graphql/mutation/deleteTask";
import useAuth from "../../../hooks/useAuth";
import {DELETE_PROJECT_INVENTORY, GET_PROJECT_INVENTORIES} from "../../../graphql/query/projectInventoryQueries";
import {toast} from "react-toastify";
import Loading from "../../../components/Loading";
import PageRoutes from "../../../utils/PageRoutes";
import DataTable from "../../../components/DataTable";
import AlertDialog from "../../../components/AlertDialog";
import Pagination from "../../../components/Pagination";
import AlertSnackbar from "../../../components/AlertSnackbar";
import {Md1K, MdDeck, MdDelete, MdModeEdit, MdMore, MdOutlineDelete} from "react-icons/md";
import {ActionType} from "../../../utils/Constants";
import BackButton from "../../../components/BackButton";
const Task = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate()
  const itemsPerPage = 10;
  const { role } = useAuth()
  const { id } = useParams()

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0)
  const [contents, setContents] = useState([]);
  const [open, setOpen] = useState(false)
  const [taskId, settaskId] = useState(0)

  const [projectName, setProjectName] = useState(null)

  const [deleteTaskById] = useMutation(DELETE_TASK, {
    refetchQueries: [
      {
        query: GET_ALL_TASKS_BY_PROJECT_ID,
        variables: {},
        awaitRefetchQueries: true,
      },
    ],
    onCompleted: data => {
      setLoading(false)
      toast.success("Task has been deleted successfully!");
      loadAllTasks({
        variables: { projectId: id, limit: itemsPerPage, offset: currentPage * itemsPerPage }
      });
    },
    onError: (error) => {
      setLoading(false)
      toast.error(error.message);
    },
  })

  const [loadAllTasks] = useLazyQuery(GET_ALL_TASKS_BY_PROJECT_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setTimeout(() => {
        setLoading(false);
        console.log(data)
        setProjectName(data.projects[0].project_name)
        const result = data.projects[0].task?.map((task) => [
          task.id || "N/A",                               // Task ID
          task.task_name || "N/A",                        // Task Name
          task.fk_location_name || "N/A",                 // Location Name
          task.percentage || "N/A",                       // Percentage
          task.hardware || "N/A",                         // Hardware
          task.quantity || "N/A",                         // Quantity
          formatDate(task.start_date_time) || "N/A",                  // Start Date & Time
          formatDate(task.end_date_time) || "N/A"                     // End Date & Time
        ]);

        setContents(result);
        setTotalItems(data.projects[0].total.aggregate.count);
        setPageCount(Math.ceil(data.projects[0].total.aggregate.count / itemsPerPage));
      }, 600)
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error fetching categories: ", error);
    }
  });

  useEffect(() => {
    if (!currentPage) setLoading(true);
    loadAllTasks({
      variables: { projectId: id, limit: itemsPerPage, offset: currentPage * itemsPerPage }
    });
  }, [currentPage]);

  const headings = [
    "No",
    "Task Name",
    "Location Name",
    "Percentage",
    "Hardware",
    "Quantity",
    "Start Date & Time",
    "End Date & Time"
  ];

  const actions = [
    {
      type: ActionType.Icon,
      actions: [
        {
          label: "Edit",
          icon: <MdMore/>,
          onClick: (id) => navigate(`/projects/tasks/${id}`),
        }/*,
        {
          label: "Delete",
          icon: <MdDelete/>,
          onClick: (id) => handleOnDeleteClick(id),
        }*/
      ]
    },
    /*{
      type: ActionType.Dropdown,
      actions: [
        {
          label: "Add Inventory To Task",
          icon: <MdDeck/>,
          onClick: (taskId) => navigate(`/projects/tasks/task-inventories/${id}/${taskId}`),
        }
      ]
    }*/
  ]

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleOnEditClick = (taskId) => {
    navigate(`/projects/tasks/edit/${id}/${taskId}`)
  }

  const handleOnDeleteClick = (id) => {
    settaskId(id)
    setOpen(true)
  }

  const deleteTaskCategory = () => {
    setOpen(false)
    deleteTaskById({
      variables: {
        id: taskId
      }
    })
  }

  return (
      loading ? (<Loading />) : (
          <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <BackButton onBackClick={() => navigate("/projects")} />
            <Header
                title={`Tasks ( ${projectName} )`}
                category="Pages"
                showAddButton={role == "admin"}
                buttonTitle={"Add Task"}
                onAddButtonClick={() => navigate(`/projects/tasks/add/${id}`)}
            />
            <DataTable
                headings={headings}
                contents={contents}
                actions={actions}
                totalPages={pageCount}
                currentPage={currentPage}
                onPageClick={handlePageClick}
                onEditClick={handleOnEditClick}
                onDeleteClick={handleOnDeleteClick}
                errorProps={{
                  name: "No Tasks Found",
                  description: "You haven't added any tasks yet. Create a new task to get started.",
                }}
            />

            <div className="my-8">
              <Header
                  title={`Inventories ( ${projectName} )`}
                  category={`All inventories related to the ${projectName}`}
                  buttonTitle={"Add Inventory To Project"}
                  onAddButtonClick={() => console.log('button add')}
              />
            </div>

            <AlertDialog
                open={open}
                onConfirm={deleteTaskCategory}
                onDismiss={() => setOpen(false)}
                title={"Delete Project"}
                description={"Are you sure you want to delete this task? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />
          </div>
      )


  );
};

export default Task;
