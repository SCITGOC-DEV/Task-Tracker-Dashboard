import React from "react";
import MinimalLayout from "../layout/MinimalLayout";
import { Login } from "../pages";

const AuthRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
  ],
};

export default AuthRoutes;
