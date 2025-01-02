import {gql} from "@apollo/client";

export const GET_ALL_TASK_INVENTORIES = gql`
query MyQuery($limit: Int!, $offset: Int!) {
  task_inventories(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
    id
    task_name {
      task_name
    }
    status
    approved_user_name
    project {
      project_name
    }
    qty
    request_user_name
    remark
    actual_rent_date
  }
  total: task_inventories_aggregate {
    aggregate {
      count
    }
  }
}`

export const GET_TASK_NAMES = gql`
query MyQuery ($query: String!) {
  tasks(limit: 5, where: {task_name: {_ilike: $query}}) {
    id
    task_name
  }
}
`

export const GET_INVENTORY_NAMES = gql`
query MyQuery($query: String!, $projectId: Int!) {
  response: project_inventories(where: {project_id: {_eq: $projectId}, inventory: {scit_control_number: {_ilike: $query}}}) {
    id
    inventory_id
    total_qty
    used_qty
    inventory {
      scit_control_number
      inventory_category {
        manufacturer
        model_type
        device
      }
    }
  }
}
`

export const GET_USER_NAMES = gql`
query MyQuery ($query: String!) {
  users(limit: 5, where: {username: {_ilike: $query}}) {
    id
    username
  }
}`

export const ADD_TASK_INVENTORY =  gql `
mutation MyMutation(
  $inventory_id: Int!,
  $project_id: Int!,
  $rent_date: timestamptz!,
  $request_date: timestamptz!,
  $return_date: timestamptz!,
  $task_id: Int!,
  $total_qty: Int!,
  $remark: String!
 
) {
  task_assigned_inventory_to_task(
    inventory_id: $inventory_id,
    project_id: $project_id,
    rent_date: $rent_date,
    return_date: $return_date,
    request_date: $request_date,
    task_id: $task_id,
    total_qty: $total_qty,
    remark: $remark
  ) {
    message
    success
  }
}`

export const GET_TASK_INVENTORY_BY_ID = gql `
query MyQuery($id: Int!) {
  task_inventories(where: {id: {_eq: $id}}) {
    id
    task_name {
      task_name
    }
    status
    approved_user_name
    project {
      project_name
      task {
        id
        task_name
      }
      project_inventory {
        id
        inventory {
          scit_control_number
        }
      }
    }
    qty
    request_user_name
    remark
    actual_rent_date
  }
}
`

export const UPDATE_TASK_INVENTORY = gql`
  mutation MyMutation(
    $id: Int!,
    $actualRentDate: timestamptz,
    $actualReturnDate: timestamptz,
    $inventoryId: Int!,
    $projectId: Int!,
    $qty: Int!,
    $remark: String,
    $rentDate: timestamptz,
    $requestDate: timestamptz,
    $requestUserName: String,
    $returnDate: timestamptz!,
    $status: String,
    $taskId: Int!
  ) {
    update_task_inventories(
      where: {id: {_eq: $id}},
      _set: {
        actual_rent_date: $actualRentDate,
        actual_return_date: $actualReturnDate,
        inventory_id: $inventoryId,
        project_id: $projectId,
        qty: $qty,
        remark: $remark,
        rent_date: $rentDate,
        request_date: $requestDate,
        request_user_name: $requestUserName,
        return_date: $returnDate,
        status: $status,
        task_id: $taskId
      }
    ) {
      affected_rows
    }
  }
`;

export const GET_TASK_INVENTORY_DETAILS_BY_ID = gql `
query MyQuery($id: Int!) {
  task_inventories(where: {id: {_eq: $id}}) {
    actual_rent_date
    actual_return_date
    approved_user_name
    created_at
    id
    inventory {
      address
      country
      email_address
      part_number
      scit_control_number
      serial_number_end
      serial_number_start
      stock_office
      total_amount
      total_stock_amount
      total_unit_release
      unit_price
    }
    inventory_id
    is_return
    project_id
    remark
    rent_date
    request_date
    request_user_name
    return_date
    return_received_user_name
    status
    task_id
    task {
      task_name
    }
    total_qty
    updated_at
    used_qty
  }
}
`

export const DELETE_TASK_INVENTORY_BY_ID = gql `
mutation MyMutation ($id: Int!) {
  delete_task_inventories(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`

export const RETURN_TASK_INVENTORY = gql `
mutation MyMutation(
  $return_date: String!,
  $return_qty: Int!,
  $task_inventory_id: Int!,
  $remark: String!,
  $description: String!
) {
  response: inventory_create_return_inventory_task(
    return_date: $return_date,
    return_qty: $return_qty,
    task_inventory_id: $task_inventory_id,
    remark: $remark,
    description: $description
  ) {
    message
    success
  }
}
`

export const ADD_INVENTORY_QUANTITY = gql `
mutation MyMutation($inventory_id: Int!, $qty: Int!, $remark: String!) {
  response: inventory_add_qty_inventory(inventory_id: $inventory_id, qty: $qty, remark: $remark) {
    message
    success
  }
}
`