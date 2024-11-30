import {gql} from "@apollo/client";

export const GET_PROJECT_INVENTORIES = gql`
  query MyQuery($id: Int!, $limit: Int!, $offset: Int!) {
  projects(where: {id: {_eq: $id}}) {
    id
    project_name
    project_inventory(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
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
    total: project_inventory_aggregate {
      aggregate {
        count
      }
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
        id
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
  inventories(limit: 5, where: {scit_control_number: {_ilike: $query}}) {
    id
    scit_control_number
  }
}`

export const ADD_PROJECT_INVENTORY = gql`
mutation MyMutation($inventory_id: Int!, $project_id: Int!, $total_qty: Int!) {
  project_assigned_inventory_to_project(inventory_id: $inventory_id, project_id: $project_id, total_qty: $total_qty) {
    success
    message
  }
}`

export  const UPDATE_PROJECT_INVENTORY_BY_ID = gql `
mutation MyMutation(
  $id: Int!,
  $inventory_id: Int!,
  $project_id: Int!,
  $status: String!,
  $total_qty: Int!,
  $used_qty: Int!,
  $is_return: Boolean,
  $updated_at: timestamptz
) {
  update_project_inventories(
    where: { id: { _eq: $id } },
    _set: {
      inventory_id: $inventory_id,
      project_id: $project_id,
      status: $status,
      total_qty: $total_qty,
      used_qty: $used_qty,
      is_return: $is_return,
      updated_at: $updated_at
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