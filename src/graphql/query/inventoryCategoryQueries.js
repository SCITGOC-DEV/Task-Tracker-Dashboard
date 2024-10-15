import { gql } from "@apollo/client";

export const getAllInventoryCategories = gql`
query MyQuery($limit: Int!, $offset: Int!) {
  inventory_categories(limit: $limit, offset: $offset, order_by: {updated_at: desc}) {
    device
    id
    manufacturer
    model_type
    updated_at
  }
  total: inventory_categories_aggregate {
    aggregate {
      count
    }
  }
}
`;

export const getInventoryCategoriesByName = gql`
query MyQuery( $device: String!) {
  inventory_categories(limit: 8, where: {device: {_ilike: $device}}) {
    device
    id
  }
}
`

/*export const GET_INVENTORY_CATEGORY_BY_ID = gql `
query MyQuery( $id: String!) {
  inventory_categories(limit: 8, where: {id: {_eq: $id}}) {
    device
    id
  }
}
`*/

export const addInventoryCategory = gql `
mutation MyMutation($manufacturer: String!, $model_type: String!, $part_number: String, $device: String!) {
  insert_inventory_categories(objects: {
    manufacturer: $manufacturer,
    model_type: $model_type,
    part_number: $part_number,
    device: $device
  }) {
    affected_rows
  }
}
`

export const DELETE_INVENTORY_CATEGORY = gql `
mutation MyMutation($id: Int!) {
  delete_inventory_categories(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`

export const GET_INVENTORY_CATEGORY_BY_ID = gql `
query MyQuery($id: Int!) {
  inventory_categories(where: { id: { _eq: $id } }) {
    device
    id
    manufacturer
    model_type
    updated_at
  }
}`

export const UPDATE_INVENTORY_CATEGORY_BY_ID = gql `
mutation MyMutation($id: Int!, $device: String!, $manufacturer: String!, $model_type: String!, $updated_at: timestamptz!) {
  update_inventory_categories(
    where: { id: { _eq: $id } }, 
    _set: { 
      device: $device, 
      manufacturer: $manufacturer, 
      model_type: $model_type,
      updated_at: $updated_at
    }
  ) {
    affected_rows
  }
}
`

export const GET_ALL_USER_NAMES_BY_NAME = gql `
query MyQuery ($query: String!) {
  users(limit: 5, where: {username: {_ilike: $query}}) {
    id
    username
  }
}`

export const ASSIGN_INVENTORY_TO_TASK = gql`
  mutation MyMutation(
    $inventory_id: Int!,
    $project_id: Int!,
    $request_user_name: String!,
    $task_id: Int!,
    $total_qty: Int!,
    $qty: Int!,
    $remark: String!,
    $rent_date: timestamptz!,
    $request_date: timestamptz!,
    $return_date: timestamptz!
  ) {
    AssignedInventoryToTask(
      inventory_id: $inventory_id,
      project_id: $project_id,
      request_user_name: $request_user_name,
      task_id: $task_id,
      total_qty: $total_qty,
      qty: $qty,
      remark: $remark,
      rent_date: $rent_date,
      request_date: $request_date,
      return_date: $return_date
    ) {
      message
      success
    }
  }
`;