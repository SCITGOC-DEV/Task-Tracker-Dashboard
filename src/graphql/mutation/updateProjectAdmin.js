import {gql} from "@apollo/client";

export const UPDATE_PROJECT_ADMIN = gql`
mutation MyMutation($id: Int!, $username: String!, $email: String!, $address: String!) {
  update_admin(
    where: {id: {_eq: $id}}, 
    _set: {
      role: "projectadmin", 
      username: $username, 
      email: $email, 
      address: $address,
    }
  ) {
    affected_rows
  }
}
`

export const UPDATE_PROJECT_ADMIN_PASSWORD = gql `
mutation MyMutation($newPassword: String!, $userName: String!) {
  response: project_admin_reset_password(new_password: $newPassword, user_name: $userName) {
    message
    success
  }
}`

export const DELETE_PROJECT_ADMIN = gql `
mutation MyMutation($id: Int!) {
  delete_admin(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`

export const ASSIGN_PROJECT_TO_PROJECT_ADMIN = gql `
mutation MyMutation($assigned_to: String!, $project_id: Int!, $percentage: numeric!, $end_date: timestamptz!, $remark: String!, $start_date: timestamptz!, $status: String!) {
  response: project_add_assigned_project(
    assigned_to: $assigned_to, 
    project_id: $project_id, 
    percentage: $percentage, 
    end_date: $end_date, 
    remark: $remark, 
    start_date: $start_date, 
    status: $status
  ) {
    message
    success
  }
}`