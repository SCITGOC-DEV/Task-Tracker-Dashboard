import React, {useEffect, useState} from "react";
import {useStateContext} from "../../contexts/ContextProvider";
import {Button, Header, TextField} from "../../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import PageRoutes from "../../utils/PageRoutes";
import {toast} from "react-toastify";
import {useLazyQuery, useMutation} from "@apollo/client";
import {useForm} from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import {ActivityIndicator} from "react-native-web";
import {addInventoryCategory, getAllInventoryCategories} from "../../graphql/query/inventoryCategoryQueries";
import {InputWithError} from "../../components/InputWithError";
import {InputButton} from "../../components/InnputButton";
import {InputFieldWithSuggestion} from "../../components/TextFieldWithSuggestions";
import DatePicker from "react-datepicker";
import {ProjectStatusValues} from "../../utils/ProjectStatus";
import {ADD_PROJECT_QUERY, GET_ALL_PROJECTS} from "../../graphql/query/projectQueries";
import {AppConstants} from "../../utils/Constants";
import {InventoryStatusWithStatus} from "../../utils/ProjectInventoryStatus";
import {
    ADD_PROJECT_INVENTORY,
    GET_INVENTORY_DATA_BY_SCIT,
    GET_PROJECT_NAMES
} from "../../graphql/query/projectInventoryQueries";
import {
    ADD_TASK_INVENTORY,
    GET_INVENTORY_NAMES, GET_TASK_INVENTORY_BY_ID,
    GET_TASK_NAMES,
    GET_USER_NAMES, UPDATE_TASK_INVENTORY
} from "../../graphql/query/taskInventoryQueries";

