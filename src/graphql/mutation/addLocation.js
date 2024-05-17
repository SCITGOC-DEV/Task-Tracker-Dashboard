import { gql } from "@apollo/client";

export const ADD_LOCATION = gql`
  mutation MyMutation($location_name: String!) {
    insert_location_one(object: { location_name: $location_name }) {
      id
    }
  }
`;
