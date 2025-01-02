import React, {useEffect, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom";
import {Header} from "../../components";
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTable";
import {formatDate} from "../../data/dummy";
import {ActionType} from "../../utils/Constants";
import {BiCheck, BiX} from "react-icons/bi";
import {toast} from "react-toastify";
import {GET_ALL_PROJECTS_ADMINS} from "../../graphql/query/getAllProjectAdmins";
import {useLazyQuery, useMutation} from "@apollo/client";
import {MdDelete, MdModeEdit} from "react-icons/md";
import AlertDialog from "../../components/AlertDialog";
import PageRoutes from "../../utils/PageRoutes";
import {DELETE_PROJECT_ADMIN} from "../../graphql/mutation/updateProjectAdmin";

const headings = [
    "ID",
    "Username",
    "Email",
    "Role",
    "Address",
    "Created At",
    "Updated At"
];

const ProjectAdmins = () => {
    const location = useLocation()
    const [contents, setContents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [open, setOpen] = useState(false)
    const [id, setId] = useState(0)

    const setContentData = (response) => {
        const contents = response.admin.map(admin => [
            admin.id || "N/A",                // ID
            admin.username || "N/A",          // Username
            admin.email || "N/A",             // Email
            admin.role || "N/A",              // Role
            admin.address || "N/A",           // Address
            formatDate(admin.created_at) || "N/A", // Created At
            formatDate(admin.updated_at) || "N/A"  // Updated At
        ]);
        setContents(contents)
    }

    const [getAllProjectAdmins] = useLazyQuery(GET_ALL_PROJECTS_ADMINS, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            console.log(data)
            setTimeout(() => {
                setLoading(false)
                setContentData(data)
                setPageCount(Math.ceil(data.total.aggregate.count / itemsPerPage));
            },500)
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [deleteProjectAdmin] = useMutation(DELETE_PROJECT_ADMIN, {
        refetchQueries: [{
            query: GET_ALL_PROJECTS_ADMINS,
            variables: {limit: itemsPerPage, offset: currentPage * itemsPerPage}
        }],
        fetchPolicy: "network-only",
        onCompleted: data => {
            setOpen(false)
            toast.success("Project admin is deleted successfully.")

            getAllProjectAdmins({variables: {limit: itemsPerPage, offset: currentPage * itemsPerPage}})
        },
        onError: (error) => {
            setOpen(false)
            toast.error(error.message)
        }
    })

    const handleOnEditClick = (id) => {
        navigate(`/project-admins/edit/${id}`)
    }

    const handleOnDeleteClick = (id) => {
        setOpen(true)
        setId(id)
    }

    const actions = [
        {
            type: ActionType.Icon,
            actions: [
                {
                    label: "Edit",
                    icon: <MdModeEdit/>,
                    onClick: (id) => handleOnEditClick(id),
                },
                {
                    label: "Delete",
                    icon: <MdDelete/>,
                    onClick: (id) => handleOnDeleteClick(id),
                }
            ]
        }
    ]

    const handlePageClick = () => {

    }

    const handleOnAddButtonClick = () => {
        navigate(PageRoutes.AddProjectAdmins)
    }

    const handleDeleteProjectAdmin = () => {
        deleteProjectAdmin({variables: {id: id}})
    }

    useEffect(() => {
        setLoading(true)
        const variables = {limit: itemsPerPage, offset: currentPage * itemsPerPage}
        getAllProjectAdmins({variables: variables})
    }, [currentPage, location.key]);

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <Header
                title="Project Admins"
                category="Users"
                showAddButton={true}
                buttonTitle="Add Project Admin"
                onAddButtonClick={handleOnAddButtonClick}
            />
            {
                loading ? <Loading/> : (
                    <DataTable
                        showDeleteOption={false}
                        headings={headings}
                        contents={contents}
                        actions={actions}
                        totalPages={pageCount}
                        currentPage={currentPage}
                        onPageClick={handlePageClick}
                        onEditClick={() => {
                        }}
                        errorProps={{
                            name: "No Project Admins Found",
                            description: "There is no project admins yet."
                        }}
                        onDeleteClick={() => {
                        }}
                    />
                )
            }
            <AlertDialog
                open={open}
                onConfirm={handleDeleteProjectAdmin}
                onDismiss={() => setOpen(false)}
                title={"Delete project admin"}
                description={"Are you sure you want to delete this project admin? All of your data will be permanently removed. This action cannot be undone."}
                confirmTitle={"Delete"}
                dismissTitle={"Cancel"}
            />
        </div>
    )
}

export default ProjectAdmins