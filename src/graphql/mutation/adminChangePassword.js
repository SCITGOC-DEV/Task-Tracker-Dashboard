import { gql } from "@apollo/client";

export const adminChangePassword = gql`
  mutation MyMutation(
    $newPassword: String!
    $oldPassword: String!
    $username: String!
  ) {
    adminChangePassword(
      newPassword: $newPassword
      oldPassword: $oldPassword
      user_name: $username
    ) {
      message
      error
    }
  }
`;
