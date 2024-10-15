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
import { addInventoryCategory, getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";
import { InputWithError } from "../../components/InputWithError";
import { InputButton } from "../../components/InnputButton";
import { InputFieldWithSuggestion } from "../../components/TextFieldWithSuggestions";
import DatePicker from "react-datepicker";
import {ProjectStatusValues} from "../../utils/ProjectStatus";
import {ADD_PROJECT_QUERY, GET_ALL_PROJECTS} from "../../graphql/query/projectQueries";
import {AppConstants} from "../../utils/Constants";
import {InventoryStatusWithStatus} from "../../utils/ProjectInventoryStatus";
import {
    ADD_PROJECT_INVENTORY,
    GET_INVENTORY_DATA_BY_SCIT, GET_PROJECT_INVENTORY_BY_ID,
    GET_PROJECT_NAMES, UPDATE_PROJECT_INVENTORY_BY_ID
} from "../../graphql/query/projectInventoryQueries";
import {AppCheckBox} from "../../components/AppCheckBox";
import AppDropdown from "../../components/AppDropdown";

const EditProjectInventory = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const {role} = useAuth()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const today = new Date().toISOString();
    const {id} = useParams();

    // State variables for fields
    const [projectId, setProjectId] = useState(null)
    const [project, setProject] = useState(null);
    const [projectError, setProjectError] = useState("");

    const [inventoryId, setInventoryId] = useState(null)
    const [inventory, setInventory] = useState(null);
    const [inventoryError, setInventoryError] = useState("");

    const [totalQuantity, setTotalQuantity] = useState("");
    const [totalQuantityError, setTotalQuantityError] = useState("");

    const [usedQuantity, setUsedQuantity] = useState("");
    const [usedQuantityError, setUsedQuantityError] = useState("");

    const [status, setStatus] = useState(InventoryStatusWithStatus[0]);
    const [formError, setFormError] = useState("");

    const [projectNames, setProjectNames] = useState([]);
    const [inventories, setInventories] = useState([]);

    const [isReturn, setIsReturn] = useState(false)

    const [getProjectInventoryById] = useLazyQuery(GET_PROJECT_INVENTORY_BY_ID, {
        onCompleted: data => {
            const inventory = data.project_inventories[0]
            setProject(inventory.project.project_name)
            setProjectId(inventory.project.id)
            setInventory(inventory.inventory.scit_control_number)
            setInventoryId(inventory.inventory.id)
            setTotalQuantity(inventory.total_qty)
            setUsedQuantity(inventory.used_qty)
            setStatus(inventory.status)
            setIsReturn(inventory.is_return)
        },
        onError: error => {
            console.log(error.message)
        }
    })

    useEffect(()=> {
        getProjectInventoryById({
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

    const [getInventories] = useLazyQuery(GET_INVENTORY_DATA_BY_SCIT, {
        onCompleted: data => {
            console.log(data.inventories.map(inventory => inventory.scit_control_number))
            setInventories(data.inventories)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [updateProjectInventory] = useMutation(UPDATE_PROJECT_INVENTORY_BY_ID, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                toast.success("Updated project inventory successfully.")
                navigate(PageRoutes.ProjectInventory)
            },[AppConstants.LOADING_DELAY])
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    // Error validation function
    const validateForm = () => {
        let valid = true;

        // Validate Project field
        if (!project) {
            setProjectError("Project is required.");
            valid = false;
        } else {
            setProjectError("");
        }

        // Validate Inventory field
        if (inventory == null) {
            setInventoryError("Inventory is required.");
            valid = false;
        } else {
            setInventoryError("");
        }

        // Validate Total Quantity field
        if (!totalQuantity || isNaN(totalQuantity)) {
            setTotalQuantityError("Total Quantity must be a valid number.");
            valid = false;
        } else {
            setTotalQuantityError("");
        }

        // Validate Used Quantity field
        if (!usedQuantity || isNaN(usedQuantity)) {
            setUsedQuantityError("Used Quantity must be a valid number.");
            valid = false;
        } else {
            setUsedQuantityError("");
        }

        // Check overall form validity
        if (!valid) {
            setFormError("Please fill in all required fields correctly.");
        } else {
            setFormError("");
        }

        return valid;
    };

    // Handle form validation on button click
    const handleSubmit = () => {

        // Submit form if valid
        if (validateForm()) {
            const variables = {
                id: id,
                project_id: projectId,
                inventory_id: inventoryId,
                total_qty: Number(totalQuantity),
                used_qty: Number(usedQuantity),
                is_return: isReturn,
                updated_at: new Date().toISOString(),
                status: status
            }
            console.log(variables)
            setLoading(true)
            updateProjectInventory({
                variables: variables
            })
        }
    };

    const handleOnProjectChange = (query) => {
        console.log(query);
        getProjectNames({
            variables: {query: `${query}%`}
        })
        setProject(query)
    }

    const handleOnInventoryChange = (query) => {
        getInventories({
            variables: {query: `${query}%`}
        })
    }

    return (

        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Update Project Inventory"} category="Pages" />
            <Link
                to={PageRoutes.ProjectInventory}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{ background: currentColor }}
            >
                Back
            </Link>

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
                    {/* Project (with suggestions) */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Project *"
                        placeholder="Select or Enter Project"
                        value={project}
                        suggestions={projectNames.map(project => project.project_name)}
                        onChange={(value) => {
                            const project = projectNames.find(item => item.project_name == value)
                            setProjectId(project?.id)
                            setProject(value)
                        }}
                        onValueChange={handleOnProjectChange}
                        error={projectError}
                    />

                    {/* Inventory (with suggestions) */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Inventory *"
                        placeholder="Select or Enter Inventory"
                        value={inventory}
                        suggestions={inventories.map(inventory => inventory.scit_control_number)}
                        onChange={(value) => {
                            const inventoryItem = inventories?.find(
                                item => item.scit_control_number === value
                            );
                            setInventoryId(inventoryItem?.id)
                            setInventory(value)
                        }}
                        onValueChange={handleOnInventoryChange}
                        error={inventoryError}
                    />

                    {/* Total Quantity */}
                    <InputWithError
                        className="min-w-full"
                        title="Total Quantity *"
                        placeholder="Enter Total Quantity"
                        value={totalQuantity}
                        onChange={(e) => setTotalQuantity(e.target.value)}
                        error={totalQuantityError}
                    />

                    {/* Used Quantity */}
                    <InputWithError
                        className="min-w-full"
                        title="Used Quantity *"
                        placeholder="Enter Used Quantity"
                        value={usedQuantity}
                        onChange={(e) => setUsedQuantity(e.target.value)}
                        error={usedQuantityError}
                    />

                    {/* Status (with suggestions) */}
                    <AppDropdown
                        title="Status"
                        value={status}
                        options={InventoryStatusWithStatus}
                        onSelected={(value) => setStatus(value)}/>

                    <AppCheckBox
                        value={isReturn}
                        title={"Is Return"}
                        onChange={(value) => setIsReturn(!isReturn)}
                        />

                    {/* Submit Button */}
                    <button
                        className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            'Update'
                        )}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default EditProjectInventory;