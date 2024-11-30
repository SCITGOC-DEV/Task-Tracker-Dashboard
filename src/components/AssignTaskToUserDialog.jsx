import {useEffect, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {useLazyQuery, useMutation} from "@apollo/client";
import {ASSIGN_TASK_TO_USER, getUsersByName} from "../graphql/query/getAllUsers";
import Loading from "./Loading";
import {InputButton} from "./InnputButton";
import {InputFieldWithSuggestion} from "./TextFieldWithSuggestions";
import LoadingIcon from "./LoadingIcon";
import {InputWithError} from "./InputWithError";
import {toast} from "react-toastify";
import {GET_ASSIGNED_USERS_BY_TASK_ID, GET_TASKS_BY_ID} from "../graphql/query/getTaskByID";

const testUsers = [
    { name: "Olivia Johnson", email: "olivia.johnson@example.com" },
    { name: "Ethan Smith", email: "ethan.smith@example.com" },
    { name: "Sophia Martinez", email: "sophia.martinez@example.com" },
    { name: "Liam Anderson", email: "liam.anderson@example.com" },
    { name: "Isabella Davis", email: "isabella.davis@example.com" },
]

const AssignTaskToUserDialog = ({taskId, show, onDismiss}) => {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [query,setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [percentage, setPercentage] = useState(null)

    const [error,setError] = useState({
        user: '',
        startDate: '',
        endDate: '',
        percentage: ''
    })

    const resetAllValues = () => {
        setSelectedUser(null)
        setStartDate(null)
        setEndDate(null)
        setPercentage(null)
    }

    const validateInput = () => {
        const newErrors = {
            user: '',
            startDate: '',
            endDate: '',
            percentage: '',
        };

        // Check for null or empty values
        if (!selectedUser) {
            newErrors.user = 'User is required.';
        }

        /*if (!startDate == null) {
            newErrors.startDate = 'Start date is required.';
        }

        if (endDate == null) {
            newErrors.endDate = 'End date is required.';
        }*/

        if (percentage === null || percentage === '') {
            newErrors.percentage = 'Percentage is required.';
        }

        // Set the error state if there are any validation errors
        setError(newErrors);

        // Return whether there are errors or not
        return Object.values(newErrors).every(error => error === '');
    };

    const [loadUsers] = useLazyQuery(getUsersByName, {
        onCompleted: data => {
            console.log(data.users)
            setUsers(data.users)
        },
        onError: error => {
            console.log(error.message)
        }
    })

    const [assignTaskToUser] = useMutation (ASSIGN_TASK_TO_USER, {
        refetchQueries: [{ query: GET_ASSIGNED_USERS_BY_TASK_ID, variables: {taskId} }],
        onCompleted: data => {
            console.log(data)
            setTimeout(() => {
                setLoading(false)
                if (data.task_create_assigned_task.success === true) {
                    onDismiss()
                    toast.success(data.task_create_assigned_task.message)
                    resetAllValues()
                } else toast.error(data.task_create_assigned_task.message)
            },500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    useEffect(() => {
        setSelectedUser(null)
        loadUsers({variables: {
                "username": `${query}%`,
                "limit": 5
            }})
    }, [query]);

    useEffect(() => {
        setOpen(show)
    }, [show]);

    const handleUserSelection = (user) => {
        setSelectedUser(user)
    }

    const handleAssignTaskAction = () => {
        if (validateInput()) {
            setLoading(true)
            console.log(selectedUser)
            assignTaskToUser({
                variables: {
                    fk_assigned_to: selectedUser,
                    end_date_time: endDate,
                    start_date_time: startDate,
                    task_id: taskId,
                    percentage: percentage
                }
            })
        }
    }

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white w-full text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex w-full ">
                                <div className="mt-3 text-center w-full sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-2xl text-center font-semibold  text-gray-900">
                                        Assign Task To User
                                    </DialogTitle>
                                    <div className="mt-8 w-full space-y-4 my-24">
                                        <InputFieldWithSuggestion
                                            title={"Select User"}
                                            placeholder={"Search Users"}
                                            value={selectedUser?.username}
                                            onChange={(value) => handleUserSelection(value)}
                                            suggestions={users.map((user) => user.username)}
                                            error={error.user}
                                            />

                                        <InputButton title={"Select Start Date"} onClick={(date) => setStartDate(date)} error={error.startDate}/>
                                        <InputButton title={"Select End Date"} onClick={(date) => setEndDate(date)} error={error.endDate}/>

                                        <InputWithError
                                            title="Percentage"
                                            placeholder={"Enter percentage"}
                                            value={percentage}
                                            error={error.percentage}
                                            onChange={(progress) => setPercentage(progress.target.value)}
                                            />
                                        {/*<div className="mt-6">
                                            <p className="text-base font-medium mb-4">Users</p>
                                            {users.map((user, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-center justify-between p-4 border rounded-lg mb-3 bg-gray-50 cursor-pointer hover:bg-blue-100 ${
                                                        selectedUser?.id === user.id ? 'bg-blue-200' : ''
                                                    }`} // Highlights selected user
                                                    onClick={() => handleUserSelection(user)} // Assuming you have a function to handle selection
                                                >
                                                     User Icon
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                                                />
                                                            </svg>
                                                        </div>
                                                         User Details
                                                        <div>
                                                            <p className="text-lg font-medium text-gray-800">{user.username}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>*/}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                disabled={selectedUser == null}
                                onClick={() => {
                                    handleAssignTaskAction()
                                    /*setOpen(false)
                                    onDismiss()*/
                                }}
                                className="inline-flex w-full min-w-fit justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            >
                                {
                                    loading ? <LoadingIcon/> : (<p>Assign Task</p>)
                                }
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                onClick={() => {
                                    setOpen(false)
                                    onDismiss()
                                }}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default AssignTaskToUserDialog;