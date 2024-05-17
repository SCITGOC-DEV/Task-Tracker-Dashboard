import { gql } from "@apollo/client";

export const DELETE_LOCATION = gql`
  mutation MyMutation($id: Int!) {
    delete_location_by_pk(id: $id) {
      id
    }
  }
`;
