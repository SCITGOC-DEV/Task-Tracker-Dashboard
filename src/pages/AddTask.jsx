import React from "react";
import { Button, Header, TextField } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../graphql/mutation/addTask";
import { toast } from "react-toastify";
import { getAllTasks } from "../graphql/query/getAllTasks";

const AddTask = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [addTask, { loading }] = useMutation(ADD_TASK);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      task_name: "",
    },
  });
  const onSubmit = ({ task_name }) => {
    addTask({
      variables: {
        task_name,
      },
      refetchQueries: [
        {
          query: getAllTasks,
          variables: {},
          awaitRefetchQueries: true,
        },
      ],
      onCompleted: ({ insert_task_name_one }) => {
        navigate("/tasks");
        toast.success("Task have added Successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Add Task"} category="Pages" />
      <Link
        to={"/tasks"}
        className="inline-block p-3 rounded-lg mb-4 text-white hover:opacity-95"
        style={{ background: currentColor }}
      >
        Back
      </Link>

      <div className="w-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg bg-white dark:shadow-sm shadow-lg sm:p-10 p-5 rounded-lg"
        >
          <div className="mb-4">
            <h3 className="text-lg mb-1">Task Name</h3>
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
          <Button
            style={{ background: currentColor }}
            disabled={loading || !(isValid && isDirty)}
            fullWidth
            size="large"
          >
            {loading ? "Please wait..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
