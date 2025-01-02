import React from "react";
import {Button, Header, TextField} from "../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider";
import {useForm} from "react-hook-form";
import {useMutation, useQuery} from "@apollo/client";
import {toast} from "react-toastify";
import {getLocationByID} from "../graphql/query/getLocationByID";
import {getAllLocations} from "../graphql/query/getAllLocatioins";
import {editLocationByID} from "../graphql/mutation/editLocationByID";

const EditLocation = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useQuery(getLocationByID, {
    variables: {
      id,
    },
  });
  const location = data?.location_by_pk ? data?.location_by_pk : null;
  const [editLocation, { loading }] = useMutation(editLocationByID);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      location_name: "",
    },
  });

  React.useEffect(() => {
    setValue("location_name", location?.location_name);
  }, [setValue, location]);
  const onSubmit = ({ location_name }) => {
    editLocation({
      variables: {
        id,
        location_name,
      },
      refetchQueries: [
        {
          query: getAllLocations,
          variables: {},
          awaitRefetchQueries: true,
        },
      ],
      onCompleted: ({ update_location_by_pk }) => {
        navigate("/locations");
        toast.success("Location have updated Successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Edit Location"} category="Pages" showAddButton={false} />
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

export default EditLocation;
