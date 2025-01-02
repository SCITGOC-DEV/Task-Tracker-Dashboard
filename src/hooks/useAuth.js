import * as jose from "jose";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  ACCESS_TOKEN,
  IS_LOGGED_IN_KEY,
  IS_LOGGED_IN_VALUE,
} from "../config/app";
import { IS_CLIENT } from "../config/common";
const useAuth = () => {
  const navigate = useNavigate();
  const hasLoggedInCookie = () => {
    const isLoggedInCookie = Cookies.get(IS_LOGGED_IN_KEY);
    return Boolean(isLoggedInCookie) && isLoggedInCookie === IS_LOGGED_IN_VALUE;
  };
  const isUser = hasLoggedInCookie();

  function getRole () {
    const token = window.localStorage.getItem(ACCESS_TOKEN)
        ? window.localStorage.getItem(ACCESS_TOKEN)
        : null;
      if (token) {
        const user = jose.decodeJwt(token);
        //console.log(JSON.stringify(user["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"][0]));
        const role = user["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"][0];
        return role
      } else return null
  }

  function getUser () {
    const token = window.localStorage.getItem(ACCESS_TOKEN)
        ? window.localStorage.getItem(ACCESS_TOKEN)
        : null;
    if (token) {
      const user = jose.decodeJwt(token);
      //const role = user["https://hasura.io/jwt/claims"]["x-hasura-default-role"];
      return user.user_name
    } else return null
  }

  function getUserData() {
    if (isUser) {
      const token = window.localStorage.getItem(ACCESS_TOKEN)
        ? window.localStorage.getItem(ACCESS_TOKEN)
        : null;
      if (token) {
        const user = jose.decodeJwt(token);
        //const role = user["https://hasura.io/jwt/claims"]["x-hasura-default-role"];
        return user.user_id;
        // if (role === "admin") {
        //   return user.user_id;
        // } else {
        //   return null;
        // }
      } else {
        return null;
      }
    }
  }
  const logout = () => {
    Cookies.remove(IS_LOGGED_IN_KEY);
    IS_CLIENT && window.localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login");
  };

  return {
    userId: isUser ? getUserData() : null,
    role: getRole(),
    userName: getUser(),
    logout,
  };
};

export default useAuth;
