import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { Header } from "../../components";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_INVENTORY_CATEGORY, getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";
import Loading from "../../components/Loading";
import PaginationButtons from "../../components/PaginationButtons";
import Pagination from "../../components/Pagination";
import { Button, Input } from "@material-tailwind/react";
import PageRoutes from "../../utils/PageRoutes";
import AlertDialog from "../../components/AlertDialog";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { GET_ALL_INVENTORY_RECORDS } from "../../graphql/query/inventoryQueries";
import { GET_ALL_INVENTORY_HISTORIES } from "../../graphql/query/inventoryHistoryQueries";
import {DELETE_PROJECT_BY_ID, GET_ALL_PROJECTS} from "../../graphql/query/projectQueries";
import TextFieldWithSuggestions, { InputFieldWithSuggestion } from "../../components/TextFieldWithSuggestions";
import { InputButton } from "../../components/InnputButton";
import { InputWithError } from "../../components/InputWithError";
import {formatDate} from "../../data/dummy";
import {ActionType} from "../../utils/Constants";
import {Md1K, MdDeck, MdDelete, MdModeEdit, MdMore} from "react-icons/md";

export function Projects() {
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
    const location = useLocation()

    const [deleteProjectById] = useMutation(DELETE_PROJECT_BY_ID, {
        refetchQueries: [
            {
                query: GET_ALL_PROJECTS,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        fetchPolicy: "network-only",
        onCompleted: data => {
            setLoading(false)
            toast.success("Task have been deleted! Successfully!");
            loadAllProjects({
                variables: { limit: itemsPerPage, offset: currentPage * itemsPerPage }
            });
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message);
        },
    })

    const [loadAllProjects] = useLazyQuery(GET_ALL_PROJECTS, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setTimeout(() => {
                setLoading(false);
                const result = data.projects.map(project => [
                    project.id || "N/A",                       // Project ID
                    project.project_name || "N/A",
                    project.created_by || "N/A",               // Created by
                    formatDate(project.actual_end_date) || "N/A",          // Actual end date
                    formatDate(project.actual_start_date) || "N/A",        // Actual start date
                    formatDate(project.end_date) || "N/A",                 // End date
                    `${project.percentage}%`,               // Percentage
                    project.project_description || "N/A",      // Project description           // Project name
                    formatDate(project.start_date) || "N/A",               // Start date
                    project.status || "N/A"                    // Status
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
    }, [currentPage,location.key]);

    const headings = [
        "Project ID",
        "Project Name",
        "Created By",
        "Actual End Date",
        "Actual Start Date",
        "End Date",
        "Percentage",
        "Project Description",
        "Start Date", 
        "Status"
      ];

    const actions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Detail",
                    icon: <MdMore/>,
                    onClick: (id) => navigate(`/projects/details/${id}`),
                },
                /*{
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
                    label: "Add Inventory To Project",
                    icon: <MdDeck/>,
                    onClick: (id) => navigate(`/projects/project-inventory/${id}`),
                },
                {
                    label: "Add Task",
                    icon: <Md1K/>,
                    onClick: (id) => navigate(`/projects/tasks/${id}`),
                }
            ]
        },*/
    ]
      
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleOnEditClick = (categoryId) => {
        //console.log(id)
        navigate(`/projects/update/${categoryId}`)
    }

    const handleOnDeleteClick = (id) => {
        setId(id)
        setOpen(true)
    }

    const deleteTaskCategory = () => {
        setOpen(false)
        deleteProjectById({
            variables: {
                id: id
            }
        })
    }

    return (

        loading ? (<Loading />) : (
            <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
                {/* Header Component */}
                <Header
                    title="Projects"
                    category="Pages"
                    showAddButton={role === "admin"}
                    buttonTitle="Add Project"
                    onAddButtonClick={() => navigate(PageRoutes.AddProject)}
                />

                {/* Data Table */}
                <DataTable
                    showDeleteOption={role === "admin"}
                    headings={headings}
                    contents={contents}
                    actions={actions}
                    totalPages={pageCount}
                    currentPage={currentPage}
                    onPageClick={handlePageClick}
                    onEditClick={handleOnEditClick}
                    onDeleteClick={handleOnDeleteClick}
                />

                {/* Alert Dialog */}
                <AlertDialog
                    open={open}
                    onConfirm={deleteTaskCategory}
                    onDismiss={() => setOpen(false)}
                    title="Delete Project"
                    description="Are you sure you want to delete this project? All of your data will be permanently removed. This action cannot be undone."
                    confirmTitle="Delete"
                    dismissTitle="Cancel"
                />
            </div>

        )
    );
}
