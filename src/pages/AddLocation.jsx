import React from "react";
import { Button, Header, TextField } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../graphql/mutation/addTask";
import { toast } from "react-toastify";
import { getAllTasks } from "../graphql/query/getAllTasks";
import { ADD_LOCATION } from "../graphql/mutation/addLocation";
import { getAllLocations } from "../graphql/query/getAllLocatioins";

const AddLocation = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [addLocation, { loading }] = useMutation(ADD_LOCATION);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      location_name: "",
    },
  });
  const onSubmit = ({ location_name }) => {
    addLocation({
      variables: {
        location_name,
      },
      refetchQueries: [
        {
          query: getAllLocations,
          variables: {},
          awaitRefetchQueries: true,
        },
      ],
      onCompleted: ({ location }) => {
        navigate("/locations");
        toast.success("Location have added Successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Add Location"} category="Pages" />
      <Link
        to={"/locations"}
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
            <h3 className="text-lg mb-1">Location Name</h3>
            <TextField
              {...register("location_name", {
                required: "location_name is required field",
              })}
              disabled={loading}
              placeholder="Location Name"
              fullWidth
              error={
                touchedFields.location_name &&
                errors.location_name &&
                Boolean(errors.location_name)
              }
              helperText={
                touchedFields.location_name &&
                errors.location_name &&
                errors.location_name.message
              }
            />
          </div>
          <Button
            style={{ background: currentColor }}
            disabled={loading || !(isValid && isDirty)}
            fullWidth
            size="large"
          >
            {loading ? "Creating..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
