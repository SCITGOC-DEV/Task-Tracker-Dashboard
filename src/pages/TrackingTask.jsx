import React from "react";
import { Header, PaginationButtons } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useQuery } from "@apollo/client";
import { getAllTrackingTasks } from "../graphql/query/getAllTrackingTask";
import { formatDate } from "../data/dummy";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import IconButton from "../components/IconButton";
const TrackingTask = () => {
  const { currentColor } = useStateContext();
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const { data } = useQuery(getAllTrackingTasks, {
    variables: { offset, limit: itemsPerPage },
  });

  const totalItems = data?.tracking_aggregate.aggregate.count;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <Header title={"Tracking Tasks"} category="Pages" />
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
                      Task Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Location Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Start Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      End Time
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
                  {Array.isArray(data?.tracking) &&
                    data?.tracking.length > 0 &&
                    data.tracking.map((tracking, index) => (
                      <tr key={tracking.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {++index}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {tracking.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {tracking.fk_user_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {tracking.fk_task_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {tracking.fk_location_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(tracking.start_date_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(tracking.end_date_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          <Link to={`/trackings/${tracking.id}`} className="">
                            <IconButton>
                              <IoEyeOutline
                                size={20}
                                style={{ color: currentColor }}
                              />
                            </IconButton>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="justify-end flex">
                {currentPage === 0 && data?.tracking.length <= 9 ? (
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

export default TrackingTask;
