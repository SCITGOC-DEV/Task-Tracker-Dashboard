import React, {useEffect, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {InputFieldWithSuggestion} from "../../components/TextFieldWithSuggestions";
import {InputButton} from "../../components/InnputButton";
import {InputWithError} from "../../components/InputWithError";
import LoadingIcon from "../../components/LoadingIcon";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_PROJECT_ADMINS_BY_NAME} from "../../graphql/query/getAllProjectAdmins";
import {ASSIGN_PROJECT_TO_PROJECT_ADMIN} from "../../graphql/mutation/updateProjectAdmin";
import {toast} from "react-toastify";
import {ProjectStatusValues} from "../../utils/ProjectStatus";
import AppDropdown from "../../components/AppDropdown";

const AssignProjectToProjectAdminDialog = ({projectId, show, onDismiss}) => {
    const [open, setOpen] = useState(false)
    const [projectAdmins, setProjectAdmins] = useState([])
    const [query, setQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState(null)
    const [percentage, setPercentage] = useState(0)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [remark, setRemark] = useState(null)
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        user: '',
        startDate: '',
        endDate: '',
        percentage: '',
    })

    const [getProjectAdmins] = useLazyQuery(GET_PROJECT_ADMINS_BY_NAME, {
        onCompleted: data => {
            setProjectAdmins(data.response)
        },
    })

    const [assignProject] = useMutation(ASSIGN_PROJECT_TO_PROJECT_ADMIN, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                onDismiss()
                const response = data.response
                if (response.success) {
                    toast.success("Assigned project successfully!")
                    resetAllValues()
                }
            },500)
        },
        onError: error => {
            setLoading(false)
            onDismiss()
            toast.error(error.message)
        }
    })

    const handleUserSelection = (user) => {
        setSelectedUser(user)
    }

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

        if (startDate == null) {
            newErrors.startDate = 'Start date is required.';
        }

        if (endDate == null) {
            newErrors.endDate = 'End date is required.';
        }

        if (percentage === null || percentage === '') {
            newErrors.percentage = 'Percentage is required.';
        }

        // Set the error state if there are any validation errors
        setError(newErrors);

        // Return whether there are errors or not
        return Object.values(newErrors).every(error => error === '');
    };

    const handleAssignProjectAction = () => {
        if (validateInput()) {
            setLoading(true)
            const variables = {
                assigned_to: selectedUser,
                project_id: projectId,
                percentage: Number(percentage),
                end_date: endDate,
                start_date: startDate,
                remark: remark,
                status: status
            }
            console.log(variables)
            assignProject({
                variables: variables
            })
        }
    }

    useEffect(() => {
        setSelectedUser(null)
        getProjectAdmins({
            variables: {
                username: `%${query}%`
            }
        })
    }, [query]);

    useEffect(() => {
        setOpen(show)
    }, [show]);

    return (
        <Dialog open={open} onClose={onDismiss} className="relative z-10">
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
                                            title={"Select Project Admin"}
                                            placeholder={"Search Project Admins"}
                                            value={selectedUser?.username}
                                            onChange={(value) => handleUserSelection(value)}
                                            suggestions={projectAdmins.map((user) => user.username)}
                                            onValueChange={(value) => setQuery(value)}
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

                                        <InputWithError
                                            title="Remark"
                                            placeholder={"Enter remark"}
                                            value={remark}
                                            error={error.percentage}
                                            onChange={(e) => setRemark(e.target.value)}
                                        />

                                        <AppDropdown
                                            title="Status"
                                            value={status}
                                            options={ProjectStatusValues}
                                            onSelected={(value) => setStatus(value)}/>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                disabled={selectedUser == null}
                                onClick={handleAssignProjectAction}
                                className="inline-flex w-full min-w-fit justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            >
                                {
                                    loading ? <LoadingIcon/> : (<p>Assign Project</p>)
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

export default AssignProjectToProjectAdminDialog;