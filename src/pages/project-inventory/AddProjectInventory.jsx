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
import {
    ADD_PROJECT_QUERY,
    GET_ALL_PROJECTS,
    GET_ALL_TASKS_AND_INVENTORIES_BY_PROJECT_ID
} from "../../graphql/query/projectQueries";
import {AppConstants} from "../../utils/Constants";
import {InventoryStatusWithStatus} from "../../utils/ProjectInventoryStatus";
import {
    ADD_PROJECT_INVENTORY,
    GET_INVENTORY_DATA_BY_SCIT,
    GET_PROJECT_NAMES
} from "../../graphql/query/projectInventoryQueries";
import AppDropdown from "../../components/AppDropdown";
import {AppCheckBox} from "../../components/AppCheckBox";
import {
    GET_ALL_INVENTORIES_BY_MANUFACTURER_AND_MODEL_TYPE, GET_ALL_INVENTORIES_BY_MODEL_TYPE,
    GET_ALL_INVENTORIES_BY_SCIT
} from "../../graphql/query/inventoryHistoryQueries";
import BackButton from "../../components/BackButton";

const AddProjectInventory = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const {role} = useAuth()
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const [inventoryId, setInventoryId] = useState(null)
    const [inventory, setInventory] = useState(null);
    const [inventoryError, setInventoryError] = useState("");

    const [totalQuantity, setTotalQuantity] = useState("");
    const [totalQuantityError, setTotalQuantityError] = useState("");

    const [manufacturer, setManufacturer] = useState(null);
    const [manufacturerError, setManufacturerError] = useState("");

    const [modelType, setModelType] = useState(null);
    const [modelTypeError, setModelTypeError] = useState("")

    const [inventories, setInventories] = useState([]);
    const [modelTypes, setModelTypes] = useState([]);

    const [getInventories] = useLazyQuery(GET_ALL_INVENTORIES_BY_SCIT, {
        onCompleted: data => {
            setInventories(data.inventories)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const [getAllInventoriesByManufacturerAndModelType] = useLazyQuery(GET_ALL_INVENTORIES_BY_MANUFACTURER_AND_MODEL_TYPE, {
        onCompleted: data => {
            setInventories(data.inventories)
        },
        onError : (error) => {
            console.log(error)
        }
    })

    const [getAllInventoriesByModelType] = useLazyQuery(GET_ALL_INVENTORIES_BY_MODEL_TYPE, {
        onCompleted: data => {
            setModelTypes(data.inventories)
        },
        onError : (error) => {
            console.log(error)
        }
    })

    useEffect(() => {
        if (manufacturer) console.log(manufacturer)
        if (modelType) console.log(modelType)
    }, [manufacturer,modelType]);

    const [addProjectInventory] = useMutation(ADD_PROJECT_INVENTORY, {
        refetchQueries: [{query: GET_ALL_TASKS_AND_INVENTORIES_BY_PROJECT_ID}],
        fetchPolicy: "network-only",
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                console.log(data)
                if (data.project_assigned_inventory_to_project.success == true) {
                    toast.success("Added project inventory successfully!")
                    navigate(-1)
                } else toast.error(data.project_assigned_inventory_to_project.message)
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

        // Validate Inventory field
        if (manufacturer == null) {
            setManufacturerError("Manufacturer is required.");
            valid = false;
        } else {
            setManufacturerError("");
        }

        if (modelType == null) {
            setModelTypeError("Model Type is required.");
            valid = false;
        } else {
            setModelTypeError("");
        }

        // Validate Total Quantity field
        if (!totalQuantity || isNaN(totalQuantity)) {
            setTotalQuantityError("Total Quantity must be a valid number.");
            valid = false;
        } else {
            setTotalQuantityError("");
        }

        return valid;
    };

    // Handle form validation on button click
    const handleSubmit = () => {

        // Submit form if valid
        if (validateForm()) {
            const variables = {
                project_id: id,
                inventory_id: inventoryId,
                total_qty: Number(totalQuantity)
            }
            console.log(variables)
            setLoading(true)
            addProjectInventory({
                variables: variables
            })
        }
    };

    const handleOnInventoryChange = (query) => {
        getInventories({
            variables: {controlNumber: `${query}%`}
        })
    }

    const handleOnManufacturerChange = (query) => {
        setInventories([])
        const variables = {manufacturer: `${query}%`, modelType: `${modelType}%`};
        console.log(variables)
        getAllInventoriesByManufacturerAndModelType({
            variables: variables
        });
    }

    const handleOnModelTypeChange = (query) => {
        setInventories([])
        const variables = {modelType: `${query}%`, manufacturer: `${manufacturer}%`};
        console.log(variables)
        getAllInventoriesByModelType({
            variables: variables
        });
    }

    return (

        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <BackButton onBackClick={() => navigate(-1)} />
            <Header
                title={"Add Project Inventory"}
                category="Pages"
                showAddButton={false}
            />

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">

                    {/* Inventory (with suggestions) */}
                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Manufacturer *"
                        placeholder="Select or Enter Manufacturer"
                        value={inventory}
                        suggestions={inventories.map(inventory => inventory.inventory_category.manufacturer)}
                        onChange={(value) => {
                            const inventoryItem = inventories?.find(
                                item => item.inventory_category.manufacturer === value
                            );
                            console.log('modelType: ',modelType, inventoryItem)
                            if (modelType != null) setInventoryId(inventoryItem?.id)
                            setManufacturer(value)
                        }}
                        onValueChange={handleOnManufacturerChange}
                        error={manufacturerError}
                    />

                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Model Type *"
                        placeholder="Select or Enter Model Type"
                        value={inventory}
                        suggestions={modelTypes.map(inventory => inventory.inventory_category.model_type)}
                        onChange={(value) => {
                            console.log(modelTypes.map((item) => item.inventory_category.model_type))
                            console.log(`value: ${value}`)

                            const inventoryItem = modelTypes?.find(
                                item => item.inventory_category.model_type === value
                            );
                            console.log('manufacturer: ',manufacturer, inventoryItem)
                            if (manufacturer != null) setInventoryId(inventoryItem?.id)
                            setModelType(value)
                        }}
                        onValueChange={handleOnModelTypeChange}
                        error={modelTypeError}
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

                    {/* Submit Button */}
                    <button
                        className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default AddProjectInventory;