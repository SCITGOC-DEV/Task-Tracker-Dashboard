import {gql} from "@apollo/client";

export const GET_PROJECT_INVENTORIES = gql`
  query MyQuery($limit: Int!, $offset: Int!) {
    project_inventories(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
      id
      project {
        project_name
        percentage
      }
      inventory {
        admin_name
        email_address
        country
        contact_number
        address
        quantity
        scit_control_number
        serial_number_start
      }
    }
    total: project_inventories_aggregate {
    aggregate {
      count
    }
  }
  }
`;

export const GET_PROJECT_INVENTORY_BY_ID = gql`
  query MyQuery($id: Int!) {
    project_inventories( order_by: {created_at: desc}, where: {id: { _eq: $id }}) {
      id
      project {
        project_name
        percentage
        id
      }
      inventory {
        admin_name
        email_address
        country
        contact_number
        address
        quantity
        scit_control_number
        serial_number_start
      }
      total_qty
    used_qty
    status
    is_return
    inventory_id
    }
    total: project_inventories_aggregate {
    aggregate {
      count
    }
  }
  }
`;

export const GET_PROJECT_NAMES = gql`
query MyQuery ($query: String!) {
  projects(limit: 5, where: {project_name: {_ilike: $query}}) {
    project_name
    id
  }
}
`

export const GET_INVENTORY_DATA_BY_SCIT = gql `
query MyQuery($query: String!) {
  project_inventories(limit: 5, where: {inventory: {scit_control_number: {_ilike: $query}}}) {
    inventory {
      scit_control_number
    }
    inventory_id
  }
}`

export const ADD_PROJECT_INVENTORY = gql`
mutation MyMutation(
  $project_id: Int!, 
  $inventory_id: Int!, 
  $total_qty: Int!, 
  $used_qty: Int!, 
  $status: String!, 
  $is_return: Boolean!
) {
  insert_project_inventories(objects: {
    project_id: $project_id, 
    inventory_id: $inventory_id, 
    total_qty: $total_qty, 
    used_qty: $used_qty, 
    status: $status, 
    is_return: $is_return
  }) {
    affected_rows
  }
}`

export  const UPDATE_PROJECT_INVENTORY_BY_ID = gql `
mutation MyMutation(
  $id: Int!,
  $inventory_id: Int!,
  $project_id: Int!,
  $status: String!,
  $total_qty: Int!,
  $used_qty: Int!
) {
  update_project_inventories(
    where: { id: { _eq: $id } },
    _set: {
      inventory_id: $inventory_id,
      project_id: $project_id,
      status: $status,
      total_qty: $total_qty,
      used_qty: $used_qty
    }
  ) {
    affected_rows
  }
}`

export const DELETE_PROJECT_INVENTORY = gql `
mutation MyMutation($id: Int!) {
  delete_project_inventories(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`