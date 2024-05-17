import { gql } from "@apollo/client";

export const getAllTrackingTasks = gql`
  query MyQuery($offset: Int!, $limit: Int!) {
    tracking(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      created_at
      dispatch
      end_coords
      end_date_time
      fk_location_name
      fk_task_name
      fk_user_name
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
    tracking_aggregate {
      aggregate {
        count
      }
    }
  }
`;
