import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
mutation MyMutation($email: String!, $password: String!, $username: String!) {
  response: UserRegister(email: $email, password: $password, username: $username) {
    accessToken
    message
    error
  }
}
`;
