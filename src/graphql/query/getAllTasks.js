import { gql } from "@apollo/client";

export const getAllTasks = gql`
  query MyQuery($limit: Int!, $offset: Int!) {
    tasks(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
      id
      task_name
      fk_location_name
      percentage
      hardware
      quantity
      start_date_time
      end_date_time
    }
    total: tasks_aggregate {
    aggregate {
      count
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
mutation MyMutation(
  $id: Int!,
  $dispatch: Boolean!,
  $endDateTime: timestamptz!,
  $locationName: String!,
  $projectId: Int!,
  $hardware: String!,
  $note: String,
  $quantity: Int!,
  $percentage: Int!,
  $startDateTime: timestamptz!,
  $status: String!,
  $taskName: String!
) {
  update_tasks(
    where: {id: {_eq: $id}}, 
    _set: {
      dispatch: $dispatch, 
      end_date_time: $endDateTime, 
      fk_location_name: $locationName, 
      fk_project_id: $projectId, 
      hardware: $hardware, 
      note: $note, 
      percentage: $percentage,
      quantity: $quantity, 
      start_date_time: $startDateTime, 
      status: $status, 
      task_name: $taskName
    }
  ) {
    affected_rows
  }
}`

