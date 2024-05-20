import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation MyMutation($email: String!, $password: String!, $username: String!) {
    UserRegister(email: "ss", password: "sss", username: "ss") {
      accessToken
      error
    }
  }
`;
