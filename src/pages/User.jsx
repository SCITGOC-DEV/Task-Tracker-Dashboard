import React, {useEffect, useState} from "react";
import {Button, Header, PaginationButtons} from "../components";
import {useLazyQuery, useQuery} from "@apollo/client";
import {getAllUsers} from "../graphql/query/getAllUsers";
import {useStateContext} from "../contexts/ContextProvider";
import {Link, useNavigate} from "react-router-dom";
import {formatDate} from "../data/dummy";
import {MdOutlineVpnKey, MdOutlineEditCalendar, MdModeEdit, MdDelete, MdChangeCircle} from "react-icons/md";

import IconButton from "../components/IconButton";
import Loading from "../components/Loading";
import {Table} from "flowbite-react";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import AlertSnackbar from "../components/AlertSnackbar";
import AppButton from "../components/AppButton";
import PageRoutes from "../utils/PageRoutes";
import EmptyState from "../components/EmptyState";
import {ActionType} from "../utils/Constants";
import ChangePasswordDialog from "../components/ChangePasswordDialog";

const User = () => {
    const {currentColor} = useStateContext();
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = React.useState(0);
    const itemsPerPage = 10;
    const offset = currentPage * itemsPerPage;
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [totalItems, setTotalItems] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [show, setShow] = useState(false);

    const [loadUsers] = useLazyQuery(getAllUsers, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                setUsers(data.users)
                setTotalItems(data?.users_aggregate.aggregate.count)
                setPageCount(Math.ceil(data?.users_aggregate.aggregate.count / itemsPerPage))
            }, 500)
        },
        onError: error => {
            setLoading(false)
            setError(error.message)
        }
    })

    useEffect(() => {
        loadUsers({
            variables: {offset: offset, limit: itemsPerPage},
            fetchPolicy: "network-only",
        })
    }, [offset]);

    const handlePageClick = ({selected}) => {
        setCurrentPage(selected);
    };

    const headings = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Address",
        "Created Date",
    ];

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
                    label: "Change Password",
                    icon: <MdChangeCircle/>,
                    onClick: (id) => navigate(`/users/change-password/${id}`),
                }
            ]
        },
    ]

    const contents = users.map(user => {
        const {
            id = "N/A",
            username = "N/A",
            email = "N/A",
            phone = "##",
            address = "##",
            created_at = "N/A"
        } = user;

        return [
            id,
            username,
            email,
            phone,
            address,
            formatDate(created_at)
        ];
    });

    const handleOnEditClick = (id) => {
        navigate(`/users/edit-user/${id}`)
    }

    const handleOnDeleteClick = () => {

    }

    if (loading) return <Loading/>

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <Header title={"Users"} category="Pages" buttonTitle="Add User" showAddButton={true}
                    onAddButtonClick={() => navigate(PageRoutes.AddUser)}/>
            <DataTable
                headings={headings}
                contents={contents}
                actions={actions}
                totalPages={pageCount}
                currentPage={currentPage}
                onPageClick={handlePageClick}
                onEditClick={(user) => handleOnEditClick(user.id)}
                onDeleteClick={handleOnDeleteClick}
                errorProps={{
                    name: "No Users Found",
                    description: "Get started by adding new users to the system. Once added, they will appear here."
                }}
                showDeleteOption={true}/>

            <AlertSnackbar
                message={error}
                className="fixed bottom-4 right-4 z-50"  // Position bottom-right with a fixed position
            />

            <ChangePasswordDialog
                isOpen={show}
                onClose={() => setShow(false)}
                onSubmit={() => {
                }}
            />

        </div>
    );
};

export default User;
