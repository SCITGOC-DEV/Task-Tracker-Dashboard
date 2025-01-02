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
      id
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
mutation MyMutation($inventory_id: Int!, $project_id: Int!, $requested_at: String!, $total_qty: Int!) {
  project_assigned_inventory_to_project(inventory_id: $inventory_id, requested_at: $requested_at, project_id: $project_id, total_qty: $total_qty) {
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

export const GET_PROJECT_INVENTORY_DETAILS = gql `query MyQuery($id: Int!) {
  project_inventories(where: {id: {_eq: $id}}) {
    created_at
    created_by
    id
    project {
      project_name
      start_date
      status
      percentage
      project_description
    }
    is_return
    inventory {
      address
      country
      email_address
      scit_control_number
      stock_office
      serial_number_start
      inventory_category_id
      serial_number_end
      total_amount
      total_stock_amount
      total_unit_release
      unit_price
    }
    project_id
    request_qty
    returned_qty
    status
    total_qty
    updated_at
    used_qty
  }
}
`

export const DELETE_PROJECT_INVENTORY_BY_ID = gql `
mutation MyMutation($id: Int!) {
  delete_project_inventories(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`

export const RETURN_INVENTORY_PROJECT = gql `
mutation InventoryCreateReturnInventoryProject(
  $inventoryId: Int!,
  $projectId: Int!,
  $projectInventoryId: Int!,
  $returnedAdminName: String!,
  $returnedDate: String!,
  $returnedQty: Int!,
  $totalQty: Int!,
  $remark: String!
) {
  response: inventory_create_return_inventory_project(
    inventory_id: $inventoryId,
    project_id: $projectId,
    project_inventory_id: $projectInventoryId,
    returned_admin_name: $returnedAdminName,
    returned_date: $returnedDate,
    returned_qty: $returnedQty,
    total_qty: $totalQty,
    remark: $remark
  ) {
    message
    success
  }
}
`

export const GET_PENDING_INVENTORIES = gql`
query MyQuery($offset: Int!, $limit: Int!, $type: String!) {
  project_inventory_transactions(offset: $offset, limit: $limit, where: {is_approved: {_is_null: true}, approved_admin: {_is_null: true}, transaction_type: {_eq: $type}}, order_by: {requested_at: desc_nulls_last}) {
    approved_admin
    approved_at
    approved_qty
    created_at
    description
    id
    inventory_id
    is_approved
    is_return_inventory
    project_id
    qty
    remark
    request_admin
    requested_at
    status
    transaction_type
    updated_at
  }
  total: project_inventory_transactions_aggregate(where: {is_approved: {_is_null: true}, transaction_type: {_eq: "Request"}, approved_admin: {_is_null: true}}) {
    aggregate {
      count
    }
  }
}

`

export const APPROVE_PENDING_INVENTORY = gql`
mutation MyMutation($approved_qty: Int!, $is_approved: Boolean!, $project_inventory_transaction_id: Int!, $remark: String!) {
  response: inventory_accept_assigned_inventory_to_project(
    approved_qty: $approved_qty,
    is_approved: $is_approved,
    project_inventory_transaction_id: $project_inventory_transaction_id,
    remark: $remark
  ) {
    message
    success
  }
}
`

export const RETURN_PROJECT_INVENTORY = gql `
mutation MyMutation(
  $inventory_id: Int!, 
  $project_id: Int!, 
  $requested_at: String!, 
  $total_qty: Int!, 
  $description: String!
) {
  response: inventory_create_return_inventory_project(
    inventory_id: $inventory_id, 
    project_id: $project_id, 
    requested_at: $requested_at, 
    total_qty: $total_qty, 
    description: $description
  ) {
    message
    success
  }
}
`

export const APPROVE_RETURNED_PROJECT = gql `
mutation MyMutation(
  $approved_qty: Int!, 
  $is_approved: Boolean!, 
  $project_inventory_transaction_id: Int!, 
  $remark: String!
) {
  response: inventory_accept_returned_inventory_project(
    approved_qty: $approved_qty, 
    is_approved: $is_approved, 
    project_inventory_transaction_id: $project_inventory_transaction_id, 
    remark: $remark
  ) {
    message
    success
  }
}
`

export const GET_REQUESTED_TASK_INVENTORIES = gql `
query MyQuery($limit: Int!, $offset: Int!) {
  response: return_inventory_tasks(where: {received_date: {_is_null: true}, receive_admin_name: {_is_null: true}, is_approved: {_is_null: true}}, limit: $limit, offset: $offset) {
    return_user_name
    description
    approve_qty
    id
    receive_admin_name
    received_date
    is_approved
    remark
    return_qty
    return_date
    total_qty
    total_returned_qty
  }
  total: return_inventory_tasks_aggregate(where: {received_date: {_is_null: true}, receive_admin_name: {_is_null: true}, is_approved: {_is_null: true}}) {
    aggregate {
      count
    }
  }
}

`

export const APPROVE_REQUESTED_TASK_INVENTORY = gql `
mutation MyMutation($approve_qty: Int!, $is_approved: Boolean!, $return_inventory_task_id: Int!, $description: String!) {
  response: inventory_accept_return_inventory_to_task(
    approve_qty: $approve_qty,
    is_approved: $is_approved,
    return_inventory_task_id: $return_inventory_task_id,
    description: $description
  ) {
    message
    success
  }
}
`

export const CANCEL_REQUESTED_TASK_INVENTORY = gql `
mutation UpdateReturnInventoryTasks($taskId: Int!) {
  update_return_inventory_tasks(where: {id: {_eq: $taskId}}, _set: {is_approved: false, return_qty: 0}) {
    affected_rows
  }
}
`