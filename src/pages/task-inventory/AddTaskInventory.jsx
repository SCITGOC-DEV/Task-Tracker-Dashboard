import React, {useState} from "react";
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
    GET_INVENTORY_NAMES,
    GET_TASK_NAMES,
    GET_USER_NAMES
} from "../../graphql/query/taskInventoryQueries";
import BackButton from "../../components/BackButton";
import AppDropdown, {DropDown} from "../../components/AppDropdown";

const AddTaskInventory = () => {
    const {currentColor} = useStateContext();
    const navigate = useNavigate()
    const {role} = useAuth()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const {id, taskId} = useParams()

    const today = new Date().toISOString();

    // State and error handling
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState(0)
    const [projectNameError, setProjectNameError] = useState('');

    const [task, setTask] = useState('');
    //const [taskId, setTaskId] = useState(0)
    const [taskError, setTaskError] = useState('');

    const [inventory, setInventory] = useState('');
    const [inventoryId, setInventoryId] = useState(0)
    const [inventoryError, setInventoryError] = useState('');

    const [rentDate, setRentDate] = useState(today);
    const [rentDateError, setRentDateError] = useState('');

    const [returnDate, setReturnDate] = useState(today);
    const [returnDateError, setReturnDateError] = useState('');

    const [qty, setQty] = useState(null);
    const [qtyError, setQtyError] = useState('');

    const [totalQty, setTotalQty] = useState(null);
    const [totalQtyError, setTotalQtyError] = useState('');

    const [status, setStatus] = useState('');
    const [statusError, setStatusError] = useState('');

    const [remark, setRemark] = useState('');

    const [requestUserName, setRequestUserName] = useState('');
    const [requestUserNameError, setRequestUserNameError] = useState('');

    const [requestDate, setRequestDate] = useState(today);
    const [requestDateError, setRequestDateError] = useState('');

    const [inventories, setInventories] = useState([]);
    const [userNames, setUserNames] = useState([])

    const [quantity, setQuantity] = useState(null)

    const [getInventories] = useLazyQuery(GET_INVENTORY_NAMES, {
        onCompleted: data => {
            setInventories(data.response)
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

    const [addTaskInventory] = useMutation(ADD_TASK_INVENTORY, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                const response = data.task_assigned_inventory_to_task
                if (response.success) {
                    toast.success("Added task inventory successfully!")
                    navigate(-1)
                } else toast.error(response.message)

            }, [AppConstants.LOADING_DELAY])
        },
        onError: (error) => {
            console.log(error)
            setLoading(false)
            toast.error(error.message)
        }
    })

    // Error validation function
    // Validation
    const validateForm = () => {
        let valid = true;

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

        if (!totalQty || isNaN(totalQty)) {
            setTotalQtyError('Total quantity is required');
            valid = false;
        } else {
            setTotalQtyError('');
        }

        if (totalQty > quantity) setTotalQtyError("Can't exceed than maximum quantity")
        else setTotalQtyError('')

        if (!requestDate) {
            setRequestDateError('Request Date is required');
            valid = false;
        } else {
            setRequestDateError('');
        }

        return valid;
    };

    // Handle form validation on button click
    const handleSubmit = () => {

        // Submit form if valid
        if (validateForm() === true) {
            const variables = {
                project_id: id,                        // Assuming 'id' is the project ID
                task_id: Number(taskId),                       // Assuming 'taskId' is the task ID
                inventory_id: Number(inventoryId),             // Assuming 'inventoryId' is the inventory ID
                total_qty: Number(totalQty),              // Total quantity, defaulting to 0 if not provided
                rent_date: rentDate,           // Rent date, null if not provided
                return_date: returnDate,
                request_date: requestDate,     // Request date, null if not provided
                remark: remark                 // Remark, empty string if not provided
            }
            setLoading(true)
            addTaskInventory({
                variables: variables
            })
        }
    };

    const handleOnInventoryChange = (query) => {
        const variables = {query: `%${query}%`, projectId: Number(id)}
        getInventories({
            variables: variables
        })
    }

    const handleOnUserNameChange = (query) => {
        getUserNames({
            variables: {query: `${query}%`}
        })
    }

    return (

        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <BackButton onBackClick={() => navigate(-1)} />
            <Header
                title={"Add Task Inventory"}
                category="Pages"
                showAddButton={false}
            />

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">

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

                    <InputWithError
                        className="min-w-full"
                        title="Total Quantity *"
                        placeholder="Enter Total Quantity"
                        value={totalQty}
                        topError={quantity && `Maximum quantity: ${quantity}`}
                        onChange={(e) => {
                            const q = e.target.value.replace(/[^0-9]/g, "")
                            setTotalQty(q)
                            if (q > quantity) setTotalQtyError("Can't exceed than maximum quantity")
                            else setTotalQtyError("")
                        }}
                        error={totalQtyError}
                    />

                    {/*<AppDropdown
                        title={"Status *"}
                        value={status}
                        options={ProjectStatusValues}
                        error={statusError}
                        onSelected={(value) => setStatus(value)}/>*/}

                    {/* Remark */}
                    <InputWithError
                        className="min-w-full"
                        title="Remark"
                        placeholder="Enter Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        error={''} // No required field error
                    />

                    <InputButton
                        className="min-w-full"
                        title="Return Date *"
                        buttonTitle={returnDate || 'Select Return Date'}
                        onClick={(date) => setReturnDate(date)}
                        error={returnDateError}
                    />

                    {/* Request Date */}
                    <InputButton
                        className="min-w-full"
                        title="Request Date *"
                        buttonTitle={requestDate || 'Select Request Date'}
                        onClick={(date) => setRequestDate(date)}
                        error={requestDateError}
                    />

                    {/* Submit Button */}
                    <button
                        className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
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

export default AddTaskInventory;