import React from "react";
import { Header, PaginationButtons } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { getAllLocations } from "../graphql/query/getAllLocatioins";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_LOCATION } from "../graphql/mutation/deleteLocation";
import { formatDate } from "../data/dummy";
import IconButton from "../components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { FaRegEdit } from "react-icons/fa";

const Locations = () => {
  const { currentColor } = useStateContext();
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const { data } = useQuery(getAllLocations, {
    variables: { offset, limit: itemsPerPage },
    fetchPolicy: "network-only",
  });
  const totalItems = data?.location_aggregate.aggregate.count;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [deleteLocation] = useMutation(DELETE_LOCATION);

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Do you really want to delete this Location?"
    );
    if (confirm) {
      deleteLocation({
        variables: {
          id,
        },
        refetchQueries: [
          {
            query: getAllLocations,
            variables: {},
            awaitRefetchQueries: true,
          },
        ],
      });
    }
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <Header title={"Locations"} category="Pages" />
      <div className="flex flex-row justify-end">
        <Link
          to={"/locations/add"}
          className="inline-block p-3 rounded-lg mb-4 text-white hover:opacity-95"
          style={{ background: currentColor }}
        >
          Add Location
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
                  {Array.isArray(data?.location) &&
                    data?.location.length > 0 &&
                    data.location.map((lc, index) => (
                      <tr key={lc.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {++index}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {lc.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {lc.location_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(lc.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(lc.updated_at)}
                        </td>

                        <td className="px-6 py-4 flex text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          <Link
                            to={`/locations/edit-location/${lc.id}`}
                            style={{ color: currentColor }}
                            className="mr-4"
                          >
                            <IconButton>
                              <FaRegEdit size={20} />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => handleDelete(lc.id)}
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
                {data?.location?.length <= 9 ? (
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

export default Locations;
