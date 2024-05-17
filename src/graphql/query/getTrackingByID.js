import { gql } from "@apollo/client";

export const getTrackingByID = gql`
  query MyQuery($id: Int!) {
    tracking_by_pk(id: $id) {
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
  }
`;
