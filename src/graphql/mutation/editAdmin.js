import { gql } from "@apollo/client";

export const editAdminByID = gql`
  mutation MyMutation(
    $id: Int!
    $address: String!
    $email: String!
    $username: String!
  ) {
    update_admin_by_pk(
      pk_columns: { id: $id }
      _set: { address: $address, username: $username, email: $email }
    ) {
      address
      email
      username
    }
  }
`;
