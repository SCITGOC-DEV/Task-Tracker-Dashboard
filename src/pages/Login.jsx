import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  ACCESS_TOKEN,
  IS_LOGGED_IN_KEY,
  IS_LOGGED_IN_VALUE,
} from "../config/app";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { MAX_PHONE_LENGTH, MIN_PHONE_LENGTH } from "../config/common";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, PasswordTextField, TextField } from "../components";
import logo from "../data/logo.png";
import { adminSignin } from "../graphql/mutation/adminSignin";
import AppTextField from "../components/AppTextField";
import {ActivityIndicator} from "react-native-web";
import styles from "../components/Styles";
import Dropdown from "./Dropdown";
import UserRole, { getUserRole } from "../utils/UserRole";
import isAdmin from "../utils/JwtDecoder";

const Login = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [login, { loading }] = useMutation(adminSignin);
  const [role, setRole] = useState(getUserRole(UserRole.ADMIN))

  const setAuthenticated = (accessToken) => {
    if (!accessToken) return;
    console.log(isAdmin(accessToken))
    Cookies.set(IS_LOGGED_IN_KEY, IS_LOGGED_IN_VALUE);
    window.localStorage.setItem(ACCESS_TOKEN, accessToken);
  };
  const validationSchema = Yup.object({
    username: Yup.string().required().max(255).trim(),
    password: Yup.string().required().max(255).trim(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const handleUserRoleSelected = (role) => {
    console.log(getUserRole(role))
    setRole(getUserRole(role))
  }

  const onSubmit = ({ username, password }) => {
    login({
      variables: {
        admin_name: username,
        password: password
      },
      onCompleted: ({ AdminLogIn }) => {

        setTimeout(() => {
          if (AdminLogIn.error === 0) {
            setAuthenticated(AdminLogIn.accessToken);
            navigate("/");
            toast.success("Welcome Back!");
          } else {
            toast.error(AdminLogIn.message);
          }
        }, 500);
      },  
      onError: (error) => {
        console.log(error.message.toString());
      },
    });
  };
  return (
    <div className="flex dark:bg-secondary-dark-bg bg-light-gray flex-col justify-center items-center h-screen px-4">
      <div className="bg-white sm:max-w-[400px] max-w-full w-full dark:bg-main-dark-bg p-6 rounded-lg">
        <div className="flex flex-row justify-center items-center">
          <Link to="/" className="dark:bg-transparent inline-block">
            <img src={logo} alt="logo" className="w-24 h-24 object-contain" />
          </Link>
        </div>
        <h1 className="text-2xl text-center mt-4 font-bold  dark:text-white text-black/60 uppercase">
          Welcome
        </h1>
        <p className="text-lg mb-8 text-gray-600 text-center" >
          Sign In your account
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <h4 className="mb-2 dark:text-white text-black/80">Username</h4>
            <AppTextField
              {...register("username", {
                required: "username is required field",
                maxLength: {
                  value: 255,
                  message: "username must be at most 255 characters",
                },
              })}
              inputSize={"medium"}
              fullWidth
              disabled={loading}
              placeholder={"Username"}
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
            />
          </div>
          <div className="mb-12">
            <h4 className="mb-2 dark:text-white text-black/80">Password</h4>
            <PasswordTextField
              {...register("password", {
                required: "password is required field",
              })}
              disabled={loading}
              inputSize={"medium"}
              fullWidth
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
              placeholder={"Password"}
              type="password"
            />
          </div>
          <div className="mb-4">
            <Button
                type="submit"
                className="rounded-lg"
                style={{ background: currentColor }}
                fullWidth
                size="large"
                disabled={loading || !(isValid && isDirty)}
            >
              {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                  'Submit' // Replace 'Submit' with the desired text or component
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
