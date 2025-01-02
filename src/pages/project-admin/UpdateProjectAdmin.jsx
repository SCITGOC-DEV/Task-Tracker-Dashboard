import BackButton from "../../components/BackButton";
import {Header} from "../../components";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {InputWithError} from "../../components/InputWithError";
import {ActivityIndicator} from "react-native-web";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_PROJECT_ADMIN_DETAILS} from "../../graphql/query/getProjectAdminDetails";
import {UPDATE_PROJECT_ADMIN, UPDATE_PROJECT_ADMIN_PASSWORD} from "../../graphql/mutation/updateProjectAdmin";
import {toast} from "react-toastify";
import {GET_ALL_PROJECTS_ADMINS} from "../../graphql/query/getAllProjectAdmins";
import {FaKey} from "react-icons/fa";
import ChangeProjectAdminPasswordDialog from "./ChangeProjectAdminPasswordDialog";

const UpdateProjectAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)

    const [getProjectAdminDetails] = useLazyQuery(GET_PROJECT_ADMIN_DETAILS, {
        onCompleted: data => {
            const response = data.response
            setAddress(response.address)
            setName(response.username)
            setEmail(response.email)
        }
    })

    const [updateProjectAdmin] = useMutation(UPDATE_PROJECT_ADMIN, {
        refetchQueries: [GET_ALL_PROJECTS_ADMINS],
        fetchPolicy: "network-only",
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                toast.success("Updated project admin successfully!")
                navigate(-1)
            }, 500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    const [changeProjectAdminPassword] = useMutation(UPDATE_PROJECT_ADMIN_PASSWORD, {
        refetchQueries: [{
            query: GET_PROJECT_ADMIN_DETAILS,
            variables: {id: id}
        }],
        fetchPolicy: "network-only",
        onCompleted: data => {
            const response = data.response
            if (response.success) toast.success("Changed password successfully!")
            else toast.error(response.message)
        },
        onError: error => {
            toast.error(error.message)
        }
    })

    const validate = () => {
        let isValid = true;

        if (!name?.trim()) {
            setNameError("Name is required!");
            isValid = false
        } else {
            setNameError(""); // Clear error if valid
        }

        // Check for email error
        if (!email?.trim()) {
            setEmailError("Email is required!");
            isValid = false
        } else {
            setEmailError(""); // Clear error if valid
        }

        if (!address?.trim()) {
            setAddressError("Address is required!");
            isValid = false
        } else {
            setAddressError(""); // Clear error if valid
        }

        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            setLoading(true)
            updateProjectAdmin({
                variables: {
                    id: id,
                    username: name,
                    email: email,
                    address: address,
                }
            })
        }
    }

    useEffect(() => {
        getProjectAdminDetails({variables: {id: id}})
    }, [location.key]);

    const handleOnChangePassword = (newPassword) => {
        setChangePasswordDialogOpen(false)
        changeProjectAdminPassword({
            variables: {
                userName: name,
                newPassword: newPassword,
            }
        })
    }

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <BackButton onBackClick={() => navigate(-1)}/>
            <Header
                title={"Update Project Admin"}
                category="Users"
                showAddButton={true}
                buttonTitle="Change Password"
                onAddButtonClick={() => setChangePasswordDialogOpen(true)}
                icon={<FaKey/>}
            />
            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
                    <InputWithError
                        className="min-w-full"
                        title="Project Admin Name *"
                        placeholder="Enter project admin name"
                        value={name}
                        disabled={true}
                        onChange={(e) => setName(e.target.value)}
                        error={nameError}
                    />
                    <InputWithError
                        className="min-w-full"
                        title="Email *"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                    />
                    <InputWithError
                        className="min-w-full"
                        title="Address *"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        error={addressError}
                    />
                    <button
                        className="
                               bg-blue-500
                               mt-4
                               min-w-full
                               text-white
                               py-2
                               px-4
                               rounded
                               transition
                               duration-200
                               ease-in-out
                               hover:bg-blue-600
                               active:bg-blue-700
                               focus:outline-none
                               focus:ring-2
                               focus:ring-blue-300
                               focus:ring-offset-2
                               "
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff"/>
                        ) : (
                            'Update'
                        )}
                    </button>
                </div>
            </div>

            <ChangeProjectAdminPasswordDialog
                open={changePasswordDialogOpen}
                onClose={() => setChangePasswordDialogOpen(false)}
                onConfirm={handleOnChangePassword}
            />
        </div>
    )
}

export default UpdateProjectAdmin;