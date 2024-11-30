import React, {useEffect, useState} from "react";
import { Header, PaginationButtons } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import {useLazyQuery, useQuery} from "@apollo/client";
import { getAllTrackingTasks } from "../graphql/query/getAllTrackingTask";
import { formatDate } from "../data/dummy";
import {Link, useNavigate} from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import IconButton from "../components/IconButton";
import Loading from "../components/Loading";
import DataTable from "../components/DataTable";
import {ActionType} from "../utils/Constants";
import {MdDelete, MdModeEdit} from "react-icons/md";

const Tasks = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [allTrackingTasks, setAllTrackingTasks] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const { data } = useQuery(getAllTrackingTasks, {
    variables: { offset, limit: itemsPerPage },
  });

  const [loadAllTrackingTasks] = useLazyQuery(getAllTrackingTasks, {
    onCompleted: data => {
      setTimeout(() => {
        setLoading(false);
        setAllTrackingTasks(data.tasks)
        setTotalItems(data?.tasks_aggregate.aggregate.count)
        setPageCount(Math.ceil(data?.tasks_aggregate.aggregate.count / itemsPerPage))
      },500)
    },
    onError: (err) => {
      setLoading(false)
      toast.error(err.message)
    }
  })

  useEffect(() => {
    loadAllTrackingTasks({variables: { offset, limit: itemsPerPage }})
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const headings = [
    "ID",
    "Task Name",
    "Dispatch",
    "Start Date & Time",
    "End Date & Time",
    "Location Name",
    "User Name",
    "Quantity"
  ];

  const actions = [
    {
      type: ActionType.Icon,
      actions: [
        {
          label: "Edit",
          icon: <MdModeEdit/>,
          onClick: (id) => navigate(`/trackings/${id}`),
        }
      ]
    },
  ]

// Updated Contents for Essential Fields
  const contents = allTrackingTasks.map(task => {
    const {
      id = "N/A",
      dispatch = "N/A",
      start_date_time = "N/A",
      end_date_time = "N/A",
      fk_location_name = "N/A",
      task_name = "N/A",
      created_by = "N/A",
      quantity = "N/A",
    } = task;

    return [
      id,
      task_name,
      dispatch==true ? "Yes" : "No",
      formatDate(start_date_time), // Format the start date/time
      formatDate(end_date_time), // Format the end date/time
      fk_location_name,
      created_by,
      quantity,
    ];
  });

  if (loading) return <Loading/>

  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <Header title={"Tracking Tasks"} category="Pages" />
      <DataTable
          headings={headings}
          contents={contents}
          actions={actions}
          totalPages={pageCount}
          currentPage={currentPage}
          onPageClick={handlePageClick}
          showDetailAction={true}
          onDetailClick={(id) => navigate(`/trackings/${id}`)}
          errorProps={{
            name: "No Tasks Found",
            description: "You haven't added any tasks yet. Create a new task to get started.",
          }}
      />
    </div>
  );
};

export default Tasks;
