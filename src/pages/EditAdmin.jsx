import React from "react";
import { Button, Header, TextField, Textarea } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { getAdminByID } from "../graphql/query/getAdminByID";
import { editAdminByID } from "../graphql/mutation/editAdmin";
import { toast } from "react-toastify";

const EditAdmin = () => {
  const { currentColor } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(getAdminByID, {
    variables: {
      id,
    },
  });
  const admin = data?.admin_by_pk ? data?.admin_by_pk : null;
  const [editAdmin, { loading }] = useMutation(editAdminByID);
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
    },
  });

  React.useEffect(() => {
    setValue("username", admin?.username);
    setValue("email", admin?.email);
    setValue("address", admin?.address);
  }, [setValue, admin]);

  const onSubmit = ({ username, email, address }) => {
    editAdmin({
      variables: {
        username,
        email,
        address,
        id,
      },
      onCompleted: ({ update_admin_by_pk }) => {
        navigate("/profile");
        toast.success(update_admin_by_pk.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Edit Admin"} category="Authentication" />
      <Link
        to={"/profile"}
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

export default EditAdmin;
