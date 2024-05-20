import React from "react";
import { Button, Header, PaginationButtons } from "../components";
import { useQuery } from "@apollo/client";
import { getAllUsers } from "../graphql/query/getAllUsers";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import { formatDate } from "../data/dummy";
import { MdOutlineVpnKey, MdOutlineEditCalendar } from "react-icons/md";

import IconButton from "../components/IconButton";
const User = () => {
  const { currentColor } = useStateContext();
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;

  const { data } = useQuery(getAllUsers, {
    variables: { offset, limit: itemsPerPage },
    fetchPolicy: "network-only",
  });

  const totalItems = data?.users_aggregate.aggregate.count;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <Header title={"Users"} category="Pages" />
      <div className="flex flex-row justify-end">
        <Link
          to={"/users/add"}
          className="inline-block p-3 rounded-lg mb-4 text-white hover:opacity-95"
          style={{ background: currentColor }}
        >
          Add User
        </Link>
        {/* <Button
          disabled={true}
          style={{ background: currentColor }}
          size="large"
          className="mb-6"
        >
          Add User
        </Button> */}
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
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-light-gray uppercase "
                    >
                      Address
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-600 divide-gray-200">
                  {Array.isArray(data?.users) &&
                    data?.users.length > 0 &&
                    data.users.map((user, index) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {++index}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {user.address}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                          <Link
                            to={`/users/change-password/${user.id}`}
                            className="mr-4"
                          >
                            <IconButton>
                              <MdOutlineVpnKey
                                size={20}
                                className="text-green-500"
                              />
                            </IconButton>
                          </Link>
                          <Link
                            to={`/users/edit-user/${user.id}`}
                            style={{ color: currentColor }}
                          >
                            <IconButton>
                              <MdOutlineEditCalendar size={20} />
                            </IconButton>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="justify-end flex">
                {currentPage === 0 && data?.users.length <= 9 ? (
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

export default User;
