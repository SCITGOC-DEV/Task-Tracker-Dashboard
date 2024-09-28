import React, {useEffect, useState} from "react";
import { Header, PaginationButtons } from "../components";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import { getAllTasks } from "../graphql/query/getAllTasks";
import {Link, useNavigate} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { formatDate } from "../data/dummy";
import IconButton from "../components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { FaRegEdit } from "react-icons/fa";
import { DELETE_TASK } from "../graphql/mutation/deleteTask";
import useAuth from "../hooks/useAuth";
import {DELETE_PROJECT_INVENTORY, GET_PROJECT_INVENTORIES} from "../graphql/query/projectInventoryQueries";
import {toast} from "react-toastify";
import Loading from "../components/Loading";
import PageRoutes from "../utils/PageRoutes";
import DataTable from "../components/DataTable";
import AlertDialog from "../components/AlertDialog";
import Pagination from "../components/Pagination";
const Task = () => {
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

  const [deleteTaskById] = useMutation(DELETE_TASK, {
    refetchQueries: [
      {
        query: getAllTasks,
        variables: {},
        awaitRefetchQueries: true,
      },
    ],
    onCompleted: data => {
      setLoading(false)
      toast.success("Task has been deleted successfully!");
      loadAllProjects({
        variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
      });
    },
    onError: (error) => {
      setLoading(false)
      toast.error(error.message);
    },
  })

  const [loadAllProjects] = useLazyQuery(getAllTasks, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setTimeout(() => {
        setLoading(false);
        console.log(data)
        const result = data.tasks.map((task) => [
          task.id || "N/A",                               // Task ID
          task.task_name || "N/A",                        // Task Name
          task.fk_location_name || "N/A",                 // Location Name
          task.percentage || "N/A",                       // Percentage
          task.hardware || "N/A",                         // Hardware
          task.quantity || "N/A",                         // Quantity
          task.start_date_time || "N/A",                  // Start Date & Time
          task.end_date_time || "N/A"                     // End Date & Time
        ]);

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
    loadAllProjects({
      variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
    });
  }, [currentPage]);

  const headings = [
    "Task ID",
    "Task Name",
    "Location Name",
    "Percentage",
    "Hardware",
    "Quantity",
    "Start Date & Time",
    "End Date & Time"
  ];

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleOnEditClick = (categoryId) => {
    navigate(`/tasks/edit-task/${categoryId}`)
  }

  const handleOnDeleteClick = (id) => {
    setId(id)
    setOpen(true)
  }

  const deleteTaskCategory = () => {
    setOpen(false)
    deleteTaskById({
      variables: {
        id: id
      }
    })
  }

  return (
      loading ? (<Loading />) : (
          <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <Header title={"Tasks"} category="Pages" />
            {
              (role == "admin") ? (
                  <div className="flex flex-row justify-end">
                    <Link
                        to={PageRoutes.AddTask}
                        className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                        style={{ background: currentColor }}
                    >
                      Add Task
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
                title={"Delete Project"}
                description={"Are you sure you want to delete this task? All of your data will be permanently removed. This action cannot be undone."}
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
};

export default Task;
