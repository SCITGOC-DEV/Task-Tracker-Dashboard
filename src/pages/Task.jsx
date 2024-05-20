import React from "react";
import { Header, PaginationButtons } from "../components";
import { useMutation, useQuery } from "@apollo/client";
import { getAllTasks } from "../graphql/query/getAllTasks";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { formatDate } from "../data/dummy";
import IconButton from "../components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { FaRegEdit } from "react-icons/fa";
import { DELETE_TASK } from "../graphql/mutation/deleteTask";
const Task = () => {
  const { currentColor } = useStateContext();
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;

  const { data } = useQuery(getAllTasks, {
    variables: { offset, limit: itemsPerPage },
    fetchPolicy: "network-only",
  });

  const totalItems = data?.task_name_aggregate.aggregate.count;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [deleteTask] = useMutation(DELETE_TASK);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you really want to delete this Task?");
    if (confirm) {
      await deleteTask({
        variables: {
          id,
        },
        refetchQueries: [
          {
            query: getAllTasks,
            variables: {},
            awaitRefetchQueries: true,
          },
        ],
      });
    }
  };

  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <Header title={"Tasks"} category="Pages" />
      <div className="flex flex-row justify-end">
        <Link
          to={"/tasks/add"}
          className="inline-block p-3 rounded-lg mb-4 text-white hover:opacity-95"
          style={{ background: currentColor }}
        >
          Add Task
        </Link>
      </div>
      <div className="flex flex-col dark:bg-box-dark-bg bg-white rounded-lg">
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y dark:divide-gray-600 divide-gray-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      NO.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Created Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Updated Date
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-600 divide-gray-200">
                  {Array.isArray(data?.task_name) &&
                    data?.task_name.length > 0 &&
                    data.task_name.map((task, index) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {++index}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {task.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {task.task_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(task.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(task.updated_at)}
                        </td>

                        <td className="px-6 py-4 flex text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          <Link
                            to={`/tasks/edit-task/${task.id}`}
                            style={{ color: currentColor }}
                            className="mr-4"
                          >
                            <IconButton>
                              <FaRegEdit size={20} />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => handleDelete(task.id)}
                            className="text-red-600 cursor-pointer"
                          >
                            <HiOutlineTrash size={20} />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="justify-end flex">
                {data?.task_name.length <= 9 ? (
                  <></>
                ) : (
                  <PaginationButtons
                    currentPage={currentPage}
                    totalPages={pageCount}
                    handlePageClick={handlePageClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
