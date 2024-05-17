import { gql } from "@apollo/client";

export const changeUserPassword = gql`
  mutation MyMutation(
    $username: String!
    $newPassword: String!
    $oldPassword: String!
  ) {
    userChangePassword(
      newPassword: $newPassword
      oldPassword: $oldPassword
      user_name: $username
    ) {
      message
      error
    }
  }
`;
