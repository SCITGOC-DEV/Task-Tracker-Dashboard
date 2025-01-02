import React, {useState} from "react";
import { Button, Header, PasswordTextField, TextField } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useMutation, useQuery } from "@apollo/client";
import { changeUserPassword } from "../graphql/mutation/userChangePassword";
import { useForm } from "react-hook-form";
import { getUserByID } from "../graphql/query/getUserByID";
import { Link, useActionData, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChangeUserPassword = () => {
  const { currentColor } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)
  const { data, loading: getLoading } = useQuery(getUserByID, {
    variables: {
      id,
    },
  });
  const user = data?.users_by_pk ? data?.users_by_pk : null;
  const [changePassword] = useMutation(changeUserPassword, {
    onCompleted: data1 => {
      setLoading(false)
      const response = data1.response
      if (response.success) {
        toast.success("Changed password successfully!")
        navigate(-1)
      } else toast.error(response.message)
    },
    onError: error1 => {
      console.log(error1.message)
      toast.error(error1.message)
    }
  });
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
    setLoading(true)
    changePassword({
      variables: {
        userName: username,
        newPassword: new_password,
      }
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"User Change Password"} category="Pages" showAddButton={false} />
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
              disabled={!getLoading}
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
