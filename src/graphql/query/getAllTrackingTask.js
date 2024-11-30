import { gql } from "@apollo/client";

export const getAllTrackingTasks = gql`
  query MyQuery($offset: Int!, $limit: Int!) {
    tasks(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      created_at
      dispatch
      end_coords
      end_date_time
      fk_location_name
      task_name
      created_by
      hardware
      id
      note
      permit_photo_url
      quantity
      signature_photo_url
      start_coords
      start_date_time
      updated_at
    }
    tasks_aggregate {
      aggregate {
        count
      }
    }
  }
`;
