import { gql } from "@apollo/client";

export const getAllUsers = gql`
  query MyQuery($offset: Int, $limit: Int) {
    users(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      email
      id
      password
      phone
      updated_at
      username
      created_at
      address
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const getUsersByName = gql`
query MyQuery($username: String, $limit: Int) {
  users(order_by: {created_at: desc}, limit: $limit, where: {username: {_ilike: $username}}) {
    id
    username
    email
  }
}
`

export const ASSIGN_TASK_TO_USER = gql `
mutation MyMutation($end_date_time: timestamptz!, $fk_assigned_to: String!, $start_date_time: timestamptz!, $task_id: Int!, $percentage: numeric!) {
  task_create_assigned_task(
    end_date_time: $end_date_time,
    fk_assigned_to: $fk_assigned_to,
    start_date_time: $start_date_time,
    task_id: $task_id,
    percentage: $percentage
  ) {
    message
    success
  }
}`
