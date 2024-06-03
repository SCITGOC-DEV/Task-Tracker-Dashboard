import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation MyMutation($email: String!, $password: String!, $username: String!) {
    UserRegister(email: $email, password: $password, username: $username) {
      accessToken
      error
      message
    }
  }
`;
