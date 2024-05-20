import { gql } from "@apollo/client";

export const getAllUsers = gql`
  query MyQuery($offset: Int, $limit: Int) {
    users(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      email
      id
      password
      phone
      updated_at
      username
      created_at
      address
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;
