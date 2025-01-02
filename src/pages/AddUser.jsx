import React, {useState} from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, PasswordTextField, TextField, Textarea } from "../components";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/mutation/registerUser";
import { useForm } from "react-hook-form";
import {toast} from "react-toastify";

const AddUser = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: data => {
      setTimeout(() => {
        setLoading(false)
        const response = data.response
        if (response.accessToken.length !== 0) toast.success("New user is created successfully.")
        else toast.error(response.message)
        navigate(-1)
      },500)
    },
    onError: error => {
      setLoading(false)
      toast.error(error.message)
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ username, password, email }) => {
    registerUser({
      variables: {
        username,
        password,
        email,
      }
    });
  };
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Add User"} category="Pages" showAddButton={false} />
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
            <h3 className="text-lg mb-1">Name</h3>
            <TextField
              {...register("username", {
                required: "username is required field",
                maxLength: {
                  value: 255,
                  message: "username must be at most 255 characters",
                },
              })}
              disabled={loading}
              error={
                touchedFields.username &&
                errors.username &&
                Boolean(errors.username)
              }
              helperText={
                touchedFields.username &&
                errors.username &&
                errors.username.message
              }
              fullWidth
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Email</h3>
            <TextField
              {...register("email", {
                required: "email is required field",
                maxLength: {
                  value: 255,
                  message: "email must be at most 255 characters",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              })}
              disabled={loading}
              error={
                touchedFields.email && errors.email && Boolean(errors.email)
              }
              helperText={
                touchedFields.email && errors.email && errors.email.message
              }
              type="email"
              placeholder="Email"
              fullWidth
            />
          </div>
          {/* <div className="mb-4">
            <h3 className="text-lg mb-1">Phone</h3>
            <TextField placeholder="Phone" fullWidth />
          </div> */}
          <div className="mb-4">
            <h3 className="text-lg mb-1">Password</h3>
            <PasswordTextField
              {...register("password", {
                required: "password is required field",
              })}
              disabled={loading}
              error={
                touchedFields.password &&
                errors.password &&
                Boolean(errors.password)
              }
              helperText={
                touchedFields.password &&
                errors.password &&
                errors.password.message
              }
              fullWidth
            />
          </div>
          {/* <div className="mb-4">
            <h3 className="text-lg mb-1">Address</h3>
            <Textarea placeholder="Address" fullWidth />
          </div> */}
          <Button
            type="submit"
            style={{ background: currentColor }}
            fullWidth
            size="large"
            disabled={loading || !(isValid && isDirty)}
          >
            {loading ? "Please Wait..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
