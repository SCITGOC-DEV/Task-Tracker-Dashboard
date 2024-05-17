import { gql } from "@apollo/client";

export const getUserByID = gql`
  query MyQuery($id: Int!) {
    users_by_pk(id: $id) {
      username
      email
      phone
      address
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;
