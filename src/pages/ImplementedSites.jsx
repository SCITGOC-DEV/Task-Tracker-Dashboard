import React, {useEffect, useState} from "react";
import { Header, PaginationButtons } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { getAllLocations } from "../graphql/query/getAllLocatioins";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import { DELETE_LOCATION } from "../graphql/mutation/deleteLocation";
import { formatDate } from "../data/dummy";
import IconButton from "../components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { FaRegEdit } from "react-icons/fa";
import AppButton from "../components/AppButton";
import PageRoutes from "../utils/PageRoutes";
import {toast} from "react-toastify";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import {ActionType} from "../utils/Constants";
import {MdDelete, MdModeEdit} from "react-icons/md";

const ImplementedSites = () => {
  const { currentColor } = useStateContext();
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate()
  const offset = currentPage * itemsPerPage;
  const { data } = useQuery(getAllLocations, {
    variables: { offset, limit: itemsPerPage },
    fetchPolicy: "network-only",
  });
  /*const totalItems = data?.location_aggregate.aggregate.count;
  const pageCount = Math.ceil(totalItems / itemsPerPage);*/

  const [locations, setLocation] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = React.useState(true);

  const [loadLocations] = useLazyQuery(getAllLocations, {
    fetchPolicy: "network-only",
    onCompleted: data => {
      setTimeout(() => {
        setLoading(false);
        setLocation(data.location)
        setTotalItems(data.location_aggregate.aggregate.count)
      }, 500)
    },
    onError: error => {
      setLoading(false)
      toast.error(error.message)
    }
  })

  useEffect(() => {
    loadLocations({
      variables: { offset, limit: itemsPerPage }
    })
  }, []);

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

  const headings = [
    "ID",
    "Location Name",
    "Created At",
    "Updated At"
  ];

  const actions = [
    {
      type: ActionType.Icon,
      actions: [
        {
          label: "Edit",
          icon: <MdModeEdit/>,
          onClick: (id) => navigate(`/locations/edit-location/${id}`),
        },
        {
          label: "Delete",
          icon: <MdDelete/>,
          onClick: (id) => handleDelete(id),
        }
      ]
    },
  ]

  const contents = locations.map(location => {
    const {
      id = "N/A",
      location_name = "N/A",
      created_at = "N/A",
      updated_at = "N/A"
    } = location;

    return [
      id,
      location_name,
      formatDate(created_at), // Assuming you have a function to format dates
      formatDate(updated_at)   // Format the updated date as well
    ];
  });

  if (loading) return <Loading/>

  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <Header title={"Implemented Sites"} category="Pages" />
      <div className="flex flex-row justify-end">
        <AppButton title="Add Location" route={PageRoutes.AddLocation}/>
      </div>
      <DataTable
          headings={headings}
          contents={contents}
          actions={actions}
          onEditClick={(location) => navigate(`/locations/edit-location/${location.id}`)}
          onDeleteClick={handleDelete}
          errorProps={{
            name: "No Users Found",
            description: "Get started by adding new users to the system. Once added, they will appear here."
          }}
          showDeleteOption={true}/>
      <Pagination
          totalPages={pageCount}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
      />
    </div>
  );
};

export default ImplementedSites;
