import React from "react";
import { Button, Header, PasswordTextField, TextField } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useMutation, useQuery } from "@apollo/client";
import { changeUserPassword } from "../graphql/mutation/userChangePassword";
import { useForm } from "react-hook-form";
import { getUserByID } from "../graphql/query/getUserByID";
import { useActionData, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChangeUserPassword = () => {
  const { currentColor } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading: getLoading } = useQuery(getUserByID, {
    variables: {
      id,
    },
  });
  const user = data?.users_by_pk ? data?.users_by_pk : null;
  const [changePassword, { loading }] = useMutation(changeUserPassword);
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
    setValue("username", user?.username);
  }, [user, setValue]);

  const onSubmit = ({ username, old_password, new_password }) => {
    console.log(username, old_password, new_password);
    changePassword({
      variables: {
        username,
        oldPassword: old_password,
        newPassword: new_password,
      },
      onCompleted: ({ userChangePassword }) => {
        console.log(userChangePassword);

        if (userChangePassword.error === 0) {
          navigate("/users");
          toast.success(userChangePassword.message);
        } else {
          toast.error(userChangePassword.message);
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
      <Header title={"User Change Password"} category="Pages" />
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
              disabled={!getLoading}
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
            text={loading ? "Creating..." : "Save"}
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangeUserPassword;
