import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, Header, TextField } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageRoutes from "../utils/PageRoutes";
import { GET_INVENTORY_CATEGORY_BY_ID, getAllInventoryCategories, UPDATE_INVENTORY_CATEGORY_BY_ID } from "../graphql/query/inventoryCategoryQueries";
import { toast } from "react-toastify";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native-web";

const UpdateInventoryCategory = (category) => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [updateCategory] = useMutation(UPDATE_INVENTORY_CATEGORY_BY_ID, {
        refetchQueries: [
            {
                query: getAllInventoryCategories,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                navigate(PageRoutes.InventoryCategory);
                toast.success("Task have updated Successfully!");
            }, 600)
        },

        onError: (error) => {
            toast.error(error.message);
        },
    });
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty, isValid, touchedFields },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            manufacturer: "",
            model_type: "",
            part_number: "",
            device: "",
        },
    });

    const [getCategoryById] = useLazyQuery(GET_INVENTORY_CATEGORY_BY_ID, {
        onCompleted: data => {
            const category = data.inventory_categories[0]
            setValue("manufacturer", category.manufacturer);
            setValue("model_type", category.model_type);
            setValue("part_number", category.part_number);
            setValue("device", category.device);
        }
    })

    useEffect(() => {
        console.log(`id: ${id}`)
        getCategoryById({
            variables: { id: id }
        })
    }, [])

    const onSubmit = ({ manufacturer, model_type, part_number, device }) => {
        setLoading(true)
        updateCategory({
            variables: {
                manufacturer: manufacturer,
                model_type: model_type,
                part_number: part_number,
                device: device,
                id: id
            }
        });
    };

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Update Inventory Category"} category="Pages" />
            <Link
                to={PageRoutes.InventoryCategory}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{ background: currentColor }}
            >
                Back
            </Link>

            <div className="w-full flex flex-col justify-center items-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg bg-white border sm:p-10 p-5 rounded-lg"
                >
                    <div className="mb-4 flex flex-col space-y-4">
                        <div>
                            <h3 className="text-lg mb-1">Manufacturer</h3>
                            <div>
                                <TextField
                                    {...register("manufacturer", {
                                        required: "manufacturer is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Manufacturer"
                                    fullWidth
                                    error={
                                        touchedFields.manufacturer &&
                                        errors.manufacturer &&
                                        Boolean(errors.manufacturer)
                                    }
                                    helperText={
                                        touchedFields.manufacturer &&
                                        errors.manufacturer &&
                                        errors.manufacturer.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Model Type</h3>
                            <div>
                                <TextField
                                    {...register("model_type", {
                                        required: "model_type is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Model Type"
                                    fullWidth
                                    error={
                                        touchedFields.model_type &&
                                        errors.model_type &&
                                        Boolean(errors.model_type)
                                    }
                                    helperText={
                                        touchedFields.model_type &&
                                        errors.model_type &&
                                        errors.model_type.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Part Number</h3>
                            <div>
                                <TextField
                                    {...register("part_number", {
                                        required: "part_number is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Part Number"
                                    fullWidth
                                    error={
                                        touchedFields.part_number &&
                                        errors.part_number &&
                                        Boolean(errors.part_number)
                                    }
                                    helperText={
                                        touchedFields.part_number &&
                                        errors.part_number &&
                                        errors.part_number.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Device</h3>
                            <div className="mb-4">
                                <TextField
                                    {...register("device", {
                                        required: "device is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Device"
                                    fullWidth
                                    error={
                                        touchedFields.device &&
                                        errors.device &&
                                        Boolean(errors.device)
                                    }
                                    helperText={
                                        touchedFields.device &&
                                        errors.device &&
                                        errors.device.message
                                    }
                                />
                            </div>
                        </div>

                        <Button
                            style={{ background: currentColor }}
                            disabled={loading || !(isValid && isDirty)}
                            fullWidth
                            className="rounded-lg"
                            size="large"
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                'Update'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default UpdateInventoryCategory;