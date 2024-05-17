import { gql } from "@apollo/client";

export const getAdminByID = gql`
  query MyQuery($id: Int!) {
    admin_by_pk(id: $id) {
      username
      email
      address
      role
    }
  }
`;
