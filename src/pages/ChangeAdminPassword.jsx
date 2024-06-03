import React from "react";
import { Button, Header, PasswordTextField, TextField } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getAdminByID } from "../graphql/query/getAdminByID";
import { toast } from "react-toastify";
import { adminChangePassword } from "../graphql/mutation/adminChangePassword";
import useAuth from "../hooks/useAuth";

const ChangeAdminPassword = () => {
  const { currentColor } = useStateContext();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data } = useQuery(getAdminByID, {
    variables: {
      id: userId,
    },
  });
  const admin = data?.admin_by_pk ? data?.admin_by_pk : null;
  const [changePassword, { loading }] = useMutation(adminChangePassword);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      old_password: "",
      new_password: "",
    },
  });

  React.useEffect(() => {
    setValue("username", admin?.username);
  }, [setValue, admin]);

  const onSubmit = ({ old_password, new_password, username }) => {
    changePassword({
      variables: {
        oldPassword: old_password,
        newPassword: new_password,
        username,
      },
      onCompleted: ({ adminChangePassword }) => {
        if (adminChangePassword.error === 0) {
          navigate("/profile");
          toast.success(adminChangePassword.message);
        } else {
          toast.error(adminChangePassword.message);
          return;
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Change Password"} category="Authentication" />
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
              disabled={true}
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Old Password</h3>
            <PasswordTextField
              {...register("old_password", {
                required: "old_password is required field",
              })}
              disabled={loading}
              error={
                touchedFields.old_password &&
                errors.old_password &&
                Boolean(errors.old_password)
              }
              helperText={
                touchedFields.old_password &&
                errors.old_password &&
                errors.old_password.message
              }
              fullWidth
              placeholder="Old Password"
            />
          </div>
          <div className="mb-8">
            <h3 className="text-lg mb-1">New Password</h3>
            <PasswordTextField
              {...register("new_password", {
                required: "new_password is required field",
              })}
              disabled={loading}
              error={
                touchedFields.new_password &&
                errors.new_password &&
                Boolean(errors.new_password)
              }
              helperText={
                touchedFields.new_password &&
                errors.new_password &&
                errors.new_password.message
              }
              fullWidth
              placeholder="New Password"
            />
          </div>
          <Button
            disabled={loading || !(isValid && isDirty)}
            style={{ background: currentColor }}
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

export default ChangeAdminPassword;