const EditTaskInventory = () => {
    const {currentColor} = useStateContext();
    const navigate = useNavigate()
    const {role} = useAuth()
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const today = new Date().toISOString();

    // State and error handling
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState(0)
    const [projectNameError, setProjectNameError] = useState('');

    const [task, setTask] = useState('');
    const [taskId, setTaskId] = useState(0)
    const [taskError, setTaskError] = useState('');

    const [inventory, setInventory] = useState('');
    const [inventoryId, setInventoryId] = useState(0)
    const [inventoryError, setInventoryError] = useState('');

    const [rentDate, setRentDate] = useState(today);
    const [rentDateError, setRentDateError] = useState('');

    const [returnDate, setReturnDate] = useState(today);
    const [returnDateError, setReturnDateError] = useState('');

    const [qty, setQty] = useState('');
    const [qtyError, setQtyError] = useState('');

    const [status, setStatus] = useState('');
    const [statusError, setStatusError] = useState('');

    const [remark, setRemark] = useState('');

    const [requestUserName, setRequestUserName] = useState('');
    const [requestUserNameError, setRequestUserNameError] = useState('');

    const [requestDate, setRequestDate] = useState(today);
    const [requestDateError, setRequestDateError] = useState('');

    const [actualRentDate, setActualRentDate] = useState(today);
    const [actualRentDateError, setActualRentDateError] = useState('');

    const [actualReturnDate, setActualReturnDate] = useState(today);
    const [actualReturnDateError, setActualReturnDateError] = useState('');

    const [projectNames, setProjectNames] = useState([]);
    const [taskNames, setTaskNames] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [userNames, setUserNames] = useState([])
    const [quantity, setQuantity] = useState(null)

    const [getTaskInventoryById] = useLazyQuery(GET_TASK_INVENTORY_BY_ID, {
        onCompleted: data => {
            const inventory = data.task_inventories[0];
            setTask(inventory.project?.task[0]?.task_name);
            setTaskId(inventory.project?.task?.id);
            setInventory(inventory.project?.project_inventory[0]?.inventory.scit_control_number);
            setInventoryId(inventory.project?.project_inventory[0]?.id);
            setStatus(inventory?.status);
            setProjectName(inventory.project?.project_name);
            setQty(inventory.qty);
            setRequestUserName(inventory?.request_user_name);
            setRemark(inventory?.remark);
            setActualRentDate(inventory?.actual_rent_date);
        }
    })

    useEffect(() => {
        getTaskInventoryById({
            variables: {id: id}
        })
    },[])

    const [getProjectNames] = useLazyQuery(GET_PROJECT_NAMES, {
        onCompleted: data => {
            console.log(data)
            setProjectNames(data.projects)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [getTaskNames] = useLazyQuery(GET_TASK_NAMES, {
        onCompleted: data => {
            console.log(data)
            setTaskNames(data.tasks)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [getInventories] = useLazyQuery(GET_INVENTORY_NAMES, {
        onCompleted: data => {
            setInventories(data.task_inventories)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [getUserNames] = useLazyQuery(GET_USER_NAMES, {
        onCompleted: data => {
            setUserNames(data.users)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [updateTaskInventory] = useMutation(UPDATE_TASK_INVENTORY, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                toast.success("Updated task inventory successfully!")
                navigate(PageRoutes.TaskInventory)
            }, [AppConstants.LOADING_DELAY])
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    // Error validation function
    // Validation
    const validateForm = () => {
        let valid = true;

        if (!projectName) {
            setProjectNameError('Project Name is required');
            valid = false;
        } else {
            setProjectNameError('');
        }

        if (!task) {
            setTaskError('Task is required');
            valid = false;
        } else {
            setTaskError('');
        }

        if (!inventory) {
            setInventoryError('Inventory is required');
            valid = false;
        } else {
            setInventoryError('');
        }

        if (!rentDate) {
            setRentDateError('Rent Date is required');
            valid = false;
        } else {
            setRentDateError('');
        }

        if (!returnDate) {
            setReturnDateError('Return Date is required');
            valid = false;
        } else {
            setReturnDateError('');
        }

        if (!qty) {
            setQtyError('Quantity is required');
            valid = false;
        } else {
            setQtyError('');
        }

        if (!status) {
            setStatusError('Status is required');
            valid = false;
        } else {
            setStatusError('');
        }

        if (!requestUserName) {
            setRequestUserNameError('Request User Name is required');
            valid = false;
        } else {
            setRequestUserNameError('');
        }

        if (!requestDate) {
            setRequestDateError('Request Date is required');
            valid = false;
        } else {
            setRequestDateError('');
        }

        if (!actualRentDate) {
            setActualRentDateError('Actual Rent Date is required');
            valid = false;
        } else {
            setActualRentDateError('');
        }

        if (!actualReturnDate) {
            setActualReturnDateError('Actual Return Date is required');
            valid = false;
        } else {
            setActualReturnDateError('');
        }

        return valid;
    };

    // Handle form validation on button click
    const handleSubmit = () => {

        // Submit form if valid
        if (validateForm()) {
            const variables = {
                id: id,
                actualRentDate: actualRentDate,
                actualReturnDate: actualReturnDate,
                inventoryId: inventoryId,
                projectId: projectId,
                qty: qty,
                remark: remark,
                rentDate: rentDate,
                requestDate: requestDate,
                requestUserName: requestUserName,
                returnDate: returnDate,
                status: status,
                taskId: taskId,
            };
            console.log(variables)
            setLoading(true)
            updateTaskInventory({
                variables: variables
            })
        }
    };

    const handleOnProjectChange = (query) => {
        getProjectNames({
            variables: {query: `${query}%`}
        })
        setProjectName(query)
    }

    const handleOnTaskNameChange = (query) => {
        getTaskNames({
            variables: {query: `${query}%`}
        })
    }

    const handleOnInventoryChange = (query) => {
        getInventories({
            variables: {query: `${query}%`}
        })
    }

    const handleOnUserNameChange = (query) => {
        getUserNames({
            variables: {query: `${query}%`}
        })
    }

    return (

        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Update Task Inventory"} category="Pages"/>
            <Link
                to={PageRoutes.TaskInventory}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{background: currentColor}}
            >
                Back
            </Link>

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
                    {/* Project Name */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Project Name *"
                        placeholder="Select or Enter Project Name"
                        value={projectName}
                        suggestions={projectNames.map(project => project.project_name)}
                        onChange={(value) => {
                            const project = projectNames.find(pj => pj.project_name == value)
                            setProjectId(project?.id)
                            setProjectName(value)
                        }}
                        onValueChange={handleOnProjectChange}
                        error={projectNameError}
                    />

                    {/* Task */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Task *"
                        placeholder="Select or Enter Task"
                        value={task}
                        suggestions={taskNames.map(task => task.task_name)}
                        onChange={(value) => {
                            const task = taskNames.find(task => task.task_name == value)
                            setTaskId(task?.id)
                            setTask(value)
                        }}
                        onValueChange={handleOnTaskNameChange}
                        error={taskError}
                    />

                    {/* Inventory */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="SCIT Control Number *"
                        placeholder="Enter scit control number"
                        value={inventory}
                        suggestions={inventories.map(iv => iv.inventory.scit_control_number)}
                        onChange={(value) => {
                            const inventory = inventories.find(iv => iv.inventory.scit_control_number.toLowerCase().trim() === value.toLowerCase().trim())
                            setInventoryId(inventory?.inventory_id)
                            setQuantity(inventory?.total_qty - inventory?.used_qty)
                            setInventory(value)
                        }}
                        onValueChange={handleOnInventoryChange}
                        error={inventoryError}
                    />

                    {/* Rent Date */}
                    <InputButton
                        className="min-w-full"
                        title="Rent Date *"
                        buttonTitle={rentDate || 'Select Rent Date'}
                        onClick={(date) => setRentDate(date)}
                        error={rentDateError}
                    />

                    {/* Return Date */}
                    <InputButton
                        className="min-w-full"
                        title="Return Date *"
                        buttonTitle={returnDate || 'Select Return Date'}
                        onClick={(date) => setReturnDate(date)}
                        error={returnDateError}
                    />

                    {/* Quantity */}
                    <InputWithError
                        className="min-w-full"
                        title="Quantity *"
                        placeholder="Enter Quantity"
                        value={qty}
                        topError={quantity && `Maximum quantity: ${quantity}`}
                        onChange={(e) => setQty(e.target.value)}
                        error={qtyError}
                    />

                    {/* Status */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Status *"
                        placeholder="Select Status"
                        value={status}
                        suggestions={ProjectStatusValues}
                        onChange={(value) => setStatus(value)}
                        error={statusError}
                    />

                    {/* Remark */}
                    <InputWithError
                        className="min-w-full"
                        title="Remark"
                        placeholder="Enter Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        error={''} // No required field error
                    />

                    {/* Request User Name */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Request User Name *"
                        placeholder="Select or Enter Request User Name"
                        value={requestUserName}
                        suggestions={userNames.map(user => user.username)}
                        onChange={(value) => setRequestUserName(value)}
                        error={requestUserNameError}
                        onValueChange={handleOnUserNameChange}
                    />

                    {/* Request Date */}
                    <InputButton
                        className="min-w-full"
                        title="Request Date *"
                        buttonTitle={requestDate || 'Select Request Date'}
                        onClick={(date) => setRequestDate(date)}
                        error={requestDateError}
                    />

                    {/* Actual Rent Date */}
                    <InputButton
                        className="min-w-full"
                        title="Actual Rent Date *"
                        buttonTitle={actualRentDate || 'Select Actual Rent Date'}
                        onClick={(date) => setActualRentDate(date)}
                        error={actualRentDateError}
                    />

                    {/* Actual Return Date */}
                    <InputButton
                        className="min-w-full"
                        title="Actual Return Date *"
                        buttonTitle={actualReturnDate || 'Select Actual Return Date'}
                        onClick={(date) => setActualReturnDate(date)}
                        error={actualReturnDateError}
                    />

                    {/* Submit Button */}
                    <button
                        className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
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
        </div>

    )
}

export default EditTaskInventory;