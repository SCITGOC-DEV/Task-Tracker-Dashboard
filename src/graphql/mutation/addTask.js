import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation MyMutation(
  $fk_location_name: String!,
  $fk_project_id: Int!,
  $hardware: String!,
  $note: String!,
  $percentage: Int!,
  $quantity: Int!,
  $task_name: String!,
  $start_date_time: timestamptz!,
  $end_date_time: timestamptz!,
  $dispatch: Boolean!,
  $status: String!
) {
  insert_tasks(objects: {
    fk_location_name: $fk_location_name,
    fk_project_id: $fk_project_id,
    hardware: $hardware,
    note: $note,
    task_name: $task_name,
    percentage: $percentage,
    quantity: $quantity,
    start_date_time: $start_date_time,
    end_date_time: $end_date_time,
    dispatch: $dispatch,
    status: $status
  }) {
    affected_rows
  }
}

`;
