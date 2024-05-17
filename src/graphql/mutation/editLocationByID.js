import { gql } from "@apollo/client";

export const editLocationByID = gql`
  mutation MyMutation($id: Int!, $location_name: String!) {
    update_location_by_pk(
      pk_columns: { id: $id }
      _set: { location_name: $location_name }
    ) {
      id
    }
  }
`;
