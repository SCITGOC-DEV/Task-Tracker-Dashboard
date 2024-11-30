import { gql } from "@apollo/client";

export const GET_ALL_TASKS_BY_PROJECT_ID = gql`
  query MyQuery($projectId: Int!, $limit: Int!, $offset: Int!) {
    projects(where: {id: {_eq: $projectId}}) {
    project_name
    task(limit: $limit, offset: $offset, order_by: {created_by: desc, updated_at: desc}) {
      id
      task_name
      fk_location_name
      percentage
      hardware
      start_date_time
      end_date_time
    }
    total:task_aggregate {
      aggregate {
        count
      }
    }
  }
  }
`;

export const GET_TASK_BY_ID = gql`
  query MyQuery($id: Int!) {
  tasks(where: {id: {_eq: $id}}) {
    id
    task_name
    fk_location_name
    percentage
    hardware
    quantity
    start_date_time
    end_date_time
    dispatch
    status
    project {
      id
      project_name
    }
  }
}
`;

export const GET_LOCATIONS = gql`
  query MyQuery($query: String) {
    location(limit: 5, where: { location_name: { _ilike: $query } }) {
      id
      location_name
    }
  }
`;

export const UPDATE_TASK_BY_ID = gql `
mutation UpdateTask(
  $id: Int!,
  $fk_location_name: String!,
  $task_name: String!,
  $hardware: String,
  $fk_project_id: Int!,
  $quantity: Int,
  $note: String,
  $start_date_time: timestamptz,
  $end_date_time: timestamptz,
  $percentage: numeric,
  $status: String,
  $actual_start_date_time: timestamptz,
  $actual_end_date_time: timestamptz,
  $dispatch: Boolean
) {
  task_update_task(
    fk_location_name: $fk_location_name,
    task_name: $task_name,
    hardware: $hardware,
    fk_project_id: $fk_project_id,
    id: $id,
    quantity: $quantity,
    note: $note,
    start_date_time: $start_date_time,
    end_date_time: $end_date_time,
    percentage: $percentage,
    status: $status,
    actual_start_date_time: $actual_start_date_time,
    actual_end_date_time: $actual_end_date_time,
    dispatch: $dispatch
  ) {
    message
    success
  }
}
`

