import React from "react";
import { Button, Header, TextField, Textarea } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { getUserByID } from "../graphql/query/getUserByID";
import { editUserByID } from "../graphql/mutation/editUserByID";
import { getAllUsers } from "../graphql/query/getAllUsers";

const EditUser = () => {
  const { currentColor } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(getUserByID, {
    variables: {
      id,
    },
  });
  const user = data?.users_by_pk ? data?.users_by_pk : null;
  const totalItems = data?.users_aggregate.aggregate.count;
  const [editUser, { loading }] = useMutation(editUserByID);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("phone", user.phone);
      setValue("email", user.email);
      setValue("address", user.address);
    }
  }, [user, setValue]);

  const onSubmit = ({ username, email, address, phone }) => {
    editUser({
      variables: {
        username,
        email,
        address,
        phone,
        id,
      },
      refetchQueries: [
        {
          query: getAllUsers,
          variables: {
            offset: 0,
            limit: totalItems,
          },
          awaitRefetchQueries: true,
        },
      ],
      onCompleted: ({ update_users_by_pk }) => {
        navigate("/users");
        toast.success(update_users_by_pk.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Edit User"} category="Authentication" />
      <Link
        to={"/users"}
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
            <h3 className="text-lg mb-1">Username</h3>
            <TextField
              {...register("username", {
                required: "username is required field",
              })}
              placeholder="Username"
              fullWidth
              error={
                touchedFields.username &&
                errors.username &&
                Boolean(errors.username)
              }
              disabled={loading}
              helperText={
                touchedFields.username &&
                errors.username &&
                errors.username.message
              }
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Email</h3>
            <TextField
              {...register("email", {
                required: "email is required field",
              })}
              placeholder="Email"
              type="email"
              fullWidth
              error={
                touchedFields.email && errors.email && Boolean(errors.email)
              }
              disabled={loading}
              helperText={
                touchedFields.email && errors.email && errors.email.message
              }
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Phone</h3>
            <TextField
              {...register("phone", {
                required: "phone is required field",
              })}
              placeholder="Phone"
              type="phone"
              fullWidth
              error={
                touchedFields.phone && errors.phone && Boolean(errors.phone)
              }
              disabled={loading}
              helperText={
                touchedFields.phone && errors.phone && errors.phone.message
              }
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Address</h3>
            <Textarea
              {...register("address", {
                required: "address is required field",
              })}
              placeholder="Address"
              fullWidth
              error={
                touchedFields.address &&
                errors.address &&
                Boolean(errors.address)
              }
              disabled={loading}
              helperText={
                touchedFields.address &&
                errors.address &&
                errors.address.message
              }
            />
          </div>
          <Button
            disabled={loading || !(isValid && isDirty)}
            style={{ background: currentColor }}
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

export default EditUser;
