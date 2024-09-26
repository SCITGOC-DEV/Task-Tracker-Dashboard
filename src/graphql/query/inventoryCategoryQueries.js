import { gql } from "@apollo/client";

export const getAllInventoryCategories = gql`
query MyQuery($limit: Int!, $offset: Int!) {
  inventory_categories(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
    device
    id
    manufacturer
    model_type
    part_number
    updated_at
  }
  total: inventory_categories_aggregate {
    aggregate {
      count
    }
  }
}
`;

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
    part_number
    updated_at
  }
}`

export const UPDATE_INVENTORY_CATEGORY_BY_ID = gql `
mutation MyMutation($id: Int!, $device: String!, $manufacturer: String!, $model_type: String!, $part_number: String!) {
  update_inventory_categories(
    where: { id: { _eq: $id } }, 
    _set: { 
      device: $device, 
      manufacturer: $manufacturer, 
      model_type: $model_type, 
      part_number: $part_number 
    }
  ) {
    affected_rows
  }
}
`