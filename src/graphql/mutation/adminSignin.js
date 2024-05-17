import { gql } from "@apollo/client";

export const adminSignin = gql`
  mutation MyMutation($admin_name: String!, $password: String!) {
    AdminLogIn(admin_name: $admin_name, password: $password, role: "admin") {
      accessToken
      error
      message
    }
  }
`;
