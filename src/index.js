import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApolloProvider } from "@apollo/client";
import { ContextProvider } from "./contexts/ContextProvider";
import { apolloClient } from "./lib/apolloClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <ApolloProvider client={apolloClient}>
    <ContextProvider>
      <App />
      <ToastContainer hideProgressBar theme="light" position="top-center" />
    </ContextProvider>
    </ApolloProvider>
  </React.StrictMode>
);
