import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, PasswordTextField, TextField, Textarea } from "../components";

const AddUser = () => {
  const { currentColor } = useStateContext();
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
      <Header title={"Add User"} category="Pages" />
      <Link
        to={"/users"}
        className="inline-block p-3 rounded-lg mb-4 text-white hover:opacity-95"
        style={{ background: currentColor }}
      >
        Back
      </Link>
      <div className="w-full flex flex-col justify-center items-center">
        <form className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg bg-white dark:shadow-sm shadow-lg sm:p-10 p-5 rounded-lg">
          <div className="mb-4">
            <h3 className="text-lg mb-1">Name</h3>
            <TextField placeholder="Name" fullWidth />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Email</h3>
            <TextField type="email" placeholder="Email" fullWidth />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Phone</h3>
            <TextField placeholder="Phone" fullWidth />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Password</h3>
            <PasswordTextField fullWidth />
          </div>
          <div className="mb-4">
            <h3 className="text-lg mb-1">Address</h3>
            <Textarea placeholder="Address" fullWidth />
          </div>
          <Button style={{ background: currentColor }} fullWidth size="large">
            {false ? "Please Wait..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
