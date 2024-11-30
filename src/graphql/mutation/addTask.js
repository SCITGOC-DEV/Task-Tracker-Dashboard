import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation MyMutation(
  $fk_location_name: String!,
  $fk_project_id: Int!,
  $hardware: String!,
  $note: String,
  $percentage: numeric!,
  $task_name: String!,
  $quantity: Int!,
  $start_date_time: timestamptz!,
  $end_date_time: timestamptz!,
  $dispatch: Boolean!,
  $status: String
) {
  task_create_task(
    fk_location_name: $fk_location_name,
    fk_project_id: $fk_project_id,
    hardware: $hardware,
    note: $note,
    percentage: $percentage,
    task_name: $task_name,
    quantity: $quantity,
    start_date_time: $start_date_time,
    end_date_time: $end_date_time,
    dispatch: $dispatch,
    status: $status
  ) {
    success
    message
  }
}
`;
