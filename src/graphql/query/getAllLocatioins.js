import { gql } from "@apollo/client";

export const getAllLocations = gql`
  query MyQuery($offset: Int, $limit: Int) {
    location(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      location_name
      id
      created_at
      updated_at
    }
    location_aggregate {
      aggregate {
        count
      }
    }
  }
`;
