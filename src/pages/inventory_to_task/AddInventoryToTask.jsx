import React, {useEffect, useState} from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button, Header, TextField } from "../../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import PageRoutes from "../../utils/PageRoutes";
import { toast } from "react-toastify";
import {useLazyQuery, useMutation} from "@apollo/client";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { ActivityIndicator } from "react-native-web";
import {
    addInventoryCategory,
    ASSIGN_INVENTORY_TO_TASK, GET_ALL_USER_NAMES_BY_NAME,
    getAllInventoryCategories
} from "../../graphql/query/inventoryCategoryQueries";
import {InputFieldWithSuggestion} from "../../components/TextFieldWithSuggestions";
import {
    GET_ALL_INVENTORIES_BY_SCIT,
    GET_ALL_PROJECT_NAMES, GET_ALL_TASK_NAMES_BY_NAME,
    GET_SCIT_CONTROL_NUMBER_BY_NAME
} from "../../graphql/query/inventoryHistoryQueries";
import AppDropdown from "../../components/AppDropdown";
import {GET_PROJECT_NAMES} from "../../graphql/query/projectInventoryQueries";
import {InputWithError} from "../../components/InputWithError";
import {InputButton} from "../../components/InnputButton";

const AddInventoryToTask = () => {
    const { currentColor } = useStateContext();
    const {id,taskId} = useParams()
    console.log(id)
    const today = new Date().toISOString()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [projects,setProjects] = useState([])
    const [projectName, setProjectName] = useState("Select the project");
    const [projectId, setProjectId] = useState(null)

    const [inventories, setInventories] = useState([])
    const [inventoryName, setInventoryName] = useState("");
    const [inventoryId, setInventoryId] = useState(null)

    const [tasks, setTasks] = useState([])

    const [quantity, setQuantity] = useState(null)
    const [remark, setRemark] = useState(null)
    const [totalQuantity, setTotalQuantity] = useState(null)
    const [rentDate, setRentDate] = useState(null)
    const [requestDate, setRequestDate] = useState(null)
    const [returnDate, setReturnDate] = useState(null)

    const [userNames, setUserNames] = useState([])
    const [requestUserName, setRequestUserName] = useState(null)

    const [error, setErrors] = useState({
        projectId: '',
        inventoryId: '',
        quantity: '',
        rentDate: '',
        totalQuantity: '',
        requestDate: '',
        requestUserName: '',
        returnDate: '',
        taskId: ''
    })

    const [assignInventoryToTask] = useMutation(ASSIGN_INVENTORY_TO_TASK, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                console.log(data)
                if (data.AssignedInventoryToTask.success = true) {
                    navigate(PageRoutes.InventoryCategory);
                    toast.success("Inventory has been added Successfully!");
                } else  {
                    toast.error(data.AssignedInventoryToTask.message)
                }
            }, 500)
        },
        onError: (error) => {
            setLoading(false)
            console.log(error.message)
            toast.error(error.message);
        },
    });

    const [getProjectNames] = useLazyQuery(GET_ALL_PROJECT_NAMES, {
        onCompleted: data => {
            setProjects(data.projects)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [getAllUserNamesByName] = useLazyQuery(GET_ALL_USER_NAMES_BY_NAME, {
        onCompleted: data => {
            setUserNames(data.users)
        }
    })

    const [getAllInventoriesByScit] = useLazyQuery(GET_ALL_INVENTORIES_BY_SCIT, {
        onCompleted: data => {
            setInventories(data.project_inventories)
        }
    })

    const [getAllTaskNamesByName] = useLazyQuery(GET_ALL_TASK_NAMES_BY_NAME, {
        onCompleted: data => {
            setTasks(data.tasks)
        }
    })

    const validateForm = () => {
        const newErrors = {};

        if (!inventoryId) newErrors.inventoryId = 'Inventory ID is required';
        if (!totalQuantity || totalQuantity <= 0) newErrors.totalQuantity = 'Total quantity must be a positive number';
        //if (!rentDate) newErrors.rentDate = 'Rent date is required';
        //if (!requestDate) newErrors.requestDate = 'Request date is required';
        if (!requestUserName) newErrors.requestUserName = 'Request user name is required';

        // Add additional validation rules as necessary for your fields

        setErrors(newErrors);

        console.log(newErrors)
        // Return whether the form is valid
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        getProjectNames()
    }, []);

    const handleOnInventoryQueryChange = (query) => {
        getAllInventoriesByScit({variables: {project_id: id, query: `${query}%`}})
    }

    const handleOnTaskQueryChange = (query) => {
        getAllTaskNamesByName({variables: {query: `${query}%`}})
    }

    const handleOnUserQueryChange = (query) => {
        getAllUserNamesByName({variables: {query: `${query}%`}})
    }

    const handleSubmit = () => {
        const isValid = validateForm()
        console.log(isValid)
        if (isValid) {
            setLoading(true)
            const variables = {
                inventory_id: inventoryId,
                project_id: id,
                request_user_name: requestUserName,
                task_id: taskId,
                total_qty: totalQuantity,
                qty: quantity,
                remark: remark,
                rent_date: rentDate,  // Example timestamp
                request_date: requestDate, // Example timestamp
                return_date: returnDate  // Example timestamp
            };
            console.log(variables)
            assignInventoryToTask({variables: variables})
        }
    }

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Add Inventory To Task"} category="Pages" />
            <Link
                to={`/projects/tasks/task-inventories/${id}/${taskId}`}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{ background: currentColor }}
            >
                Back
            </Link>

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">

                    <InputFieldWithSuggestion
                        title={"Inventory *"}
                        value={inventoryName}
                        className="min-w-full"
                        suggestions={inventories.map(inventory => inventory.inventory.scit_control_number)}
                        onChange={(value) => {
                            const inventory = inventories.find(inventory => inventory.inventory.scit_control_number === value);
                            setInventoryId(inventory?.inventory?.id)
                            setInventoryName(value)
                        }}
                        error={error.inventoryId}
                        placeholder={"Select the inventory"}
                        onValueChange={handleOnInventoryQueryChange}/>

                    <InputWithError
                        title={"Quantity *"}
                        value={quantity}
                        onChange={(value) => setQuantity(value.target.value)}
                        error={error.quantity}
                        placeholder={"Enter Quantity"}
                    />

                    <InputWithError
                        title={"Remark"}
                        value={remark}
                        onChange={(value) => setRemark(value.target.value)}
                        placeholder={"Enter Remark"}
                    />

                    <InputButton
                        className="min-w-full"
                        title="Rent Date"
                        buttonTitle={rentDate || 'Select Rent Date'}
                        onClick={(date) => {
                            setRentDate(date);
                        }}
                        error={error.rentDate}
                    />

                    <InputButton
                        className="min-w-full"
                        title="Request Date"
                        buttonTitle={requestDate || 'Select Request Date'}
                        onClick={(date) => {
                            setRequestDate(date);
                        }}
                        error={error.requestDate}
                    />

                    <InputFieldWithSuggestion
                        title={"Request User Name *"}
                        value={requestUserName}
                        className="min-w-full"
                        suggestions={userNames.map(user => user.username)}
                        onChange={(value) => {
                            setRequestUserName(value)
                        }}
                        error={error.requestUserName}
                        placeholder={"Select user name"}
                        onValueChange={handleOnUserQueryChange}/>

                    <InputButton
                        className="min-w-full"
                        title="Return Date"
                        buttonTitle={returnDate || 'Select Return Date'}
                        onClick={(date) => {
                            setReturnDate(date);
                        }}
                        error={error.requestDate}
                    />

                    <InputWithError
                        title={"Total Quantity"}
                        value={totalQuantity}
                        onChange={(value) => setTotalQuantity(value.target.value)}
                        placeholder={"Enter Total Quantity"}
                    />

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

            export default AddInventoryToTask;