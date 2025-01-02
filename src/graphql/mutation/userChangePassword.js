import { gql } from "@apollo/client";

export const changeUserPassword = gql`
mutation MyMutation($newPassword: String!, $userName: String!) {
  response: user_reset_password(new_password: $newPassword, user_name: $userName) {
    message
    success
  }
}
`;
