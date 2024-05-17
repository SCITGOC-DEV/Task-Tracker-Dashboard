import { gql } from "@apollo/client";

export const getLocationByID = gql`
  query MyQuery($id: Int!) {
    location_by_pk(id: $id) {
      location_name
    }
  }
`;
