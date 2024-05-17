import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { Sidebar, Navbar, ThemeSettings } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const {
    setCurrentColor,
    setCurrentMode,
    setThemeSettings,
    activeMenu,
    themeSettings,
    currentColor,
  } = useStateContext();

  React.useEffect(() => {
    if (userId === null) {
      navigate("/login");
    }
  }, [navigate, userId]);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <button
          type="button"
          onClick={() => setThemeSettings(true)}
          style={{ background: currentColor, borderRadius: "50%" }}
          className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
        >
          <FiSettings />
        </button>
      </div>
      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
          <Navbar />
        </div>
        <div className="">
          {themeSettings && <ThemeSettings />}
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default MainLayout;
