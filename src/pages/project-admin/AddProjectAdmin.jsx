import BackButton from "../../components/BackButton";
import {Header} from "../../components";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {InputWithError} from "../../components/InputWithError";
import {ActivityIndicator} from "react-native-web";
import {useMutation} from "@apollo/client";
import {ADD_PROJECT_ADMIN} from "../../graphql/mutation/addProjectAdmin";
import {toast} from "react-toastify";
import {GET_ALL_PROJECTS} from "../../graphql/query/projectQueries";

const AddProjectAdmin = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [addressError, setAddressError] = useState("")

    const [addProjectAdmin] = useMutation(ADD_PROJECT_ADMIN, {
        refetchQueries: [GET_ALL_PROJECTS],
        fetchPolicy: "network-only",
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                toast.success("New project admin is created successfully.")
                navigate(-1)
            }, 400)
        },
        onError: error => {
            setLoading(false)
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

        // Check for password error
        if (!password?.trim()) {
            setPasswordError("Password is required!");
            isValid = false
        } else {
            setPasswordError(""); // Clear error if valid
        }

        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            setLoading(true)
            addProjectAdmin({
                variables: {
                    name: name,
                    email: email,
                    address: address,
                    password: password
                }
            })
        }
    }

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <BackButton onBackClick={() => navigate(-1)}/>
            <Header
                title={"Add Project Admin"}
                category="Users"
                showAddButton={false}
            />

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
                    <InputWithError
                        className="min-w-full"
                        title="Project Admin Name *"
                        placeholder="Enter project admin name"
                        value={name}
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
                    <InputWithError
                        className="min-w-full"
                        title="Password"
                        placeholder="Enter password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
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
                            'Add'
                        )}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default AddProjectAdmin;