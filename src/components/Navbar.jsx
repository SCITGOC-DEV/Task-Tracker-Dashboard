import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

import avatar from "../data/profile.png";
import { UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import IconButton from "./IconButton";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { getAdminByID } from "../graphql/query/getAdminByID";

const Navbar = () => {
  const { userId } = useAuth();
  const { data } = useQuery(getAdminByID, {
    variables: {
      id: userId,
    },
  });
  const admin = data?.admin_by_pk ? data?.admin_by_pk : null;
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between px-2 py-3 relative bg-white dark:bg-secondary-dark-bg">
      <IconButton onClick={handleActiveMenu}>
        <AiOutlineMenu className="w-5 h-5" style={{ color: currentColor }} />
      </IconButton>
      <div
        className="flex items-center hover:bg-black hover:bg-opacity-10 gap-2 cursor-pointer p-1  dark:hover:bg-opacity- rounded-lg"
        onClick={() => handleClick("userProfile")}
      >
        <img
          className="rounded-full w-8 h-8 "
          src={avatar}
          alt="user-profile"
        />
        <p>
          <span className="text-gray-400 text-14">Hi,</span>{" "}
          <span className="text-gray-400 font-bold ml-1 text-14">
            {admin?.username}
          </span>
        </p>
        <MdKeyboardArrowDown className="text-gray-400 text-14" />
      </div>
      {isClicked.userProfile && <UserProfile admin={admin} />}
    </div>
  );
};

export default Navbar;
