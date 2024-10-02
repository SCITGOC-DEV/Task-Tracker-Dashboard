import React, { useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button, Header, TextField } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import PageRoutes from "../../utils/PageRoutes";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { ActivityIndicator } from "react-native-web";
import { addInventoryCategory,getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";

const AddInventoryHistory = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [addCategory] = useMutation(addInventoryCategory, {
        refetchQueries: [
            {
                query: getAllInventoryCategories,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: ({ insert_task_name_one }) => {
            setTimeout(() => {
                navigate(PageRoutes.InventoryCategory);
                toast.success("Inventory have added Successfully!");
            }, 600)
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const {
        register,
        handleSubmit,
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

    const onSubmit = ({ manufacturer, model_type, part_number, device }) => {
        setLoading(true)
        addCategory({
            variables: {
                manufacturer: manufacturer,
                model_type: model_type,
                part_number: part_number,
                device: device,
            }
        });
    };

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Add Inventory History"} category="Pages" />
            <Link
                to={PageRoutes.InventoryHistory}
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
                            <h3 className="text-lg mb-1">SCIT Control Number</h3>
                            <div>
                                <TextField
                                    {...register("scit_control_number", {
                                        required: "scit_control_number is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="SCIT Control Number"
                                    fullWidth
                                    error={
                                        touchedFields.scit_control_number &&
                                        errors.scit_control_number &&
                                        Boolean(errors.scit_control_number)
                                    }
                                    helperText={
                                        touchedFields.scit_control_number &&
                                        errors.scit_control_number &&
                                        errors.scit_control_number.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Serial Number</h3>
                            <div>
                                <TextField
                                    {...register("serial_number", {
                                        required: "serial_number is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Serial Number"
                                    fullWidth
                                    error={
                                        touchedFields.serial_number &&
                                        errors.serial_number &&
                                        Boolean(errors.serial_number)
                                    }
                                    helperText={
                                        touchedFields.serial_number &&
                                        errors.serial_number &&
                                        errors.serial_number.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Project Name</h3>
                            <div className="mb-4">
                                <TextField
                                    {...register("project_name", {
                                        required: "project_name is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Project Name"
                                    fullWidth
                                    error={
                                        touchedFields.project_name &&
                                        errors.project_name &&
                                        Boolean(errors.project_name)
                                    }
                                    helperText={
                                        touchedFields.project_name &&
                                        errors.project_name &&
                                        errors.project_name.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Task Name</h3>
                            <div className="mb-4">
                                <TextField
                                    {...register("task_name", {
                                        required: "task_name is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Task Name"
                                    fullWidth
                                    error={
                                        touchedFields.task_name &&
                                        errors.task_name &&
                                        Boolean(errors.task_name)
                                    }
                                    helperText={
                                        touchedFields.task_name &&
                                        errors.task_name &&
                                        errors.task_name.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Model Type</h3>
                            <div className="mb-4">
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
                            <h3 className="text-lg mb-1">Serial Number End</h3>
                            <div>
                                <TextField
                                    {...register("serial_number_end", {
                                        required: "serial_number_end is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Serial Number End"
                                    fullWidth
                                    error={
                                        touchedFields.serial_number_end &&
                                        errors.serial_number_end &&
                                        Boolean(errors.serial_number_end)
                                    }
                                    helperText={
                                        touchedFields.serial_number_end &&
                                        errors.serial_number_end &&
                                        errors.serial_number_end.message
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg mb-1">Serial Number Start</h3>
                            <div className="mb-4">
                                <TextField
                                    {...register("serial_number_start", {
                                        required: "serial_number_start is required field",
                                    })}
                                    disabled={loading}
                                    placeholder="Serial Number Start"
                                    fullWidth
                                    error={
                                        touchedFields.serial_number_start &&
                                        errors.serial_number_start &&
                                        Boolean(errors.serial_number_start)
                                    }
                                    helperText={
                                        touchedFields.serial_number_start &&
                                        errors.serial_number_start &&
                                        errors.serial_number_start.message
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
                                'Add'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default AddInventoryHistory;