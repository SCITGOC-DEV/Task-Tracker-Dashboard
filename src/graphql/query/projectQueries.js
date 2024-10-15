import { gql } from "@apollo/client";

export const GET_ALL_PROJECTS = gql `
query MyQuery($offset: Int!, $limit: Int!) {
  projects(offset: $offset, limit: $limit) {
    actual_end_date
    actual_start_date
    end_date
    id
    created_by
    percentage
    project_description
    project_name
    start_date
    status
  }
  total: projects_aggregate {
    aggregate {
      count
    }
  }
}
`

export const GET_PROJECT_BY_ID = gql `
query MyQuery($id: Int!) {
  projects(where: {id: {_eq: $id}}) {
    actual_end_date
    actual_start_date
    end_date
    id
    created_by
    percentage
    project_description
    project_name
    start_date
    status
  }
}
`

export  const ADD_PROJECT_QUERY = gql `
mutation MyMutation(
  $project_name: String!,
  $project_description: String,
  $created_by: String!,
  $start_date: timestamptz!,
  $end_date: timestamptz!,
  $status: String,
  $actual_start_date: timestamptz,
  $actual_end_date: timestamptz,
  $percentage: numeric
) {
  insert_projects(objects: {
    project_name: $project_name,
    project_description: $project_description,
    created_by: $created_by,
    start_date: $start_date,
    end_date: $end_date,
    status: $status,
    actual_start_date: $actual_start_date,
    actual_end_date: $actual_end_date,
    percentage: $percentage
  }) {
    affected_rows
  }
}`

export const UPDATE_PROJECT_BY_ID = gql `
mutation MyMutation(
  $id: Int!,  # Assuming the ID is an integer
  $actual_end_date: timestamptz,
  $actual_start_date: timestamptz,
  $created_by: String,
  $end_date: timestamptz,
  $percentage: numeric,  # Assuming percentage is numeric
  $project_description: String,
  $project_name: String,
  $start_date: timestamptz,
  $status: String,
  $updated_at: timestamptz
) {
  update_projects(
    where: {id: {_eq: $id}},
    _set: {
      actual_end_date: $actual_end_date,
      actual_start_date: $actual_start_date,
      created_by: $created_by,
      end_date: $end_date,
      percentage: $percentage,
      project_description: $project_description,
      project_name: $project_name,
      start_date: $start_date,
      status: $status,
      updated_at: $updated_at,
    }
  ) {
    affected_rows
  }
}`

export const DELETE_PROJECT_BY_ID = gql `
mutation MyMutation($id: Int!) {
  delete_projects(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`