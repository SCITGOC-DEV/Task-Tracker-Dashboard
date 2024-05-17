import React from "react";
import { RxCross1 } from "react-icons/rx";

import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/profile.png";
import IconButton from "./IconButton";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UserProfile = ({ admin }) => {
  const { logout } = useAuth();
  const { setIsClicked, initialState } = useStateContext();
  const handleClose = () => {
    setIsClicked(initialState);
  };
  const logoutHandler = () => {
    logout();
    setIsClicked(initialState);
  };

  return (
    <div className="nav-item absolute  shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] right-1 top-16 bg-white dark:bg-secondary-dark-bg p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <IconButton onClick={handleClose}>
          <RxCross1 className=" text-red-600" />
        </IconButton>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24 "
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {admin?.username}
          </p>
          <p className="text-white text-sm px-1 bg-red-400 rounded inline-block ">
            {admin?.role}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {admin?.email}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <Link key={index} to={item.href} onClick={handleClose}>
            <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-opacity-10 dark:hover:bg-black">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className=" text-xl rounded-lg p-3 hover:bg-light-gray"
              >
                {item.icon}
              </button>

              <div>
                <p className="font-semibold dark:text-gray-200 ">
                  {item.title}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-5">
        <Button
          onClick={logoutHandler}
          className="bg-red-400 text-white"
          size="large"
          fullWidth
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
