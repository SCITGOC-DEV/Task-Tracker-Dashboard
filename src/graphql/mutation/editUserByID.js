import { gql } from "@apollo/client";

export const editUserByID = gql`
  mutation MyMutation(
    $id: Int!
    $address: String!
    $email: String!
    $username: String!
    $phone: String!
  ) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: {
        address: $address
        email: $email
        username: $username
        phone: $phone
      }
    ) {
      address
      email
      username
      phone
    }
  }
`;
