import { gql } from "@apollo/client";

export const GET_ALL_PROJECTS = gql `
query MyQuery($offset: Int!, $limit: Int!) {
  projects(offset: $offset, limit: $limit, order_by: {created_at: desc, updated_at: desc}) {
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
mutation UpdateProject(
  $id: Int!
  $project_name: String!
  $project_description: String!
  $percentage: numeric!
  $end_date: timestamptz!
  $actual_start_date: timestamptz!
  $actual_end_date: timestamptz!
  $start_date: timestamptz!
  $status: String!
) {
  project_update_project(
    id: $id
    project_name: $project_name
    project_description: $project_description
    percentage: $percentage
    end_date: $end_date
    actual_start_date: $actual_start_date
    actual_end_date: $actual_end_date
    start_date: $start_date
    status: $status
  ) {
    message
    success
  }
}
`

export const DELETE_PROJECT_BY_ID = gql `
mutation MyMutation($id: Int!) {
  delete_projects(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`

export const GET_ALL_TASKS_AND_INVENTORIES_BY_PROJECT_ID = gql`
query MyQuery($id: Int!) {
  projects(where: {id: {_eq: $id}}) {
    id
    project_name
    actual_end_date
    actual_start_date
    created_at
    created_by
    end_date
    percentage
    project_description
    status
    start_date
    updated_at
    inventories: project_inventory(limit: 10, offset: 0, order_by: {created_at: desc}) {
      id
      status
      total_qty
      used_qty
      project_id
      updated_at
      inventory {
        inventory_category {
          manufacturer
          model_type
          device
        }
        part_number
      }
    }
    inventories_count: project_inventory_aggregate {
      aggregate {
        count
      }
    }
    tasks: task(limit: 5, offset: 0, order_by: {updated_at: desc, created_at: desc}) {
      id
      task_name
      fk_location_name
      percentage
      hardware
      start_date_time
      end_date_time
    }
    tasks_count: task_aggregate {
      aggregate {
        count
      }
    }
  }
}

`